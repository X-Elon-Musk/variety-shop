// less

var gulp=require("gulp");
var browserSync=require("browser-sync");
var less=require("gulp-less");
var sourcemaps = require('gulp-sourcemaps');
var reload =browserSync.reload;
gulp.task('less',function(){
    return gulp.src('../test/less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../test/css'))
    .pipe(reload({stream:true}));
})
gulp.task('serve', ['less'], function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch('../test/less/*.less', ['less'],{cwd: 'app'}, reload);
});
