var _ = require('busyman'),
    expect = require('chai').expect;

var Spec = require('../lib/spec.js');

describe('dir - Spec Class Functional Check', function () {
    var spec1 = new Spec('lightingColorCtrl', 'dir');

    spec1.init({
        value: 1
    });

    it('should has value', function () {
        expect(spec1.has('value')).to.be.true;
    });

    it('should not has valueX', function () {
        expect(spec1.has('valueX')).to.be.false;
    });

    it('value should equal to 1', function () {
        expect(spec1.get('value')).to.be.equal(1);
        expect(spec1.get('valueX')).to.be.undefined;
    });

    it('value should be equal 1 after set', function () {
        expect(spec1.set('value', 1)).to.be.equal(spec1);
        expect(spec1.get('value')).to.be.equal(1);
    });

    it('should dump asynclly', function (done) {
        spec1.dump(function (err, data) {
          // { value: 1 }
            if (!err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(spec1.dumpSync()).to.be.deep.equal({ value: 1 });
    });

    it('should read value properly', function (done) {
        spec1.read('value', function (err, data) {
            if (data === 1)
                done();
        });
    });

    it('should write value properly', function (done) {
        spec1.write('value', 3, function (err, data) {
            if (data === 3)
                done();
        });
    });

    it('should not execute an direction', function (done) {
        spec1.exec('value', [], function (err, data) {
            if (err)
                done();
        });
    });

    it('should clear all', function () {
        expect(spec1.clear()).to.be.equal(spec1);
        expect(spec1.dumpSync()).to.be.deep.equal({});
    });

    it('should init something else, only accept "value"', function () {
        expect(function () {
            return spec1.init({
                foo: 10
            }, false);
        }).to.throw(Error);
    });

    it('should be a number for "value"', function () {
        expect(function () {
            return spec1.init({
                value: 'xxx'
            }, false);
        }).to.throw(TypeError);
    });
});