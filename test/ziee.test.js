var _ = require('busyman'),
    expect = require('chai').expect;

var Ziee = require('../lib/ziee.js');
var zapp = {};

describe('acls - Ziee Class Functional Check', function () {
    var ziee = new Ziee(zapp);
    ziee.init('lightingColorCtrl', 'acls', {
        currentHue: 'R',
        currentSaturation: 'W',
        colorMode: 'RW'
    });


    it('should has value', function () {
        expect(ziee.has('lightingColorCtrl', 'acls', 'currentHue')).to.be.true;
    });

    it('should not has valueX', function () {
        expect(ziee.has('lightingColorCtrl', 'acls', 'valueX')).to.be.false;
    });

    it('currentHue should equal to R', function () {
        expect(ziee.get('lightingColorCtrl', 'acls', 'currentHue')).to.be.equal('R');
    });

    it('currentSaturation should equal to W', function () {
        expect(ziee.get('lightingColorCtrl', 'acls', 'currentSaturation')).to.be.equal('W');
    });

    it('colorMode should equal to RW', function () {
        expect(ziee.get('lightingColorCtrl', 'acls', 'colorMode')).to.be.equal('RW');
    });

    it('currentHue should be equal RW after set', function () {
        expect(ziee.set('lightingColorCtrl', 'acls', 'currentHue', 'rw')).to.be.true;
        expect(ziee.get('lightingColorCtrl', 'acls', 'currentHue')).to.be.equal('RW');
    });

    it('should dump asynclly', function (done) {
        ziee.dump('lightingColorCtrl', 'acls', function (err, data) {
          // { currentHue: 'RW', currentSaturation: 'W', colorMode: 'RW' }
            if (!err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(ziee.dumpSync('lightingColorCtrl', 'acls')).to.be.deep.equal({ currentHue: 'RW', currentSaturation: 'W', colorMode: 'RW' });
    });


    it('should throw err by writing currentSaturation with invalid flag', function () {
        expect(function () {
            return ziee.set('lightingColorCtrl', 'acls', 'currentSaturation', 'RG', function () {}).to.throw(TypeError)
        });
    });

    it('should init something else', function () {
        expect(function () {
            return ziee.init('lightingColorCtrl', 'acls', {
                foo: 'r'
            }, false);
        }).not.to.throw(Error);

        expect(ziee.dumpSync('lightingColorCtrl', 'acls')).to.be.deep.equal({ foo: 'R' });
        expect(ziee.dumpSync('lightingColorCtrl')).to.be.deep.equal({ acls: { foo: 'R' } });
        expect(ziee.dumpSync()).to.be.deep.equal({ lightingColorCtrl: { acls: { foo: 'R' } } });
    });

    it('should dump acls asynclly', function (done) {
        ziee.dump('lightingColorCtrl', 'acls', function (err, data) {
            if (data.foo === 'R')
                done();
        });
    });

    it('should dump lightingColorCtrl asynclly', function (done) {
        ziee.dump('lightingColorCtrl', function (err, data) {
            if (data.acls.foo === 'R')
                done();
        });
    });

    it('should dump ziee asynclly', function (done) {
        ziee.dump(function (err, data) {
            if (data.lightingColorCtrl.acls.foo === 'R')
                done();
        });
    });
});

describe('dir - Ziee Class Functional Check', function () {
    var ziee = new Ziee(zapp);
    ziee.init('lightingColorCtrl', 'dir', {
        value: 1
    });

    it('should has value', function () {
        expect(ziee.has('lightingColorCtrl', 'dir', 'value')).to.be.true;
    });

    it('should not has valueX', function () {
        expect(ziee.has('lightingColorCtrl', 'dir', 'valueX')).to.be.false;
    });

    it('value should equal to 1', function () {
        expect(ziee.get('lightingColorCtrl', 'dir', 'value')).to.be.equal(1);
        expect(ziee.get('lightingColorCtrl', 'dir', 'valueX')).to.be.undefined;
    });

    it('value should be equal 1 after set', function () {
        expect(ziee.set('lightingColorCtrl', 'dir', 'value', 1)).to.be.true;
        expect(ziee.get('lightingColorCtrl', 'dir', 'value')).to.be.equal(1);
    });

    it('should dump asynclly', function (done) {
        ziee.dump('lightingColorCtrl', 'dir', function (err, data) {
          // { value: 1 }
            if (data.value === 1)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(ziee.dumpSync('lightingColorCtrl', 'dir')).to.be.deep.equal({ value: 1 });
    });

    it('should init something else, only accept "value"', function () {
        expect(function () {
            return ziee.init('lightingColorCtrl', 'dir', {
                foo: 10
            }, false);
        }).to.throw(Error);
    });

    it('should be a number for "value"', function () {
        expect(function () {
            return ziee.init('lightingColorCtrl', 'dir', {
                value: 'xxx'
            }, false);
        }).to.throw(TypeError);
    });
});

describe('cmds - Ziee Class Functional Check', function () {
    var ziee = new Ziee(zapp);
    var theSpec = {
        moveToHue: function () {},
        moveHue: {
            exec: function () {}
        }
    };
    ziee.init('lightingColorCtrl', 'cmds', theSpec);

    it('should has moveToHue', function () {
        expect(ziee.has('lightingColorCtrl', 'cmds', 'moveToHue')).to.be.true;
    });

    it('should not has moveToHue', function () {
        expect(ziee.has('lightingColorCtrl', 'cmds', 'moveToHueX')).to.be.false;
    });

    it('moveToHue should equal to { exec }', function () {
        expect(ziee.get('lightingColorCtrl', 'cmds', 'moveToHue').exec).to.be.equal(theSpec.moveToHue);
    });

    it('moveHue should equal to { exec }', function () {
        expect(ziee.get('lightingColorCtrl', 'cmds', 'moveHue').exec).to.be.equal(theSpec.moveHue.exec);
    });

    it('moveHue should be equal new method after set', function () {
        var method2 = function (zapp, argObj, cb) {
            cb(null, argObj);
        };
        expect(ziee.set('lightingColorCtrl', 'cmds', 'moveHue', method2)).to.be.true;
        expect(ziee.get('lightingColorCtrl', 'cmds', 'moveHue').exec).to.be.equal(method2);
    });

    it('should not dump - unredable', function (done) {
        ziee.dump('lightingColorCtrl', 'cmds', function (err, data) {
            if (err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(ziee.dumpSync('lightingColorCtrl', 'cmds')).to.be.deep.equal({ moveHue: { exec: "_exec_"}, moveToHue: { exec: "_exec_"} });
    });

    it('should execute', function (done) {
        ziee.exec('cmd', 'lightingColorCtrl', 'moveHue', { x: 'hi', y: 'hello' }, function (err, data) {
            if (data.x === 'hi' && data.y === 'hello')
                done();
        });
    });

    it('should init something else', function () {
        var sp = {
                foo: function () {}
            };

        expect(function () {
            return ziee.init('lightingColorCtrl', 'cmds', sp, false);
        }).not.to.throw(Error);
        expect(ziee.dumpSync('lightingColorCtrl', 'cmds')).to.be.deep.equal({ foo: { exec: '_exec_' } });
    });
});

describe('cmdRsps - Ziee Class Functional Check', function () {
    var ziee = new Ziee(zapp);
    var theSpec = {
        statusChangeNotification: function () {},
        enrollReq: {
            exec: function () {}
        }
    };
    ziee.init('ssIasZone', 'cmdRsps', theSpec);

    it('should has statusChangeNotification', function () {
        expect(ziee.has('ssIasZone', 'cmdRsps', 'statusChangeNotification')).to.be.true;
    });

    it('should not has statusChangeNotification', function () {
        expect(ziee.has('ssIasZone', 'cmdRsps', 'statusChangeNotificationX')).to.be.false;
    });

    it('statusChangeNotification should equal to { exec }', function () {
        expect(ziee.get('ssIasZone', 'cmdRsps', 'statusChangeNotification').exec).to.be.equal(theSpec.statusChangeNotification);
    });

    it('enrollReq should equal to { exec }', function () {
        expect(ziee.get('ssIasZone', 'cmdRsps', 'enrollReq').exec).to.be.equal(theSpec.enrollReq.exec);
    });

    it('enrollReq should be equal new method after set', function () {
        var method2 = function (zapp, argObj, cb) {
            cb(null, argObj);
        };
        expect(ziee.set('ssIasZone', 'cmdRsps', 'enrollReq', method2)).to.be.true;
        expect(ziee.get('ssIasZone', 'cmdRsps', 'enrollReq').exec).to.be.equal(method2);
    });

    it('should not dump - unredable', function (done) {
        ziee.dump('ssIasZone', 'cmdRsps', function (err, data) {
            if (err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(ziee.dumpSync('ssIasZone', 'cmdRsps')).to.be.deep.equal({ enrollReq: { exec: "_exec_"}, statusChangeNotification: { exec: "_exec_"} });
    });

    it('should execute', function (done) {
        ziee.exec('cmdRsp', 'ssIasZone', 'enrollReq', { x: 'hi', y: 'hello' }, function (err, data) {
            if (data.x === 'hi' && data.y === 'hello')
                done();
        });
    });

    it('should init something else', function () {
        var sp = {
                foo: function () {}
            };

        expect(function () {
            return ziee.init('ssIasZone', 'cmdRsps', sp, false);
        }).not.to.throw(Error);
        expect(ziee.dumpSync('ssIasZone', 'cmdRsps')).to.be.deep.equal({ foo: { exec: '_exec_' } });
    });
});

describe('attrs - Ziee Class Functional Check', function () {
    var ziee = new Ziee(zapp);
    ziee.init('lightingColorCtrl', 'attrs', {
        currentHue: 10,
        currentSaturation: 11,
        colorMode: 1
    });

    it('should has currentHue', function () {
        expect(ziee.has('lightingColorCtrl', 'attrs', 'currentHue')).to.be.true;
    });

    it('should not has currentHueX', function () {
        expect(ziee.has('lightingColorCtrl', 'attrs', 'currentHueX')).to.be.false;
    });

    it('should has currentSaturation', function () {
        expect(ziee.has('lightingColorCtrl', 'attrs', 'currentSaturation')).to.be.true;
    });

    it('should not has currentSaturationX', function () {
        expect(ziee.has('lightingColorCtrl', 'attrs', 'currentSaturationX')).to.be.false;
    });

    it('should has colorMode', function () {
        expect(ziee.has('lightingColorCtrl', 'attrs', 'colorMode')).to.be.true;
    });

    it('should not has colorModeX', function () {
        expect(ziee.has('lightingColorCtrl', 'attrs', 'colorModeX')).to.be.false;
    });

    it('currentHue should equal to 10', function () {
        expect(ziee.get('lightingColorCtrl', 'attrs', 'currentHue')).to.be.equal(10);
        expect(ziee.get('lightingColorCtrl', 'attrs', 'currentHueX')).to.be.undefined;
    });

    it('currentSaturation should equal to 1', function () {
        expect(ziee.get('lightingColorCtrl', 'attrs', 'currentSaturation')).to.be.equal(11);
        expect(ziee.get('lightingColorCtrl', 'attrs', 'currentSaturationX')).to.be.undefined;
    });

    it('colorMode should equal to 1', function () {
        expect(ziee.get('lightingColorCtrl', 'attrs', 'colorMode')).to.be.equal(1);
        expect(ziee.get('lightingColorCtrl', 'attrs', 'colorModeX')).to.be.undefined;
    });

    it('should has driftCompensation after set', function () {
        expect(ziee.set('lightingColorCtrl', 'attrs', 'driftCompensation', 12)).to.be.true;
        expect(ziee.get('lightingColorCtrl', 'attrs', 'driftCompensation')).to.be.equal(12);
    });

    it('colorMode should be equal 2 after set', function () {
        expect(ziee.set('lightingColorCtrl', 'attrs', 'colorMode', 2)).to.be.true;
        expect(ziee.get('lightingColorCtrl', 'attrs', 'colorMode')).to.be.equal(2);
    });

    it('should dump asynclly', function (done) {
        ziee.dump('lightingColorCtrl', 'attrs', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (!err)
                done();
        });
    });

    it('should dump syncly', function () {
        expect(ziee.dumpSync('lightingColorCtrl', 'attrs')).to.be.deep.equal({ currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 });
    });

    it('should read currentHue properly', function (done) {
        ziee.read('lightingColorCtrl', 'currentHue', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 10)
                done();
        });
    });

    it('should read currentSaturation properly', function (done) {
        ziee.read('lightingColorCtrl', 'currentSaturation', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 11)
                done();
        });
    });

    it('should read colorMode properly', function (done) {
        ziee.read('lightingColorCtrl', 'colorMode', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 2)
                done();
        });
    });

    it('should read driftCompensation properly', function (done) {
        ziee.read('lightingColorCtrl', 'driftCompensation', function (err, data) {
          // { currentHue: 10, currentSaturation: 11, colorMode: 2, driftCompensation: 12 }
            if (data === 12)
                done();
        });
    });

    it('should read nothing when not found', function (done) {
        ziee.read('lightingColorCtrl', 'driftCompensationX', function (err, data) {
            if (err)
                done();
        });
    });

    it('should write currentHue properly', function (done) {
        ziee.write('lightingColorCtrl', 'currentHue', 20, function (err, data) {
            if (data === 20)
                done();
        });
    });

    it('should write currentSaturation properly', function (done) {
        ziee.write('lightingColorCtrl', 'currentSaturation', 21, function (err, data) {
            if (data === 21)
                done();
        });
    });

    it('should write colorMode properly', function (done) {
        ziee.write('lightingColorCtrl', 'colorMode', 3, function (err, data) {
            if (data === 3)
                done();
        });
    });

    it('should write driftCompensation properly', function (done) {
        ziee.write('lightingColorCtrl', 'driftCompensation', 22, function (err, data) {
            if (data === 22)
                done();
        });
    });

    it('should write nothing when not found', function (done) {
        ziee.write('lightingColorCtrl', 'driftCompensationX', 22, function (err, data) {
            if (err)
                done();
        });
    });

    it('should not execute an attr', function (done) {
        ziee.exec('lightingColorCtrl', 'driftCompensation', {}, function (err, data) {
            if (err)
                done();
        });
    });

    it('should init something not ZCL-defined', function () {
        ziee.init('lightingColorCtrl', 'attrs', {
            foo: 10,
            bar: 11
        }, false);

        expect(ziee.dumpSync('lightingColorCtrl', 'attrs')).to.be.deep.equal({ foo: 10, bar: 11 });
    });

    it('should init something with read cb', function (done) {
        ziee.init('lightingColorCtrl', 'attrs', {
            foo: {
                read: function (cb) {
                    cb(null, 100);
                }
            }
        }, false);

        ziee.read('lightingColorCtrl', 'foo', function (err, data) {
            if (data === 100)
                done();
        });
    });

    it('should init something with read cb but write should fail', function (done) {
        ziee.init('lightingColorCtrl', 'attrs', {
            foo: {
                read: function (cb) {
                    cb(null, 100);
                }
            }
        }, false);

        ziee.write('lightingColorCtrl', 'foo', 'xx', function (err, data) {
            if (err)
                done();
        });
    });

    it('should init something with write cb', function (done) {
        ziee.init('lightingColorCtrl', 'attrs', {
            bar: {
                write: function (val, cb) {
                    cb(null, val);
                }
            }
        }, false);

        ziee.write('lightingColorCtrl', 'bar', 1000, function (err, data) {
            if (data === 1000)
                done();
        });
    });


    it('should init something with write cb but unredable', function (done) {
        ziee.init('lightingColorCtrl', 'attrs', {
            bar: {
                write: function (val, cb) {
                    cb(null, val);
                }
            }
        }, false);
        ziee.read('lightingColorCtrl', 'bar', function (err, data) {
            if (err)
                done();
        });
    });

    it('should init something with read/write cb', function (done) {
        var ok = 0;
        ziee.init('lightingColorCtrl', 'attrs', {
            foo: {
                read: function (cb) {
                    cb(null, 100);
                },
                write: function (val, cb) {
                    cb(null, val);
                }
            }
        }, false);

        ziee.read('lightingColorCtrl', 'foo', function (err, data) {
            if (data === 100) {
                ok++;
                if (ok === 2)
                    done();
            }
        });

        ziee.write('lightingColorCtrl', 'foo', 99, function (err, data) {
            if (data === 99) {
                ok++;
                if (ok === 2)
                    done();
            }
        });
    });
});

describe('attrs - Ziee Class Functional Check', function () {
    var ziee = new Ziee(zapp);
    ziee.init('lightingColorCtrl', 'dir', { value: 1 });
    ziee.init('haApplianceEventsAlerts', 'dir', { value: 1 });
    ziee.init('ssIasZone', 'dir', { value: 1 });
    ziee.init('hvacThermostat', 'dir', { value: 3 });
    ziee.init('closuresDoorLock', 'dir', { value: 3 });
    ziee.init('genRssiLocation', 'dir', { value: 2 });
    ziee.init('genAlarms', 'dir', { value: 2 });
    ziee.init('genOnOff', 'dir', { value: 3 });

    it('should export correct cluster list', function () {
        expect(ziee.clusterList()).to.be.deep.equal({
            in: [ 768, 2818, 1280, 513, 257, 6 ],
            out: [ 513, 257, 11, 9, 6 ]
        });
    });
});
