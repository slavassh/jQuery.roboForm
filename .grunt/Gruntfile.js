var options = {
	stripBanners: true,
	banner: '/**\n' +
	' * Application:  <%= pkg.name %>\n' +
	' * Version:      <%= pkg.version %>\n' +
	' * Release date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
	' * Author:       <%= pkg.author %> (<%= pkg.authorPage %>)\n' +
	' * Homepage:     https://github.com/StepanMas/jQuery.roboForm\n' +
	' * License:      <%= pkg.license %>\n' +
	'*/\n\n'
}

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: options,
			dist: {
				src: [
					'../<%= pkg.name %>.dev.js'
				],
				dest: '../<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: options,
			build: {
				src: '../<%= pkg.name %>.js',
				dest: '../<%= pkg.name %>.min.js'
			}
		},
		watch: {
			scripts: {
				files: ['../*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};