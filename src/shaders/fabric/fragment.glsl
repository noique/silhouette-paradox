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

  // Base color with anisotropic highlight — toned down for muted luxury
  vec3 color = uBaseColor * (0.35 + 0.45 * NdotL);
  color += uHighlightColor * anisotropic * 0.5;
  color += vec3(1.0, 0.97, 0.93) * fresnel * 0.7;

  // Subtle color shift with scroll — warmth fades, cold emerges
  vec3 coldTint = vec3(0.6, 0.6, 0.7);
  color = mix(color, coldTint * 0.3, uScrollProgress * 0.4);

  // ACES filmic tone mapping (inline — zero GPU overhead vs post-processing)
  color = color * (2.51 * color + 0.03) / (color * (2.43 * color + 0.59) + 0.14);
  color = clamp(color, 0.0, 1.0);

  // Gentle desaturation for luxury muted peach aesthetic
  float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(lum), color, 0.72);

  // Film grain
  float grain = hash(vUv * 500.0 + uTime * 100.0) * 0.03;
  color += grain;

  // Fade out (tear) at high scroll progress
  float alpha = 1.0 - smoothstep(0.75, 1.0, uScrollProgress);

  gl_FragColor = vec4(color, alpha);
}
