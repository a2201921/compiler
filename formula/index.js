let parse = require('./parse')
let evaluate = require('./evaluate')
let sourceCode = '7-3-2'
let ast = parse(sourceCode)
// console.log(JSON.stringify(ast, null, 2))

let result = evaluate(ast)
console.log(result)
