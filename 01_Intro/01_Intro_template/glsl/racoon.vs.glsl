// Create shared variable for the vertex and fragment shaders
varying vec3 interpolatedNormal;
uniform vec3 remotePosition;
uniform int rcState;
uniform float time;
/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

void main() {
    
    vec3 new_pos = position * 6.5 - vec3(0,0,2.0);
    if (rcState == 2) {
        if (time <= 2.0)
            new_pos += time * normal;
        else {
            new_pos = new_pos + 2.0 * normal - (time-2.0) * vec3(-new_pos.x,-new_pos.y,new_pos.z);
        }
    }
    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    vec4 w_position = modelMatrix * vec4(new_pos, 1.0);
    // Set shared variable to vertex normal
    float dist_bound = 3.0;
    if (abs(distance(w_position.xyz,remotePosition)) <= dist_bound)
        interpolatedNormal = vec3(1.0,1.0,1.0);
    else 
        interpolatedNormal = normal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_pos, 1.0);
}
