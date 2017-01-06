import { transform } from 'babel-core';

const options = {
	"presets": ["stage-0", "es2015"],
	"plugins": ["./src"]
};

it('can transform without error', () => {
	const { code } = transform('const hello = 5;', options);
	expect(code).toMatch('var hello = 5;');
});
