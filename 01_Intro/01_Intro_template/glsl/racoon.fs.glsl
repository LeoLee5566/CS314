// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying vec3 interpolatedNormal;
uniform int rcState;
uniform float time;
/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

// Random number generator, extracted from http://www.science-and-fiction.org/rendering/noise.html
float rand3D(vec3 co){
    return fract(sin(dot(co.xyz ,vec3(12.9898,78.233,144.7272))) * 43758.5453);
}

void main() {
  vec3 n_normal = normalize(interpolatedNormal);
  // Set final rendered color according to the surface normal
  if (rcState == 3){
    gl_FragColor = vec4(n_normal, 0)+vec4((time/3.0) * rand3D(n_normal) * (vec3(1,1,1)-n_normal),1.0);
  } else {
    gl_FragColor = vec4(n_normal, 1.0); 
    }
}
