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

const { JSDOC_REGEX, ACCESSORS } = require('../util/Constants');
const { ASTNode: Node } = require('./ASTNode');
const { EventEmitter } = require('events');
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
        const node = this.getNodeFromText(fileAst, ast, item.trim());
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
   * @param {Node[][]} tree The AST tree
   * @param {string} text The text to create a node
   * @returns {Node} The node itself
   */
  getNodeFromText(ast, tree, text) {
    // Starting carriages for JSDoc
    if (text === '/**') return Node.from('Start');
    if (text === '*/') return Node.from('End');

    // Now we reach a list of items
    if (text.startsWith('*')) {
      if (text.indexOf('@') !== -1) {
        const starting = ast.find(node => is.start(node)) || null;
        const declare = this.getChildNode(text, starting, ast, tree);

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
   * @param {Node[]} ast The current AST tree
   * @param {Node[][]} tree The actual tree
   */
  getChildNode(text, parent, ast, tree) {
    const contents = text.split('@').pop();

    // If there is nothing in the `contents`, let's just return the started declaration
    // We shouldn't reach this state at all, but JavaScript is weird sometimes xD
    if (contents === undefined) return undefined;

    let node = undefined; // we'll add this to the `declared`'s children
    const types = contents.split(' ');
    const jsdocType = types.shift();

    switch (jsdocType) {
      case 'abstract':
      case 'virtual':
        node = Node.from('Abstract', parent);
        break;

      case 'access': {
        const statement = Node.from('Access', parent);
        const type = types.shift();

        util.assert(ACCESSORS.includes(type), `\`${type}\` was not a valid accessor (${ACCESSORS.join(', ')})`);
        statement.decorate('accessor', type);

        node = statement;
      } break;

      case 'alias': {
        const statement = Node.from('Alias', parent);
        const alias = types.shift();

        if (alias.indexOf('.') !== -1) {
          const [namespace, func] = alias.split('.');
          const nsParent = tree.filter(nodes =>
            nodes.find(node => is.namespace(node) && node.namespace === namespace) !== undefined
          )[0].find(node => is.namespace(node) && node.namespace === namespace);

          statement.decorate('name', func);
          if (nsParent !== null) statement.setParent(nsParent);
        } else {
          statement.decorate('name', alias);
        }

        node = statement;
      } break;

      case 'async':
        node = Node.from('Async', parent);
        break;

      case 'author': {
        const statement = Node.from('Author', parent);
        statement.decorate('author', types[0]);

        // Due to the nature, we can't do emails
        // source: https://jsdoc.app/tags-author.html
        const last = types[types.length - 1];
        if (last.startsWith('<') && last.endsWith('>')) {
          const url = last
            .replace(/</g, '')
            .replace(/>/g, '');

          statement.decorate('url', url);
        }

        node = statement;
      } break;

      case 'copyright': {
        const statement = Node.from('Copyright', parent);

        const author = types.shift();
        const year = types.shift().replace(/&year;/g, new Date().getFullYear());

        statement.decorate('author', author);
        statement.decorate('year', year);
        statement.decorate('stringify', () => `${author} ©️ ${year}`);

        node = statement;
      } break;

      case 'deprecated':
      case 'deprecate': {
        const statement = Node.from('Deprecated', parent);
        const message = types.join(' ') || 'None';

        if (message !== 'None') statement.decorate('reason', message);
        node = statement;
      } break;

      case 'fires': {
        const statement = Node.from('Fires', parent);
        const event = types.shift();

        util.assert(event !== undefined, '`event` can\'t be undefined in [FireDeclaration] node');
        statement.decorate('event', event);

        node = statement;
      } break;

      case 'license': {
        const statement = Node.from('License', parent);
        const license = types.shift();

        util.assert(license !== undefined, '`license` can\'t be undefined in [LicenseDeclaration] node');
        statement.decorate('license', license);

        node = statement;
      } break;

      case 'namespace': {
        const statement = Node.from('Namespace', parent);
        const ns = types.shift();

        util.assert(ns !== undefined, '`ns` can\'t be undefined in [NamespaceDeclaration] node');
        statement.decorate('namespace', ns);

        node = statement;
      } break;

      case 'param': {
        const statement = Node.from('Param', parent);
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
        if (name.startsWith('[') && name.endsWith(']')) {
          const items = name
            .replace(/\[/g, '')
            .replace(/]/g, '')
            .split('=');

          statement.decorate('name', items[0]);
          statement.decorate('default', items[1]);
        } else {
          statement.decorate('name', name);
        }

        const description = types.join(' ');
        statement.decorate('description', description.replace(/- /g, ''));

        node = statement;
      } break;

      case 'private':
        node = Node.from('Private', parent);
        break;

      case 'public':
        node = Node.from('Public', parent);
        break;

      case 'protected':
        node = Node.from('Protected', parent);
        break;

      case 'readonly':
        node = Node.from('Readonly', parent);
        break;

      case 'returns':
      case 'return': {
        const statement = Node.from('Return', parent);
        const type = types.shift();

        if (type.startsWith('{') && type.endsWith('}')) {
          const name = type
            .replace(/{/g, '')
            .replace(/}/g, '');

          if (name.indexOf('>') !== -1 && name.indexOf('>') !== -1) {
            const actualName = name.split('<').shift();
            const generic = name.split('<').pop().replace(/>/g, '');

            statement.decorate('typeof', {
              fullName: name,
              generic,
              mdnUrl: '',
              name: actualName
            });
          } else {
            statement.decorate('typeof', {
              mdnUrl: '',
              name
            });
          }
        }

        const description = types.join(' ') || 'None';
        statement.decorate('description', description);

        node = statement;
      } break;

      case 'since': {
        const statement = Node.from('Since', parent);
        statement.decorate('since', types.join(' ') || '0.0.0');

        node = statement;
      } break;

      case 'static':
        node = Node.from('Static', parent);
        break;

      case 'throws': {
        const statement = Node.from('Throws', parent);
        const errorType = types.shift() || 'Error';
        const description = types.join(' ') || 'None';

        statement.decorate('error', {
          mdnUrl: '',
          type: errorType
        });

        statement.decorate('description', description);
        node = statement;
      } break;

      case 'todo': {
        const statement = Node.from('Todo');
        statement.decorate('todo', types.join(' '));

        node = statement;
      } break;

      default: break;
    }

    if (parent !== null) parent.push(node);
    return node;
  }
};
