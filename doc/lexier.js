let sourceCode = '10+20'

const NUMBERS = /[0-9]/
const Numeric = 'Numeric'
const Punctuator = 'Punctuator'

let tokens = []
let currentToken

function emit(char) {
	console.log(char)
	currentToken = { type: '', value: '' }
	tokens.push(char)
}
function start(char) {
	if (NUMBERS.test(char)) {
		currentToken = {
			type: Numeric,
			value: '',
		}
	}

	return number(char)
}

function number(char) {
	if (NUMBERS.test(char)) {
		currentToken.value += char
		return number
	} else if (char === '+' || char === '-') {
		emit(currentToken)
		emit({ type: Punctuator, value: char })
		currentToken = { type: Numeric, value: '' }
		return number
	}
}

function tokenizer(chars) {
	let state = start
	for (const char of chars) {
		state = state(char)
	}
	if (currentToken.value.length > 0) {
		emit(currentToken)
	}
}
tokenizer(sourceCode)
