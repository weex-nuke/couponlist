var path = require('path'),
  globby = require('globby'),
  webpack = require('webpack'),
  RaxPlugin = require('rax-webpack-plugin'),
  LiveReloadPlugin = require('webpack-livereload-plugin');

var DEV = process.env.DEV;

var pluginList = ['add-module-exports',
  //   nuke需引用配置，与内置冲突，不可同时使用。
  // , ["transform-imports", {
  //   "nuke": {
  //     "transform": "nuke/lib/${member}/index.js",
  //     "preventFullImport": true
  //   }
  // }],
  ['transform-react-jsx', {
    pragma: 'createElement'  // default pragma is React.createElement
  }]
];

// if (DEV) {
//   pluginList.push('transform-react-jsx-source')
// } else {
//   pluginList.push('transform-react-constant-elements')
// }

var LIVELOAD = process.env.LIVELOAD;

function getEntry() {
  var entry = {};
  // 遍历所有页面入口文件
  // ./src/pages/xxx/index.js
  globby.sync(['*'], {
    cwd: path.join(srcPath, 'pages')
  }).forEach(function (page) {
    entry[page] = ['./pages/' + page + '/index'];
  });

  return entry;
}

var srcPath = path.resolve(__dirname, './src/'),
  buildPath = path.resolve(__dirname, process.env.BUILD_DEST || 'build');

var config = {
  context: srcPath,
  entry: getEntry(),
  output: {
    path: buildPath,
    filename: '[name].js',
    publicPath: '/build/'
  },
  resolve: {
    root: srcPath,
    extensions: ['', '.js', '.jsx'],
    alias: {
      "weex-rx": "rax",
      $components: path.join(__dirname, "src/components"),
      $page: path.join(__dirname, "src/pages"),
      $util: path.join(__dirname, "src/util")
    }
  },
  // 内置配置，参考文档 http://nuke.taobao.org/nukedocs/changelog/changes-of-buildin-vendor.html
  // "externals": [{
  //   "weex-rx": "commonjs rax",
  //   "rax": "commonjs rax",
  //   "nuke": "commonjs nuke",
  //   "QAP-SDK": "commonjs QAP-SDK",
  //   "genv": "commonjs genv",
  // }],
  module: {
    loaders: [{
      test: /\.js|jsx?$/,
      loader: 'babel',
      include: [
        srcPath,
        path.resolve(__dirname, 'node_modules/'),
      ],
      query: {
        presets: ['es2015','rax'],
        plugins: pluginList
      }
    }, {
      test: /(\.rxscss|\.scss)$/,  // deprecated
      loader: 'rx-css-loader!fast-sass'
    }, {
      test: /\.css$/,
      loader: 'stylesheet'
    }, {
      test: /\.less$/,
      loader: 'stylesheet!less'
    }
    ]
  },

  plugins: [
    new RaxPlugin({
      target: 'bundle',
      moduleName: 'rax',
      globalName: 'Rax',
      externalBuiltinModules: false,
    }),
    new webpack.NoErrorsPlugin(),
    //new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),

    //进度插件
    new webpack.ProgressPlugin((percentage, msg) => {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`📦   ${msg}`);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('\nwebpack: bundle build is now finished.');
      }
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(DEV ? 'development' : 'production'),
        '__DEV__': JSON.stringify(DEV ? JSON.parse('true') : JSON.parse('false'))
      }
    })
  ]
};

if (DEV && DEV != 0) {
  config.devtool = 'cheap-module-source-map';
  // config.plugins.push(new webpack.SourceMapDevToolPlugin({}));
  if (LIVELOAD && LIVELOAD != 0) {
    config.plugins.push(new LiveReloadPlugin())
  }
} else {
  config.plugins.push(
    //查找相等或近似的模块，避免在最终生成的文件中出现重复的模块。
    new webpack.optimize.DedupePlugin(),
    //Webpack gives IDs to identify your modules. With this plugin,
    // Webpack will analyze and prioritize often used modules assigning them the smallest ids.
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: { unused: true, dead_code: true, warnings: false },
      output: { comments: false, ascii_only: true }
    }),
    new webpack.BannerPlugin('// {"framework": "Rax"}', { raw: true })
  );
}

module.exports = config;
