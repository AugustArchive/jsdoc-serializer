const codegen = require('../src/codegen');
const generator = new codegen.Generator();

generator.on('start', (contents) => console.log('Compiling from text\n', contents));
generator.on('found', nodes => console.log(`Found ${nodes} match${nodes === 1 ? '' : 'es'} to compile from`));

const nodes = generator.compile(`
  /**
   * Hi!
   * @param {string} uwu Some uwu text
   * @returns {void} Returns \`void\`
   */
  function getter() {}

  /**
   * Hola!
   * @param {string} uwu Que? Me no habla ingles~
   * @return {Promise<void>} Returns \`Promise<void>\`
   */
  function someOtherGetter() {}
`);

console.log(nodes[0][3].children);
