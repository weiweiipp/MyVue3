// 这个文件会帮我们打包packages下的模块，最终打包出js文件


// node dev.js 要打包的名字 -f 打包的格式

import minimist from 'minimist';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import esbuild from "esbuild";
// 解析命令行参数
const args = minimist(process.argv.slice(2))
//获取文件的绝对路径（文件路径）
const __filename = fileURLToPath(import.meta.url);
//当前文件的目录路径
const __dirname = dirname(__filename);
//基于路径创建require语法
const require = createRequire(import.meta.url)
const target = args._[0] || 'reactivity'; //打包哪个项目
const format = args.f || 'iife'; //打包后的模块化规范

// 入口文件  根据命令行提供的路径来进行解析
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = resolve(__dirname, `../packages/${target}/package.json`)
// 根据需要进行打包
esbuild.context({
    //入口
    entryPoints: [entry],
    //出口
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    // 所有的依赖文件打包成一个
    bundle: true,
    // 打包后给浏览器使用
    platform: "browser",
    // 可以调试源代码
    sourcemap: true,
    // 格式 cjs,esm,iife  var xxx = (function(){var xx return xxx})()
    format,
    globalName: pkg.buildOptions?.name,
}).then((ctx) => {
    console.log('start dev');

    return ctx.watch(); // 监控入口文件持续进行打包处理
})