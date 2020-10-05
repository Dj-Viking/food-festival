const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  entry:{
    app: './assets/js/script.js',
    events: './assets/js/events.js',
    schedule: './assets/js/schedule.js',
    tickets: './assets/js/tickets.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js', //the name of each attribute in the entry object will be used in place of [name] in each bundle.js file that is created. so the budle file for script.js will be app.bundle.js and events: events.bundle.js and so on. with each using the key name for each key-value pair in the object for [name]
  },
  module: 
  {
    rules: 
    [//adding file loader to webpack
      {
        test: /\.jpg$/i,
        use: 
        [
          {
            loader: 'file-loader',//process images
            options: 
            {
              name: (file) => {//will return the actual name of the file an not a hexidecimal string
                return '[path][name].[ext]'
              },
              publicPath: (url) => {
                return url.replace('../', '/assets/')
              }
            }
          },
          {
            loader: 'image-webpack-loader'//reduce image sizes when using file-loader
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin
    (
      {
        $: "jquery",
        jQuery: 'jquery'
      }
    ),
    new BundleAnalyzerPlugin
    (
      {
        analyzerMode: "static", //report outputs to an HTML file in the dist folder
      }
    )
  ],
  mode: 'development'

};