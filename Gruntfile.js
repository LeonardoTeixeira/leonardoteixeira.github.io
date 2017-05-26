module.exports = function(grunt) {
  grunt.initConfig({

    clean: [
      'dist/',
      '_site/dist/',
      '_site/node_modules/'
    ],

    copy: {
      main: {
        expand: true,
        cwd: '_site/',
        src: '**',
        dest: 'dist/',
        flatten: false,
        filter: 'isFile'
      }
    },

    uncss: {
      dist: {
        options: {
          stylesheets: ['css/main.css'],
          ignoreSheets: [/fonts.googleapis/]
        },
        files: {
          'dist/css/main.css': [
            'dist/index.html',
            'dist/contato/index.html',
            'dist/leonardo-teixeira/index.html',
            'dist/projetos/index.html',
            'dist/2015/08/19/apresentacao.html',
            'dist/android/2015/09/18/tutorial-android-mediaplayer.html'
          ]
        }
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: false
      },
      target: {
        files: [{
          expand: true,
          extDot: 'last',
          cwd: 'dist/css',
          src: '*.css',
          dest: 'dist/css',
          ext: '.css'
        }]
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          extDot: 'last',
          cwd: 'dist/img',
          src: '**/*.{png,jpg,gif,svg}',
          dest: 'dist/img',
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          extDot: 'last',
          cwd: 'dist',
          src: '**/*.html',
          dest: 'dist',
        }]
      }
    },

    compress: {
      main: {
        options: {
          mode: 'gzip',
          level: 5
        },
        files: [
          {
            expand: true,
            extDot: 'last',
            cwd: 'dist',
            src: '**/*.html',
            dest: 'dist/gzipped',
          },
          {
            expand: true,
            extDot: 'last',
            cwd: 'dist/css',
            src: '*.css',
            dest: 'dist/gzipped/css/',
          },
          {
            expand: true,
            extDot: 'last',
            cwd: 'dist/img',
            src: '*.svg',
            dest: 'dist/gzipped/img/',
          }
        ]
      },
    },

    aws_s3: {
      options: {
        accessKeyId: 'AKIAJTESNEBYGHBSGBRA',
        secretAccessKey: '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',
        region: 'us-east-1',
        bucket: 'blog.leonardoteixeira.com.br',
        uploadConcurrency: 10,
        downloadConcurrency: 10
      },
      production: {
        files: [
          {
            action: 'upload',
            expand: true,
            cwd: 'dist/',
            src: ['**', '!gzipped/**'],
            dest: '/',
            params: {
              CacheControl: 'max-age=290304000'
            }
          }
        ]
      },
      production_gzipped: {
        files: [
          {
            action: 'upload',
            expand: true,
            cwd: 'dist/gzipped',
            src: ['**'],
            dest: '/',
            params: {
              ContentEncoding: 'gzip',
              CacheControl: 'max-age=290304000'
            }
          }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-aws-s3');

  grunt.registerTask('default', ['clean', 'copy', /*'uncss',*/ 'cssmin', 'imagemin', 'htmlmin', 'compress', 'aws_s3']);
};
