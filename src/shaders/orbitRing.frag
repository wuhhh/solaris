export default `
/*
    This shader was composed using the following elements from LYGIA Shader library ( https://lygia.xyz )

        * lygia/draw/circle.glsl

    LYGIA is dual-licensed under the [Prosperity License](https://prosperitylicense.com/versions/3.0.0) 
    and the [Patron License](https://lygia.xyz/license) for [sponsors](https://github.com/sponsors/patriciogonzalezvivo) 
    and [contributors](https://github.com/patriciogonzalezvivo/lygia/graphs/contributors).

    Those are automatically added to the [Patron License](https://lygia.xyz/license) and they (only they) 
    can ignore and any non-commercial rule of the [Prosperity License](https://prosperitylicense.com/versions/3.0.0)
    software (please take a look at the exceptions).

    It's also possible to get a permanent commercial license hooked to a single and specific version of LYGIA.
*/

#ifndef CIRCLESDF_FNC
#define CIRCLESDF_FNC(POS_UV) length(POS_UV)
#endif
float circleSDF(in vec2 v) {
#ifdef CENTER_2D
    v -= CENTER_2D;
#else
    v -= 0.5;
#endif
    return CIRCLESDF_FNC(v) * 2.0;
}

#if defined(GL_OES_standard_derivatives)
#extension GL_OES_standard_derivatives : enable
#endif
float aastep(float threshold, float value) {
#if !defined(GL_ES) || __VERSION__ >= 300 || defined(GL_OES_standard_derivatives)
    float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
#elif defined(AA_EDGE)
    float afwidth = AA_EDGE;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
#else 
    return step(threshold, value);
#endif
}
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float fill(float x, float size) {
    return 1.0 - aastep(size, x);
}


#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif
float stroke(float x, float size, float w) {
    float d = aastep(size, x + w * 0.5) - aastep(size, x - w * 0.5);
    return saturate(d);
}
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return saturate(d);
}

float circle(vec2 st, float size) {
    return fill(circleSDF(st), size);
}
float circle(vec2 st, float size, float strokeWidth) {
    return stroke(circleSDF(st), size, strokeWidth);
}

uniform vec2 u_resolution;

void main() {
	vec4 color = vec4(vec3(0.0), 0.0);
	vec2 pixel = 1.0/u_resolution.xy;
	vec2 st = gl_FragCoord.xy * pixel;

	float circ = circle(st, 0.5, .01);
	color += circ; 

	gl_FragColor = color;
}
`;
