"use strict";
exports.zips = require('../data/zipcode-locations.json');
for (var _i = 0, _a = Object.keys(exports.zips); _i < _a.length; _i++) {
    var zip = _a[_i];
    if (!Array.isArray(exports.zips[zip]))
        break;
    exports.zips[zip] = {
        latitude: exports.zips[zip][0],
        longitude: exports.zips[zip][1]
    };
}
var UI = require("./ui");
UI.start();
//# sourceMappingURL=index.js.map