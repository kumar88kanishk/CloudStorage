/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const log = require('fancy-log');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const git = require('gulp-git');
const jsdoc2md = require('jsdoc-to-markdown');
const mocha = require('gulp-spawn-mocha');

const files = [
  'index.js',
  'Gulpfile.js',
  'test/**.js',
  'lib/**.js',
];

const createDocs = (done) => {
  jsdoc2md.render({ files: 'index.js' })
    .then((output) => fs.writeFileSync('README.md', output))
    .catch((err) => log.error('docs creation failed:', err.message));
  return done();
};

const lint = () => gulp.src(files)
  .pipe(eslint({}))
  .pipe(eslint.format())
  .pipe(eslint.failOnError());

const add = () => gulp.src('README.md')
  .pipe(git.add({ quiet: true }));

const test = () => gulp.src(['test/*.spec.js'])
  .pipe(mocha({
    reporter: 'mochawesome',
    exit: true,
  }));

const docs = gulp.series(createDocs, add);

gulp.task('lint', lint);
gulp.task('docs', docs);
gulp.task('test', test);
