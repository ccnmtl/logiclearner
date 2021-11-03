/* global requirejs: true */

requirejs.config({
    baseUrl: '../../media/js/',
    paths: {
        'jquery': 'lib/jquery-3.3.1.min',
        'domReady': 'lib/require/domReady',
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});

define([
    'jquery',
    'domReady',
    'src/utils'
], function($, domReady, utils) {
    domReady(function() {
    });
});
