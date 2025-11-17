/**
 * Webpack Configuration for Production Build
 * 
 * Implements security best practices:
 * 1. Code Minification (Terser)
 * 2. Code Obfuscation (JavaScript Obfuscator)
 * 3. Code Splitting
 * 4. Tree Shaking
 */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      // Core modules
      app: './js/core/init.js',
      auth: './js/auth/authentication.js',
      security: './js/auth/security.js',
      advancedSecurity: './js/auth/advanced-security.js',
      
      // Feature modules (code splitting)
      dashboard: './js/modules/dashboard.js',
      treino: './js/modules/treino.js',
      nutricao: './js/modules/nutricao.js',
      admin: './js/modules/admin.js',
    },
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'js/[name].[contenthash].min.js' : 'js/[name].js',
      chunkFilename: isProduction ? 'js/[name].[contenthash].chunk.js' : 'js/[name].chunk.js',
      clean: true,
    },
    
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction, // Remove console.log em produção
              drop_debugger: isProduction,
              pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
            },
            mangle: {
              // Proteger nomes de funções críticas de serem mangled
              reserved: ['openDB', 'dbPut', 'dbGet', 'dbGetAll', 'dbDelete'],
            },
            format: {
              comments: false, // Remove todos os comentários
            },
          },
          extractComments: false,
        }),
      ],
      
      // Code splitting - separa dependências compartilhadas
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunks (bibliotecas externas)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          // Código comum compartilhado
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
          // Módulos de segurança (alta prioridade)
          security: {
            test: /[\\/]js[\\/]auth[\\/]/,
            name: 'security',
            priority: 20,
          },
        },
      },
      
      // Runtime chunk para melhor cache
      runtimeChunk: 'single',
    },
    
    module: {
      rules: [
        // No babel-loader needed since code is already ES5 compatible
        // Uncomment if you need to transpile modern JS
        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: [
        //         ['@babel/preset-env', {
        //           targets: {
        //             browsers: ['last 2 versions', 'not dead', '> 0.5%']
        //           },
        //           modules: false,
        //         }]
        //       ],
        //     },
        //   },
        // },
      ],
    },
    
    plugins: [
      // HTML plugin para injetar scripts automaticamente
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body',
        minify: isProduction ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        } : false,
      }),
      
      // Copiar arquivos estáticos
      new CopyWebpackPlugin({
        patterns: [
          { from: 'css', to: 'css' },
          { from: 'firebase-config.js', to: 'firebase-config.js' },
          { from: 'firebase.json', to: 'firebase.json' },
          // Adicione outros arquivos estáticos conforme necessário
        ],
      }),
      
      // Obfuscação apenas em produção e apenas para módulos críticos de segurança
      ...(isProduction ? [
        new WebpackObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
          
          // Configurações balanceadas: segurança vs performance
          compact: true,
          controlFlowFlattening: false, // Desabilitado por performance
          deadCodeInjection: false, // Desabilitado por performance
          debugProtection: false,
          debugProtectionInterval: 0,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: false,
          renameGlobals: false,
          selfDefending: true, // Protege contra formatação/debug
          simplify: true,
          splitStrings: false,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 1,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 2,
          stringArrayWrappersType: 'variable',
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
        }, [
          // Aplicar obfuscação forte apenas a módulos de segurança
          'security.js',
          'authentication.js',
          'advanced-security.js',
        ])
      ] : []),
    ],
    
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'js'),
        '@auth': path.resolve(__dirname, 'js/auth'),
        '@core': path.resolve(__dirname, 'js/core'),
        '@modules': path.resolve(__dirname, 'js/modules'),
        '@utils': path.resolve(__dirname, 'js/utils'),
      },
    },
    
    devtool: isProduction ? false : 'source-map',
    
    // Configurações de performance
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000, // 500kb
      maxAssetSize: 512000,
    },
    
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    },
  };
};
