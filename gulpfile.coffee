gulp = require 'gulp'
concat = require 'gulp-concat'
replace = require 'gulp-token-replace'
minifyCss = require 'gulp-minify-css'
less = require 'gulp-less'


gulp.task 'less', ()->
  gulp.src ['./less/*.less']
    .pipe less()
    .pipe concat 'min.css'
    .pipe gulp.dest './css'


gulp.task 'default', ['less'], ()->
  gulp.src ['./css/*.css']
  .pipe concat 'example.css'
  .pipe minifyCss compatibility: 'ie8'
  .on 'data', (data)->
    insertedCss = data.contents.toString()
    gulp.src [
        './bower_components/sip.js/dist/sip.js'
        './js/main.js'
      ]
      .pipe replace global: insertedCss: insertedCss
      .pipe concat 'owo.js'
      .pipe gulp.dest './dist/'


gulp.task 'watch', ['default'], ()->
  gulp.watch ['./js/*.js', './css/*.css'], ['default']