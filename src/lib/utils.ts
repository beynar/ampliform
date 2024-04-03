export function decode64(string: string) {
	const binaryString = asciiToBinary(string);
	const arraybuffer = new ArrayBuffer(binaryString.length);
	const dv = new DataView(arraybuffer);

	for (let i = 0; i < arraybuffer.byteLength; i++) {
		dv.setUint8(i, binaryString.charCodeAt(i));
	}

	return arraybuffer;
}

export function encode64(arraybuffer: ArrayBuffer) {
	const dv = new DataView(arraybuffer);
	let binaryString = '';

	for (let i = 0; i < arraybuffer.byteLength; i++) {
		binaryString += String.fromCharCode(dv.getUint8(i));
	}

	return binaryToAscii(binaryString);
}
const KEY_STRING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function binaryToAscii(str: string) {
	let out = '';
	for (let i = 0; i < str.length; i += 3) {
		const groupsOfSix = [undefined, undefined, undefined, undefined] as [
			number | undefined,
			number | undefined,
			number | undefined,
			number | undefined,
		];
		groupsOfSix[0] = str.charCodeAt(i) >> 2;
		groupsOfSix[1] = (str.charCodeAt(i) & 0x03) << 4;
		if (str.length > i + 1) {
			groupsOfSix[1] |= str.charCodeAt(i + 1) >> 4;
			groupsOfSix[2] = (str.charCodeAt(i + 1) & 0x0f) << 2;
		}
		if (str.length > i + 2) {
			groupsOfSix[2]! |= str.charCodeAt(i + 2) >> 6;
			groupsOfSix[3] = str.charCodeAt(i + 2) & 0x3f;
		}
		for (let j = 0; j < groupsOfSix.length; j++) {
			if (typeof groupsOfSix[j] === 'undefined') {
				out += '=';
			} else {
				out += KEY_STRING[groupsOfSix[j] as number];
			}
		}
	}
	return out;
}

function asciiToBinary(data: string) {
	if (data.length % 4 === 0) {
		data = data.replace(/==?$/, '');
	}

	let output = '';
	let buffer = 0;
	let accumulatedBits = 0;

	for (let i = 0; i < data.length; i++) {
		buffer <<= 6;
		buffer |= KEY_STRING.indexOf(data[i]);
		accumulatedBits += 6;
		if (accumulatedBits === 24) {
			output += String.fromCharCode((buffer & 0xff0000) >> 16);
			output += String.fromCharCode((buffer & 0xff00) >> 8);
			output += String.fromCharCode(buffer & 0xff);
			buffer = accumulatedBits = 0;
		}
	}
	if (accumulatedBits === 12) {
		buffer >>= 4;
		output += String.fromCharCode(buffer);
	} else if (accumulatedBits === 18) {
		buffer >>= 2;
		output += String.fromCharCode((buffer & 0xff00) >> 8);
		output += String.fromCharCode(buffer & 0xff);
	}
	return output;
}
