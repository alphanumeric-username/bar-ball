"use strict";
exports.__esModule = true;
exports.ObjectSet = void 0;
var ObjectSet = /** @class */ (function () {
    function ObjectSet(values) {
        var _this = this;
        // console.log(values);
        this._set = new Set();
        values.forEach(function (v) { return _this.add(v); });
    }
    ObjectSet.prototype.add = function (value) {
        if (!this.has(value)) {
            this._set.add(value);
        }
        return this;
    };
    ObjectSet.prototype["delete"] = function (value) {
        var _this = this;
        var found = false;
        this._set.forEach(function (obj) {
            if (obj.equals(value)) {
                _this._set["delete"](obj);
                found = true;
                return;
            }
        });
        return found;
    };
    ObjectSet.prototype.has = function (value) {
        var found = false;
        this._set.forEach(function (obj) {
            if (obj.equals(value)) {
                found = true;
                return;
            }
        });
        return found;
    };
    ObjectSet.prototype.size = function () {
        return this._set.size;
    };
    ObjectSet.prototype.forEach = function (callback) {
        this._set.forEach(callback);
    };
    ObjectSet.prototype.clear = function () {
        this._set.clear();
    };
    return ObjectSet;
}());
exports.ObjectSet = ObjectSet;
