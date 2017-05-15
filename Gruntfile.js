module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-execute');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            cache: '.cache',
            src: {
                js: 'js',
                css: 'css',
                templates: 'templates'
            },
            public: {
                js: 'public/js',
                css: 'public/css'
            }
        },

        handlebars: {
            compile: {
                options: {
                    namespace: "Handlebars.templates",
                    processName: function(filepath) {
                        var parts = filepath.split('/');
                        return parts[parts.length - 1].replace('.handlebars', '');
                    }
                },
                files: {
                    '<%= dirs.cache %>/popup.handlebars.tmp': '<%= dirs.src.templates %>/popup/*.handlebars'
                }
            }
        },

        concat: {
            js: {
                files: {
                    '<%= dirs.public.js %>/popup.js': ['<%= dirs.cache %>/popup.handlebars.tmp', '<%= dirs.src.js %>/popup.js']
                }
            }
        },

        browserify: {
            dist: {
                options: {
                    transform: [
                        ['babelify']
                    ]
                },
                files: {
                    '<%= dirs.public.js %>/base.js': ['<%= dirs.src.js %>/base/index.es6.js'],
                    '<%= dirs.public.js %>/trackers.js': ['<%= dirs.src.js %>/pages/trackers.es6.js'],
                    '<%= dirs.public.js %>/options.js': ['<%= dirs.src.js %>/pages/options.es6.js']
                }
            }
        },

        sass: {
            dist: {
                files: {
                    '<%= dirs.public.css %>/base.css': ['<%= dirs.src.css %>/base/index.scss'],
                    '<%= dirs.public.css %>/trackers.css': ['<%= dirs.src.css %>/trackers.scss']
                }
            }
        },
        execute: {
            preProcessLists: {
                src: ['scripts/buildLists.js']
            }
        },
        watch: {
            css: {
                files: ['<%= dirs.src.css %>/**/*.scss'],
                tasks: ['sass']
            },
            javascript: {
                files: ['<%= dirs.src.js %>/**/*.js'],
                tasks: ['concat:js']
            },
            templates: {
                files: ['<%= dirs.src.templates %>/**/*.handlebars'],
                tasks: ['handlebars:compile', 'concat:js']
            },
            es6: {
                files: ['<%= dirs.src.js %>/**/*.es6.js'],
                tasks: ['browserify']
            }
        }
    });

    grunt.registerTask('build', 'Build project(s)css, templates, js', ['sass', 'handlebars:compile', 'browserify', 'concat', 'execute:preProcessLists']);
    grunt.registerTask('dev', 'Build and watch files for development', ['build', 'watch'])
    grunt.registerTask('default', 'build');
}
