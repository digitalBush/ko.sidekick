var jsdom = require("jsdom").jsdom;
global.document = jsdom('<html><body></body></html>');
global.window = global.document.createWindow();
global.navigator = global.window.navigator;
global.ko = require('knockout-client');
global.jQuery = require('jQuery');

require(__dirname + '/../src/ko.sidekick')