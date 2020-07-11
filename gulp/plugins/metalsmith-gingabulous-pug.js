const pug = require('pug');
const path = require('path');
const debug = require('debug')('metalsmith-gingabulousLayouts');
const replaceExtension = require('replace-ext');
const markdown = require('jstransformer-markdown-it');

function markdownToPug(options) {
  // const transformedContent = markdown.render(content);
  const DEFAULTS = {
    layoutName: 'default',
    blockName:  'main'
  };
  const refs = Object.assign({}, DEFAULTS, options);
  return `
extends ${refs.layoutName}

block ${refs.blockName}
  .container
    .block!= transformedContent


`;
}

function gingabulousLayouts(options) {
  const parsedOptions = Object.assign({}, {
    /**
     * determines if files will be fully processed or not.
     * If `false` then they will.
     * @default inPlace
     * @type {Boolean}
     */
    inPlace: false
  }, options);

  return (files, metalsmith, done) => {
    setImmediate(done);
    // check for any locals passed to the pug options object and merge them.
    const data = Object.assign({}, parsedOptions.locals, metalsmith.metadata());
    // debug(data);
    // Loop through all files
    Object.keys(files).forEach((filename) => {
      // Get the file extension
      const ext = path.extname(filename);
      // Set conditonals
      const isMarkdown = ext === '.md';
      const isPug = ext === '.pug';
      const inPlace = parsedOptions.inPlace;
      let isPartial = false;
      debug(`current file: ${filename}`);
      debug(ext);
      // if it isnt a pug or markdown file, then ignore.
      if (isPug || isMarkdown) {
        let file = files[filename];
        let contents = file.contents.toString();

        // Check if the file is a markdown file
        // if so, convert it to valid pug
        if (isMarkdown) {
          debug(`${filename} is a markdown file`);
          const transformedContent = markdown.render(contents, { html: true });

          // Check for any options passed in file data
          const refs = {};
          if (file.extends) {
            refs.layoutName = file.extends;
          }
          if (file.block_name) {
            refs.blockName = file.block_name;
          }

          // If `inPlace` is true, then the file will remain as an HTML partial
          if (inPlace) {
            debug('HTML Partial Created')
            contents = transformedContent;
            isPartial = true;
          } else {
            file.transformedContent = transformedContent;
            // convert file contents from markdown to pug
            contents = markdownToPug(refs);
          }
        }

        if (!isPartial) {
          // parse file data and global data
          const locals = Object.assign({}, data, file);

          const pugOptions = Object.assign({}, parsedOptions, {
            filename: path.join(metalsmith.source(), filename),
            locals
          });
          // Compile pug to html
          const compiled = pug.compile(contents, pugOptions);

          contents = Buffer.from(compiled(locals));
        }

        // Assign the new contents of the file
        file.contents = contents;
        // Remove old file
        delete files[filename];
        // Create a new file
        files[replaceExtension(filename, '.html')] = file;
      } else {
        debug('stuff did not match');
        return; // eslint-disable-line no-useless-return
      }
      // return;
    });
  };
}

module.exports = gingabulousLayouts;
