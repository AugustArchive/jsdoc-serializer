const { JSDOC_REGEX } = require('../src/util/Constants');

const contents = `
  /**
   * Simple thing for simple stuff?
   * @param {string} contents The contents
   * @param {?string} nil A null value
   * @param {boolean} [defaults=true] A default value
   */
  function simple(contents, nil = null, defaults = true) {
    /**
     * Inner function for the [simple] function
     */
    function inner() {
      console.log('inner');
    }

    console.log('outer');
    inner();
  }
`;

function serialize() {
  const matches = contents.match(JSDOC_REGEX);
  if (matches === null) return [];

  const all = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    all.push(match.trim());
  }

  return all;
}

console.log(serialize());
