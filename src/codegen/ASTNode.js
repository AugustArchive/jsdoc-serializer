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

/**
 * List of node types available
 */
const Types = {
  Abstract: 'AbstractDeclaration',
  Access: 'AccessDeclaration',
  Alias: 'AliasDeclaration',
  Async: 'AsyncDeclaration',
  Augument: 'AugumentDeclaration',
  Author: 'AuthorDeclaration',
  Borrows: 'BorrowsDeclaration',
  Callback: 'CallbackDeclaration',
  Class: 'ClassDeclaration',
  ClassDescription: 'ClassDescriptionDeclaration',
  Constant: 'ConstantDeclaration',
  Constructs: 'ConstructDeclaration',
  Copyright: 'CopyrightDeclaration',
  Deprecated: 'DeprecatedDeclaration',
  Description: 'DescriptionDeclaration',
  Declare: 'DeclareStatement',
  Enum: 'EnumDeclaration',
  End: 'EndDeclaration',
  Event: 'EventDeclaration',
  Example: 'ExampleDeclaration',
  Exports: 'ExportsDeclaration',
  External: 'ExternalDeclaration',
  File: 'FileDeclaration',
  Fires: 'FireDeclaration',
  Function: 'FunctionDeclaration',
  Generator: 'GeneratorDeclaration',
  Global: 'GlobalDeclaration',
  HideConstructor: 'HideConstructorDeclaration',
  Ignore: 'IgnoreDeclaration',
  Implements: 'ImplementsDeclaration',
  InheritDoc: 'InheritDocDeclaration',
  Inner: 'InnerDeclaration',
  Instance: 'InstanceDeclaration',
  Interface: 'InterfaceDeclaration',
  Kind: 'KindDeclaration',
  Lends: 'LendsDeclaration',
  License: 'LicenseDeclaration',
  Listens: 'ListenDeclaration',
  Member: 'MemberDeclaration',
  MemberOf: 'MemberOfDeclaration',
  Mixes: 'MixesDeclaration',
  Mixin: 'MixinDeclaration',
  Module: 'ModuleDeclaration',
  Name: 'NameDeclaration',
  Namespace: 'NamespaceDeclaration',
  Override: 'OverrideDeclaration',
  Package: 'PackageDeclaration',
  Param: 'ParameterDeclaration',
  Private: 'PrivateDeclaration',
  Property: 'PropertyDeclaration',
  Protected: 'ProtectedDeclaration',
  Public: 'PublicDeclaration',
  Readonly: 'ReadonlyDeclaration',
  Requires: 'RequiresDeclaration',
  Return: 'ReturnDeclaration',
  See: 'SeeDeclaration',
  Since: 'SinceDeclaration',
  Static: 'StaticDeclaration',
  Summary: 'SummaryDeclaration',
  Start: 'StartDeclaration',
  This: 'ThisDeclaration',
  Throws: 'ThrowsDeclaration',
  Todo: 'TodoDeclaration',
  Tutorial: 'TutorialDeclaration',
  Typedef: 'TypeDefDeclaration',
  Whitespace: 'WhitespaceDeclaration',
  Yields: 'YieldDeclaration'
};

class Node {
  /**
   * Statically create a [Node]
   * @param {keyof Types} type The types to create a new AST node
   * @param {?Node} [parent=null] The parent of this AST node
   */
  static from(type, parent) {
    return new Node(type, parent);
  }

  /**
   * Creates a new [Node] instance
   * @param {keyof Types} type The type to create from
   */
  constructor(type, parent = null) {
    /**
     * Children of this [Node]
     * @type {Node[]}
     */
    this.children = [];

    /**
     * The parent to this [Node], if any
     * @type {?Node}
     */
    this.parent = parent;

    /**
     * List of blocks available for this [Node]
     * @type {Types[keyof Types]}
     */
    this.type = Types[type];
  }

  /**
   * Getter to signify if this [Node] is a sibling of a tree
   */
  get sibling() {
    return this.parent !== null;
  }

  /**
   * Creates and pushes a new block to this [Node]
   * @param {Node} node The node
   */
  push(node) {
    this.children.push(node);
    return this;
  }

  /**
   * Sets the parent of this [Node]
   * @param {Node} parent The parent
   */
  setParent(parent) {
    this.parent = parent;
    return this;
  }

  /**
   * Decorates a node with a given value
   * @param {string} name The name of the property
   * @param {any} value The value to set
   */
  decorate(name, value) {
    this[name] = value;
    return this;
  }

  toString() {
    const childType = this.children.length === 1 ? 'child' : 'children';

    return `[Node<${this.type}> (${this.children.length} ${childType})]`;
  }
}

module.exports = { Types, Node };
