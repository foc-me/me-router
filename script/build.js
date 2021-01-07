const path = require('path')
const rollup = require('rollup')

const { output, ...input } = require(path.resolve(__dirname, '../rollup.config.js'))

async function build() {
    // create a bundle
    const bundle = await rollup.rollup(input);
  
    console.log(bundle.imports); // an array of external dependencies
    console.log(bundle.exports); // an array of names exported by the entry point
    console.log(bundle.modules); // an array of module objects
  
    // generate code and a sourcemap
    // const { code, map } = await bundle.generate(outputOptions);
  
    // or write the bundle to disk
    await bundle.write(output);
  }
  
  build();