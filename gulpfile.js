var gulp = require('gulp');
var polybuild = require('polybuild');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var manifest = require('gulp-appcache');

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'app',
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch('app/*', browserSync.reload);
});

gulp.task('copy-files', function() {
    var app = gulp.src([
        'app/**/*'
    ]).pipe(gulp.dest('dist'));

    var bower = gulp.src([
        'bower_components/**/*'
    ]).pipe(gulp.dest('dist/bower_components'));

    return merge(app, bower);
});

gulp.task('polybuild', function() {
    return gulp.src('dist/index.html')
        .pipe(polybuild({ maximumCrush: true }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('rename-files', function() {
    return gulp.src('dist/index.build.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
    return del('dist');
});

gulp.task('del-unnecessary', function() {
    // Delete files and directories no longer needed after polybuild.
    return del([
        'dist/index.build.html',
        'dist/js',
        'dist/bower_components',
        'dist/progress-bubble-fork'
    ]);
});

gulp.task('appcache', function() {
    return gulp.src(['dist/**/*'])
        .pipe(manifest({
            hash: true,
            filename: 'manifest.appcache',
            network: ['*']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['clean'], function(callback) {
    runSequence('copy-files', 'polybuild', 'rename-files', 'del-unnecessary', 'appcache', callback);
});
gulp.task('default', ['serve']);
