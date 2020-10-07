const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackPwaManifest = require('webpack-pwa-manifest');
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
    ),
    new WebpackPwaManifest
    (
      {
        name: "Food Festival",
        short_name: "Foodies",
        description: "An app that allows you to view upcoming food events.",
        background_color: "#01579b",
        theme_color: "#ffffff",
        fingerprints: false, //these two false properties are not in the manifest.json. because they are specific to manifest plugin. fingerprints tell webpack whether or not it should generate unique fingerprints so that each time a new manifest is generated, it looks like this: manifest.lhge23d.json because we do not want this feature, its false.
        inject: false,// inject determines whether the link to the manifest.json file is added to the html. because we are not using fingerprints, we can also set inject to be false. we will hardcode the path to the manifest.json instead, just like we would in an application without webpack
        icons: [
          {
            src: path.resolve("assets/img/icons/icon-512x512.png"),
            sizes: [96, 128, 192, 384, 512],
            destination: path.join("assets", "icons")
          }
        ]
      }
    )
  ],
  mode: 'development'

};