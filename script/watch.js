const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
// const rimraf = require("rimraf")

// const package = require(path.resolve(__dirname, '../package.json'))
const { output, ...input } = require(path.resolve(__dirname, '../rollup.config.js'))
const watch = { buildDelay: 1000 }

const watcher = rollup.watch({ ...input, output, watch })
// const rmDir = path.resolve(__dirname, '../dist')
// const rmdirOptions = { recursive: true }
// const rmErrorCallback = error => {
//     if (error) console.error(error)
// }

watcher.on('event', event => {
    // if (event.code === 'START') {
    //     rimraf(rmDir, rmdirOptions, rmErrorCallback)
    // }

    // if (event.code === 'END') {
    //     fs.copyFileSync(path.resolve(__dirname, '../README.md'), path.resolve(__dirname, '../dist/README.md'))
    //     fs.writeFileSync(
    //         path.resolve(__dirname, '../dist/package.json'),
    //         JSON.stringify({
    //             ...package,
    //             main: 'lib/router.js',
    //             types: 'lib/router.d.ts',
    //             scripts: {},
    //             'lint-staged': undefined,
    //             husky: undefined,
    //             devDependencies: {}
    //         }, null, 2)
    //     )
    // }

    if (event.result) event.result.close()
})