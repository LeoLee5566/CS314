varying vec2 texCoord;

uniform sampler2D leafDiffuse;
uniform sampler2D leafOpacity;
uniform float kAmbient;
uniform float shininess;

void main() {
  vec4 DiffuseColor = texture2D(leafDiffuse,texCoord);
  vec4 OpacityColor = texture2D(leafOpacity,texCoord);
  
  gl_FragColor =  DiffuseColor * OpacityColor;
}