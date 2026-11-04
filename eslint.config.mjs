import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const config = await generateEslintConfig({
	enableTypescript: true,
	ignores: ['old/**'],
	typescriptRules: {
		'n/no-missing-import': 'off',
	},
})

export default [
	...config,
	{
		files: ['test/*.mjs'],
		rules: { 'n/no-unpublished-import': 'off' },
	},
]
