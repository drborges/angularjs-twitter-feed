var path = require('path')
  , fs = require('fs')
  , stylish = require('jshint-stylish')
  , server = require('tiny-lr')()
  , connectLivereload = require('connect-livereload')
  , express = require('express')
  , argv = require('yargs').argv

var gulp = require('gulp')
  , plumber = require('gulp-plumber')
  , watch = require('gulp-watch')
  , reload = require('gulp-livereload')
  , nodemon = require('gulp-nodemon')
  , shell = require('gulp-shell')
  , gutil = require('gulp-util')
  , ngAnnotate = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , jshint = require('gulp-jshint')
  , mochaPhantomJS = require('gulp-mocha-phantomjs')
  , angularTemplateCache = require('gulp-angular-templatecache')
  , concat = require('gulp-concat-sourcemap')
  , templateCache = require('gulp-angular-templatecache')

var files = {
  bundle: {
    app: 'public/js/dist/app.js',
    spec: 'public/js/dist/specs.js',
    path: 'public/js/dist',
    minified: 'public/js/dist/app.min.js',
  },
  src: {
    app: {
      moduleIndexes: 'public/js/modules/**/index.js',
      moduleComponents: 'public/js/modules/**/*.js',
      public: 'public/**/*',
      templates: 'public/js/modules/**/templates/**/*.html',
    },
    spec: 'spec/unit/**/*.js',
    specRunner: 'spec/spec.runner.html',
  },
}

gulp.task('dist', [ 'min' ])
gulp.task('concat', [ 'clean', 'concat.app', 'concat.spec', 'concat.templates' ])
gulp.task('default', ['server'])

gulp.task('server', function () {
  nodemon({ script: 'app.js', ext: 'js', ignore: [] })
})

gulp.task('livereload', ['server'], function() {
  server.listen(35729)
  gulp.watch(files.src.app.public, function (file) {
    gulp.start('concat.app')
    gulp.src(file.path).pipe(reload(server))
  })
})

gulp.task('spec', ['concat'], function () {
  return gulp
    .src(files.src.specRunner)
    .pipe(plumber())
    .pipe(mochaPhantomJS({ mocha: { grep: argv.tag }}))
    .pipe(plumber())
})

gulp.task('tdd', ['spec'], function () {
  return gulp.watch([files.src.app.public, files.src.spec], function (file) {
    gulp.start('spec')
  })
})

gulp.task('lint', function () {
  var srcFiles = [
    files.src.app.moduleIndexes,
    files.src.app.moduleComponents
  ]

  return gulp
    .src(srcFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
})

gulp.task('concat.app', function() {
  return gulp
    .src([files.src.app.moduleIndexes, files.src.app.moduleComponents])
    .pipe(concat(path.basename(files.bundle.app), { sourceRoot: '../', prefix: 2 }))
    .pipe(gulp.dest(path.dirname(files.bundle.app)))
});

gulp.task('concat.spec', function() {
  return gulp
    .src(files.src.spec)
    .pipe(concat(path.basename(files.bundle.spec), { sourceRoot: '../../../spec/unit/', prefix: 2 }))
    .pipe(gulp.dest(path.dirname(files.bundle.spec)))
});

gulp.task('concat.templates', function () {
  var options = {
    standalone: true,
    module: 'twTwitter.templates',
    root: '/static/js/modules/'
  }

  return gulp.src(files.src.app.templates)
    .pipe(templateCache(options))
    .pipe(gulp.dest(files.bundle.path))
});

gulp.task('ng.annotate', ['concat.app'], function () {
  return gulp
    .src(files.bundle.app)
    .pipe(ngAnnotate())
    .pipe(gulp.dest(path.dirname(files.bundle.app)))
})

gulp.task('min', ['ng.annotate'], function () {
  return gulp
    .src(files.bundle.app)
    .pipe(uglify())
    .pipe(rename(path.basename(files.bundle.minified)))
    .pipe(gulp.dest(path.dirname(files.bundle.minified)))
})

gulp.task('clean', function () {
  return gulp
    .src(path.dirname(files.bundle.app))
    .pipe(shell('rm -rf <%=file.path%>'))
})
