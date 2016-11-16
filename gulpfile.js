'use strict';

const gulp = require('gulp'),
      configModule = require('./tools/gulp.config.js'),
      config = configModule(),
      runSequence = require('run-sequence'),
      gulpUtil = require('gulp-util'),
      del = require('del'),
      notify = require("gulp-notify"),
      browserSync = require('browser-sync').create(),
      fs = require('fs'),
      url = require('url'),
      template = require('gulp-template'),

      tslint = require('gulp-tslint'),
      typescript = require('gulp-typescript'),
      tscConfig = require('./tsconfig.json'),
      uglify = require('gulp-uglify'),
      pump = require('pump'),

      sourcemaps = require('gulp-sourcemaps'),
      uncache = require('gulp-uncache'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css');


/* Clean the contents of the distribution directory */
gulp.task('clean', () => {
  let paths = !config.firstStart ? [
    `${config.dist}/**/*`,
    `!${config.dist}/node_modules`, `!${config.dist}/node_modules/**/*`,
    `!${config.dist}/${config.systemjsConfigPath}`
  ] : [`${config.dist}/**/*`];
  return del([...paths])
});


/* SCSS to CSS */
gulp.task('scss', () =>
  gulp.src(`${config.src}/scss/**/*.scss`)
    .pipe(config.env.prod ? gulpUtil.noop() : sourcemaps.init())
    .pipe(sass({style: 'compressed'}).on('error', sass.logError))
    .pipe(config.env.prod ? cleanCSS() : gulpUtil.noop())
    .pipe(config.env.prod ? autoprefixer() : gulpUtil.noop())
    .pipe(config.env.prod ? gulpUtil.noop() : sourcemaps.write('.'))
    .pipe(gulp.dest(`${config.dist}/css`)));


/* Copy NPM dependencies */
gulp.task('copy:ng2-dependencies', function() {
  return gulp.src([...config.npmDependencies], {base: config.node_modules})
    .pipe(gulp.dest(`${config.dist}/${config.node_modules}`));});


/* Copy SystemJS config */
gulp.task('copy:systemjsConfig', function() {
  return gulp.src(`${config.tools}/${config.systemjsConfigPath}`)
    .pipe(gulp.dest(`${config.dist}`));});


/* Copy all Angular 2 Dependencies and Settings to dist */
gulp.task('copy:ng2', () => {
  if(config.firstStart) {
    gulp.run(['copy:systemjsConfig', 'copy:ng2-dependencies']);
    configModule.turnOffFirstStart();
  }
});


/* Copy static assets - i.e. non TypeScript compiled source */
gulp.task('copy:assets', () => {
  return gulp.src([
      'src/**/*',
      '!src/scss',
      '!src/scss/*.*',
      '!/src/**/*.ts',
      `!${config.src}/index.html`
    ])
    .pipe(gulp.dest(`${config.dist}`))});



/* Copy static assets - i.e. non TypeScript compiled source */
gulp.task('uncache:index', () => {
  return gulp.src([`${config.src}/index.html`])
    .pipe(uncache({
      append: 'hash',
      srcDir: './dist/dev'
    }))
    .pipe(gulp.dest(`${config.dist}`))});


/* TypeScript lint */
gulp.task('tslint', () =>
  gulp.src('src/app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose')));


/* TypeScript compile + sourcemaps */
gulp.task('typescript', () => 
  gulp.src(`${config.src}/app/**/*.ts`)
    .pipe(config.env.prod ? gulpUtil.noop() : sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(config.env.prod ? gulpUtil.noop() : sourcemaps.write('.'))
    .pipe(gulp.dest(config.env.prod ? `${config.tmp}/app` : `${config.dist}/app`)));


/* Uglify */
gulp.task('uglify', () => {
  if(!config.env.prod) {
    return gulp.src('').pipe(gulpUtil.noop());
  }
  return pump([
    gulp.src(`${config.tmp}/app/**/*.js`),
    uglify(),
    gulp.dest(`${config.dist}/app`)
  ]);
});


/* Template */
gulp.task('template', () =>
  gulp.src(`${config.dist}/app/**/*.js`)
    .pipe(template(config.endpoints[config.envStr]))
    .pipe(gulp.dest(`${config.dist}/app`)));


/* Update config environement */
gulp.task('setStaging', () => configModule.setStaging());
gulp.task('setProduction', () => configModule.setProduction());


/* Notify */
gulp.task('notify', () => {gulp.src('').pipe(notify('Project compiled'));});


/* Serve using default system browser */
gulp.task('serve', [], function(cb){
  browserSync.init({
    open: true,
    browser: 'google chrome',
    port: config.server.port,
    server: {
      baseDir: config.dist,
      middleware: function(req, res, next) {
        let fileExists, fileName = url.parse(req.url);
        fileName = fileName.href.split(fileName.search).join("");
        fileExists = fs.existsSync(config.dist + fileName);
        if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
          req.url = `/${config.mainFile}`;
        }
        return next();
      }
    }
  });
});


/* Reload server after watched */
gulp.task('reload', function() {browserSync.reload();});


/* Compile src to dist depends on env */
gulp.task('compile', (callback) => {
  return runSequence(
    /*'tslint',*/
    'clean',
    'typescript',
    'uglify',
    'template',
    'scss',
    ['copy:assets', 'copy:ng2'],
    'uncache:index',
    'notify',
    'reload',
    callback);
});


/* Watch changes and serve */
gulp.task('watch', () => {

  gulp.run('compile', () => {
    gulp.run('serve');
  });

  gulp.watch(`${config.src}/**/*`, function() {
    gulp.run('compile');
  });

});


gulp.task('dev', ['compile']);
gulp.task('dev.watch', ['watch']);
/*gulp.task('stage', ['setStaging', 'compile']);*/
/*gulp.task('stage.watch', ['setStaging', 'watch']);*/
gulp.task('prod', ['setProduction', 'compile']);
gulp.task('prod.watch', ['setProduction', 'compile']);

gulp.task('default', ['dev.watch']);
