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

const { join } = require('path');
const fs = require('fs');

const promisify = (caller) =>
  (...args) => new Promise((resolve, reject) =>
    caller(...args, (error, data) => error ? reject(error) : resolve(data))
  );

/**
 * Extra utilities throughout the library
 */
const util = {

  /**
   * Returns a promisifed version of [fs], if under Node.js v10
   * @type {typeof import('fs/promises')}
   */
  fs: (() => {
    try {
      return require('fs/promises');
    } catch(ex) {
      return {
        writeFile: promisify(fs.writeFile),
        readdir: promisify(fs.readdir),
        lstat: promisify(fs.lstat)
      };
    }
  })(),

  /**
   * Recursively read a directory
   * @param {string} path The path
   * @returns {Promise<string[]>} Returns an array of file paths
   */
  async readDirectory(path) {
    let results = [];
    const files = await util.fs.readdir(path);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stats = await util.fs.lstat(join(path, file));

      if (stats.isDirectory()) {
        const other = await util.readDirectory(join(path, file));
        results = results.concat(other);
      } else {
        results.push(join(path, file));
      }
    }

    return results;
  },

  /**
   * Asserts a boolean and throws an error if it returns false
   * @param {boolean} assertion The assertion
   * @param {string} message The message to throw
   */
  assert(assertion, message) {
    if (!assertion) throw new Error(message);
  }
};

module.exports = util;
