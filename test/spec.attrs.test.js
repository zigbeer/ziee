var _ = require('busyman'),
    // sinon = require('sinon'),
    // sinonChai = require('sinon-chai'),
    expect = require('chai').expect;

var Spec = require('../lib/spec.js');

describe('attrs - Spec Class Functional Check', function () {
    var spec1 = new Spec('lightingColorCtrl', 'attrs');

    spec1.init({
        currentHue: 10,
        currentSaturation: 11,
        colorMode: 1
    });

    it('should has currentHue', function () {
        expect(spec1.has('currentHue')).to.be.true;
    });

    it('should not has currentHueX', function () {
        expect(spec1.has('currentHueX')).to.be.false;
    });

    it('should has currentSaturation', function () {
        expect(spec1.has('currentSaturation')).to.be.true;
    });

    it('should not has currentSaturationX', function () {
        expect(spec1.has('currentSaturationX')).to.be.false;
    });

    it('should has colorMode', function () {
        expect(spec1.has('colorMode')).to.be.true;
    });

    it('should not has colorModeX', function () {
        expect(spec1.has('colorModeX')).to.be.false;
    });

    it('currentHue should equal to 10', function () {
        expect(spec1.get('currentHue')).to.be.equal(10);
        expect(spec1.get('currentHueX')).to.be.undefined;
    });

    it('currentSaturation should equal to 1', function () {
        expect(spec1.get('currentSaturation')).to.be.equal(11);
        expect(spec1.get('currentSaturationX')).to.be.undefined;
    });

    it('colorMode should equal to 1', function () {
        expect(spec1.get('colorMode')).to.be.equal(1);
        expect(spec1.get('colorModeX')).to.be.undefined;
    });

    it('should has driftCompensation after set', function () {
        expect(spec1.set('driftCompensation', 12)).to.be.equal(spec1);
        expect(spec1.get('driftCompensation')).to.be.equal(12);
    });

    it('colorMode should be equal 2 after set', function () {
        expect(spec1.set('colorMode', 2)).to.be.equal(spec1);
        expect(spec1.get('colorMode')).to.be.equal(2);
    });

    it('should dump asynclly', function (done) {
        spec1.dump(function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }

            if (!err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(spec1.dumpSync()).to.be.deep.equal({ currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 });
    });

    it('should read currentHue properly', function (done) {
        spec1.read('currentHue', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 10)
                done();
        });
    });

    it('should read currentSaturation properly', function (done) {
        spec1.read('currentSaturation', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 11)
                done();
        });
    });

    it('should read colorMode properly', function (done) {
        spec1.read('colorMode', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 2)
                done();
        });
    });

    it('should read driftCompensation properly', function (done) {
        spec1.read('driftCompensation', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 12)
                done();
        });
    });

    it('should read nothing when not found', function (done) {
        spec1.read('driftCompensationX', function (err, data) {
            if (err)
                done();
        });
    });

    it('should write currentHue properly', function (done) {
        spec1.write('currentHue', 20, function (err, data) {
            if (data === 20)
                done();
        });
    });

    it('should write currentSaturation properly', function (done) {
        spec1.write('currentSaturation', 21, function (err, data) {
            if (data === 21)
                done();
        });
    });

    it('should write colorMode properly', function (done) {
        spec1.write('colorMode', 3, function (err, data) {
            if (data === 3)
                done();
        });
    });

    it('should write driftCompensation properly', function (done) {
        spec1.write('driftCompensation', 22, function (err, data) {
            if (data === 22)
                done();
        });
    });

    it('should write nothing when not found', function (done) {
        spec1.write('driftCompensationX', 22, function (err, data) {
            if (err)
                done();
        });
    });

    it('should not execute an attr', function (done) {
        spec1.exec('driftCompensation', [], function (err, data) {
            if (err)
                done();
        });
    });

    it('should clear all', function () {
        expect(spec1.clear()).to.be.equal(spec1);
        expect(spec1.dumpSync()).to.be.deep.equal({});
    });

    it('should init something not ZCL-defined', function () {
        spec1.init({
            foo: 10,
            bar: 11
        }, false);

        expect(spec1.dumpSync()).to.be.deep.equal({ foo: 10, bar: 11 });
    });

    it('should init something with read cb', function (done) {
        spec1.init({
            foo: {
                read: function (cb) {
                    cb(null, 100);
                }
            }
        }, false);

        spec1.read('foo', function (err, data) {
            if (data === 100)
                done();
        });
    });


    it('should init something with read cb but write should fail', function (done) {
        spec1.init({
            foo: {
                read: function (cb) {
                    cb(null, 100);
                }
            }
        }, false);

        spec1.write('foo', 'xx', function (err, data) {
            if (err)
                done();
        });
    });

    it('should init something with write cb', function (done) {
        spec1.init({
            bar: {
                write: function (val, cb) {
                    cb(null, val);
                }
            }
        }, false);

        spec1.write('bar', 1000, function (err, data) {
            if (data === 1000)
                done();
        });
    });


    it('should init something with write cb but unredable', function (done) {
        spec1.init({
            bar: {
                write: function (val, cb) {
                    cb(null, val);
                }
            }
        }, false);

        spec1.read('bar', function (err, data) {
            if (err)
                done();
        });
    });

    it('should init something with read/write cb', function (done) {
        var ok = 0;
        spec1.init({
            foo: {
                read: function (cb) {
                    cb(null, 100);
                },
                write: function (val, cb) {
                    cb(null, val);
                }
            }
        }, false);

        spec1.read('foo', function (err, data) {
            if (data === 100) {
                ok++;
                if (ok === 2)
                    done();
            }
        });
        spec1.write('foo', 99, function (err, data) {
            if (data === 99) {
                ok++;
                if (ok === 2)
                    done();
            }
        });
    });

});