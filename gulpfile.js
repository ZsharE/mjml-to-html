const gulp = require('gulp');
const mjml = require('gulp-mjml');
const mjmlEngine = require('mjml');
const htmlMinify = require('html-minifier');
const jsonEditor = require('gulp-json-editor');

let htmlContents = null;

gulp.task('mjml-to-html', function () {
    return gulp.src('./test.mjml')
        .pipe(mjml(mjmlEngine))
        .on('data', function(file) {
            const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), {
                collapseWhitespace: true,
                minifyCSS: true,
                processConditionalComments: true
            }));
            htmlContents = '"' + buferFile.toString() + '"';
            return file.contents = buferFile;
        })
        .pipe(gulp.dest('./html'))
});

gulp.task('update-json', function () {
    return gulp.src('./template.json')
        .pipe(jsonEditor(function(json) {
            json.Template.HtmlPart = htmlContents;
            return json;
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('run', gulp.series('mjml-to-html', 'update-json'));