let tokenize = require('./tokenize')
let toAST = require('./toAST')

function parse(script){
    let tokenReader = tokenize(script)
    console.log(tokenReader)
    let ast = toAST(tokenReader)
    return ast
}

module.exports = parse