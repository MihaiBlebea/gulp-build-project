////////////////////////////////////
/// Require & constants
////////////////////////////////////
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var inject = require('gulp-inject');
var clean = require('gulp-rimraf');
var uglify = require('gulp-uglify');

var paths = {
    src: 'src/**/*',
    srcHTML: 'src/*.html',
    srcCSS: 'src/css/*.css',
    srcJS: 'src/script/*.js',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/css/',
    tmpJS: 'tmp/js/',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/css/',
    distJS: 'dist/script/'
};

////////////////////////////////////
/// Scripts
////////////////////////////////////

function getExtension(file)
{
    return file.split('.')[1];
}

function script()
{
    return gulp.src(paths.srcJS)
                .pipe(uglify())
                .pipe(gulp.dest(paths.tmpJS));
}

function css()
{
    console.log('ceva')
    return gulp.src(paths.srcCSS)
                .pipe(gulp.dest(paths.tmpCSS));
}

function html()
{
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
}

function copy(source, destination)
{
    return gulp.src(source).pipe(gulp.dest(destination));
}

gulp.task('serve', function() {
    gulp.src(paths.tmp)
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('copy', gulp.series([html, css, script]));

// Delete tmp folder before copy files in here
gulp.task('clean', function() {
    return gulp.src('./tmp/*', { read: false }).pipe(clean());
});

// Inject files in the index.html
gulp.task('inject', gulp.series(['clean', 'copy'], function () {
    var css = gulp.src(paths.tmpCSS + '/*.css');
    var js = gulp.src(paths.tmpJS + '/*.js');
    return gulp.src(paths.tmpIndex)
               .pipe(inject(css, { relative:true }))
               .pipe(inject(js, { relative:true }))
               .pipe(gulp.dest(paths.tmp));
}));

// Watch for changes
var watcher = gulp.watch('./src');
watcher.on('all', function(event, path) {
    if(event == 'change')
    {
        var extension = getExtension(path);
        console.log(extension)
        switch(extension)
        {
            case 'css':
                console.log('this is css')
                gulp.task(css)
                break;
            case 'js':
                gulp.task(script)
                break;
            default:
                console.log('FIle format not found');
                break;
        }
    }
});

////////////////////////////////////
/// Default task
////////////////////////////////////

gulp.task('default', gulp.series(['inject', 'serve'], function(done) {

    console.log('Job Done!')
    done();
}));
