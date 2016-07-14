'use strict';

var _ = require('busyman'),
    zclId = require('zcl-id');

var utils = require('./utils');

function Folder(cidKey, iid) {
    if (!_.isString(cidKey))
        throw new TypeError("cid should be a string, such as 'genBasic'.");

    this.cid = cidKey;    // cid is a string
    this.iid = iid;       // iid is a string or a number
}

/*************************************************************************************************/
/*** Public Methods: Getter and Setter                                                         ***/
/*************************************************************************************************/
Folder.prototype.has = function (aid) {
    if (!utils.isValidArgType(aid)) 
        throw new TypeError('aid should be given with a number or a string.');

    var aidkey = utils.getAidKey(this.cid, aid);
    return this.hasOwnProperty(aidkey);
};

Folder.prototype.get = function (aid) {
    if (!utils.isValidArgType(aid)) 
        throw new TypeError('aid should be given with a number or a string.');

    var aidkey = utils.getAidKey(this.cid, aid);
    return this[aidkey];
};

Folder.prototype.set = function (aid, value) {
    if (!utils.isValidArgType(aid)) 
        throw new TypeError('aid should be given with a number or a string.');

    if (_.isUndefined(value) || _.isFunction(value))
        throw new TypeError('Attribute cannot be a function or undefined.');

    var aidkey = utils.getAidKey(this.cid, aid);
    this[aidkey] = value;

    return this;
};

Folder.prototype.clear = function () {
    var self = this;
    _.forEach(this, function (v, k) {
        if (k === 'cid' || k === 'iid')
            return;

        self[k] = null;
        delete self[k];
    });

    return this;
};

Folder.prototype.init = function (resrcs) {
    // each time of init(), all resources will be cleared. Please use .set() to add/modify resource
    var self = this.clear(),
        aidKey;

    if (!_.isPlainObject(resrcs))
        throw new TypeError('Attributes should be wrapped in an object.');

    switch (this.iid) {
        case 'dir':
            if (!resrcs.hasOwnProperty('value'))
                throw new TypeError("Direction should be an object with a key named 'value'.");
            else if (!_.isNumber(resrcs.value))
                throw new TypeError("dir.value should be a number.");
            else
                self.set('value', resrcs.value);
            break;
        case 'attrs':
        case 'acls':
            _.forEach(resrcs, function (rVal, rKey) {
                if (!zclId.attr(self.cid, rKey))
                    throw new TypeError('Attr id: ' + rKey + ' is not an ZCL-defined attribute.');

                if (_.isObject(rVal))
                    rVal._isCb = _.isFunction(rVal.read) || _.isFunction(rVal.write) || _.isFunction(rVal.exec);

                self.set(rKey, rVal);   // set will turn aid to string
            });
            break;
        case 'cmds':
            _.forEach(resrcs, function (rVal, rKey) {
                if (!zclId.functional(self.cid, rKey))
                    throw new TypeError('Command id: ' + rKey + ' is not an ZCL-defined functional command.');

                if (_.isObject(rVal))
                    rVal._isCb = _.isFunction(rVal.read) || _.isFunction(rVal.write) || _.isFunction(rVal.exec);

                self.set(rKey, rVal);   // set will turn aid to string
            });
            break;
    }
};

Folder.prototype.dump = function (callback) {
    // do not dump keys: 'cid', 'iid'
    var self = this,
        dumped = {},
        resrcNum = _.keys(this).length;

    _.forEach(this, function (val, aidKey) {
        if (aidKey === 'cid' || aidKey === 'iid') {
            resrcNum -= 1;
            
            if (resrcNum === 0)
                callback(null, dumped);
        } else {
            self.read(aidKey, function (err, data) {
                if (err) {
                    if (data === '_exec_' || data === '_unreadable_') {
                        dumped[aidKey] = data;
                        resrcNum -= 1;

                        if (resrcNum === 0)
                            callback(null, dumped);
                    } else {
                        // do not (resrcNum - 1), or callback will be invoked twice
                        callback(err, null);
                    }
                } else {
                    dumped[aidKey] = data;
                    resrcNum -= 1;

                    if (resrcNum === 0)
                        callback(null, dumped);
                }
            });
        }
    });
};

Folder.prototype.dumpSync = function () {
    // do not dump keys: 'cid', 'iid'
    var self = this,
        dumped = {};

    _.forEach(this, function (rval, aidKey) {
        var clonedObj;

        if (aidKey === 'cid' || aidKey === 'iid' || _.isFunction(rval))
            return;

        if (_.isObject(rval)) {
            clonedObj = utils.cloneResourceObject(rval);
            dumped[aidKey] = clonedObj;
        } else if (!_.isFunction(rval)) {
            dumped[aidKey] = rval;
        }
    });

    return dumped;
};

/*************************************************************************************************/
/*** Public Methods: Asynchronous Read/Write/Exec                                              ***/
/*************************************************************************************************/
Folder.prototype.read = function (aid, callback) {
    var self = this,
        rsc = this.get(aid);

    if (_.isUndefined(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);
    else if (_.isFunction(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);

    // [TODO]
    //-------------------------------------------------------------------------------------------
    function restrictRead(rsc, cb) {
        var rdef = zclId.attr(self.cid, aid);
        if (rdef) {
            if (rdef.access === 'R' || rdef.access === 'RW')
                return utils.invokeCbNextTick(null, rsc, cb);
            else
                return utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_unreadable_', cb);
        } else {
            return utils.invokeCbNextTick(null, rsc, cb);
        }
    }

    if (!_.isPlainObject(rsc)) {
        if (opt.restrict)
            return restrictRead(rsc, callback);
        else
            return utils.invokeCbNextTick(null, rsc, callback);
    }

    // if we are here, rsc is a plain object
    if (!rsc._isCb) {
        if (opt.restrict)
            return restrictRead(rsc, callback);
        else
            return utils.invokeCbNextTick(null, _.omit(rsc, [ '_isCb' ], callback));
    }

    // rsc should be read from users callback
    if (_.isFunction(rsc.exec)) {
        // an exec resource cannot be read, so checks for it first
        utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_exec_', callback);
    } else if (_.isFunction(rsc.read)) {
        rsc.read(function (err, val) {
            utils.invokeCbNextTick(err, val, callback);
        });
    } else {
        utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_unreadable_', callback);
    }
};

Folder.prototype.write = function (aid, value, callback, opt) {
    var self = this,
        rsc = this.get(aid);

    opt = opt || { restrict: false };

    if (_.isUndefined(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);
    else if (_.isFunction(rsc))
        return utils.invokeCbNextTick(new Error('Resource cannot be a function.'), '_notfound_', callback);
    else if (!_.isPlainObject(opt))
        throw new TypeError('opt should be an object if given.');

    function restrictWrite(valToWrite, cb) {
        var rdef = zclId.getRdef(self.cid, aid);
        if (rdef) {
            if (rdef.access === 'W' || rdef.access === 'RW') {
                self.set(aid, valToWrite);
                return utils.invokeCbNextTick(null, valToWrite, cb);
            } else {
                return utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_unwritable_', cb);
            }
        } else {
            self.set(aid, valToWrite);
            return utils.invokeCbNextTick(null, valToWrite, cb);
        }
    }

    if (!_.isPlainObject(rsc)) {
        if (opt.restrict) {
            return restrictWrite(value, callback);
        } else {
            this.set(aid, value);
            return utils.invokeCbNextTick(null, value, callback);
        }
    }

    // if we are here, rsc is a plain object
    if (!rsc._isCb) {
        if (opt.restrict) {
            return restrictWrite(value, callback);
        } else {
            this.set(aid, value);
            return utils.invokeCbNextTick(null, _.omit(value, [ '_isCb' ]), callback);
        }
    }

    // rsc should be written by users callback
    if (_.isFunction(rsc.exec)) {
        // an exec resource cannot be written, so checks for it first
        utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_exec_', callback);
    } else if (_.isFunction(rsc.write)) {
        rsc.write(value, function (err, val) {
            utils.invokeCbNextTick(err, val, callback);
        });
    } else {
        utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_unwritable_', callback);
    }
};

Folder.prototype.exec = function (aid, argus, callback) {
    var rsc = this.get(aid);

    if (_.isFunction(argus)) {
        callback = argus;
        argus = [];
    }
    argus = argus || [];

    if (_.isUndefined(rsc)) {
        utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);
    } else if (!_.isArray(argus)) {
        utils.invokeCbNextTick(new TypeError('argus should be an array.'), '_badreq_', callback);
    } else {
        if (_.isObject(rsc) && _.isFunction(rsc.exec)) {
            argus.push(function (execErr, rspObj) {
                // rspObj: { status, value }
                utils.invokeCbNextTick(execErr, rspObj, callback);
            });
            rsc.exec.apply(this, argus);
        } else {
            utils.invokeCbNextTick(new Error('Resource is unexecutable.'), '_unexecutable_', callback);
        }
    }
};

module.exports = Folder;
