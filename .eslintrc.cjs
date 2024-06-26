module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	settings: { react: { version: '18.2' } },
	plugins: ['react-refresh', 'react'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'no-unused-vars': [
			'error',
			{
				varsIgnorePattern: '^h$',
			},
		],
		'react/prop-types': 'off',
		'react/no-unescaped-entities': 'off',
		'react-refresh/only-export-components': 'off',
		'no-unused-vars': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'no-empty': 'off',
		'no-constant-condition': 'off',
	},
};
