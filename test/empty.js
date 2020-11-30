const codegen = require('../src/codegen');
const generator = new codegen.Generator();

generator.on('start', (contents) => console.log('Compiling from text\n', contents));
generator.on('found', nodes => console.log(`Found ${nodes} match${nodes === 1 ? '' : 'es'} to compile from`));

const nodes = generator.compile(`
  /**
   * Hi!
   * @param {string} uwu Some uwu text
   */
  function getter() {}
`);

console.log(nodes.map(s => s.toString()).join('\n'));
