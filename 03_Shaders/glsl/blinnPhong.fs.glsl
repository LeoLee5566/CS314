varying vec4 V_ViewPosition;
varying vec4 V_Normal_VCS;
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

	// COMPUTE LIGHTING HERE
	vec3 n = normalize(V_Normal_VCS.xyz);
	vec3 l = normalize(vec3(viewMatrix * vec4(lightPosition, 0.0)));
	vec3 v = normalize(-V_ViewPosition.xyz);
	vec3 finalColor;
	if (lightstate == 0) {
		vec3 l = normalize(vec3(viewMatrix * vec4(lightPosition, 0.0)));
		vec3 hv = normalize((l + v)/2.0);
		
		vec3 diffuse = lightColor * max(0.0,dot(n,l));
		vec3 specular = pow(max(0.0,dot(n,hv)),shininess) * lightColor;
		finalColor = (kAmbient * ambientColor) 
			+ (kDiffuse * diffuse) 
			+ (kSpecular * specular);
	} else {
		vec4 l_pos = viewMatrix * vec4(lightsourcePosition, 1.0);
		vec3 l = normalize(vec3(l_pos)-V_ViewPosition.xyz);
		vec3 sd = normalize(vec3(viewMatrix * vec4(lightPosition, 0.0)));
		
		if (dot(-l,sd) >= lightAngle) {
			vec3 hv = normalize((l + v)/2.0);
			vec3 diffuse = lightColor * max(0.0,dot(n,l));
			vec3 specular = pow(max(0.0,dot(n,hv)),shininess) * lightColor;
			finalColor = (kAmbient * ambientColor) 
				+ (kDiffuse * diffuse) 
				+ (kSpecular * specular);
		} else {
			finalColor = (kAmbient * ambientColor);
		}
	}
	gl_FragColor = vec4(finalColor, 1.0);
}