import browserSync from 'browser-sync';
import yargs from 'yargs';
import {SERVERS} from '../config';

// const DEPLOY = Boolean(yargs.argv.production);
const FULLTEST = Boolean(yargs.argv.fulltest);
const TEST = Boolean(yargs.argv.test);

//
// SERVERS
// ================= //

export const servers = {
  dev:  browserSync.create('dev'),
  test: browserSync.create('test')
};

// Development Server
export function serverDev(done) {
  if (!TEST) {
    servers.dev.init(SERVERS.dev);
  }
  done();
}

// Test Server
export function serverTest(done) {
  if (TEST || FULLTEST) {
    servers.test.init(SERVERS.test);
  }
  done();
}
export function startServers(done) {
  if (!TEST) {
    servers.dev.init(SERVERS.dev);
  }
  if (TEST || FULLTEST) {
    servers.test.init(SERVERS.test);
  }
  done();
}
export function reload(done) {
  if (FULLTEST) {
    servers.dev.reload();
    servers.test.reload();
  } else if (TEST) {
    servers.test.reload();
  } else {
    servers.dev.reload();
  }
  done();
}
