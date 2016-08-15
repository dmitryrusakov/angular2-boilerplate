const srcBase = 'src',
      distBase = 'dist',
      toolsBase = 'tools';

const config = {
  env: {
    dev: false,
    stage: false,
    prod: false
  },
  firstStart: true,
  src: srcBase,
  dist: distBase,
  tools: toolsBase,
  tmp: `${distBase}/tmp`,
  node_modules: 'node_modules',

  npmDependencies: [
    'node_modules/core-js/client/shim.min.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/@angular/**/*', '!node_modules/@angular/**/*.ts',
    'node_modules/core-js/**/*', '!node_modules/core-js/**/*.ts',
    'node_modules/rxjs/**/*', '!node_modules/rxjs/**/*.ts',
    'node_modules/angular2-in-memory-web-api/**/*', '!node_modules/angular2-in-memory-web-api/**/*.ts'
  ],
  systemjsConfigPath: 'systemjs.config.js',

  server: {
    port: 9000
  }
};


const updateEnvironement = (env) => {
  Object.keys(config.env).forEach((e) => {
    config.env[e] = false;
  });
  config.env[env] = true;
  config.dist = `${distBase}/${env.toLowerCase()}`;
};


module.exports = () => {
  updateEnvironement('dev');
  return config;
};


module.exports.setProduction = () => {
  updateEnvironement('prod');
}


module.exports.setStaging = () => {
  updateEnvironement('stage');
}


module.exports.turnOffFirstStart = () => {
  config.firstStart = false;
}
