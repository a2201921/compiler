const ASTNode = require('./ASTNode')
let nodeTypes = require('./nodeTypes')
let tokenTypes = require('./tokenTypes')

/**
 * 2+3*4
 *  additive -> minus | minus + additive
 * minus -> muleiple | muleiple - minus
 * multiple -> divide | divide * multiple
 * divide -> primary | primary / divide
 * primary -> NUMBER | (add)
 */

function toAST(tokenReader) {
	let rootNode = new ASTNode(nodeTypes.Program)
	let child = additive(tokenReader)
	if (child) {
		rootNode.appendChild(child)
	}

	return rootNode
}

function additive(tokenReader) {
	let child1 = multiple(tokenReader)
	let node = child1

	if (child1 !== null) {
		while (true) {
			let token = tokenReader.peek()
			if (
				token != null &&
				(token.type === tokenTypes.PLUS || token.type === tokenTypes.MINUS)
			) {
				token = tokenReader.read()
				let child2 = multiple(tokenReader)
				console.log(child2)

				node = new ASTNode(
					token.type === tokenTypes.PLUS ? nodeTypes.Additive : nodeTypes.Minus
				)
				node.appendChild(child1)
				node.appendChild(child2)
				child1 = node
			} else {
				break
			}
		}
	}
	return child1
}

function multiple(tokenReader) {
	let child1 = primary(tokenReader)
	let node = child1

	if (child1 !== null) {
		while (true) {
			let token = tokenReader.peek()
			if (
				token != null &&
				(token.type === tokenTypes.MULTIPLY || token.type === tokenTypes.DIVIDE)
			) {
				token = tokenReader.read()
				let child2 = multiple(tokenReader)

				node = new ASTNode(
					token.type === tokenTypes.MULTIPLY
						? nodeTypes.Multplicative
						: nodeTypes.Divide
				)
				node.appendChild(child1)
				node.appendChild(child2)
				child1 = node
			} else {
				break
			}
		}
	}
	return child1
}

function primary(tokenReader) {
	let node = number(tokenReader)
	if (!node) {
		let token = tokenReader.peek()

		if (token !== null && token.type === tokenTypes.LEFT_PARA) {
			tokenReader.read()
			node = additive(tokenReader)
			tokenReader.read()
		}
	}
	return node
}

function number(tokenReader) {
	let token = tokenReader.peek()
	let node = null
	if (token != null && token.type == tokenTypes.NUMBER) {
		node = new ASTNode(nodeTypes.Numeric, tokenReader.read().value)
	}
	return node
}

module.exports = toAST
