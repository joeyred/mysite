var ghPages = require('gh-pages');

ghPages.publish('dist', function(error) { if (error) console.log(error); });