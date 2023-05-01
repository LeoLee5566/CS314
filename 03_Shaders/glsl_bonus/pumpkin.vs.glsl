varying vec2 texCoord;
varying vec3 L;
varying vec3 V;

uniform vec3 pumpkintang;
uniform vec3 lightPosition;

void main() {
	vec4 V_Normal_VCS = vec4(normalMatrix * normal, 1.0);
	vec4 V_pos = modelViewMatrix * vec4(position, 1.0);
	texCoord = uv;

	// NORMAL MAPPING
	vec3 norm = normalize(V_Normal_VCS.xyz);
	vec3 tang = normalize(pumpkintang);
	tang = normalize(tang - dot(tang,norm)*norm);
	vec3 bitang = normalize(cross(norm, tang));
	mat3 toTangentSpace = mat3(
        tang.x, bitang.x, norm.x,
        tang.y, bitang.y, norm.y,
        tang.z, bitang.z, norm.z
    );

	L =  lightPosition - V_pos.xyz;
    V =  toTangentSpace *  (- V_pos.xyz);

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}