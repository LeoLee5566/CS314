varying vec4 V_ViewPosition;
varying vec4 V_Normal_VCS;
varying vec2 texCoord;

uniform sampler2D chessboardTexture;
uniform vec3 lightColor;
uniform vec3 tableColor;
uniform float kAmbient;
uniform float shininess;

void main() {
  // COMPUTE LIGHTING HERE
  vec3 n = normalize(V_Normal_VCS.xyz);
  vec3 v = normalize(-V_ViewPosition.xyz);

  // VELVET
  float fabricAngle = pow(max(0.0,1.0-dot(n,v)),shininess);

  vec3 finalColor =
      (kAmbient * tableColor) + (lightColor * fabricAngle);

  vec4 textureColor = texture2D(chessboardTexture,texCoord);

  gl_FragColor = (vec4(finalColor, 1.0) + textureColor)/2.0;
}