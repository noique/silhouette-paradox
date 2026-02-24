// Fabric fragment shader — Banks anisotropic + Fresnel rim
// Luxury silk aesthetic: Peach Fuzz base, directional highlights, edge glow

uniform float uTime;
uniform float uScrollProgress;
uniform vec3 uBaseColor;     // Peach Fuzz #FFBE98
uniform vec3 uHighlightColor; // Warm gold #E8C57A
uniform float uSheen;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Film grain
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Banks anisotropic reflection — silk directional highlights
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
  float NdotL = max(dot(normal, lightDir), 0.0);
  float TdotH = dot(tangent, normalize(lightDir + viewDir));
  float anisotropic = pow(sqrt(1.0 - TdotH * TdotH), 16.0) * uSheen;

  // Fresnel rim glow — edge luminance at grazing angles
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  fresnel *= 0.6;

  // Base color with anisotropic highlight
  vec3 color = uBaseColor * (0.3 + 0.7 * NdotL);
  color += uHighlightColor * anisotropic;
  color += vec3(1.0, 0.95, 0.9) * fresnel;

  // Subtle color shift with scroll — warmth fades, cold emerges
  vec3 coldTint = vec3(0.6, 0.6, 0.7);
  color = mix(color, coldTint * 0.3, uScrollProgress * 0.4);

  // Film grain
  float grain = hash(vUv * 500.0 + uTime * 100.0) * 0.04;
  color += grain;

  // Fade out (tear) at high scroll progress
  float alpha = 1.0 - smoothstep(0.75, 1.0, uScrollProgress);

  gl_FragColor = vec4(color, alpha);
}
