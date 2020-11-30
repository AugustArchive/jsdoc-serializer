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

const codegen = require('./codegen');
const util = require('./util');

/**
 * Represents a [JsDocSerializer], which represents a serialization
 * tool to create AST blocks of code to return the JSDoc type using the
 * [codegen] internal module. It can also convert to Markdown and HTML,
 * custom converters soon.
 */
module.exports = class JsDocSerializer {
  /**
   * Compiles a string of code to a [AST]
   * @param {string} code The code to convert
   */
  compile(code) {
    const generator = new codegen.Generator();
    return generator.compile(code);
  }

  /**
   * Compiles a string to a file represented as JSON
   * @param {string} code The code to represent
   * @param {string} filepath The file path to use, it'll create a empty JSON blob if it doesn't exist
   * @returns {Promise<void>} Empty promise
   */
  compileToFile(code, filepath) {
    const generator = new codegen.Generator();
    return generator.compileToFile(code, filepath);
  }

  /**
   * Compiles any JavaScript or TypeScript file to an object of all the ASTs
   * @param {string} filepath The file path to convert from
   * @returns {Promise<import('./codegen').SingleFileAST>}
   */
  async compileFromFile(filepath) {
    // const contents = await util.fs.readFile(filepath, { encoding: 'utf8' });
    // const generator = new codegen.Generator();
    // const ast = await generator.compile(contents);
    // return { [filepath]: ast };

    throw new Error('JsDocSerializer.compileFromFile has not been implemented');
  }

  /**
   * Compiles multiple JavaScript or TypeScript files to an object of all ASTs
   * @param {string} filepath The path directory
   * @returns {Promise<import('./codegen').FileAST>}
   */
  async compileFromDirectory(filepath) {
    // const stats = await util.fs.lstat(filepath);
    // if (!stats.isDirectory()) throw new TypeError(`Path "${filepath}" was not a directory`);

    // const generator = new codegen.Generator();
    // return generator.compileFromDirectory(filepath);

    throw new Error('JsDocSerializer.compileFromDirectory has not been implemented');
  }

  /**
   * Converts an [AST] block to Markdown with Highlight.js included
   * @param {import('./codegen').AST} ast The AST block to convert to Markdown
   */
  astToMarkdown(ast) {
    // const converter = new converters.Markdown(ast);
    // return converter.convert();

    throw new Error('JsDocSerializer.astToMarkdown has not been implemented');
  }

  /**
   * Converts an [AST] block to HTML with Highlight.js included
   * @param {import('./codegen').AST} ast The AST block to convert to HTML
   */
  astToHtml(ast) {
    // const converter = new converters.HTML(ast);
    // return converter.convert();

    throw new Error('JsDocSerializer.astToHtml has not been implemented');
  }
};
