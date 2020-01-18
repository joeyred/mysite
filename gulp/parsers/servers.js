
const DEFAULTS = {
  port:   8000,
  notify: false,
  open:   false
};

export default function parse(paths, config) {
  const options = Object.assign({}, DEFAULTS, config);
  const {port, notify, open} = options;

  return {
    dev: {
      server: paths.build,
      port,
      ui:     {
        port: port + 1
      },
      notify,
      open
    },
    test: {
      server: {
        baseDir: paths.test,
        routes:  {
          '/jquery':      `${paths.bower}/jquery/dist`,
          '/mocha':       `${paths.node}/mocha`,
          '/chai':        `${paths.node}/chai`,
          '/chai-jquery': `${paths.node}/chai-jquery`,
          '/sinon-chai':  `${paths.node}/sinon-chai`,
          '/sinon':       `${paths.node}/sinon`,
          '/assets':      `${paths.build}/assets`
        }
      },
      port: port + 2,
      ui:   {
        port: port + 3
      },
      notify,
      open
    }
  };
}
