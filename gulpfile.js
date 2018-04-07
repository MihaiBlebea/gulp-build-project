////////////////////////////////////
/// Require & constants
////////////////////////////////////
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var inject = require('gulp-inject');
var clean = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
// Test React JSX to JS
var babel = require('gulp-babel');

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
                .pipe(concat('script.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest(paths.tmpJS));
}

function css()
{
    return gulp.src(paths.srcCSS)
                .pipe(concat('style.min.css'))
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(gulp.dest(paths.tmpCSS));
}

function html()
{
    return gulp.src(paths.srcHTML)
                .pipe(htmlmin({collapseWhitespace: true}))
                .pipe(gulp.dest(paths.tmp));
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

// TODO Add linting to the project
// gulp.task('lint', function() {
//     return gulp.src(['**/*.js','!node_modules/**'])
//         .pipe(eslint())
//         .pipe(eslint.format())
//         .pipe(eslint.results(function(results) {
//             console.log(`Total Results: ${results.length}`);
//             console.log(`Total Warnings: ${results.warningCount}`);
//             console.log(`Total Errors: ${results.errorCount}`);
//         }))
//         .pipe(eslint.formatEach('compact', process.stderr));
// });

// Watch for changes
var watcher = gulp.watch('./src');
watcher.on('all', function(event, path) {
    if(event == 'change')
    {
        var extension = getExtension(path);
        switch(extension)
        {
            case 'css':
                gulp.task(css())
                break;
            case 'js':
                gulp.task(script())
                break;
            default:
                console.log('FIle format not found');
                break;
        }
    }
});

gulp.task('babel', function() {
    return gulp.src('test-react/*.jsx').
        pipe(babel({
            plugins: ['transform-react-jsx']
        })).
        pipe(gulp.dest('test-react/'));
});

////////////////////////////////////
/// Default task
////////////////////////////////////

gulp.task('default', gulp.series(['inject', 'serve'], function(done) {

    console.log('Job Done!')
    done();
}));
