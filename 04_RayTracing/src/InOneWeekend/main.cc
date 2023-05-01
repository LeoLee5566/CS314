//==============================================================================================
// Originally written in 2016 by Peter Shirley <ptrshrl@gmail.com>
//
// To the extent possible under law, the author(s) have dedicated all copyright and related and
// neighboring rights to this software to the public domain worldwide. This software is
// distributed without any warranty.
//
// You should have received a copy (see file COPYING.txt) of the CC0 Public Domain Dedication
// along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//==============================================================================================

#include "rtweekend.h"

#include "camera.h"
#include "color.h"
#include "hittable_list.h"
#include "material.h"
#include "cube.h"
#include "sphere.h"

#include <iostream>

struct light {
    vec3 light_src;
    color light_color;
    char type;
    double kAmbient;
    double kDiffuse;
    double kSpecular;
    double shininess;
};

bool in_shadow(const ray& light_ray, const hittable& world, const double t_min){
    hit_record rec2;
    if (world.hit(light_ray,t_min,infinity,rec2)) {
        if ((std::dynamic_pointer_cast<dielectric>(rec2.mat_ptr) == nullptr)){
            return true;
        } else {
            return in_shadow(light_ray, world, rec2.t + 0.1);
        }
    } 
    return false;
}


color ray_color(const ray& r, const hittable& world, const light l, int depth) {
    hit_record rec;

    // If we've exceeded the ray bounce limit, no more light is gathered.
    if (depth <= 0)
        return color(0,0,0);

    if (world.hit(r, 0.001, infinity, rec)) {
        // Compute Light
        ray light_ray;
        if (l.type == 'p') {
            light_ray = ray(rec.p,unit_vector(l.light_src-rec.p));
        } else
        {
            light_ray = ray(rec.p,unit_vector(-l.light_src));
        }
        
        if (in_shadow(light_ray, world, 0.001)){
            return color(0.05,0.05,0.05);
        }
        
        double NLAngle = std::max(0.0,dot(rec.normal,light_ray.direction()));
        vec3 hv = (light_ray.direction() + unit_vector(-r.direction()))/2;
        double specAmount = pow(std::max(0.0,dot(rec.normal,hv)),l.shininess);

        ray scattered;
        color attenuation;
        if (rec.mat_ptr->scatter(r, rec,attenuation, scattered)) {
            color ambient =  ray_color(scattered, world, l, depth-1);
            if ((std::dynamic_pointer_cast<dielectric>(rec.mat_ptr) != nullptr)){
                return 0.5 * attenuation * ambient + 0.5 * specAmount * l.light_color;
            }
            return l.kAmbient * attenuation * ambient
                + l.kDiffuse * attenuation * NLAngle * l.light_color 
                + l.kSpecular * specAmount * l.light_color;
        }
    
        return color(0,0,0);
    }

    vec3 unit_direction = unit_vector(r.direction());
    auto t = 0.5*(unit_direction.y() + 1.0);
    return (1.0-t)*color(1.0, 1.0, 1.0) + t*color(0.5, 0.7, 1.0);
}


hittable_list random_scene() {
    hittable_list world;

    auto ground_material = make_shared<lambertian>(color(0.5, 0.5, 0.5));
    world.add(make_shared<sphere>(point3(0,-1000,0), 1000, ground_material));

    for (int a = -11; a < 11; a++) {
        for (int b = -11; b < 11; b++) {
            auto choose_mat = random_double();
            point3 center(a + 0.9*random_double(), 0.2, b + 0.9*random_double());

            if ((center - point3(4, 0.2, 0)).length() > 0.9) {
                shared_ptr<material> sphere_material;

                if (choose_mat < 0.8) {
                    // diffuse
                    auto albedo = color::random() * color::random();
                    sphere_material = make_shared<lambertian>(albedo);
                    world.add(make_shared<sphere>(center, 0.2, sphere_material));
                } else if (choose_mat < 0.95) {
                    // metal
                    auto albedo = color::random(0.5, 1);
                    auto fuzz = random_double(0, 0.5);
                    sphere_material = make_shared<metal>(albedo, fuzz);
                    world.add(make_shared<sphere>(center, 0.2, sphere_material));
                } else {
                    // glass
                    sphere_material = make_shared<dielectric>(1.5);
                    world.add(make_shared<sphere>(center, 0.2, sphere_material));
                }
            }
        }
    }

    auto material1 = make_shared<dielectric>(1.5);
    world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material1));

    auto material2 = make_shared<lambertian>(color(0.4, 0.2, 0.1));
    world.add(make_shared<sphere>(point3(-4, 1, 0), 1.0, material2));

    auto material3 = make_shared<metal>(color(0.7, 0.6, 0.5), 0.0);
    world.add(make_shared<cube>(point3(4, 1, 0), 1.0, material3));

    return world;
}


int main() {

    // Image

    const auto aspect_ratio = 16.0 / 9.0;
    const int image_width = 400;
    const int image_height = static_cast<int>(image_width / aspect_ratio);
    const int samples_per_pixel = 20;
    const int max_depth = 50;

    // World

    auto world = random_scene();

    // Camera

    point3 lookfrom(13,2,3);
    point3 lookat(0,0,0);
    vec3 vup(0,1,0);
    auto dist_to_focus = 10.0;
    auto aperture = 0.1;

    camera cam(lookfrom, lookat, vup, 20, aspect_ratio, aperture, dist_to_focus);

    // LightSrc
    light l;
    l.light_src = vec3(-40,-40,-40);
    l.light_color = color(1,1,1);
    l.type = 'd';
    l.kAmbient = 0.5;
    l.kDiffuse = 0.3;
    l.kSpecular = 0.2;
    l.shininess = 5.0;

    // Render

    std::cout << "P3\n" << image_width << ' ' << image_height << "\n255\n";

    for (int j = image_height-1; j >= 0; --j) {
        std::cerr << "\rScanlines remaining: " << j << ' ' << std::flush;
        for (int i = 0; i < image_width; ++i) {
            color pixel_color(0,0,0);
            for (int s = 0; s < samples_per_pixel; ++s) {
                auto u = (i + random_double()) / (image_width-1);
                auto v = (j + random_double()) / (image_height-1);
                ray r = cam.get_ray(u, v);
                pixel_color += ray_color(r, world, l, max_depth);
            }
            write_color(std::cout, pixel_color, samples_per_pixel);
        }
    }

    std::cerr << "\nDone.\n";
}
