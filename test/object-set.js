"use strict";
exports.__esModule = true;
exports.ObjectSet = void 0;
var ObjectSet = /** @class */ (function () {
    function ObjectSet(values) {
        this._set = new Set(values);
    }
    ObjectSet.prototype.add = function (value) {
        var _this = this;
        this._set.forEach(function (obj) {
            if (obj.equals(value)) {
                return _this;
            }
        });
        this._set.add(value);
        return this;
    };
    ObjectSet.prototype["delete"] = function (value) {
        var _this = this;
        this._set.forEach(function (obj) {
            if (obj.equals(value)) {
                _this._set["delete"](obj);
                return true;
            }
        });
        return false;
    };
    ObjectSet.prototype.has = function (value) {
        this._set.forEach(function (obj) {
            if (obj.equals(value)) {
                return true;
            }
        });
        return false;
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
