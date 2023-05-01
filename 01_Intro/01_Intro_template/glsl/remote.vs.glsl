// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 remotePosition;
uniform int onhit;

void main() {
	/* HINT: WORK WITH remotePosition HERE! */

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    vec3 new_pos = position + remotePosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_pos,1.0);
}
