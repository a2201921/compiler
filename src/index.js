const { parser } = require('./parser')
const { transformer } = require('./transformer')
const { codeGenerator } = require('./generator')

let code = `<h1 id="title"><span>hello</span>world</h1>`
let ast = parser(code)
transformer(ast)
console.log(JSON.stringify(ast,null,2))

let result = codeGenerator(ast)
console.log(result)


