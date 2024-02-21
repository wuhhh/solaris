const rotate4dY = `
	#ifndef FNC_ROTATE4DY
	#define FNC_ROTATE4DY
	mat4 rotate4dY(in float r){
			return mat4(
					vec4(cos(r),0.,-sin(r),0),
					vec4(0.,1.,0.,0.),
					vec4(sin(r),0.,cos(r),0.),
					vec4(0.,0.,0.,1.));
	}
	#endif
`;

const rotateY = `
	#ifndef FNC_ROTATEY
	#define FNC_ROTATEY
	vec4 rotateY(in vec4 v, in float r, in vec4 c) {
			return rotate4dY(r) * (v - c) + c;
	}

	vec4 rotateY(in vec4 v, in float r) {
			#ifdef CENTER_4D
			return rotate4dY(r) * (v - CENTER_4D) + CENTER_4D;
			#else
			return rotate4dY(r) * v;
			#endif
	}

	vec3 rotateY(in vec3 v, in float r, in vec3 c) {
			return (rotate4dY(r) * vec4(v - c, 1.)).xyz + c;
	}

	vec3 rotateY(in vec3 v, in float r) {
			#ifdef CENTER_3D
			return (rotate4dY(r) * vec4(v - CENTER_3D, 1.)).xyz + CENTER_3D;
			#else
			return (rotate4dY(r) * vec4(v, 1.)).xyz;
			#endif
	}
	#endif
`;

const getGradient = `
	vec3 getGradient(vec4 c1, vec4 c2, float value_) {
		float blend = smoothstep(c1.w, c2.w, value_);
		return mix(c1.rgb, c2.rgb, blend);
	}

	vec3 getGradient(vec4 c1, vec4 c2, vec4 c3, float value_) {
		float blend1 = smoothstep(c1.w, c2.w, value_);
		float blend2 = smoothstep(c2.w, c3.w, value_);

		vec3 
		col = mix(c1.rgb, c2.rgb, blend1);
		col = mix(col, c3.rgb, blend2);

		return col;
	}
	
	vec3 getGradient(vec4 c1, vec4 c2, vec4 c3, vec4 c4, float value_) {
		float blend1 = smoothstep(c1.w, c2.w, value_);
		float blend2 = smoothstep(c2.w, c3.w, value_);
		float blend3 = smoothstep(c3.w, c4.w, value_);

		vec3 
		col = mix(c1.rgb, c2.rgb, blend1);
		col = mix(col, c3.rgb, blend2);
		col = mix(col, c4.rgb, blend3);

		return col;
	}
`;

const blendLinearBurn = `
	#ifndef FNC_BLENDLINEARBURN
	#define FNC_BLENDLINEARBURN
	float blendLinearBurn(in float base, in float blend) {
		// Note : Same implementation as BlendSubtractf
			return max(base + blend - 1., 0.);
	}

	vec3 blendLinearBurn(in vec3 base, in vec3 blend) {
		// Note : Same implementation as BlendSubtract
			return max(base + blend - vec3(1.), vec3(0.));
	}

	vec3 blendLinearBurn(in vec3 base, in vec3 blend, in float opacity) {
			return (blendLinearBurn(base, blend) * opacity + base * (1. - opacity));
	}
	#endif
`;

const blendLinearDodge = `
	#ifndef FNC_BLENDLINEARDODGE
	#define FNC_BLENDLINEARDODGE
	float blendLinearDodge(in float base, in float blend) {
		// Note : Same implementation as BlendAddf
			return min(base + blend, 1.);
	}

	vec3 blendLinearDodge(in vec3 base, in vec3 blend) {
		// Note : Same implementation as BlendAdd
			return min(base + blend, vec3(1.));
	}

	vec3 blendLinearDodge(in vec3 base, in vec3 blend, in float opacity) {
			return (blendLinearDodge(base, blend) * opacity + base * (1. - opacity));
	}
	#endif
`;

const blendLinearLight = `
	#ifndef FNC_BLENDLINEARLIGHT
	#define FNC_BLENDLINEARLIGHT
	float blendLinearLight(in float base, in float blend) {
		return blend < .5? blendLinearBurn(base, (2. * blend)): blendLinearDodge(base, (2. * (blend- .5)));
	}

	vec3 blendLinearLight(in vec3 base, in vec3 blend) {
		return vec3(blendLinearLight(base.r, blend.r),
								blendLinearLight(base.g, blend.g),
								blendLinearLight(base.b, blend.b));
	}

	vec3 blendLinearLight(in vec3 base, in vec3 blend, in float opacity) {
			return (blendLinearLight(base, blend) * opacity + base * (1. - opacity));
	}
	#endif
`;

const blendSoftLight = `
	#ifndef FNC_BLENDSOFTLIGHT
	#define FNC_BLENDSOFTLIGHT
	float blendSoftLight(in float base, in float blend) {
			return (blend < .5)? (2. * base * blend + base * base * (1. - 2.*blend)): (sqrt(base) * (2. * blend - 1.) + 2. * base * (1. - blend));
	}

	vec3 blendSoftLight(in vec3 base, in vec3 blend) {
			return vec3(blendSoftLight(base.r, blend.r),
									blendSoftLight(base.g, blend.g),
									blendSoftLight(base.b, blend.b));
	}

	vec4 blendSoftLight(in vec4 base, in vec4 blend) {
			return vec4(blendSoftLight( base.r, blend.r ),
									blendSoftLight( base.g, blend.g ),
									blendSoftLight( base.b, blend.b ),
									blendSoftLight( base.a, blend.a )
			);
	}

	vec3 blendSoftLight(in vec3 base, in vec3 blend, in float opacity) {
			return (blendSoftLight(base, blend) * opacity + base * (1. - opacity));
	}
	#endif
`;

const mod289 = `
	#ifndef FNC_MOD289
	#define FNC_MOD289
	float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
	vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
	vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
	vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
	#endif
`;

const permute = `
	#ifndef FNC_PERMUTE
	#define FNC_PERMUTE
	float permute(const in float v) { return mod289(((v * 34.0) + 1.0) * v); }
	vec2 permute(const in vec2 v) { return mod289(((v * 34.0) + 1.0) * v); }
	vec3 permute(const in vec3 v) { return mod289(((v * 34.0) + 1.0) * v); }
	vec4 permute(const in vec4 v) { return mod289(((v * 34.0) + 1.0) * v); }
	#endif
`;

const taylorInvSqrt = `
	#ifndef FNC_TAYLORINVSQRT
	#define FNC_TAYLORINVSQRT
	float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
	vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
	vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
	vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
	#endif
	#ifndef FNC_GRAD4
	#define FNC_GRAD4
	vec4 grad4(float j, vec4 ip) {
			const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
			vec4 p,s;
			p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
			p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
			s = vec4(lessThan(p, vec4(0.0)));
			p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
			return p;
	}
	#endif
`;

const psrdnoise = `
	#ifndef FNC_PSRFNOISE
	#define FNC_PSRFNOISE
	float psrdnoise(vec2 x, vec2 period, float alpha, out vec2 gradient) {
			vec2 uv = vec2(x.x + x.y*0.5, x.y);
			vec2 i0 = floor(uv);
			vec2 f0 = fract(uv);
			float cmp = step(f0.y, f0.x);
			vec2 o1 = vec2(cmp, 1.0-cmp);
			vec2 i1 = i0 + o1;
			vec2 i2 = i0 + vec2(1.0, 1.0);
			vec2 v0 = vec2(i0.x - i0.y * 0.5, i0.y);
			vec2 v1 = vec2(v0.x + o1.x - o1.y * 0.5, v0.y + o1.y);
			vec2 v2 = vec2(v0.x + 0.5, v0.y + 1.0);
			vec2 x0 = x - v0;
			vec2 x1 = x - v1;
			vec2 x2 = x - v2;
			vec3 iu = vec3(0.0);
			vec3 iv = vec3(0.0);
			vec3 xw = vec3(0.0);
			vec3 yw = vec3(0.0);
			if(any(greaterThan(period, vec2(0.0)))) {
					xw = vec3(v0.x, v1.x, v2.x);
					yw = vec3(v0.y, v1.y, v2.y);
					if(period.x > 0.0)
							xw = mod(vec3(v0.x, v1.x, v2.x), period.x);
					if(period.y > 0.0)
							yw = mod(vec3(v0.y, v1.y, v2.y), period.y);
					iu = floor(xw + 0.5*yw + 0.5);
					iv = floor(yw + 0.5);
			} else {
					iu = vec3(i0.x, i1.x, i2.x);
					iv = vec3(i0.y, i1.y, i2.y);
			}
			vec3 hash = mod(iu, 289.0);
			hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
			hash = mod((hash*34.0 + 10.0)*hash, 289.0);
			vec3 psi = hash * 0.07482 + alpha;
			vec3 gx = cos(psi);
			vec3 gy = sin(psi);
			vec2 g0 = vec2(gx.x,gy.x);
			vec2 g1 = vec2(gx.y,gy.y);
			vec2 g2 = vec2(gx.z,gy.z);
			vec3 w = 0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2));
			w = max(w, 0.0);
			vec3 w2 = w * w;
			vec3 w4 = w2 * w2;
			vec3 gdotx = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2));
			float n = dot(w4, gdotx);
			vec3 w3 = w2 * w;
			vec3 dw = -8.0 * w3 * gdotx;
		vec2 dn0 = w4.x * g0 + dw.x * x0;
		vec2 dn1 = w4.y * g1 + dw.y * x1;
		vec2 dn2 = w4.z * g2 + dw.z * x2;
		gradient = 10.9 * (dn0 + dn1 + dn2);
		return 10.9 * n;
	}
	float psrdnoise(vec2 x, vec2 period, float alpha, out vec2 gradient, out vec3 dg) {
		vec2 uv = vec2(x.x + x.y*0.5, x.y);
		vec2 i0 = floor(uv);
		vec2 f0 = fract(uv);
		float cmp = step(f0.y, f0.x);
		vec2 o1 = vec2(cmp, 1.0-cmp);
		vec2 i1 = i0 + o1;
		vec2 i2 = i0 + vec2(1.0, 1.0);
		vec2 v0 = vec2(i0.x - i0.y * 0.5, i0.y);
		vec2 v1 = vec2(v0.x + o1.x - o1.y * 0.5, v0.y + o1.y);
		vec2 v2 = vec2(v0.x + 0.5, v0.y + 1.0);
		vec2 x0 = x - v0;
		vec2 x1 = x - v1;
		vec2 x2 = x - v2;
		vec3 iu, iv;
		vec3 xw, yw;
		if(any(greaterThan(period, vec2(0.0)))) {
			xw = vec3(v0.x, v1.x, v2.x);
			yw = vec3(v0.y, v1.y, v2.y);
			if(period.x > 0.0)
				xw = mod(vec3(v0.x, v1.x, v2.x), period.x);
			if(period.y > 0.0)
				yw = mod(vec3(v0.y, v1.y, v2.y), period.y);
			iu = floor(xw + 0.5*yw + 0.5);
			iv = floor(yw + 0.5);
		} else {
			iu = vec3(i0.x, i1.x, i2.x);
			iv = vec3(i0.y, i1.y, i2.y);
		}
		vec3 hash = mod(iu, 289.0);
		hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
		hash = mod((hash*34.0 + 10.0)*hash, 289.0);
		vec3 psi = hash * 0.07482 + alpha;
		vec3 gx = cos(psi);
		vec3 gy = sin(psi);
		vec2 g0 = vec2(gx.x,gy.x);
		vec2 g1 = vec2(gx.y,gy.y);
		vec2 g2 = vec2(gx.z,gy.z);
		vec3 w = 0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2));
		w = max(w, 0.0);
		vec3 w2 = w * w;
		vec3 w4 = w2 * w2;
		vec3 gdotx = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2));
		float n = dot(w4, gdotx);
		vec3 w3 = w2 * w;
		vec3 dw = -8.0 * w3 * gdotx;
		vec2 dn0 = w4.x * g0 + dw.x * x0;
		vec2 dn1 = w4.y * g1 + dw.y * x1;
		vec2 dn2 = w4.z * g2 + dw.z * x2;
		gradient = 10.9 * (dn0 + dn1 + dn2);
		vec3 dg0, dg1, dg2;
		vec3 dw2 = 48.0 * w2 * gdotx;
		dg0.xy = dw2.x * x0 * x0 - 8.0 * w3.x * (2.0 * g0 * x0 + gdotx.x);
		dg1.xy = dw2.y * x1 * x1 - 8.0 * w3.y * (2.0 * g1 * x1 + gdotx.y);
		dg2.xy = dw2.z * x2 * x2 - 8.0 * w3.z * (2.0 * g2 * x2 + gdotx.z);
		dg0.z = dw2.x * x0.x * x0.y - 8.0 * w3.x * dot(g0, x0.yx);
		dg1.z = dw2.y * x1.x * x1.y - 8.0 * w3.y * dot(g1, x1.yx);
		dg2.z = dw2.z * x2.x * x2.y - 8.0 * w3.z * dot(g2, x2.yx);
		dg = 10.9 * (dg0 + dg1 + dg2);
		return 10.9 * n;
	}
	float psrdnoise(vec2 x, vec2 period, float alpha) {
			vec2 g = vec2(0.0);
			return psrdnoise(x, period, alpha, g);
	}
	float psrdnoise(vec2 x, vec2 period) {
			return psrdnoise(x, period, 0.0);
	}
	float psrdnoise(vec2 x) {
			return psrdnoise(x, vec2(0.0));
	}
	float psrdnoise(vec3 x, vec3 period, float alpha, out vec3 gradient) {
	#ifndef PSRDNOISE_PERLIN_GRID
			const mat3 M = mat3(0.0, 1.0, 1.0,
													1.0, 0.0, 1.0,
													1.0, 1.0, 0.0);
			const mat3 Mi = mat3(-0.5, 0.5, 0.5,
															0.5,-0.5, 0.5,
															0.5, 0.5,-0.5);
	#endif
			vec3 uvw = vec3(0.0);
	#ifndef PSRDNOISE_PERLIN_GRID
			uvw = M * x;
	#else
			uvw = x + dot(x, vec3(0.33333333));
	#endif
			vec3 i0 = floor(uvw);
			vec3 f0 = fract(uvw);
			vec3 g_ = step(f0.xyx, f0.yzz);
			vec3 l_ = 1.0 - g_;
			vec3 g = vec3(l_.z, g_.xy);
			vec3 l = vec3(l_.xy, g_.z);
			vec3 o1 = min( g, l );
			vec3 o2 = max( g, l );
			vec3 i1 = i0 + o1;
			vec3 i2 = i0 + o2;
			vec3 i3 = i0 + vec3(1.0);
			vec3 v0 = vec3(0.0);
			vec3 v1 = vec3(0.0);
			vec3 v2 = vec3(0.0);
			vec3 v3 = vec3(0.0);
	#ifndef PSRDNOISE_PERLIN_GRID
			v0 = Mi * i0;
			v1 = Mi * i1;
			v2 = Mi * i2;
			v3 = Mi * i3;
	#else
			v0 = i0 - dot(i0, vec3(1.0/6.0));
			v1 = i1 - dot(i1, vec3(1.0/6.0));
			v2 = i2 - dot(i2, vec3(1.0/6.0));
			v3 = i3 - dot(i3, vec3(1.0/6.0));
	#endif
			vec3 x0 = x - v0;
			vec3 x1 = x - v1;
			vec3 x2 = x - v2;
			vec3 x3 = x - v3;
			if(any(greaterThan(period, vec3(0.0)))) {
					vec4 vx = vec4(v0.x, v1.x, v2.x, v3.x);
					vec4 vy = vec4(v0.y, v1.y, v2.y, v3.y);
					vec4 vz = vec4(v0.z, v1.z, v2.z, v3.z);
					if(period.x > 0.0) vx = mod(vx, period.x);
					if(period.y > 0.0) vy = mod(vy, period.y);
					if(period.z > 0.0) vz = mod(vz, period.z);
	#ifndef PSRDNOISE_PERLIN_GRID
					i0 = M * vec3(vx.x, vy.x, vz.x);
					i1 = M * vec3(vx.y, vy.y, vz.y);
					i2 = M * vec3(vx.z, vy.z, vz.z);
					i3 = M * vec3(vx.w, vy.w, vz.w);
	#else
					v0 = vec3(vx.x, vy.x, vz.x);
					v1 = vec3(vx.y, vy.y, vz.y);
					v2 = vec3(vx.z, vy.z, vz.z);
					v3 = vec3(vx.w, vy.w, vz.w);
					i0 = v0 + dot(v0, vec3(1.0/3.0));
					i1 = v1 + dot(v1, vec3(1.0/3.0));
					i2 = v2 + dot(v2, vec3(1.0/3.0));
					i3 = v3 + dot(v3, vec3(1.0/3.0));
	#endif
					i0 = floor(i0 + 0.5);
					i1 = floor(i1 + 0.5);
					i2 = floor(i2 + 0.5);
					i3 = floor(i3 + 0.5);
			}
			vec4 hash = permute( permute( permute( 
									vec4(i0.z, i1.z, i2.z, i3.z ))
									+ vec4(i0.y, i1.y, i2.y, i3.y ))
									+ vec4(i0.x, i1.x, i2.x, i3.x ));
			vec4 theta = hash * 3.883222077;
			vec4 sz    = hash * -0.006920415 + 0.996539792;
			vec4 psi   = hash * 0.108705628 ;
			vec4 Ct = cos(theta);
			vec4 St = sin(theta);
			vec4 sz_prime = sqrt( 1.0 - sz*sz );
			vec4 gx = vec4(0.0);
			vec4 gy = vec4(0.0);
			vec4 gz = vec4(0.0);
	#ifdef PSRDNOISE_FAST_ROTATION
			vec4 qx = St;
			vec4 qy = -Ct; 
			vec4 qz = vec4(0.0);
			vec4 px =  sz * qy;
			vec4 py = -sz * qx;
			vec4 pz = sz_prime;
			psi += alpha;
			vec4 Sa = sin(psi);
			vec4 Ca = cos(psi);
			gx = Ca * px + Sa * qx;
			gy = Ca * py + Sa * qy;
			gz = Ca * pz + Sa * qz;
	#else
			if(alpha != 0.0) {
					vec4 Sp = sin(psi);
					vec4 Cp = cos(psi);
					vec4 px = Ct * sz_prime;
					vec4 py = St * sz_prime;
					vec4 pz = sz;
					vec4 Ctp = St*Sp - Ct*Cp;
					vec4 qx = mix( Ctp*St, Sp, sz);
					vec4 qy = mix(-Ctp*Ct, Cp, sz);
					vec4 qz = -(py*Cp + px*Sp);
					vec4 Sa = vec4(sin(alpha));
					vec4 Ca = vec4(cos(alpha));
					gx = Ca * px + Sa * qx;
					gy = Ca * py + Sa * qy;
					gz = Ca * pz + Sa * qz;
			}
			else {
					gx = Ct * sz_prime;
					gy = St * sz_prime;
					gz = sz;  
			}
	#endif
			vec3 g0 = vec3(gx.x, gy.x, gz.x);
			vec3 g1 = vec3(gx.y, gy.y, gz.y);
			vec3 g2 = vec3(gx.z, gy.z, gz.z);
			vec3 g3 = vec3(gx.w, gy.w, gz.w);
			vec4 w = 0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
			w = max(w, 0.0);
			vec4 w2 = w * w;
			vec4 w3 = w2 * w;
			vec4 gdotx = vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3));
			float n = dot(w3, gdotx);
			vec4 dw = -6.0 * w2 * gdotx;
			vec3 dn0 = w3.x * g0 + dw.x * x0;
			vec3 dn1 = w3.y * g1 + dw.y * x1;
			vec3 dn2 = w3.z * g2 + dw.z * x2;
			vec3 dn3 = w3.w * g3 + dw.w * x3;
			gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);
			return 39.5 * n; 
	}
	float psrdnoise(vec3 x, vec3 period, float alpha, out vec3 gradient, out vec3 dg, out vec3 dg2) {
	#ifndef PSRDNOISE_PERLIN_GRID
			const mat3 M = mat3(0.0, 1.0, 1.0,
													1.0, 0.0, 1.0,
													1.0, 1.0, 0.0);
			const mat3 Mi = mat3(-0.5, 0.5, 0.5,
															0.5,-0.5, 0.5,
															0.5, 0.5,-0.5);
	#endif
			vec3 uvw = vec3(0.0);
	#ifndef PSRDNOISE_PERLIN_GRID
			uvw = M * x;
	#else
			uvw = x + dot(x, vec3(0.3333333));
	#endif
			vec3 i0 = floor(uvw);
			vec3 f0 = fract(uvw);
			vec3 g_ = step(f0.xyx, f0.yzz);
			vec3 l_ = 1.0 - g_;
			vec3 g = vec3(l_.z, g_.xy);
			vec3 l = vec3(l_.xy, g_.z);
			vec3 o1 = min( g, l );
			vec3 o2 = max( g, l );
			vec3 i1 = i0 + o1;
			vec3 i2 = i0 + o2;
			vec3 i3 = i0 + vec3(1.0);
			vec3 v0, v1, v2, v3;
	#ifndef PSRDNOISE_PERLIN_GRID
			v0 = Mi * i0;
			v1 = Mi * i1;
			v2 = Mi * i2;
			v3 = Mi * i3;
	#else
			v0 = i0 - dot(i0, vec3(1.0/6.0));
			v1 = i1 - dot(i1, vec3(1.0/6.0));
			v2 = i2 - dot(i2, vec3(1.0/6.0));
			v3 = i3 - dot(i3, vec3(1.0/6.0));
	#endif
			vec3 x0 = x - v0;
			vec3 x1 = x - v1;
			vec3 x2 = x - v2;
			vec3 x3 = x - v3;
			if(any(greaterThan(period, vec3(0.0)))) {
					vec4 vx = vec4(v0.x, v1.x, v2.x, v3.x);
					vec4 vy = vec4(v0.y, v1.y, v2.y, v3.y);
					vec4 vz = vec4(v0.z, v1.z, v2.z, v3.z);
					if(period.x > 0.0) vx = mod(vx, period.x);
					if(period.y > 0.0) vy = mod(vy, period.y);
					if(period.z > 0.0) vz = mod(vz, period.z);
	#ifndef PSRDNOISE_PERLIN_GRID
					i0 = M * vec3(vx.x, vy.x, vz.x);
					i1 = M * vec3(vx.y, vy.y, vz.y);
					i2 = M * vec3(vx.z, vy.z, vz.z);
					i3 = M * vec3(vx.w, vy.w, vz.w);
	#else
					v0 = vec3(vx.x, vy.x, vz.x);
					v1 = vec3(vx.y, vy.y, vz.y);
					v2 = vec3(vx.z, vy.z, vz.z);
					v3 = vec3(vx.w, vy.w, vz.w);
					i0 = v0 + dot(v0, vec3(0.3333333));
					i1 = v1 + dot(v1, vec3(0.3333333));
					i2 = v2 + dot(v2, vec3(0.3333333));
					i3 = v3 + dot(v3, vec3(0.3333333));
	#endif
					i0 = floor(i0 + 0.5);
					i1 = floor(i1 + 0.5);
					i2 = floor(i2 + 0.5);
					i3 = floor(i3 + 0.5);
			}
			vec4 hash = permute( permute( permute( 
									vec4(i0.z, i1.z, i2.z, i3.z ))
									+ vec4(i0.y, i1.y, i2.y, i3.y ))
									+ vec4(i0.x, i1.x, i2.x, i3.x ));
			vec4 theta = hash * 3.883222077;
			vec4 sz    = hash * -0.006920415 + 0.996539792;
			vec4 psi   = hash * 0.108705628 ;
			vec4 Ct = cos(theta);
			vec4 St = sin(theta);
			vec4 sz_prime = sqrt( 1.0 - sz*sz );
			vec4 gx, gy, gz;
	#ifdef PSRDNOISE_FAST_ROTATION
			vec4 qx = St;
			vec4 qy = -Ct; 
			vec4 qz = vec4(0.0);
			vec4 px =  sz * qy;
			vec4 py = -sz * qx;
			vec4 pz = sz_prime;
			psi += alpha;
			vec4 Sa = sin(psi);
			vec4 Ca = cos(psi);
			gx = Ca * px + Sa * qx;
			gy = Ca * py + Sa * qy;
			gz = Ca * pz + Sa * qz;
			#else
			if(alpha != 0.0) {
					vec4 Sp = sin(psi);
					vec4 Cp = cos(psi);
					vec4 px = Ct * sz_prime;
					vec4 py = St * sz_prime;
					vec4 pz = sz;
					vec4 Ctp = St*Sp - Ct*Cp;
					vec4 qx = mix( Ctp*St, Sp, sz);
					vec4 qy = mix(-Ctp*Ct, Cp, sz);
					vec4 qz = -(py*Cp + px*Sp);
					vec4 Sa = vec4(sin(alpha));
					vec4 Ca = vec4(cos(alpha));
					gx = Ca * px + Sa * qx;
					gy = Ca * py + Sa * qy;
					gz = Ca * pz + Sa * qz;
			}
			else {
					gx = Ct * sz_prime;
					gy = St * sz_prime;
					gz = sz;  
			}
	#endif
			vec3 g0 = vec3(gx.x, gy.x, gz.x);
			vec3 g1 = vec3(gx.y, gy.y, gz.y);
			vec3 g2 = vec3(gx.z, gy.z, gz.z);
			vec3 g3 = vec3(gx.w, gy.w, gz.w);
			vec4 w = 0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
			w = max(w, 0.0);
			vec4 w2 = w * w;
			vec4 w3 = w2 * w;
			vec4 gdotx = vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3));
			float n = dot(w3, gdotx);
			vec4 dw = -6.0 * w2 * gdotx;
			vec3 dn0 = w3.x * g0 + dw.x * x0;
			vec3 dn1 = w3.y * g1 + dw.y * x1;
			vec3 dn2 = w3.z * g2 + dw.z * x2;
			vec3 dn3 = w3.w * g3 + dw.w * x3;
			gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);
			vec4 dw2 = 24.0 * w * gdotx;
			vec3 dga0 = dw2.x * x0 * x0 - 6.0 * w2.x * (gdotx.x + 2.0 * g0 * x0);
			vec3 dga1 = dw2.y * x1 * x1 - 6.0 * w2.y * (gdotx.y + 2.0 * g1 * x1);
			vec3 dga2 = dw2.z * x2 * x2 - 6.0 * w2.z * (gdotx.z + 2.0 * g2 * x2);
			vec3 dga3 = dw2.w * x3 * x3 - 6.0 * w2.w * (gdotx.w + 2.0 * g3 * x3);
			dg = 35.0 * (dga0 + dga1 + dga2 + dga3);
			vec3 dgb0 = dw2.x * x0 * x0.yzx - 6.0 * w2.x * (g0 * x0.yzx + g0.yzx * x0);
			vec3 dgb1 = dw2.y * x1 * x1.yzx - 6.0 * w2.y * (g1 * x1.yzx + g1.yzx * x1);
			vec3 dgb2 = dw2.z * x2 * x2.yzx - 6.0 * w2.z * (g2 * x2.yzx + g2.yzx * x2);
			vec3 dgb3 = dw2.w * x3 * x3.yzx - 6.0 * w2.w * (g3 * x3.yzx + g3.yzx * x3);
			dg2 = 39.5 * (dgb0 + dgb1 + dgb2 + dgb3);
			return 39.5 * n;
	}
	float psrdnoise(vec3 x, vec3 period, float alpha) {
			vec3 g = vec3(0.0);
			return psrdnoise(x, period, alpha, g);
	}
	float psrdnoise(vec3 x, vec3 period) {
			return psrdnoise(x, period, 0.0);
	}
	float psrdnoise(vec3 x) {
			return psrdnoise(x, vec3(0.0));
	}
	#endif
	#ifndef FNC_POW5
	#define FNC_POW5
	float pow5(const in float v) {
			float v2 = v * v;
			return v2 * v2 * v;
	}
	vec2 pow5(const in vec2 v) {
			vec2 v2 = v * v;
			return v2 * v2 * v;
	}
	vec3 pow5(const in vec3 v) {
			vec3 v2 = v * v;
			return v2 * v2 * v;
	}
	vec4 pow5(const in vec4 v) {
			vec4 v2 = v * v;
			return v2 * v2 * v;
	}
	#endif

	#ifndef FNC_SCHLICK
	#define FNC_SCHLICK
	vec3 schlick(const in vec3 f0, const in float f90, const in float VoH) {
			float f = pow5(1.0 - VoH);
			return f + f0 * (f90 - f);
	}
	vec3 schlick(const in vec3 f0, const in vec3 f90, const in float VoH) {
			return f0 + (f90 - f0) * pow5(1.0 - VoH);
	}
	float schlick(const in float f0, const in float f90, const in float VoH) {
			return f0 + (f90 - f0) * pow5(1.0 - VoH);
	}
	#endif
	#ifndef QTR_PI
	#define QTR_PI 0.78539816339
	#endif
	#ifndef HALF_PI
	#define HALF_PI 1.5707963267948966192313216916398
	#endif
	#ifndef PI
	#define PI 3.1415926535897932384626433832795
	#endif
	#ifndef TWO_PI
	#define TWO_PI 6.2831853071795864769252867665590
	#endif
	#ifndef TAU
	#define TAU 6.2831853071795864769252867665590
	#endif
	#ifndef INV_PI
	#define INV_PI 0.31830988618379067153776752674503
	#endif
	#ifndef INV_SQRT_TAU
	#define INV_SQRT_TAU 0.39894228040143267793994605993439
	#endif
	#ifndef SQRT_HALF_PI
	#define SQRT_HALF_PI 1.25331413732
	#endif
	#ifndef PHI
	#define PHI 1.618033988749894848204586834
	#endif
	#ifndef EPSILON
	#define EPSILON 0.0000001
	#endif
	#ifndef GOLDEN_RATIO
	#define GOLDEN_RATIO 1.6180339887
	#endif
	#ifndef GOLDEN_RATIO_CONJUGATE 
	#define GOLDEN_RATIO_CONJUGATE 0.61803398875
	#endif
	#ifndef GOLDEN_ANGLE
	#define GOLDEN_ANGLE 2.39996323
	#endif

	#if !defined(FNC_SATURATE) && !defined(saturate)
	#define FNC_SATURATE
	#define saturate(V) clamp(V, 0.0, 1.0)
	#endif
	#ifndef FNC_FRESNEL
	#define FNC_FRESNEL
	vec3 fresnel(const in vec3 f0, vec3 normal, vec3 view) {
		return schlick(f0, 1.0, dot(view, normal));
	}
	vec3 fresnel(const in vec3 f0, const in float NoV) {
	#if defined(TARGET_MOBILE) || defined(PLATFORM_RPI)
			return schlick(f0, 1.0, NoV);
	#else
			float f90 = saturate(dot(f0, vec3(50.0 * 0.33)));
			return schlick(f0, f90, NoV);
	#endif
	}
	float fresnel(const in float f0, const in float NoV) {
			return schlick(f0, 1.0, NoV);
	}
	#endif
`;

const getNoise = `
	float getNoise(const in vec3 position, const in float time, const in float timeMult, const in float seed, const in float spinX, const in float spinY, const in float scale, const in float scaleX, const in float scaleY, out vec3 g) {
		vec3 pos = position;
		
		pos = rotateY(pos, spinX * time * .1);
		
		pos.x *= scaleX;
		pos.y *= scaleY;

		vec3 v = vec3(scale * pos);
		vec3 p = vec3(120., 120., 120.);

		return psrdnoise(v, p, (time * timeMult) + seed, g);
	}
`;

const polarRemap = `
	#ifndef PI
	#define PI 3.1415926535897932384626433832795
	#endif
	
	vec2 polarRemap(vec2 uv) {
		// Calculate center of the plane
		vec2 center = vec2(0.5, 0.5); // assuming plane goes from 0 to 1

		// Calculate vector from center to current uv coordinate
		vec2 offset = uv - center;

		// Calculate angle (theta) using atan2
		float angle = atan(offset.y, offset.x);

		// Calculate distance from center
		float radius = length(offset);

		// Map angle to [0, 1] range
		float mappedAngle = (angle + PI) / (2.0 * PI);

		// Optionally, you can adjust the radius to control the distortion strength
		// For example:
		// radius = sqrt(radius); // square root for smoother distortion

		// Remap the polar coordinates back to cartesian
		return vec2(mappedAngle, radius);
	}
`;

export {
  rotateY,
  rotate4dY,
  getGradient,
  blendLinearBurn,
  blendLinearDodge,
  blendLinearLight,
  blendSoftLight,
  mod289,
  permute,
  taylorInvSqrt,
  psrdnoise,
  getNoise,
  polarRemap,
};
