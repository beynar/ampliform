import { it, expect } from 'vitest';
import { deform, formify } from '../src/lib';
import { deepSet } from '../src/lib/utils';
// () are for Set
// [] are for Array
// {} are for Map
// . is for Object

it('Should deeply set', async () => {
	console.log(
		deepSet({
			map: new Map(['hello', 'world']),
			set: new Set(['hello', 'world']),
		}),
	);
	expect(true).toEqual(true);
});
