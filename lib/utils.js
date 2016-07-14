var _ = require('busyman'),
    zclId = require('zcl-id');

var utils = {};

utils.isValidArgType = function (param) {
    var isValid = true;

    if (!_.isNumber(param) && !_.isString(param))
        isValid = false;
    else if (_.isNumber(param))
        isValid = !isNaN(param);

    return isValid;
};

utils.isCid = function (cid) {
    var cidItem = zclId.cluster(cid);
    return cidItem ? true : false;
};

utils.getCidKey = function (cid) {
    var cidItem = zclId.cluster(cid);
    return cidItem ? cidItem.key : cid;
};

utils.getCidNum = function (cid) {
    var cidItem = zclId.cluster(cid);
    return cidItem ? cidItem.value : cid;
};

utils.getAidKey = function (cid, aid) {
    var aidItem = zclId.attr(cid, aid);
    return aidItem ? aidItem.key : aid;
};

utils.getCmdKey = function (cid, cmdId) {
    var cmdItem = zclId.functional(cid, cmdId);
    return cmdItem ? cmdItem.key : cmdId;
};

utils.invokeCbNextTick = function (err, val, cb) {
    if (_.isFunction(cb)) {
        process.nextTick(function () {
            cb(err, val);
        });
    }
};

/*************************************************************************************************/
/*** Synchronous Data Dumper                                                                   ***/
/*************************************************************************************************/
// [TODO] dumpClusterSync
utils.dumpObjectSync = function (obj) {
    var dumped = {};

    _.forEach(obj, function (inst, instId) {
        dumped[instId] = inst.dumpSync();
    });

    return dumped;
};

/*************************************************************************************************/
/*** Asynchronous Data Dumper                                                                  ***/
/*************************************************************************************************/
// [TODO] dumpCluster
utils.dumpObject = function (obj, callback, opt) {
    var dumped = {},
        instNum = _.isObject(obj) ? _.keys(obj).length : 0;

    _.forEach(obj, function (inst, instId) {
        inst.dump(function (err, resrcs) {
            if (err) {
                // do not (instNum - 1), or callback will be invoked twice
                callback(err, null);
            } else {
                dumped[instId] = resrcs;
                instNum -= 1;

                if (instNum === 0)
                    callback(null, dumped);
            }
        }, opt);
    });
};

// [TODO] dumpClusters, dont dump zapp
utils.dumpSmartObject = function (so, callback, opt) {
    var dumped = {},
        objNum = _.keys(so).length;

    _.forEach(so, function (obj, oidKey) {
        utils.dumpObject(obj, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                dumped[oidKey] = data;
                objNum -= 1;

                if (objNum === 0)
                    callback(null, dumped);
            }
        }, opt);
    });
};

utils.cloneResourceObject = function (rObj) {
    var cloned = {};

    if (rObj._isCb) {
        _.forEach(rObj, function (rval, rkey) {
            if (rkey === 'read')
                cloned.read = '_read_';
            else if (rkey === 'write')
                cloned.write = '_write_';
            else if (rkey === 'exec')
                cloned.write = '_exec_';
        });
    } else {
        _.forEach(rObj, function (rval, rkey) {
            if (_.isFunction(rval))
                return;
            else
                cloned[rkey] = rval;
        });
    }

    delete cloned._isCb;
    return cloned;
};

module.exports = utils;