"use strict";
var NationWideMovement = (function () {
    function NationWideMovement(name) {
        this.name = name;
        this.movementProtests = [];
    }
    NationWideMovement.prototype.getName = function () {
        return this.name;
    };
    NationWideMovement.prototype.addProtest = function (protestName) {
        if (this.containsProtest(protestName)) {
            return ("ERROR: This protest has already been added");
        }
        else {
            this.movementProtests.push(protestName);
        }
    };
    NationWideMovement.prototype.containsProtest = function (protestName) {
        for (var i = 0; i < this.movementProtests.length; i++) {
            if (this.movementProtests[i] == protestName) {
                return true;
            }
        }
        return false;
    };
    return NationWideMovement;
}());
exports.NationWideMovement = NationWideMovement;
var Protests = (function () {
    function Protests(name, zipcode, date) {
        this.name = name;
        this.zipcode = zipcode;
        this.date = date;
        this.protesters = new Array();
    }
    Protests.prototype.addMember = function (member) {
        if (this.containsMember(member)) {
            return ("ERROR: This protestor has already been added");
        }
        else {
            this.protesters.push(member);
        }
    };
    Protests.prototype.getName = function () {
        return this.name;
    };
    Protests.prototype.getZipCode = function () {
        return this.zipcode;
    };
    Protests.prototype.getProtestors = function () {
        return this.protesters;
    };
    Protests.prototype.setTitle = function (newTitle) {
        this.name = newTitle;
    };
    Protests.prototype.setDate = function (newDate) {
        this.date = newDate;
    };
    Protests.prototype.containsMember = function (member) {
        for (var i = 0; i < this.protesters.length; i++) {
            if (this.protesters[i].getName() == member.getName() &&
                this.protesters[i].getZipCode() == member.getZipCode()) {
                return true;
            }
        }
        return false;
    };
    return Protests;
}());
exports.Protests = Protests;
var Protester = (function () {
    function Protester(name, protesterEmail, zipcode) {
        this.email = protesterEmail;
        this.zipcode = zipcode;
        this.name = name;
    }
    Protester.prototype.getName = function () {
        return this.name;
    };
    Protester.prototype.getZipCode = function () {
        return this.zipcode;
    };
    Protester.prototype.getEmail = function () {
        return this.email;
    };
    return Protester;
}());
exports.Protester = Protester;
var ResistanceManager = (function () {
    function ResistanceManager() {
        this.members = new Array();
        this.protests = new Array();
        this.movements = new Array();
    }
    ResistanceManager.prototype.addMovement = function (name) {
        this.movements.push(new NationWideMovement(name));
        return name;
    };
    ResistanceManager.prototype.addMember = function (name, email, zipcode) {
        this.members.push(new Protester(name, email, zipcode));
        return name;
    };
    ResistanceManager.prototype.addProtest = function (newProtestName, zipcode, date) {
        this.protests.push(new Protests(newProtestName, zipcode, date));
        return newProtestName;
    };
    ResistanceManager.prototype.addProtestToMovement = function (protestName, movementName) {
        for (var i = 0; i < this.movements.length; i++) {
            if (this.movements[i].getName().toLowerCase() == movementName.toLowerCase()) {
                this.movements[i].addProtest(protestName);
            }
        }
    };
    ResistanceManager.prototype.containsProtest = function (protestName) {
        for (var i = 0; i < this.protests.length; i++) {
            if (this.protests[i].getName() == protestName) {
                return true;
            }
        }
        return false;
    };
    ResistanceManager.prototype.addMemberToProtest = function (memberName, protestName) {
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].getName().toLowerCase() == memberName.toLowerCase()) {
                for (var j = 0; j < this.protests.length; j++) {
                    if (this.protests[j].getName().toLowerCase() == protestName.toLowerCase()) {
                        this.protests[j].addMember(this.members[i]);
                        break;
                    }
                }
            }
        }
    };
    ResistanceManager.prototype.modifyProtest = function (protestName, newTitle, newTime) {
        for (var i = 0; i < this.protests.length; i++) {
            if (this.protests[i].getName().toLowerCase() == protestName.toLowerCase()) {
                if (newTitle == undefined) {
                    this.protests[i].setDate(newTime);
                }
                else {
                    this.protests[i].setTitle(newTitle);
                }
            }
        }
    };
    ResistanceManager.prototype.getProtesters = function (protestName) {
        var protesterNames = [];
        var protesters = [];
        for (var i = 0; i < this.protests.length; i++) {
            if (this.protests[i].getName().toLowerCase() == protestName.toLowerCase()) {
                protesters = this.protests[i].getProtestors();
            }
        }
        for (var i = 0; i < protesters.length; i++) {
            protesterNames.push(protesters[i].getName());
        }
        return protesterNames;
    };
    ResistanceManager.prototype.getUsersNearProtest = function (protestName, distance2) {
        var protest = this.protests.find(function (p) {
            return p.getName() === protestName;
        });
        if (!protest)
            return ["ERROR: invalid protest"];
        if (!protest.getZipCode().match(/\d{5}/))
            return ["ERROR: bad zipcode"];
        var dist = mileMeter(distance2);
        var res = this.members.filter(function (m) {
            var diff = calcDistance(protest.getZipCode(), m.getZipCode());
            return (diff < dist);
        }).map(function (p) {
            return p.getName();
        });
        if (res.length < 1)
            return ['none found'];
        return res;
    };
    ResistanceManager.prototype.getNearbyProtests = function (zip, distance) {
        if (!zip.match(/\d{5}/))
            return ["ERROR: bad zipcode"];
        var dist = mileMeter(distance);
        var res = this.protests.filter(function (m) {
            var diff = calcDistance(zip, m.getZipCode());
            return (diff < dist);
        }).map(function (p) {
            return p.getName();
        });
        if (res.length < 1)
            return ['none found'];
        return res;
    };
    ResistanceManager.prototype.searchArray = function (query, array) {
        var matchingProtestNames = [];
        for (var i = 0; i < array.length; i++) {
            var name = array[i].getName();
            if (name.indexOf(query) != -1) {
                matchingProtestNames.push(name);
            }
        }
        return matchingProtestNames;
    };
    ResistanceManager.prototype.findProtestNames = function (query) {
        return this.searchArray(query, this.protests);
    };
    ResistanceManager.prototype.findMemberNames = function (query) {
        return this.searchArray(query, this.members);
    };
    ResistanceManager.prototype.findMovementNames = function (query) {
        return this.searchArray(query, this.movements);
    };
    return ResistanceManager;
}());
exports.ResistanceManager = ResistanceManager;
var zips = require('./index').zips;
var geolib = require('geolib');
function calcDistance(zip1, zip2) {
    return geolib.getDistance(zips[zip1], zips[zip2]);
}
function mileMeter(mi) {
    return mi * 1609.34;
}
//# sourceMappingURL=resistance.js.map