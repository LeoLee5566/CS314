varying vec4 V_ViewPosition;
varying vec4 V_Normal_VCS;
uniform vec3 lightColor;
uniform vec3 bunnyColor;
uniform vec3 lightPosition;
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

void main() {
  // COMPUTE LIGHTING HERE
  vec3 n = normalize(V_Normal_VCS.xyz);
  vec3 v = normalize(-V_ViewPosition.xyz);

  vec3 l = normalize(vec3(viewMatrix * vec4(lightPosition, 0.0)));
  vec3 rv = normalize(2.0 * dot(n, l) * n - l);

  vec3 diffuse = bunnyColor * max(0.0, dot(n, l));
  vec3 specular = pow(max(0.0, dot(rv, v)), shininess) * lightColor;
  vec3 finalColor =
      (kAmbient * bunnyColor) + (kDiffuse * diffuse) + (kSpecular * specular);

  gl_FragColor = vec4(finalColor, 1.0);
}