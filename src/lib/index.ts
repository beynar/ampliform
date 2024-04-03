import { deepSet, get_type, stringify_string } from './utils';

export const formify = (value: unknown, formData: FormData = new FormData()) => {
	if (value === undefined) return formData;
	return toForm({ value }, formData);
};

const toForm = (data: any, formData: FormData, parentKey = '', parentType?: 'MAP' | 'SET') => {
	const type = get_type(data);
	const processedKey = parentKey || '';
	let formKey = `${type} | ${processedKey}`;
	if (parentType) {
		formKey += ` | ${parentType}`;
	}
	const isRootObject = processedKey === '';

	const s = (value: any) => formData.append(formKey, value);
	switch (type) {
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
			const { source, flags } = data;
			s(flags ? `[${stringify_string(source)},"${flags}"]` : `[${stringify_string(source)}]`);
			break;
		case 'File':
			s(data);
			break;
		case 'Set':
		case 'Array':
			s('[]');
			let index = 0;
			for (const value of data) {
				toForm(value, formData, `${processedKey}${type === 'Set' ? `(${index})` : `[${index}]`}`);
				index++;
			}
			break;
		case 'Object':
		case 'Map':
			if (!isRootObject) {
				s('{}');
			}
			for (const [key, value] of type === 'Map' ? data.entries() : Object.entries(data)) {
				toForm(value, formData, `${`${processedKey}`}${type === 'Map' ? `{${key}}` : `.${key}`}`);
			}
			break;
		default:
			break;
	}

	return formData;
};

export const deform = (formData: FormData) => {
	const { value } = fromForm(formData) as { value: any };
	return value;
};

const fromForm = (formData: FormData) => {
	const data = {};
	for (const [key, value] of formData.entries()) {
		const [type, processedKey] = key.split(' | ');
		const s = (value: any) => deepSet(data, processedKey, value);
		switch (type) {
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
			case 'Array':
				s([]);
				break;
			case 'Object':
				s({});
				break;
			case 'Set':
				s(new Set());
				break;
			case 'Map':
				s(new Map());
				break;
		}
	}
	return data;
};
