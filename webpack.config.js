let path = require('path'),
	webpack = require('webpack'),
	srcPath = '/src/js',
	distPath = '/dist/js'

module.exports = {
	mode: 'production',
	context: __dirname + srcPath,
	entry: {
		site: './site/index.js'
	},
	output: {
		filename: '[name].build.js',
		path: path.resolve(__dirname) + distPath
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		}]
	}
}
