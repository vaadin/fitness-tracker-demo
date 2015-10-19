var gulp = require('gulp');
var polyclean = require('polyclean');
var vulcanize = require('gulp-vulcanize');
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

gulp.task('vulcanize', function() {
    return gulp.src('dist/elements.html')
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripComments: true
        }))
        .pipe(polyclean.cleanJsComments())
        .pipe(polyclean.cleanCss())
        .pipe(polyclean.uglifyJs())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function() {
    return del('dist');
});

gulp.task('del-unnecessary', function() {
    // Delete files and directories no longer needed after vulcanize.
    // Note that moment and webcomponentjs must be preserved.
    return del([
        'dist/elements.build.html',
        'dist/app-logo.html',
        'dist/app-theme.html',
        'dist/app-toolbar.html',
        'dist/speed-altitude-chart.html',
        'dist/summary-rings.html',
        'dist/summary-table.html',
        'dist/summary-view.html',
        'dist/user-avatar.html',
        'dist/workouts-view.html',
        'dist/bower_components/**',
        '!dist/bower_components',
        '!dist/bower_components/moment/**',
        '!dist/bower_components/webcomponentsjs/**',
        '!dist/bower_components/vaadin-grid/**',
        'dist/progress-bubble-fork'
    ]);
});

gulp.task('appcache', function() {
    return gulp.src(['dist/**/*'])
        .pipe(manifest({
            hash: true,
            filename: 'manifest.appcache',
            exclude: 'manifest.appcache',
            network: ['*']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['clean'], function(callback) {
    runSequence('copy-files', 'vulcanize', 'del-unnecessary', 'appcache', callback);
});
gulp.task('default', ['serve']);
