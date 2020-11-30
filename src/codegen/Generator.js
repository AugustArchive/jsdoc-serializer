/**
 * Copyright (c) 2020 August
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { EventEmitter } = require('events');
const { JSDOC_REGEX } = require('../util/Constants');
const { Node } = require('./ASTNode');
const util = require('../util');
const is = require('./is');

/**
 * Represents a [Generator] class, which generates all AST nodes
 * of a string of content available in the given context
 */
module.exports = class Generator extends EventEmitter {

  // Public API
  /**
   * Compiles a string to an AST string
   * @param {string} contents The contents to compile
   * @returns {Node[][]}
   */
  compile(contents) {
    util.assert(typeof contents === 'string', '`contents` was not a string');

    this.emit('start', contents);

    const matches = contents.match(JSDOC_REGEX);
    if (matches === null) return [];

    this.emit('found', matches.length);

    const ast = [];
    for (let i = 0; i < matches.length; i++) {
      const blocks = matches[i].split('\n');
      const fileAst = [];

      blocks.forEach((item) => {
        const node = this.getNodeFromText(ast, item.trim());
        fileAst.push(node);
      });

      ast.push(fileAst);
    }

    return ast;
  }

  // Private API
  /**
   * Gets the node of the given text
   * @param {Node[]} ast The current AST structure
   * @param {string} text The text to create a node
   * @returns {Node} The node itself
   */
  getNodeFromText(ast, text) {
    // Starting carriages for JSDoc
    if (text === '/**') return Node.from('Start');
    if (text === '*/') return Node.from('End');

    // Now we reach a list of items
    if (text.startsWith('*')) {
      if (text.indexOf('@') !== -1) {
        const starting = ast.find(is.start) || null;
        const declare = this.getChildNode(text, starting);

        if (starting !== null) starting.push(declare);
        return declare;
      }

      if (text === '') return Node.from('Whitespace');

      const starting = ast.find(is.start) || null;
      const node = Node.from('Description', starting);
      node.decorate('description', text.replace(/\* /g, ''));

      if (starting !== null) starting.push(node);
      return node;
    }
  }

  /**
   * Gets a child node with the given text
   * @param {string} text The text
   * @param {?Node} parent The parent
   */
  getChildNode(text, parent) {
    // Returns the parent node (which is a sibling node to "StartDeclaration")
    const declared = Node.from('Declare', parent);
    const contents = text.split('@').pop();

    // If there is nothing in the `contents`, let's just return the started declaration
    // We shouldn't reach this state at all, but JavaScript is weird sometimes xD
    if (contents === undefined) return declared;

    let node = undefined; // we'll add this to the `declared`'s children
    const types = contents.split(' ');
    const jsdocType = types.shift();

    switch (jsdocType) {
      case 'param': {
        const statement = Node.from('Param', declared);
        if (types[0].startsWith('{') && types[0].endsWith('}')) {
          const rawName = types.shift();
          const name = rawName
            .replace(/{/g, '')
            .replace(/}/g, '');

          statement.decorate('typeof', {
            nullable: name.startsWith('?'),
            mdnUrl: '',
            name
          });
        }

        const name = types.shift();
        const description = types.join(' ');

        statement.decorate('name', name);
        statement.decorate('description', description.replace(/- /g, ''));

        node = statement;
      } break;

      default: break;
    }

    declared.push(node);
    return declared;
  }
};
