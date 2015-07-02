var gulp = require('gulp');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var del = require('del');

var allJs = ['./client/js/app.js',
	'./client/js/caisse.js',
	'./client/js/admin_panel_gerer_caisse.js',
	'./client/js/admin_panel_gerer_categorie.js',
	'./client/js/admin_journaldesventes.js',
	'./client/js/admin_gereruser.js',
	'./client/js/res_categorie.js'
];

gulp.task('scripts', function(){
	return gulp.src(allJs)
		.pipe(plumber())
		.pipe(gulp.dest('./public/js'));
});

gulp.task('scripts-release', function(){
	return gulp.src(allJs)
		.pipe(plumber())
		.pipe(concat('caisse.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'));
});

gulp.task('css', function(){
	return gulp.src('./client/css/*.css')
		.pipe(plumber())
		.pipe(concat('caisse.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('bootstrap', function(){
	gulp.src('./node_modules/bootstrap/dist/css/*.css')
		.pipe(gulp.dest('./public/css'));
	gulp.src('./node_modules/bootstrap/dist/fonts/*.eot')
		.pipe(gulp.dest('./public/fonts'));
});

gulp.task('angular', function() {
	gulp.src(['./node_modules/angular/angular.js', './node_modules/angular/angular.min.js'])
	.pipe(gulp.dest('./public/js'));
	gulp.src('./node_modules/angular-bootstrap/dist/*.js')
	.pipe(gulp.dest('./public/js'));
	gulp.src('./node_modules/angular-route/angular-route*.js')
	.pipe(gulp.dest('./public/js'));
	gulp.src('./node_modules/angular-cookies/angular-cookies.js')
	.pipe(gulp.dest('./public/js'));
	gulp.src(['./node_modules/angular-loading-spinner/angular-loading-spinner.js', './node_modules/angular-loading-spinner/node_modules/angular-spinner/angular-spinner.js'])
	.pipe(gulp.dest('./public/js'));
	gulp.src('./node_modules/spin/spin.js')
	.pipe(gulp.dest('./public/js'));
	gulp.src('./node_modules/angular-jwt/dist/angular-jwt.js')
	.pipe(gulp.dest('./public/js'));
	gulp.src('./node_modules/angular-resource/angular-resource.js')
	.pipe(gulp.dest('./public/js'));
})

gulp.task('jade', function(){

	var devJsFile = [];

	allJs.forEach(function (jsFile) {
		var extractedName = jsFile.slice(12);
		devJsFile.push('/js/' + extractedName);
	})

	gulp.src('./client/*.jade')
	.pipe(plumber())
	.pipe(jade({locals: {jsFiles : devJsFile}}))
	.pipe(gulp.dest('./public'));
})

gulp.task('jade-release', function(){
	gulp.src('./client/*.jade')
	.pipe(plumber())
	.pipe(jade({locals: {release: true}}))
	.pipe(gulp.dest('./public'));
})

gulp.task('watch', function() {
	gulp.watch('./client/js/*.js', ['scripts']);
	gulp.watch('./client/css/*.css', ['css']);
	gulp.watch('./client/*.jade', ['jade']);
})

gulp.task('clear', function() {
	del.sync(['./public']);
})

gulp.task('default', ['clear', 'jade', 'scripts', 'css', 'bootstrap', 'angular', 'watch']);
gulp.task('release', ['clear', 'jade-release', 'scripts-release', 'css', 'bootstrap', 'angular'])
