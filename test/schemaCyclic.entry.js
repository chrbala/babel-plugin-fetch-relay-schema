// @flow

require('babel-core/register')({
	plugins: ['../src'],
});

Object.assign(exports, require('./schema'));
