let tokenTypes = require('./tokenTypes.js')
const LETTERS = /[a-z0-9]/

let currentToken = { type: '', value: '' }
let tokens = []

function emit(char) {
	currentToken = { type: '', value: '' }
	tokens.push(char)
}

function start(char) {
	if (char === '<') {
		emit({ type: tokenTypes.LeftParentheses, value: '<' })
		return foundLeftParentheses
	}

	throw new Error('第一个字符必须是<')
}

function foundLeftParentheses(char) {
	// char = h1
	// 找左侧
	if (LETTERS.test(char)) {
		currentToken.type = tokenTypes.JSXIdentifier
		currentToken.value += char
		return jsxIdentifier
	} else if (char === '/') {
		emit({ type: tokenTypes.BackSlash, value: '/' })
		return foundLeftParentheses
	}
	throw new Error('第一个字符必须是<')
}

// 获取jsx 标签
function jsxIdentifier(char) {
	if (LETTERS.test(char)) {
		currentToken.value += char
		return jsxIdentifier
	} else if (char === '>') {
		emit(currentToken)
		emit({ type: tokenTypes.RightParentheses, value: '>' })
		return foundRightParentheses
	} else if (char === ' ') {
		emit(currentToken)
		return attribute
	}

	throw new Error('第一个字符必须是<')
}

// 获取属性
function attribute(char) {
	// char=i
	if (LETTERS.test(char)) {
		currentToken.type = tokenTypes.AttributeKey
		currentToken.value += char
		return attributeKey
	}
}

// 获取属性key
function attributeKey(char) {
	// char=d
	if (LETTERS.test(char)) {
		currentToken.value += char
		return attributeKey
	} else if (char === '=') {
		emit(currentToken)
		return attributeValue
	}

	throw new TypeError('Error')
}

function attributeValue(char) {
	// char="
	// 获取属性key
	if (char === '"') {
		currentToken.type = tokenTypes.AttributeStringValue
		currentToken.value = '"'
		return attributeStingValue
	} else if (char === '{') {
		currentToken.type = tokenTypes.AttributeExpressionValue
		currentToken.value = '{'
		return attributeExpressionValue
	}
}

function attributeExpressionValue(char) {
	if (LETTERS.test(char)) {
		currentToken.value += char
		return attributeExpressionValue
	} else if (char == '}') {
        currentToken.value +=char
		emit(currentToken) // {type: 'String',value: 'title'}
		return tryLeaveAttribute
	}
	throw new TypeError('Error')
}

function attributeStingValue(char) {
	if (LETTERS.test(char)) {
		currentToken.value += char
		return attributeStingValue
	} else if (char == '"') {
        currentToken.value+=char
		emit(currentToken) // {type: 'String',value: 'title'}
		return tryLeaveAttribute
	}
	throw new TypeError('Error')
}
// 判断是一个新属性 也可能是开始标签的结束
function tryLeaveAttribute(char) {
	if (char === ' ') {
		return attribute
	} else if (char === '>') {
		emit({ type: tokenTypes.RightParentheses, value: '>' })
		return foundRightParentheses
	}
	throw new TypeError('Error')
}

function foundRightParentheses(char) {
	// 说明开启新元素 <span
	if (char === '<') {
		emit({ type: tokenTypes.LeftParentheses, value: '<' })
		return foundLeftParentheses
	} else {
		// 'world'
		currentToken.type = tokenTypes.JSXText
		currentToken.value += char
		return jsxText
	}
}

function jsxText(char) {
	if (char === '<') {
		emit(currentToken) // {type: 'JSXText,value: 'hello }
		emit({ type: tokenTypes.LeftParentheses, value: '<' })
		return foundLeftParentheses
	} else {
		currentToken.value += char
		return jsxText
	}
}

function tokenizer(input) {
	let state = start
	for (let char of input) {
		state = state(char)
	}
	return tokens
}

module.exports = tokenizer