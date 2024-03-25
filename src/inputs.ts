import { CompanionInputFieldTextInput } from '@companion-module/base'

export function BasicTextInput(
	label: string,
	id: string,
	defaultValue?: string,
	required?: boolean,
	useVariables?: boolean
): CompanionInputFieldTextInput {
	return {
		type: 'textinput',
		label: label,
		id: id,
		default: defaultValue,
		required: required,
		useVariables: useVariables,
	}
}
