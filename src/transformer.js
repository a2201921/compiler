const { parser } = require('./parser')
const { traverse } = require('./traverse')
const nodeTypes = require('./nodeTypes')

class t {
	static nullLiteral() {
		return { type: nodeTypes.NullLiteral }
	}
	static stringLiteral(value) {
		// 字符串的值
		return { type: nodeTypes.StringLiteral, value }
	}
	static identifier(name) {
		return { type: nodeTypes.Identifier, name }
	}

	static objectExpression(properities) {
		return { type: nodeTypes.ObjectExpression, properities }
	}
	static property(key, value) {
		return {
			type: nodeTypes.Property,
			key,
			value,
		}
	}
	static callExpression(callee, _arguments) {
		return {
			type: nodeTypes.CallExpression,
			callee,
			_arguments,
		}
	}

	static memberExpression(object, property) {
		return {
			type: nodeTypes.MemberExpression,
			object,
			property,
		}
	}
	static isJSXElement(node) {
		return node.type === nodeTypes.JSXElement
	}

	static isJSXText(node) {
		return node.type === nodeTypes.JSXText
	}
}

function transformer(ast) {
	traverse(ast, {
		JSXElement(nodePath, parent) {
			function transform(node) {
				if (!node) return t.nullLiteral()

				if (t.isJSXElement(node)) {
					let memberExpression = t.memberExpression(
						t.identifier('React'),
						t.identifier('createElement')
					)

					// 获取标签
					let elementType = t.stringLiteral(node.openingElement.name.name)
					// 获取属性
					let attributes = node.openingElement.attributes
					let objectExpression
					if (attributes.length > 0) {
						objectExpression = t.objectExpression(
							attributes.map((attr) =>
								t.property(
									t.identifier(attr.name.name),
									t.stringLiteral(attr.value.value)
								)
							)
						)
                        console.log(objectExpression)
					} else {
						objectExpression = t.nullLiteral()
					}

					let _argsments = [
						elementType,
						objectExpression,
						...node.children.map((child) => transform(child)),
					]

					return t.callExpression(memberExpression, _argsments)
				} else if (t.isJSXText(node)) {
					return t.stringLiteral(node.value)
				}
			}

			let newNode = transform(nodePath.node)
			nodePath.replaceWidth(newNode)
		},
	})
}

module.exports = { transformer }