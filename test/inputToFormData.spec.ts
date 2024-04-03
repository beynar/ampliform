import { it, expect } from 'vitest';
import { deform, form } from '../src/lib';

it('Should transform an object back and forth between input and formData', async () => {
	const input = {
		string: 'world',
		date: new Date(),
		infinity: Infinity,
		minusInfinity: -Infinity,
		zero: 0,
		nan: NaN,
		max: Number.MAX_VALUE,
		min: Number.MIN_VALUE,
		url: new URL('https://google.com'),
		regex: new RegExp('hello', 'g'),
		number: 1,
		undefined: undefined,
		null: null,
		boolean: true,
		// others weird javascript types
		bigint: BigInt(1),
		array: ['string', undefined, null, 1],
		set: new Set(['hello', 'world']),
		map: new Map([
			[
				'hello',
				{
					hello: 'world',
					test: new Set(['hello', 'world']),
				},
			],
		]),
		object: {
			string: 'world',
			date: new Date(),
			number: 1,
			undefined: undefined,
			null: null,
			boolean: true,
		},
		complexArray: [
			{
				string: 'world',
				date: new Date(),
				number: 1,
				undefined: undefined,
				null: null,
				boolean: true,
			},
		],
		// arrayBuffer: new ArrayBuffer(8),
		// unit8Array: new Uint8Array([1, 2, 3, 4]),
	};

	const formData = await form(input);

	const data = deform(formData);
	console.log(data);
	expect(input).toEqual(data);
});
it('Should transform a simple string back and forth between input and formData', async () => {
	const input = 'hello';
	const toFormData = form(input);
	const fromFormData = deform(toFormData);
	expect(input).toEqual(fromFormData);
});
it('Should transform a simple number back and forth between input and formData', async () => {
	const input = 1;
	const toFormData = form(input);
	const fromFormData = deform(toFormData);
	expect(input).toEqual(fromFormData);
});
it('Should transform a simple boolean back and forth between input and formData', async () => {
	const input = true;
	const toFormData = form(input);
	const fromFormData = deform(toFormData);
	expect(input).toEqual(fromFormData);
});
// it('Should transform a simple undefined back and forth between input and formData', async () => {
// 	const input = undefined;
// 	const toFormData = form(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });
it('Should transform a simple null back and forth between input and formData', async () => {
	const input = null;
	const toFormData = form(input);
	const fromFormData = deform(toFormData);
	expect(input).toEqual(fromFormData);
});
it('Should transform a simple date back and forth between input and formData', async () => {
	const input = new Date();
	const toFormData = form(input);
	const fromFormData = deform(toFormData);
	expect(input).toEqual(fromFormData);
});
it('Should transform a simple file back and forth between input and formData', async () => {
	const input = new File(['hello'], 'hello.txt');
	const toFormData = form(input);
	const fromFormData = deform(toFormData);
	expect(input).toEqual(fromFormData);
});

it('Should transform a simple file back and forth between input and formData', async () => {
	const input = {
		map: new Map([
			[
				'hello',
				{
					hello: 'world',
					test: new Set(['hello', 'world']),
				},
			],
		]),
	};
	const toFormData = form(input);
	const fromFormData = deform(toFormData);
	console.log({ fromFormData }, toFormData);
	expect(input).toEqual(fromFormData);
});
