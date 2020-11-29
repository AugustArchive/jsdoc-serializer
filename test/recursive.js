const util = require('../src/util');

async function testRecursion() {
  const results = await util.readDirectory(require('path').join(process.cwd(), '..'));
  console.log(results);
}

testRecursion()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
