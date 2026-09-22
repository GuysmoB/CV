var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var csso = require("gulp-csso");
var del = require("del");
var gulp = require("gulp");
var htmlmin = require("gulp-htmlmin");

// Clean output directory
gulp.task("clean", function () {
  return del(["dist"]);
});

// Gulp task to minify CSS files
gulp.task("styles", function () {
  return (
    gulp
      .src("./style.css")
      // Auto-prefix css styles for cross browser compatibility
      .pipe(autoprefixer())
      // Minify the file
      .pipe(csso())
      // Output
      .pipe(gulp.dest("./dist"))
  );
});

gulp.task("assets", function () {
  return gulp.src("./asset/**/*").pipe(gulp.dest("./dist/asset"));
});

gulp.task("scripts", function () {
  return gulp.src(["./app.js"]).pipe(gulp.dest("./dist"));
});

// Gulp task to minify HTML files
gulp.task("pages", function () {
  return gulp
    .src(["./*.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: false,
      }),
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("reload", function (done) {
  browserSync.reload();
  done();
});

gulp.task("serve", function (done) {
  browserSync.init({
    server: "./dist",
    port: 3000,
    open: false,
    notify: false,
  });
  done();
});

gulp.task("watch", function () {
  gulp.watch(["./*.html"], gulp.series("pages", "reload"));
  gulp.watch(["./app.js"], gulp.series("scripts", "reload"));
  gulp.watch(["./style.css"], gulp.series("styles", "reload"));
  gulp.watch(["./asset/**/*"], gulp.series("assets", "reload"));
});

gulp.task(
  "dev",
  gulp.series(
    "clean",
    "pages",
    "styles",
    "assets",
    "scripts",
    "serve",
    "watch",
  ),
);
