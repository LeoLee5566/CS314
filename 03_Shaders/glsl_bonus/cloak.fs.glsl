varying vec4 V_ViewPosition;
varying vec4 V_Normal_VCS;
uniform vec3 lightColor;
uniform vec3 cloakColor;
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

void main() {
  // COMPUTE LIGHTING HERE
  vec3 n = normalize(V_Normal_VCS.xyz);
  vec3 v = normalize(-V_ViewPosition.xyz);

   // VELVET
  float fabricAngle = pow(max(0.0,1.0-dot(n,v)),shininess);
  vec3 fabric = lightColor * fabricAngle;

  vec3 finalColor =
    (kAmbient * cloakColor) + (lightColor * fabricAngle);

  gl_FragColor = vec4(finalColor, 1.0);
}