const tokenizer = require('./tokenizer')
const tokenTypes = require('./tokenTypes')
const nodeTypes = require('./nodeTypes')

function parser(sourceCode) {
	let tokens = tokenizer(sourceCode)
	let pos = 0
	function walk(parent) {
		let token = tokens[pos]

		let nextToken = tokens[pos + 1]
		if (
			token.type === tokenTypes.LeftParentheses &&
			nextToken.type === tokenTypes.JSXIdentifier
		) {
			// <h1
			let node = {
				type: nodeTypes.JSXElement,
				openingElement: null,
				closingElement: null,
				children: [],
			}

			token = tokens[++pos]
			node.openingElement = {
				type: nodeTypes.JSXOpeningElement,
				name: {
					type: nodeTypes.JSXIdentifier,
					name: token.value,
				},
				attributes: [],
			}
			token = tokens[++pos]
			// 判断当前是否为属性
			while (token.type === tokenTypes.AttributeKey) {
				node.openingElement.attributes.push(walk())
				token = tokens[pos]
			}

			token = tokens[++pos]
			nextToken = tokens[pos + 1]

			// 判断不是新开始的元素或者是结束元素 <span || </span
			// 判断是否是子节点
			while (
				token.type != tokenTypes.LeftParentheses ||
				(token.type === tokenTypes.LeftParentheses &&
					nextToken.type != tokenTypes.BackSlash)
			) {
				node.children.push(walk())
				token = tokens[pos]
				nextToken = tokens[pos + 1]
			}
			node.closingElement = walk(node)
			return node
		} else if (token.type === tokenTypes.AttributeKey) {
			// attribute规则
			let nextToken = tokens[++pos]
			let node = {
				type: nodeTypes.JSXAttribute,
				name: {
					type: nodeTypes.JSXIdentifier,
					name: token.value,
				},
				value: {
					type: nodeTypes.Literal,
					value: nextToken.value,
				},
			}
			pos++
			return node
		} else if (token.type === tokenTypes.JSXText) {
			pos++
			return {
				type: nodeTypes.JSXText,
				value: token.value,
			}
		} else if (
			parent &&
			token.type === tokenTypes.LeftParentheses &&
			nextToken.type === tokenTypes.BackSlash
		) {
			pos++ // 跳过<
			pos++ // 跳过/
			token = tokens[pos] // span h1
			pos++ // 跳过span
			pos++ // 跳过>
			return {
				type: nodeTypes.JSXClosingElement,
				name: {
					type: nodeTypes.JSXIdentifier,
					name: token.value,
				},
			}
		}
	}

	let ast = {
		type: nodeTypes.Program,
		body: [
			{
				type: nodeTypes.ExpressionStatement,
				expression: walk(),
			},
		],
	}
	return ast
}


module.exports = {
	parser,
}

