let RegExpObject = /([0-9]+)|(\+)|(\-)|(\*)|(\/)|(\(+)|(\)+)/g
let tokenTypes = require('./tokenTypes')
let tokenNames = [
	tokenTypes.NUMBER,
	tokenTypes.PLUS,
	tokenTypes.MINUS,
	tokenTypes.MULTIPLY,
	tokenTypes.DIVIDE,
	tokenTypes.LEFT_PARA,
	tokenTypes.RIGHT_PARA
]

function* tokenizer(script) {
	while (true) {
		let result = RegExpObject.exec(script)
		if (!result) break
		let index = result.findIndex((item, index) => index > 0 && !!item)
		let token = {}
		token.type = tokenNames[index - 1]
		token.value = result[0]
		yield token
	}
}

function tokenize(script) {
	let tokens = []
	for (let token of tokenizer(script)) {
		tokens.push(token)
	}
	return new TokenReader(tokens)
}

class TokenReader {
	constructor(tokens) {
		this.tokens = tokens
		this.pos = 0
	}

	read() {
		if (this.pos < this.tokens.length) {
			return this.tokens[this.pos++]
		}
		return null
	}

	peek() {
		if (this.pos < this.tokens.length) {
			return this.tokens[this.pos]
		}
		return null
	}

	unread() {
		this.pos--
	}
}

module.exports = tokenize
