// import { decode64, encode64 } from './utils';

function get_type(thing: any) {
	const type = Object.prototype.toString.call(thing).slice(8, -1);
	if (type === 'Object' && thing instanceof Map) {
		return 'Map';
	}
	if (type === 'Object' && thing instanceof Set) {
		return 'Set';
	}
	if (type === 'Object' && thing instanceof File) {
		return 'File';
	}
	return type;
}

export const form = (value: unknown, formData: FormData = new FormData()) => {
	if (value === undefined) return formData;
	return toForm({ value }, formData);
};

const toForm = (data: any, formData: FormData) => {
	let p = 0;
	const flatten = (data: any) => {
		const index = p++;
		const type = get_type(data);
		const s = (value: any) => {
			formData.append(`${index}`, type === 'File' ? value : `${type} | ${value}`);
		};
		switch (type) {
			// case 'Int8Array':
			// case 'Uint8Array':
			// case 'Uint8ClampedArray':
			// case 'Int16Array':
			// case 'Uint16Array':
			// case 'Int32Array':
			// case 'Uint32Array':
			// case 'Float32Array':
			// case 'Float64Array':
			// case 'BigInt64Array':
			// case 'BigUint64Array': {
			// 	s(encode64(data.buffer));
			// 	break;
			// }
			// case 'ArrayBuffer':
			// 	s(encode64(data as ArrayBuffer));
			// 	break;
			case 'URL':
				s(data.toString());
				break;
			case 'Null':
				s('null');
				break;
			case 'Undefined':
				s('undefined');
				break;
			case 'Number':
			case 'String':
			case 'Boolean':
				s(String(data));
				break;
			case 'BigInt':
				s(data);
				break;
			case 'Date':
				s(data.toISOString());
				break;
			case 'RegExp':
				const { source, flags } = data as RegExp;
				s(JSON.stringify([source, flags]));
				break;
			case 'File':
				s(data);
				break;
			case 'Array':
			case 'Set': {
				const array: any[] = [];
				data.forEach((value: any) => {
					array.push(flatten(value));
				});
				s(JSON.stringify(array));
				break;
			}
			case 'Object':
			case 'Map': {
				const values = type === 'Map' ? data.entries() : Object.entries(data);
				let object = {};
				for (const entry of values) {
					Object.assign(object, { [entry[0]]: flatten(entry[1]) });
				}
				s(JSON.stringify(object));
				break;
			}
		}
		return index;
	};
	flatten(data);
	return formData;
};

export const deform = (formData: FormData) => {
	const { value } = fromForm(formData) as { value: any };
	return value;
};

const fromForm = (formData: FormData) => {
	const set = (root: any, key: string | number, valueIndex: number, rootType?: string) => {
		const formValue = formData.get(String(valueIndex)) as string;
		const [type, value] = typeof formValue === 'string' ? formValue.split(' | ') : ['File', formValue];
		const s = (value: any) => {
			if (rootType === 'Map') {
				root.set(key, value);
			} else if (rootType === 'Set') {
				root.add(value);
			} else {
				root[key] = value;
			}
		};
		switch (type) {
			// case 'Int8Array':
			// case 'Uint8Array':
			// case 'Uint8ClampedArray':
			// case 'Int16Array':
			// case 'Uint16Array':
			// case 'Int32Array':
			// case 'Uint32Array':
			// case 'Float32Array':
			// case 'Float64Array':
			// case 'BigInt64Array':
			// case 'BigUint64Array': {
			// 	const TypedArrayConstructor = globalThis[type];
			// 	const base64 = value;
			// 	const arraybuffer = decode64(base64);
			// 	const typedArray = new TypedArrayConstructor(arraybuffer);
			// 	s(typedArray);
			// 	break;
			// }
			// case 'ArrayBuffer':
			// 	s(decode64(value));
			// 	break;
			case 'URL':
				s(new URL(value));
				break;
			case 'Number':
				s(Number(value));
				break;
			case 'String':
				s(value);
				break;
			case 'Boolean':
				s(value === 'true');
				break;
			case 'BigInt':
				s(BigInt(value as string));
				break;
			case 'File':
				s(value);
				break;
			case 'Date':
				s(new Date(value as string));
				break;
			case 'RegExp':
				const [source, flags] = JSON.parse(value as string);
				s(new RegExp(source, flags));
				break;
			case 'Undefined':
				s(undefined);
				break;
			case 'Null':
				s(null);
				break;
			case 'Set':
			case 'Array':
				{
					const values = JSON.parse(value);
					const root = type === 'Set' ? new Set() : [];
					const l = values.length;
					let i = 0;
					for (i; i < l; i += 1) {
						set(root, i, values[i], type);
					}
					s(root);
				}

				break;
			case 'Map':
			case 'Object':
				{
					const values = JSON.parse(value);
					const root = type === 'Map' ? new Map() : values;
					for (const key in values) {
						set(root, key, values[key], type);
					}
					s(root);
				}
				break;
		}
	};

	const root = { value: 1 };
	set(root, 'value', 1);

	return root;
};
