const Constants = require('../src/util/Constants');
const util = require('../src/util');
const { join } = require('path');

async function createAstBlock(path) {
  const blocks = [];
  const createBlock = (type, contents) => {
    const node = { type };
    if (contents !== undefined) node.contents = contents;

    blocks.push(node);
    return node;
  };

  const files = await util.readDirectory(path);
  for (let i = 0; i < files.length; i++) {
    const contents = await util.fs.readFile(files[i], { encoding: 'utf8' });
    const matches = contents.match(Constants.JSDOC_REGEX);

    if (matches === null) continue;

    createNodes({
      onCreate: createBlock,
      blocks: matches
    });
  }

  return blocks;
}

function createNodes({ onCreate, blocks }) {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const items = block.split('\n');

    items.forEach(item => {
      const { contents, type } = getStatementTypeOfNodeContent(item.trim());
      onCreate(type, contents);
    });
  }
}

function getStatementTypeOfNodeContent(item) {
  if (item === '/**') return {
    type: 'StartOfDoc'
  };

  if (item === '*/') return {
    type: 'EndOfDoc'
  };

  if (item.startsWith('*')) {
    if (item.indexOf('@') !== -1) {
      const [, i] = item.split('@');
      const types = i.split(' ');
      let contents;
      const t = types.shift();

      switch (t) {
        case 'param': {
          const statement = {
            type: 'ParameterDeclaration'
          };

          if (types[0].startsWith('{') && types[0].endsWith('}')) {
            const rawName = types.shift();
            const name = rawName
              .replace(/{/g, '')
              .replace(/}/g, '');

            statement.typeof = {
              nullable: name.startsWith('?'),
              mdnUrl: '',
              name: name.replace(/\?/g, '')
            };
          }

          const name = types.shift();
          const description = types.join(' ');

          statement.name = name;
          statement.description = description.replace(/- /g, '');

          contents = statement;
        } break;

        case 'returns':
        case 'return': {
          const statement = {
            type: 'ReturnDeclaration'
          };

          if (types[0].startsWith('{') && types[0].endsWith('}')) {
            const rawName = types.shift();
            const name = rawName
              .replace(/{/g, '')
              .replace(/}/g, '');

            if (name.indexOf('>') !== -1 && name.indexOf('>') !== -1) {
              const type = name.split('<').shift();
              statement.typeof = {
                mdnUrl: '',
                full: name,
                name: type
              };

              contents = statement;
              break;
            }
          }

          contents = statement;
        } break;
      }

      return {
        contents,
        type: 'DeclareStatement'
      };
    } else {
      return {
        contents: item.replace(/\*/g, '').trim(),
        type: 'DescriptionStatement'
      };
    }
  }
}

createAstBlock(join(process.cwd(), 'some'))
  .then((blocks) => {
    console.log(require('util').inspect(blocks, { depth: null }));
    process.exit(0);
  }).catch(error => {
    console.error(error);
    process.exit(1);
  });
