gulp = require 'gulp'
concat = require 'gulp-concat'
replace = require 'gulp-token-replace'
minifyCss = require 'gulp-minify-css'

gulp.task 'default', ()->
  gulp.src ['./css/*css']
  .pipe concat 'example.css'
  .pipe minifyCss compatibility: 'ie8'
  .on 'data', (data)->
    insertedCss = data.contents.toString()
    gulp.src ['./js/css.js', './js/engine.js']
    .pipe replace global: insertedCss: insertedCss
    .pipe concat 'callButton.js'
    .pipe gulp.dest './dist'


gulp.watch ['css/**','js/**'], (event)->  
    gulp.run('default')