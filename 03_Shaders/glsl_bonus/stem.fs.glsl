varying vec2 texCoord;

varying vec3 L;
varying vec3 V;

uniform float kAmbient;
uniform float kDiffuse;
uniform vec3 stemColor;
uniform sampler2D stemNormals;
uniform sampler2D stemDiffuse;

void main() {
  vec3 diffuseColor = vec3(texture2D(stemDiffuse,texCoord));

  vec3 n = vec3(texture2D(stemNormals, texCoord));
  vec3 v = normalize(V);
  vec3 l = normalize(L);
  vec3 rv = normalize(2.0 * dot(n,l) * n - l);

  vec3 diffuse = diffuseColor * max(0.0,dot(n,l));
  vec3 finalColor = (kAmbient * stemColor) 
			+ (kDiffuse * diffuse);
  gl_FragColor = vec4(finalColor, 1.0);
}