module.exports = {
  toolkit: 'fie-toolkit-nuke',
  toolkitConfig: {
    webpack: {
      sourcemap: 'cheap-module-inline-source-map',                  // 调试sourcemap类型，默认为inline-cheap-module-source-map。
      uglify: true,                                                 // 是否对生产环境的代码进行压缩混淆，默认为true。
      hotreload: true,                                              // 是否进行热更新，默认为true
      'optimize-size': {
        nuke: true,                                               // 是否开启对nuke的按需引用，默认为fasle
        webpack: true,                                            // 是否按照使用webpack3进行tree shaking，代码需满足export import的es6规范  
      },
      alias: {
        $components: './src/components',
        $pages: './src/pages',
        $util: './src/util',
        $root: './src/',
        $data: './data/',
      },
      report: true,                                                 //是否开启构建信息上报，默认为true
    },
    open: true,                                                      //启动调试后自动打开调试辅助页面
    devType: 'dingtalk'
  },
};
