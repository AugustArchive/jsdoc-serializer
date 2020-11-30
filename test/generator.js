const compiler = require('../src');
const serializer = new compiler.JSDocSerializer();

const contents = `
  /**
   * @namespace ns
   * @copyright August &year;
   */
  var ns={};

  /**
   * Hi!
   * @alias ns.getter
   * @author August <https://augu.dev>
   * @param {string} uwu Some uwu text
   * @param {string} [owo='test'] uwu
   * @access public
   * @returns {void} Returns \`void\`
   */
  function getter() {}

  /**
   * Hola!
   * @abstract
   * @alias nothing
   * @access private
   * @async
   * @param {string} uwu Que? Me no habla ingles~
   * @return {Promise<void>} Returns \`Promise<void>\`
   */
  function someOtherGetter() {}
`;

serializer.compileToFile(contents, require('path').join(process.cwd(), 'some', 'other_blob.json'));
