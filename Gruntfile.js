/* jshint node:true */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        // Setting folder templates.
        dirs: {
            js: 'assets/js',
            css: 'assets/css',
            scss: 'assets/scss',
        },

        // JavaScript linting with JSHint.
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= dirs.js %>/*.js',
                '!<%= dirs.js %>/*.min.js',
                '<%= dirs.js %>/*.js',
                '!<%= dirs.js %>/*.min.js'
            ]
        },

        // Sass linting with Stylelint.
        stylelint: {
            options: {
                stylelintrc: '.stylelintrc'
            },
            all: [
                '<%= dirs.scss %>/*.scss'
            ]
        },

        // Minify all .js files.
        uglify: {
            options: {
                ie8: true,
                parse: {
                    strict: false
                },
                output: {
                    comments: /@license|@preserve|^!/
                }
            },
            assets: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.js %>/',
                    src: [
                        '*.js',
                        '!*.min.js'
                    ],
                    dest: '<%= dirs.js %>/',
                    ext: '.min.js'
                }]
            },
            vendor: {
                files: {
                    '<%= dirs.js %>/jquery-blockui/jquery.jquery.blockUI.min.js': ['<%= dirs.js %>/jquery-blockui/jquery.jquery.blockUI.js'],
                    '<%= dirs.js %>/jquery-tiptip/jquery.tipTip.min.js': ['<%= dirs.js %>/jquery-tiptip/jquery.tipTip.js'],
                    '<%= dirs.js %>/select2/select2.min.js': ['<%= dirs.js %>/select2/select2.js']
                }
            }
        },

        // Compile all .scss files.
        sass: {
            options: {
                sourceMap: true,
                unixNewlines: true,
                sourceMapFileInline: true,
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.scss %>/',
                    src: ['*.scss', '!*.css'],
                    dest: '<%= dirs.css %>/',
                    ext: '.css',
                }]
            }
        },

        // Generate all RTL .css files
        rtlcss: {
            generate: {
                expand: true,
                cwd: '<%= dirs.css %>',
                src: ['*.css', '!*.rtl.css'],
                dest: '<%= dirs.css %>/',
                ext: '.rtl.css'
            }
        },

        // Minify all .css files.
        cssmin: {
            options: {
                sourceMap: true,
                sourceMapFileInline: true,
            },
            minify: {
                expand: true,
                cwd: '<%= dirs.css %>/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= dirs.css %>/',
                ext: '.min.css'
            }
        },

        // Concatenate select2.css onto the admin.css files.
        concat: {
            admin: {
                files: {}
            }
        },

        // Watch changes for assets.
        watch: {
            css: {
                options: {
                    sourceMap: true,
                    sourceMapFileInline: true,
                },
                files: [
                    '<%= dirs.scss %>/*.scss',
                    '<%= dirs.scss %>/**/*.scss'

                ],
                tasks: ['sass', 'postcss', 'cssmin'],
            },
            
            js: {
                files: [
                    '<%= dirs.js %>/*.js',
                    '<%= dirs.js %>/!*.min.js'
                ],
                tasks: [/*'jshint',*/ 'uglify']
            }
        },

        // Generate POT files.
        makepot: {
            options: {
                type: 'wp-plugins',
                domainPath: 'languages/',
                potHeaders: {
                    'report-msgid-bugs-to': 'themecentury@gmail.com',
                    'language-team': 'LANGUAGE <themecentury@gmail.com>'
                }
            },
            dist: {
                options: {
                    potFilename: 'sharing-plus.pot',
                    exclude: [
                        'vendor/.*'
                    ]
                }
            }
        },

        // Check textdomain errors.
        checktextdomain: {
            options: {
                text_domain: 'sharing-plus',
                keywords: [
                    '__:1,2d',
                    '_e:1,2d',
                    '_x:1,2c,3d',
                    'esc_html__:1,2d',
                    'esc_html_e:1,2d',
                    'esc_html_x:1,2c,3d',
                    'esc_attr__:1,2d',
                    'esc_attr_e:1,2d',
                    'esc_attr_x:1,2c,3d',
                    '_ex:1,2c,3d',
                    '_n:1,2,4d',
                    '_nx:1,2,4c,5d',
                    '_n_noop:1,2,3d',
                    '_nx_noop:1,2,3c,4d'
                ]
            },
            files: {
                src: [
                    '**/*.php',         // Include all files
                    '!node_modules/**', // Exclude node_modules/
                    '!vendor/**'        // Exclude vendor/
                ],
                expand: true
            }
        },

        // PHP Code Sniffer.
        phpcs: {
            options: {
                bin: 'vendor/bin/phpcs',
                standard: './phpcs.ruleset.xml'
            },
            dist: {
                src: [
                    '**/*.php',         // Include all files
                    '!node_modules/**', // Exclude node_modules/
                    '!vendor/**'        // Exclude vendor/
                ]
            }
        },

        // Autoprefixer.
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: [
                        	'last 4 versions',
                            '> 0.1%',
                            'ie 8',
                            'ie 9',
                            'ie 7',
                            'opera 12',
                            'ff 15'
                        ]
                    })
                ]
            },
            dist: {
                src: [
                    '<%= dirs.css %>/*.css'
                ]
            }
        },

        // Compress files and folders.
        compress: {
            options: {
                archive: 'sharing-plus.zip'
            },
            files: {
                src: [
                    '**',
                    '!.*',
                    '!*.md',
                    '!*.zip',
                    '!.*/**',
                    '!sass/**',
                    '!vendor/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!package.json',
                    '!composer-lock.json',
                    '!composer.lock',
                    '!node_modules/**',
                    '!phpcs.ruleset.xml'
                ],
                dest: 'sharing-plus',
                expand: true
            }
        },
        browserSync:{
            dev:{
                bsFiles:{
                    src:[
                        'assets/css/*.css',
                    ],
                },
                options: {
                    //watchTask: ['sass', 'postcss', 'cssmin'],
                    /*server:{
                        baseDir: "./assets/css",
                    },*/
                    port: 4000,
                    watchTask: true,
                    proxy: "localhost/themecentury/plugins/sharing-plus",
                },
            },
        },
    });

    // Load NPM tasks to be used here
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-phpcs');
    grunt.loadNpmTasks('grunt-rtlcss');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-stylelint');
    grunt.loadNpmTasks('grunt-wp-i18n');
    grunt.loadNpmTasks('grunt-checktextdomain');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Register tasks
    grunt.registerTask('default', [
        'browserSync',
        'watch',
        //'jshint',
        //'uglify',
        //'css'
    ]);

    grunt.registerTask('js', [
        //'jshint',
        'uglify:assets'

    ]);

    grunt.registerTask('css', [
        'sass',
        'postcss',
        'rtlcss',
        'cssmin',
        //'concat'
    ]);

    grunt.registerTask('dev', [
        'default',
        'makepot'
    ]);

    grunt.registerTask('zip', [
        //'dev',
        'compress'
    ]);

    /*grunt.registerTask('watch', [
        'watch',
    ]);*/
};
