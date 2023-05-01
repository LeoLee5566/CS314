#ifndef CUBE_H
#define CUBE_H

#include "rtweekend.h"

#include "hittable.h"
#include "hittable_list.h"


class triangle : public hittable {
    public:
        triangle() {}

        triangle(point3 _x, point3 _y, point3 _z, vec3 _n,shared_ptr<material> m)
            : x(_x), y(_y), z(_z), normal(_n), mat_ptr(m) {};

        virtual bool hit(const ray& r, double t_min, double t_max, hit_record& rec) const override;

    public:
        point3 x;
        point3 y;
        point3 z;
        vec3 normal;
        shared_ptr<material> mat_ptr;
};


bool triangle::hit(const ray& r, double t_min, double t_max, hit_record& rec) const {
    vec3 w = x - r.origin();
    double k = dot(w,normal)/dot(r.direction(),normal);
    if (k < t_min || k > t_max) {
        return false;
    }
    point3 I = r.origin() + k * r.direction();

    double At = cross(x-y,z-y).length();
    double Ax = cross(I-y,I-z).length();
    double Ay = cross(I-x,I-z).length();
    double Az = cross(I-x,I-y).length();

    if (Ax + Ay + Az > At) {
        return false;
    }

    rec.t = k;
    rec.p = r.at(rec.t);
    rec.set_face_normal(r, normal);
    rec.mat_ptr = mat_ptr;
    return true;
}


class cube : public hittable {
    public:
        cube() {}

        cube(const point3& cen, double l, shared_ptr<material> m);

        virtual bool hit(const ray& r, double t_min, double t_max, hit_record& rec) const override;

    public:
        point3 center;
        double len;
        hittable_list sides;
        shared_ptr<material> mat_ptr;
};

cube::cube(const point3& cen, double l, shared_ptr<material> m) {
    center = cen;
    len = l;

    vec3 x = vec3(l/2,0,0);
    vec3 y = vec3(0,l/2,0);
    vec3 z = vec3(0,0,l/2);

    //Front
    sides.add(make_shared<triangle>(cen+x+y+z, cen-x+y+z, cen-x-y+z,vec3(0,0,1),m));
    sides.add(make_shared<triangle>(cen+x+y+z, cen+x-y+z, cen-x-y+z,vec3(0,0,1),m));

    //Back
    sides.add(make_shared<triangle>(cen+x+y-z, cen-x+y-z, cen-x-y-z,vec3(0,0,-1),m));
    sides.add(make_shared<triangle>(cen+x+y-z, cen+x-y-z, cen-x-y-z,vec3(0,0,-1),m));

    //Right
    sides.add(make_shared<triangle>(cen+x+y+z, cen+x+y-z, cen+x-y-z,vec3(1,0,0),m));
    sides.add(make_shared<triangle>(cen+x+y+z, cen+x-y+z, cen+x-y-z,vec3(1,0,0),m));

    //Left
    sides.add(make_shared<triangle>(cen-x+y+z, cen-x+y-z, cen-x-y-z,vec3(-1,0,0),m));
    sides.add(make_shared<triangle>(cen-x+y+z, cen-x-y+z, cen-x-y-z,vec3(-1,0,0),m));

    //Up
    sides.add(make_shared<triangle>(cen+x+y+z, cen+x+y-z, cen-x+y-z,vec3(0,1,0),m));
    sides.add(make_shared<triangle>(cen+x+y+z, cen-x+y+z, cen-x+y-z,vec3(0,1,0),m));

    //Down
    sides.add(make_shared<triangle>(cen+x-y+z, cen+x-y-z, cen-x-y-z,vec3(0,-1,0),m));
    sides.add(make_shared<triangle>(cen+x-y+z, cen-x-y+z, cen-x-y-z,vec3(0,-1,0),m));
}

bool cube::hit(const ray& r, double t_min, double t_max, hit_record& rec) const {
    return sides.hit(r, t_min, t_max, rec);
}


#endif
