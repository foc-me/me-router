const fs = require('fs')
const path = require('path')
const rollup = require('rollup')

const package = require(path.resolve(__dirname, '../package.json'))
const { output, ...input } = require(path.resolve(__dirname, '../rollup.config.js'))

async function build() {
    const bundle = await rollup.rollup(input);

    await bundle.write(output);

    fs.copyFileSync(path.resolve(__dirname, '../README.md'), path.resolve(__dirname, '../dist/README.md'))

    fs.writeFileSync(
      path.resolve(__dirname, '../dist/package.json'),
      JSON.stringify({
        ...package,
        main: 'lib/router.js',
        types: 'lib/router.d.ts',
        scripts: {},
        'lint-staged': undefined,
        husky: undefined,
        devDependencies: {}
      }, null, 2)
    )
}

build();