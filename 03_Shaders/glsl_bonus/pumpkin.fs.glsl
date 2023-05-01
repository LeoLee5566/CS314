varying vec2 texCoord;

varying vec3 L;
varying vec3 V;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;
uniform vec3 lightPosition;
uniform vec3 pumpkinColor;
uniform sampler2D pumpkinBump;
uniform sampler2D pumpkinNormals;
uniform sampler2D pumpkinDiffuse;
uniform sampler2D pumpkinSpecular;

void main() {
  vec3 diffuseColor = vec3(texture2D(pumpkinDiffuse,texCoord));
  vec3 specularColor = vec3(texture2D(pumpkinSpecular,texCoord));

  vec3 bumpNorm = vec3(texture2D(pumpkinBump, texCoord));
  vec3 Normmap = vec3(texture2D(pumpkinNormals, texCoord));
  Normmap = (Normmap - 0.5) * 2.0;
  vec3 n = Normmap * bumpNorm;
  vec3 v = normalize(V);
  vec3 l = normalize(L);
  vec3 rv = normalize(2.0 * dot(n,l) * n - l);

  vec3 diffuse = diffuseColor * max(0.0,dot(n,l));
  vec3 specular = pow(max(0.0,dot(rv,v)),shininess) * specularColor;
  vec3 finalColor = (kAmbient * pumpkinColor) 
			+ (kDiffuse * diffuse) 
			+ (kSpecular * specular);
  gl_FragColor = vec4(finalColor, 1.0);
}