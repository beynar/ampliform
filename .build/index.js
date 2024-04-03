var R = function (A) {
		const q = Object.prototype.toString.call(A).slice(8, -1);
		if (q === 'Object' && A instanceof Map) return 'Map';
		if (q === 'Object' && A instanceof Set) return 'Set';
		if (q === 'Object' && A instanceof File) return 'File';
		return q;
	},
	W = (A, q = new FormData()) => {
		if (A === void 0) return q;
		return S({ value: A }, q);
	},
	S = (A, q, Q = '', L) => {
		let N = 0;
		const G = (w) => {
			const J = N++,
				E = R(w),
				M = (O) => {
					q.append(`${J}`, E === 'File' ? O : `${E} | ${O}`);
				};
			switch (E) {
				case 'URL':
					M(w.toString());
					break;
				case 'Null':
					M('null');
					break;
				case 'Undefined':
					M('undefined');
					break;
				case 'Number':
				case 'String':
				case 'Boolean':
					M(String(w));
					break;
				case 'BigInt':
					M(w);
					break;
				case 'Date':
					M(w.toISOString());
					break;
				case 'RegExp':
					const { source: O, flags: H } = w;
					M(JSON.stringify([O, H]));
					break;
				case 'File':
					M(w);
					break;
				case 'Set': {
					const C = [];
					w.forEach((z) => {
						C.push(G(z));
					}),
						M(JSON.stringify(C));
					break;
				}
				case 'Array':
					{
						const C = [],
							z = w.length;
						let B = 0;
						for (B; B < z; B++) C.push(G(w[B]));
						M(JSON.stringify(C));
					}
					break;
				case 'Object': {
					let C = {};
					for (let z in w) Object.assign(C, { [z]: G(w[z]) });
					M(JSON.stringify(C));
					break;
				}
				case 'Map': {
					const C = E === 'Map' ? w.entries() : Object.entries(w);
					let z = {};
					for (let B of C) Object.assign(z, { [B[0]]: G(B[1]) });
					M(JSON.stringify(z));
					break;
				}
				default:
					break;
			}
			return J;
		};
		return G(A), q;
	},
	X = (A) => {
		const { value: q } = U(A);
		return q;
	},
	U = (A) => {
		const q = (L, N, G, w) => {
				const J = A.get(String(G)),
					[E, M] = typeof J === 'string' ? J.split(' | ') : ['File', J],
					O = (H) => {
						if (w === 'Map') L.set(N, H);
						else if (w === 'Set') L.add(H);
						else L[N] = H;
					};
				switch (E) {
					case 'URL':
						O(new URL(M));
						break;
					case 'Number':
						O(Number(M));
						break;
					case 'String':
						O(M);
						break;
					case 'Boolean':
						O(M === 'true');
						break;
					case 'BigInt':
						O(BigInt(M));
						break;
					case 'File':
						O(M);
						break;
					case 'Date':
						O(new Date(M));
						break;
					case 'RegExp':
						const [H, C] = JSON.parse(M);
						O(new RegExp(H, C));
						break;
					case 'Undefined':
						O(void 0);
						break;
					case 'Null':
						O(null);
						break;
					case 'Set':
					case 'Array':
						{
							const z = JSON.parse(M),
								B = E === 'Set' ? new Set() : [],
								P = z.length;
							let K = 0;
							for (K; K < P; K += 1) q(B, K, z[K], E);
							O(B);
						}
						break;
					case 'Map':
					case 'Object':
						{
							const z = JSON.parse(M),
								B = E === 'Map' ? new Map() : z;
							for (let P in z) q(B, P, z[P], E);
							O(B);
						}
						break;
				}
			},
			Q = { value: 1 };
		return q(Q, 'value', 1), Q;
	};
export { W as form, X as deform };
