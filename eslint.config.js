import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
	globalIgnores(["dist", "node_modules"]),
	{
		files: ["**/*.{js,jsx}"],
		extends: [
			js.configs.recommended,
			"plugin:react/recommended",
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
			"plugin:prettier/recommended",
		],
		plugins: ["react", "prettier"],
		languageOptions: {
			ecmaVersion: 2021,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		rules: {
			"react/react-in-jsx-scope": "off", // React 17+ نیاز نداره
			"no-unused-vars": [
				"error",
				{ varsIgnorePattern: "^[A-Z_]" },
			],
			"prettier/prettier": [
				"error",
				{
					printWidth: 100,
					tabWidth: 4,
					useTabs: true,
					semi: true,
					singleQuote: false,
					trailingComma: "es5",
					arrowParens: "always",
					endOfLine: "auto",
				},
			],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
]);
