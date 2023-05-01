varying vec2 texCoord;
varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;

uniform float tableTexDensity;

void main() {
  	V_Normal_VCS = vec4(normalMatrix * normal, 1.0);
	vec4 V_pos = modelViewMatrix * vec4(position, 1.0);
	V_ViewPosition = vec4(V_pos.xyz/V_pos.w, 1.0);
	texCoord = tableTexDensity * uv;

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}