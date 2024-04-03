export const escaped = {
	'<': '\\u003C',
	'\\': '\\\\',
	'\b': '\\b',
	'\f': '\\f',
	'\n': '\\n',
	'\r': '\\r',
	'\t': '\\t',
	'\u2028': '\\u2028',
	'\u2029': '\\u2029',
};

export function get_type(thing: any) {
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

function get_escaped_char(char: string) {
	switch (char) {
		case '"':
			return '\\"';
		case '<':
			return '\\u003C';
		case '\\':
			return '\\\\';
		case '\n':
			return '\\n';
		case '\r':
			return '\\r';
		case '\t':
			return '\\t';
		case '\b':
			return '\\b';
		case '\f':
			return '\\f';
		case '\u2028':
			return '\\u2028';
		case '\u2029':
			return '\\u2029';
		default:
			return char < ' ' ? `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}` : '';
	}
}

export function stringify_string(str: string) {
	let result = '';
	let last_pos = 0;
	const len = str.length;

	for (let i = 0; i < len; i += 1) {
		const char = str[i];
		const replacement = get_escaped_char(char);
		if (replacement) {
			result += str.slice(last_pos, i) + replacement;
			last_pos = i + 1;
		}
	}

	return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}

function extractPathElements(path: string): string[] {
	// Define a regular expression to match the different parts of the path
	const pathRegex = /(\.\w+)|(\[\d+\])|(\(\d+\))|(\{\w+\})/g;
	// Initialize an array to hold the extracted elements
	let extractedElements: string[] = [];
	let match: RegExpExecArray | null;

	// Match all parts of the path using the regular expression
	while ((match = pathRegex.exec(path)) !== null) {
		// Only one group will match at a time, concatenate the groups

		const matchedElement = match[1] || match[2] || match[3] || match[4];

		// Add the extracted element to the array
		extractedElements.push(matchedElement);
	}

	return extractedElements;
}

const getKeyType = (key: string): ['Object' | 'Array' | 'Set' | 'Map' | 'Unknown', string] => {
	if (key.startsWith('.')) {
		return ['Object', key.replace('.', '')];
	} else if (key.startsWith('[')) {
		return ['Array', key.replace('[', '').replace(']', '')];
	} else if (key.startsWith('(')) {
		return ['Set', key.replace('(', '').replace(')', '')];
	} else if (key.startsWith('{')) {
		return ['Map', key.replace('{', '').replace('}', '')];
	} else {
		throw new Error('Unknown key type');
	}
};

export function deepSet(root: any, path: string, value: any): void {
	const segments = extractPathElements(path);
	let current = root;

	for (let i = 0; i < segments.length; i++) {
		const [type, key] = getKeyType(segments[i]);
		const isLast = i === segments.length - 1;

		if (isLast) {
			switch (type) {
				case 'Object':
					current[key] = value;
					break;
				case 'Array':
					current[Number(key)] = value;
					break;
				case 'Set':
					current.add(value);
					break;
				case 'Map':
					current.set(key, value);
					break;
				default:
					break;
			}
		} else {
			switch (type) {
				case 'Object':
					current = current[key];
					break;
				case 'Set':
				case 'Array':
					current = current[Number(key)];
					break;
				case 'Map':
					current = current.get(key);
					break;
				default:
					break;
			}
		}
	}
	return root;
}
