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
  const parsedOptions = Object.assign({}, options);

  return (files, metalsmith, done) => {
    setImmediate(done);

    const data = Object.assign({}, parsedOptions.locals, metalsmith.metadata());

    // Loop through all files
    Object.keys(files).forEach((filename) => {
      // get the file extension
      const ext = path.extname(filename);
      debug(`current file: ${filename}`);
      debug(ext);

      // if it isnt a pug or markdown file, then ignore.
      if (ext === '.pug' || ext === '.md') {
        let file = files[filename];
        let dir = path.dirname(filename);
        let contents = file.contents.toString();
        // NOTE might not need this
        let name = path.basename(filename, ext);
        // debug('got this far');
        // Does name and filename equal the same damn thing??
        debug(`filename: ${filename}\n name: ${name}`);

        if (path.extname(name) === '') {
          name = path.basename(filename, ext) + '.html'
        }

        if (dir !== '.') {
          name = `${dir}/${name}`
        }

        // Check if the file is a markdown file
        // if so, convert it to valid pug
        if (path.extname(filename) === '.md') {
          debug(`${filename} is a markdown file`);
          const transformedContent = markdown.render(contents);
          // Check for any options passed in file data
          const refs = {};
          if (file.extends) {
            refs.layoutName = file.extends;
          }
          if (file.block_name) {
            refs.blockName = file.block_name;
          }
          file.transformedContent = transformedContent;
          // convert file contents from markdown to pug
          contents = markdownToPug(refs);
        }


        const locals = Object.assign(data, file);

        const pugOptions = Object.assign(parsedOptions, {
          filename: path.join(metalsmith.source(), filename),
          locals
        })
        // Compile pug to html
        const compiled = pug.compile(contents, pugOptions);
        name = replaceExtension(filename, '.html');
        file.contents = Buffer.from(compiled(locals));

        delete files[filename];

        files[name] = file;
      } else {
        debug('stuff did not match');
        return;
      }
      // return;
    });
  }
}

module.exports = gingabulousLayouts;
