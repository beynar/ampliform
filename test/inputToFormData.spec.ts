import { it, expect } from 'vitest';
import { deform, formify } from '../src/lib';

// it('Should transform an object back and forth between input and formData', async () => {
// 	const input = {
// 		string: 'world',
// 		date: new Date(),
// 		regex: new RegExp('hello', 'g'),
// 		number: 1,
// 		undefined: undefined,
// 		null: null,
// 		boolean: true,
// 		file: new File(['hello'], 'hello.txt'),
// 		object: {
// 			string: 'world',
// 			date: new Date(),
// 			number: 1,
// 			undefined: undefined,
// 			null: null,
// 			file: new File(['hello'], 'hello.txt'),
// 			boolean: true,
// 		},
// 		bigint: BigInt(1),
// 		array: ['string', undefined, null, 1],
// 		complexArray: [
// 			{
// 				string: 'world',
// 				date: new Date(),
// 				number: 1,
// 				undefined: undefined,
// 				null: null,
// 				file: new File(['hello'], 'hello.txt'),
// 				boolean: true,
// 			},
// 		],
// 	};

// 	const formData = await formify(input);
// 	console.log(formData);
// 	const data = deform(formData);

// 	expect(input).toEqual(data);
// });
// it('Should transform a simple string back and forth between input and formData', async () => {
// 	const input = 'hello';
// 	const toFormData = formify(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });
// it('Should transform a simple number back and forth between input and formData', async () => {
// 	const input = 1;
// 	const toFormData = formify(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });
// it('Should transform a simple boolean back and forth between input and formData', async () => {
// 	const input = true;
// 	const toFormData = formify(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });
// it('Should transform a simple undefined back and forth between input and formData', async () => {
// 	const input = undefined;
// 	const toFormData = formify(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });
// it('Should transform a simple null back and forth between input and formData', async () => {
// 	const input = null;
// 	const toFormData = formify(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });
// it('Should transform a simple date back and forth between input and formData', async () => {
// 	const input = new Date();
// 	const toFormData = formify(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });
// it('Should transform a simple file back and forth between input and formData', async () => {
// 	const input = new File(['hello'], 'hello.txt');
// 	const toFormData = formify(input);
// 	const fromFormData = deform(toFormData);
// 	expect(input).toEqual(fromFormData);
// });

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
	const toFormData = formify(input);
	const fromFormData = deform(toFormData);
	console.log(fromFormData);
	expect(input).toEqual(fromFormData);
});
