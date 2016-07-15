var _ = require('busyman'),
    expect = require('chai').expect;

var Spec = require('../lib/spec.js');

describe('acls - Spec Class Functional Check', function () {
    var spec1 = new Spec('lightingColorCtrl', 'acls');

    spec1.init({
        currentHue: 'R',
        currentSaturation: 'W',
        colorMode: 'RW'
    });

    it('should has value', function () {
        expect(spec1.has('currentHue')).to.be.true;
    });

    it('should not has valueX', function () {
        expect(spec1.has('valueX')).to.be.false;
    });

    it('currentHue should equal to R', function () {
        expect(spec1.get('currentHue')).to.be.equal('R');
    });

    it('currentSaturation should equal to W', function () {
        expect(spec1.get('currentSaturation')).to.be.equal('W');
    });

    it('colorMode should equal to RW', function () {
        expect(spec1.get('colorMode')).to.be.equal('RW');
    });

    it('currentHue should be equal RW after set', function () {
        expect(spec1.set('currentHue', 'rw')).to.be.equal(spec1);
        expect(spec1.get('currentHue')).to.be.equal('RW');
    });

    it('should dump asynclly', function (done) {
        spec1.dump(function (err, data) {
          // { currentHue: 'RW', currentSaturation: 'W', colorMode: 'RW' }
            if (!err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(spec1.dumpSync()).to.be.deep.equal({ currentHue: 'RW', currentSaturation: 'W', colorMode: 'RW' });
    });

    it('should read currentHue properly', function (done) {
        spec1.read('currentHue', function (err, data) {
            if (data === 'RW')
                done();
        });
    });

    it('should write currentSaturation properly', function (done) {
        spec1.write('currentSaturation', 'R', function (err, data) {
            if (data === 'R')
                done();
        });
    });

    it('should throw err by writing currentSaturation with invalid flag', function () {
        expect(function () {
            return spec1.write('currentSaturation', 'RG', function () {}).to.throw(TypeError)
        });
    });

    it('should not execute an acl', function (done) {
        spec1.exec('currentSaturation', [], function (err, data) {
            if (err)
                done();
        });
    });

    it('should clear all', function () {
        expect(spec1.clear()).to.be.equal(spec1);
        expect(spec1.dumpSync()).to.be.deep.equal({});
    });

    it('should init something else', function () {
        expect(function () {
            return spec1.init({
                foo: 'r'
            }, false);
        }).not.to.throw(Error);

        expect(spec1.dumpSync()).to.be.deep.equal({ foo: 'R' });
    });
});