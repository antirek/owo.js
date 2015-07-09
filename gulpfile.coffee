gulp = require 'gulp'
concat = require 'gulp-concat'
#replace = require 'gulp-token-replace'
#minifyCss = require 'gulp-minify-css'

gulp.task 'default', ()->
  gulp.src ['./bower_components/sip.js/dist/sip.js', './js/main.js']
  .pipe concat 'owo.js'
  .pipe gulp.dest './dist'


gulp.task 'watch', ->
  gulp.watch ['js/**'], (event)->
    gulp.run('default')