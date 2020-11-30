# @augu/jsdoc
> :rose: **| Simple, powerful, and type-safe JSDoc Serializer**

## Notice
This library is for [docs.augu.dev](https://github.com/auguwu/docs), so this will serialize what it needs and not every type JSDoc has to support. So, if you want *full support*, you might wanna switch to a different library.

## Usage
```js
const { JSDocSerializer } = require('@augu/jsdoc');
const serializer = new JSDocSerializer();

// Serialize a simple string
const str = `
  /**
    * Some function
    * @param {string} value The value
    * @param {?string} nil A null value
    */
  function print(value, nil) {
    console.log("Hi!", value, nil !== null ? 'nil' : 'not null');
  }
`;

serializer.compile(str); //=> JSDoc.AST
serializer.compileToFile(str, './file.json'); // Promise<void>

// Serialize a relative path directory for it (supports recursion)
serializer.compileFromDirectory('~/path/to/some/files'); // Promise<JSDoc.FileAST>
serializer.compileFromFile('~/path/to/file.js'); // Promise<JSDoc.SingleFileAST>

// Convert the AST block to HTML or Markdown
serializer.astToMarkdown(astBlock);
serializer.astToHtml(astBlock);
```

## License
**@augu/jsdoc** is released under the [MIT](/LICENSE) License.
