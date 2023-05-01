varying vec4 V_Color;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform int lightstate;
uniform vec3 lightsourcePosition;
uniform float lightAngle;

void main() {
	// COMPUTE COLOR ACCORDING TO GOURAUD HERE
	vec4 v_pos = modelViewMatrix * vec4(position, 1.0);
	vec3 n = normalize(normalMatrix * normal);
	vec3 v = normalize(-vec3(v_pos));
	vec3 finalColor;
	if (lightstate == 0) {
		vec3 l = normalize(vec3(viewMatrix * vec4(lightPosition, 0.0)));
		vec3 rv = normalize(2.0 * dot(n,l) * n - l);

		vec3 diffuse = lightColor * max(0.0,dot(n,l));
		vec3 specular = pow(max(0.0,dot(rv,v)),shininess) * lightColor;
		finalColor = (kAmbient * ambientColor) 
			+ (kDiffuse * diffuse) 
			+ (kSpecular * specular);
		V_Color = vec4(finalColor,1.0);
	} else {
		vec4 l_pos = viewMatrix * vec4(lightsourcePosition, 1.0);
		vec3 l = normalize(vec3(l_pos)-vec3(v_pos));
		vec3 sd = normalize(vec3(viewMatrix * vec4(lightPosition, 0.0)));
		
		if (dot(-l,sd) >= lightAngle) {
			vec3 rv = normalize(2.0 * dot(n,l) * n - l);
			vec3 diffuse = lightColor * max(0.0,dot(n,l));
			vec3 specular = pow(max(0.0,dot(rv,v)),shininess) * lightColor;
			finalColor = (kAmbient * ambientColor) 
				+ (kDiffuse * diffuse) 
				+ (kSpecular * specular);
		} else {
			finalColor = (kAmbient * ambientColor);
		}
	}
	V_Color = vec4(finalColor,1.0);


	// Position
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}