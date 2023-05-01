// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying vec2 texCoord;
varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;

uniform sampler2D rocksTexture;
uniform int lightstate;
uniform vec3 lightPosition;
uniform vec3 lightsourcePosition;
uniform float lightAngle;


void main() {

	// LOOK UP THE COLOR IN THE TEXTURE
  
  // Set final rendered color according to the surface normal
  if (lightstate == 0) {
    gl_FragColor = texture2D(rocksTexture,texCoord); 
  } else {
    vec4 l_pos = viewMatrix * vec4(lightsourcePosition, 1.0);
		vec3 l = normalize(vec3(l_pos)-V_ViewPosition.xyz);
		vec3 sd = normalize(vec3(viewMatrix * vec4(lightPosition, 0.0)));
		
		if (dot(-l,sd) >= lightAngle) {
      gl_FragColor = texture2D(rocksTexture,texCoord) ; 
    } else {
      gl_FragColor = vec4(0,0,0,1.0);
    }
  }
}
