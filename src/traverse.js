const { parser } = require('./parser')
const nodeTypes = require('./nodeTypes')

function reaplce(parent, oldNode, newNode) {
	if (parent) {
		for (const key in parent) {
			if (parent.hasOwnProperty(key)) {
				if (parent[key] === oldNode) {
					parent[key] = newNode
				}
			}
		}
	}
}

function traverse(ast, visitor) {
	function traverseArray(array, parent) {
		array.forEach((child) => traverseNode(child, parent))
	}

	function traverseNode(node, parent) {
		let replaceWidth = reaplce.bind(null, parent, node)
		let method = visitor[node.type]
		// 开始遍历节点的时候
		if (method) {
			if (typeof method === 'function') {
				method({ node, replaceWidth }, parent)
			} else {
				method.enter({ node, replaceWidth }, parent)
			}
		}

		switch (node.type) {
			case nodeTypes.Program:
				traverseArray(node.body, node)
				break
			case nodeTypes.ExpressionStatement:
				traverseNode(node.expression, node)
				break
			case nodeTypes.JSXElement:
				traverseNode(node.openingElement, node)
				traverseArray(node.children, node)
				traverseNode(node.closingElement, node)
				break
			case nodeTypes.JSXOpeningElement:
				traverseNode(node.name, node)
				traverseArray(node.attributes, node)
				break
			case nodeTypes.JSXAttribute:
				traverseNode(node.name, node)
				traverseNode(node.value, node)
				break
			case nodeTypes.JSXClosingElement:
				traverseNode(node.name, node)
				break
			case nodeTypes.JSXIdentifier:
			case nodeTypes.JSXText:
			case nodeTypes.Literal:
				break
			default:
				break
		}
		// 遍历完节点
		if (method && method.exit) {
			method.exit({ node, replaceWidth }, parent)
		}
	}
	traverseNode(ast, null)
}

module.exports = {
	traverse,
}

// let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`
// let ast = parser(sourceCode)
// traverse(ast, {
// 	JSXOpeningElement: {
// 		enter: (nodePath, parent) => {
// 			console.log(`进入开始元素`, nodePath.node)
// 		},
// 		exit: (nodePath, parent) => {
// 			console.log(`离开开始元素`, nodePath.node)
// 		},
// 	},
// })

/*  */
