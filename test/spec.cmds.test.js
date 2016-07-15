var _ = require('busyman'),
    expect = require('chai').expect;

var Spec = require('../lib/spec.js');

describe('cmds - Spec Class Functional Check', function () {
    var spec1 = new Spec('lightingColorCtrl', 'cmds');

    var theSpec = {
        moveToHue: function () {},
        moveHue: {
            exec: function () {}
        }
    };
    spec1.init(theSpec);

    it('should has moveToHue', function () {
        expect(spec1.has('moveToHue')).to.be.true;
    });

    it('should not has moveToHue', function () {
        expect(spec1.has('moveToHueX')).to.be.false;
    });

    it('moveToHue should equal to { exec }', function () {
        expect(spec1.get('moveToHue').exec).to.be.equal(theSpec.moveToHue);
    });

    it('moveHue should equal to { exec }', function () {
        expect(spec1.get('moveHue').exec).to.be.equal(theSpec.moveHue.exec);
    });

    it('moveHue should be equal new method after set', function () {
        var method2 = function (arg1, arg2, cb) {
            cb(null, [ arg1, arg2 ]);
        };
        expect(spec1.set('moveHue', method2)).to.be.equal(spec1);
        expect(spec1.get('moveHue').exec).to.be.equal(method2);
    });

    it('should not dump - unredable', function (done) {
        spec1.dump(function (err, data) {
            if (err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(spec1.dumpSync()).to.be.deep.equal({ moveHue: { exec: "_exec_"}, moveToHue: { exec: "_exec_"} });
    });

    it('should not read moveHue', function (done) {
        spec1.read('moveHue', function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should not read moveToHue', function (done) {
        spec1.read('moveToHue', function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should not write moveHue', function (done) {
        spec1.write('moveHue', 1, function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should not write moveToHue', function (done) {
        spec1.write('moveToHue', 1, function (err, data) {
            if (err && data === '_exec_')
                done();
        });
    });

    it('should execute', function (done) {
        spec1.exec('moveHue', ['hi', 'hello'], function (err, data) {
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