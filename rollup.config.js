import typescript from 'rollup-plugin-typescript2';

module.exports = {
    // 核心参数
    input: './src/index.ts', // 唯一必填参数
    // external,
    // plugins,

    // 高级参数
    // onwarn,
    // cache,

    // 危险参数
    // acorn,
    // context,
    // moduleContext,
    // legacy
    output: {
        // 核心参数
        file: './dist/router.js',   // 若有bundle.write，必填
        format: 'cjs', // 必填
        // name,
        // globals,
      
        // 高级参数
        // paths,
        // banner,
        // footer,
        // intro,
        // outro,
        // sourcemap,
        // sourcemapFile,
        // interop,
      
        // 危险区域
        // exports,
        // amd,
        // indent
        // strict
    },
    plugins: [
        typescript({})
    ]
}