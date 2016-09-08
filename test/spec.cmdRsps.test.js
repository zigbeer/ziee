var _ = require('busyman'),
    expect = require('chai').expect;

var Spec = require('../lib/spec.js');

describe('cmdRsps - Spec Class Functional Check', function () {
    var spec1 = new Spec('ssIasZone', 'cmdRsps');

    var theSpec = {
        statusChangeNotification: function () {},
        enrollReq: {
            exec: function () {}
        }
    };
    spec1.init(theSpec);

    it('should has statusChangeNotification', function () {
        expect(spec1.has('statusChangeNotification')).to.be.true;
    });

    it('should not has statusChangeNotification', function () {
        expect(spec1.has('statusChangeNotificationX')).to.be.false;
    });

    it('statusChangeNotification should equal to { exec }', function () {
        expect(spec1.get('statusChangeNotification').exec).to.be.equal(theSpec.statusChangeNotification);
    });

    it('enrollReq should equal to { exec }', function () {
        expect(spec1.get('enrollReq').exec).to.be.equal(theSpec.enrollReq.exec);
    });

    it('enrollReq should be equal new method after set', function () {
        var method2 = function (arg1, arg2, cb) {
            cb(null, [ arg1, arg2 ]);
        };
        expect(spec1.set('enrollReq', method2)).to.be.equal(spec1);
        expect(spec1.get('enrollReq').exec).to.be.equal(method2);
    });

    it('should not dump - unredable', function (done) {
        spec1.dump(function (err, data) {
            if (err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(spec1.dumpSync()).to.be.deep.equal({ enrollReq: { exec: "_exec_"}, statusChangeNotification: { exec: "_exec_"} });
    });

    it('should not read enrollReq', function (done) {
        spec1.read('enrollReq', function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should not read statusChangeNotification', function (done) {
        spec1.read('statusChangeNotification', function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should not write enrollReq', function (done) {
        spec1.write('enrollReq', 1, function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should not write statusChangeNotification', function (done) {
        spec1.write('statusChangeNotification', 1, function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should execute', function (done) {
        spec1.exec('enrollReq', ['hi', 'hello'], function (err, data) {
            if (data[0] === 'hi' && data[1] === 'hello')
                done();
        });
    });

    it('should clear all', function () {
        expect(spec1.clear()).to.be.equal(spec1);
        expect(spec1.dumpSync()).to.be.deep.equal({});
    });

    it('should init something else', function () {
        var sp = {
                foo: function () {}
            };

        expect(function () {
            return spec1.init(sp, false);
        }).not.to.throw(Error);

        expect(spec1.dumpSync()).to.be.deep.equal({ foo: { exec: '_exec_' } });
    });
});