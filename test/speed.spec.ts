import { test, expect } from 'vitest';
import { deform, form } from '../src/lib';
import { deform as deform2, form as form2 } from '../src/lib';
import { stringify, parse } from 'devalue';
import superjson from 'superjson';

const input = {
	string: 'world',
	date: new Date(),
	regex: new RegExp('hello', 'g'),
	number: 1,
	undefined: undefined,
	null: null,
	boolean: true,
	// file: new File(['hello'], 'hello.txt'),
	object: {
		string: 'world',
		date: new Date(),
		number: 1,
		undefined: undefined,
		null: null,
		// file: new File(['hello'], 'hello.txt'),
		boolean: true,
	},

	array: ['string', undefined, null, 1],
	complexArray: [
		{
			string: 'world',
			date: new Date(),
			number: 1,
			undefined: undefined,
			null: null,
			// file: new File(['hello'], 'hello.txt'),
			boolean: true,
		},
	],
};

test('JSON speed', () => {
	const start = process.hrtime();
	for (let i = 0; i < 1000; i++) {
		JSON.parse(JSON.stringify(input));
	}
	const end = process.hrtime(start);
	console.log('JSON Execution time: %dms', end[1] / 1000000);

	expect(input).not.toEqual(JSON.parse(JSON.stringify(input)));
});
test('Devalue speed', () => {
	const start = process.hrtime();
	for (let i = 0; i < 1000; i++) {
		parse(stringify(input));
	}
	const end = process.hrtime(start);
	console.log('Devalue Execution time: %dms', end[1] / 1000000);

	expect(input).toEqual(parse(stringify(input)));
});
test('Superjson speed', () => {
	const start = process.hrtime();
	for (let i = 0; i < 1000; i++) {
		superjson.parse(superjson.stringify(input));
	}
	const end = process.hrtime(start);
	console.log('Superjson Execution time: %dms', end[1] / 1000000);

	expect(input).toEqual(superjson.parse(superjson.stringify(input)));
});

test('Ampliform speed', () => {
	const start = process.hrtime();

	for (let i = 0; i < 1000; i++) {
		deform(form(input));
	}

	const end = process.hrtime(start);
	console.log('Ampliform Execution time: %dms', end[1] / 1000000);

	expect(input).toEqual(deform(form(input)));
});
test('Ampliform2 speed', () => {
	const start = process.hrtime();

	for (let i = 0; i < 1000; i++) {
		deform2(form2(input));
	}

	const end = process.hrtime(start);
	console.log('Ampliform2 Execution time: %dms', end[1] / 1000000);

	expect(input).toEqual(deform2(form2(input)));
});
