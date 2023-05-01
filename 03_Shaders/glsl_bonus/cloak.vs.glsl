varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;
uniform float time;
uniform float cloakAmp;

void main() {
	vec3 new_pos;
	if (position.y <= 17.0){
		float wave = 1.0 + cloakAmp * abs((position.x + 10.0) / 30.0) * sin((3.0 * time) - position.x);
		new_pos = vec3(position.x,position.y * wave,position.z);
	} else {
		new_pos = position;
	}
  	V_Normal_VCS = vec4(normalMatrix * normal, 1.0);
	vec4 V_pos = modelViewMatrix * vec4(new_pos, 1.0);
	V_ViewPosition = vec4(V_pos.xyz/V_pos.w, 1.0);

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(new_pos, 1.0);
}