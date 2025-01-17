
## 把当前工作目录下的shard 安装给reactivity
```pnpm install @vue/shard --workspace --filter @vue/reactivity```

## package.json中的脚本配置
```"dev": "node scripts/dev.js reactivity -f esm"```
- -f指打包格式化的种类，分三种 cjs,esm,iife, 不传默认是iife

## scripts下的dev.js主要逻辑
- 解析命令行参数，拿到目录，文件信息
- 指定打包入口出口，打包成一个包，指定打包格式
