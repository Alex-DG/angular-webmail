module.exports = function( grunt ) {
	var exec = require( 'child_process' ).exec;

	grunt.initConfig( {
		uglify        : {
			build     : {
				files : {
					'./build/build.min.js' : [
						'./build/build.js'
					]
				}
			},
			index     : {
				files : {
					'./index.min.js' : [
						'./index.js'
					]
				}
			}
		},
		watch         : {
			files     : ['./src/**/*.js', './test/**/*.js'],
			tasks     : ['default']
		}
	} );

  	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.registerTask( 'component:build', 'run component.io build script', function() {
		console.log( 'component:build start.' );

		var done = this.async();

		exec( 'component build', function( error, stdout, stderr ) {
			!stdout || console.log( stdout );
			!stderr || console.log( 'ERROR: ' + stderr );

			 console.log( error !== null ? 'EXEC ERROR: ' + error : 'component:build complete.' );

			 done();
		} );
  	} );

  	grunt.registerTask( 'default', ['component:build', 'uglify'] );
};
