var shell = require('shelljs')

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    standard: {
      options: { format: false },
      gruntfile: { src: ['gruntfile.js'] },
      scripts: { src: 'scripts/**/*.js' },
      js: { src: 'src/**/*.js' }
    },
    browserify: {
      dist: { src: 'index.js', dest: 'plugin.js' }
    },
    uglify: {
      dist: { files: { 'plugin.min.js': ['plugin.js'] } }
    },
    // watch: {
    //   gruntfile: {
    //     options: {reload: true},
    //     files: 'Gruntfile.js',
    //     tasks: ['standard:gruntfile']
    //   },
    //   js: {
    //     files: ['src/**/*.js'],
    //     tasks: ['standard:js', 'browserify', 'jsdoc']
    //   }
    // },
    watch: {
      gruntfile: {
        options: {reload: true},
        files: 'Gruntfile.js',
        tasks: ['standard:gruntfile']
      },
      js: {
        files: ['build/**/*.js'],
        tasks: ['browserify']
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'gh-sirap-group',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: 'rc',
        regExp: false
      }
    }
  })

  grunt.registerTask('jsdoc', function () {
    shell.exec('npm run jsdoc')
  })

  // grunt.registerTask('build', ['standard', 'browserify', 'uglify', 'jsdoc'])
  grunt.registerTask('build', ['browserify', 'uglify'])

  // grunt.registerTask('dev', ['standard', 'browserify', 'watch'])
  grunt.registerTask('dev', ['browserify', 'watch'])

  grunt.registerTask('default', ['dev'])
}
