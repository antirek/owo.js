gulp = require 'gulp'
concat = require 'gulp-concat'
replace = require 'gulp-token-replace'
minifyCss = require 'gulp-minify-css'

gulp.task 'default', ()->
  gulp.src ['./css/*.css']
  .pipe concat 'example.css'
  .pipe minifyCss compatibility: 'ie8'
  .on 'data', (data)->
    insertedCss = data.contents.toString()
    gulp.src [
        './bower_components/sip.js/dist/sip.js' 
        './js/css.js'        
        './js/main.js'
      ]
      .pipe replace global: insertedCss: insertedCss
      .pipe concat 'owo.js'
      .pipe gulp.dest './dist/'



gulp.task 'watch', ->
  gulp.watch ['./js/*.js'], ['default']
