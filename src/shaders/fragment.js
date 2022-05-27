import { noise } from "./helpers/noise";

export const fragmentShader = `
${noise}
uniform vec3 uColor;
uniform float uTime;
uniform vec2 uMousePos;

uniform sampler2D uTexture;

varying vec2 vUv;

float smoothcircle(vec2 st, float r){
    float dist = distance(st, vec2(uMousePos));
    return 1.0 - smoothstep(0., r, dist);
  }

void main()
{
    vec2 uv = vUv;

    float n  = noise(uv * 3.0 + uTime * 0.8);
                n += noise(uv * 5.0 - uTime * 0.5);
                n *= smoothcircle(uv, 0.3);
    n = step(0.1, n);

    // texture() returns vec3
    vec3 angelTexture = texture(uTexture, uv * vec2(1.0, 0.9)).rgb;

    vec3 color = mix(uColor, angelTexture, n);

    gl_FragColor = vec4(color, 1.0);
}
`;
