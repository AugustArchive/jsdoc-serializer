const { Types, Node } = require('../src/codegen/ASTNode');

const isStarting = (value) => value instanceof Node && value.type === Types.Start;
const is = {};

const names = ['Start'];
for (let i = 0; i < names.length; i++) {
  const name = names[i];
  is[name.toLowerCase()] = value => value instanceof Node && value.type === Types[name];
}

const node = Node.from('Start');

console.log(is);
console.log(isStarting(node));
console.log(is.start(node));
