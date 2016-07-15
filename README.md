# ziee

smartobject
========================

[![NPM](https://nodei.co/npm/smartobject.png?downloads=true)](https://nodei.co/npm/ziee/)  

[![Build Status](https://travis-ci.org/PeterEB/smartobject.svg?branch=develop)](https://travis-ci.org/zigbeer/ziee)
[![npm](https://img.shields.io/npm/v/smartobject.svg?maxAge=2592000)](https://www.npmjs.com/package/ziee)
[![npm](https://img.shields.io/npm/l/smartobject.svg?maxAge=2592000)](https://www.npmjs.com/package/ziee)

## Table of Contents

1. [Overview](#Overview)  
2. [Installation](#Installation)  
3. [Usage](#Usage)  
4. [Resources Planning](#Resources)  
5. [APIs](#APIs)  


<a name="Overview"></a>
## 1. Overview

**ziee** is a Class that helps you create _ZCL Clusters_ in your JavaScript applications. You can use **ziee** as the base class to abstract your hardware, sensor modules, or gadgets into plugins (node.js packages) for your users convenience.  
  

<a name="Installation"></a>
## 2. Installation

> $ npm install ziee --save

<a name="Usage"></a>
## 3. Usage

Here is a quick example to show you how to create your _Clusters_ with only few steps:

```js
// Step 1: Import the Ziee Class
var Ziee = require('ziee');
var zApp = {};              //  Your zigbee application, I take a mock object here as an example

// Step 2: New a ziee instance to have all your attributes, access control flgas, zcl commands, and direction in it
var ziee = new ziee(zApp);

// Step 3: Initialize a 'lightingColorCtrl' Cluster in your `ziee`, with its attributes, access control flags, .etc.  

ziee.init('lightingColorCtrl', 'dir', { value: 1 });    // direction accepts an object with a key 'value' only
ziee.init('lightingColorCtrl', 'attrs', {
    currentHue: 10,             // (1) a simple primitive
    currentSaturation: {        // (2) with read/write method
        read: function (cb) {
            // ... get your data from some operations
            cb(null, data);
        },
        write: function (val, cb) {
            // ... write the value with some operations
            cb(null, val);
        }
    },
    colorMode: {                // (3) with read method
        read: function (cb) {
            // ... get your data from some operations
            cb(null, data);
        }
    }
}); 

ziee.init('lightingColorCtrl', 'acls', {    // acls are often used to control the authority from remote access
    currentHue: 'RW',                       // local access depends on read/write methods, not depends on flags
    currentSaturation: 'R',
    colorMode: 'R'
});

ziee.init('lightingColorCtrl', 'cmds', {
    moveToHue: function (zapp, movemode, rate, cb) {
        // ziee will pass zapp with 1st argument, and pass cb to the last argument to you

        // ... do something, then call the err-first callback
        cb(null, something);
    },
    stepHue: function (zapp, stepmode, stepsize, transtime, cb) {
        // ...
    },
    stepColor: {    // you can also wrap a command within an object by key 'exec'
        exec: function (zapp, stepx, stepy, transtime, cb) {
            // ...
        }
    }
});


// Step 4: Accesss your cluters
//   >> 4-1: getter and setter
ziee.get('lightingColorCtrl', 'dir', 'value');          // 1
ziee.get('lightingColorCtrl', 'attrs', 'currentHue');   // 10
ziee.get('lightingColorCtrl', 'attrs', 'colorMode');    // { read: function () { ... }, _isCb: true }
ziee.get('lightingColorCtrl', 'acls', 'currentHue');    // 'RW'
ziee.get('lightingColorCtrl', 'cmds', 'moveToHue');     // { exec: function () { ... } }

ziee.set('lightingColorCtrl', 'dir', 'value', 0);
ziee.set('lightingColorCtrl', 'attrs', 'currentHue', 6);
ziee.set('lightingColorCtrl', 'acls', 'currentHue', 'W');
ziee.set('lightingColorCtrl', 'cmds', 'stepColor', function (zapp, stepx, stepy, transtime, cb) {
    // ...
});

//   >> 4-2: Asynchronous read/write attributes.
//           Be careful, read/write methods are only valid to access attributes.
ziee.read('lightingColorCtrl', 'currentHue', function (err, data) {
    if (!err)
        console.log(data);  // 10
});

ziee.write('lightingColorCtrl', 'currentHue', 18, function (err, data) {
    if (!err)
        console.log(data);  // 18
});

//   >> 4-3: Asynchronous execute zcl command.
//           Be careful, exec method is only valid to commands.
ziee.exec('lightingColorCtrl', 'stepColor', [ 6, 110, 20 ], function (err, data) {
    // paramerts: [ stepx, stepy, transtime ] should be wrapped up in an array
    if (!err)
        console.log(data);
});

//   >> 4-4: Asynchronous dump
ziee.dump(function (err, data) {    // dump all clusters
//    {
//        lightingColorCtrl: {
//            dir: { value: 1 },
//            acls: { ... },
//            attrs: { ... },
//            cmds: { ... }
//        },
//        ssIasZone: {
//            dir: { value: 0 },
//            acls: { ... },
//            attrs: { ... },
//            cmds: { ... }
//        },
//        ...
//    }
});

ziee.dump('lightingColorCtrl', function (err, data) {    // dump a cluster
//    {
//        dir: { value: 1 },
//        acls: { ... },
//        attrs: { ... },
//        cmds: { ... },
//        ...   // if you have some thing more
//    }
});

ziee.dump('lightingColorCtrl', 'acls', function (err, data) {    // dump a spec
//    {
//        currentHue: 'RW',
//        currentSaturation: 'R',
//        colorMode: 'R'
//    }
});

//   >> 4-5: Synchronous dump
ziee.dumpSync('lightingColorCtrl', 'acls');
//    {
//        currentHue: 'RW',
//        currentSaturation: 'R',
//        colorMode: 'R'
//    }
});

ziee.dumpSync('lightingColorCtrl', 'cmds');
//    {
//        stepColor: { exec: '_exec_'},
//        ...
//    }
});
```

<a name="Resources"></a>
## 4. Resources Planning

TBD: see examples in [usage](#Usage);

<a name="APIs"></a>
## 5. APIs

* [new Ziee()](#API_ziee)
* [init()](#API_init)
* [has()](#API_has)
* [get()](#API_get)
* [set()](#API_set)
* [read()](#API_read)
* [write()](#API_write)
* [exec()](#API_exec)
* [dump()](#API_dump)
* [dumpSync()](#API_dumpSync)


*************************************************
## Ziee Class
Exposed by `require('ziee')`.  

<a name="API_smartobject"></a>
### new Ziee(zapp)
Create a new instance of Ziee class. This document will use `ziee` to indicate this kind of instance. A `ziee` can hold many _Clusters_ in it.  

**Arguments:**  

1. zapp (_Object_): Your application. You can use `ziee.zapp` to refer to your app in read/write/exec callbacks.  

**Returns:**  

* (_Object_): ziee  

**Examples:** 

```js
var Ziee = require('ziee');
var myApp = {}; // yours must be more complicated

var ziee = new Ziee(myApp);
```

*************************************************
<a name="API_init"></a>
### init(cid, sid, resrcs[, isZcl])
Initialize your cluster and all its specs.  
  
**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_. Will be turned into a key in string internally.  
2. `sid` (_String_): _Spec Id_, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  
3. `resrcs` (_Object_): An object holds all resources (attribues, flags, command methods, ...) in your spec.  
4. `isZcl` (_Boolean_): Force to use ZCL-defined ids if `true`, and default is `true`. If you like to add something that is not ZCL-defined, please init() it wirh `isZcl=false`.   

**Returns:**  

* (_Object_): The initialized _Cluster_.  

**Examples:** 

```js
ziee.init('lightingColorCtrl', 'dir', { value: 1 });    // direction accepts an object with a key 'value' only
ziee.init('lightingColorCtrl', 'attrs', {
    currentHue: 10,             // (1) a simple primitive
    currentSaturation: {        // (2) with read/write method
        read: function (cb) {
            // ... get your data from some operations
            cb(null, data);
        },
        write: function (val, cb) {
            // ... write the value with some operations
            cb(null, val);
        }
    },
    colorMode: {                // (3) with read method
        read: function (cb) {
            // ... get your data from some operations
            cb(null, data);
        }
    }
}); 

ziee.init('lightingColorCtrl', 'acls', {    // acls are often used to control the authority from remote access
    currentHue: 'RW',                       // local access depends on read/write methods, not depends on flags
    currentSaturation: 'R',
    colorMode: 'R'
});

ziee.init('lightingColorCtrl', 'cmds', {
    moveToHue: function (zapp, movemode, rate, cb) {
        // ziee will pass zapp with 1st argument, and pass cb to the last argument to you

        // ... do something, then call the err-first callback
        cb(null, something);
    },
    stepHue: function (zapp, stepmode, stepsize, transtime, cb) {
        // ...
    },
    stepColor: {    // you can also wrap a command within an object by key 'exec'
        exec: function (zapp, stepx, stepy, transtime, cb) {
            // ...
        }
    }
});
```

*************************************************
<a name="API_clusterList"></a>
### clusterList()
[TBD] don't use it  
  
**Arguments:**  

1. _none_  

**Returns:**  

* (_Array_): Returns   

**Examples:** 

```js

```

*************************************************
<a name="API_has"></a>
### has(cid[, sid[, rid]])
To see if `ziee` has the specified _Cluster_, Cluster Spec_, or _Cluster Resource_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   

**Returns:**  

* (_Boolean_): Returns `true` if target exists, otherwise `false`.  

**Examples:** 

```js
ziee.has('lightingColorCtrl, 'cmds', 'stepHue');            // true
ziee.has('lightingColorCtrl, 'cmds', 'xxx');                // false
ziee.has('lightingColorCtrl, 'attrs', 'currentSaturation'); // true
ziee.has('lightingColorCtrl, 'attrs', 'yyy');               // false
ziee.has('lightingColorCtrl, 'acls', 'currentSaturation');  // true

```

*************************************************
<a name="API_get"></a>
### get(cid, sid, rid)
Synchronously get the specified _Resource_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   

**Returns:**  

* (_Depends_): Returns the _Resource_ value, or `undefined` if _Resource_ does not exist.  

**Examples:** 

```js
ziee.get('lightingColorCtrl', 'dir', 'value');          // 1
ziee.get('lightingColorCtrl', 'attrs', 'currentHue');   // 10
ziee.get('lightingColorCtrl', 'attrs', 'colorMode');    // { read: function () { ... }, _isCb: true }
ziee.get('lightingColorCtrl', 'attrs', 'xxx');          // undefined
ziee.get('lightingColorCtrl', 'acls', 'currentHue');    // 'RW'
ziee.get('lightingColorCtrl', 'acls', 'yyy');           // undefined
ziee.get('lightingColorCtrl', 'cmds', 'moveToHue');     // { exec: function () { ... } }
```

*************************************************
<a name="API_set"></a>
### set(cid, sid, rid, value)
Synchronously set a value to the specified _Resource_.  


**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
4. `value` (_Primitives_ | _Object_): _Resource_ data or an object with read/write/exec method(s). This method will throw if `value` is given with a function.  

**Returns:**  

* (_Boolean_): Returns `true` if set successfully, else returns `false` if the _Cluster_ does not exist (_Resource_ cannot be set).  

**Examples:** 

```js
ziee.set('lightingColorCtrl', 'dir', 'value', 0);
ziee.set('lightingColorCtrl', 'attrs', 'currentHue', 6);
ziee.set('lightingColorCtrl', 'acls', 'currentHue', 'W');
ziee.set('lightingColorCtrl', 'cmds', 'stepColor', function (zapp, stepx, stepy, transtime, cb) {
    // ...
});
```

*************************************************
<a name="API_read"></a>
### read(cid, rid, callback[, opt])
Asynchronously read the specified _Resource_ value.  
Be careful, there is no need to put `sid` in the argument. Read is only valid upon attributes.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
3. `callback` (_Function_): `function (err, data) { ... }`. Will be called when reading is done or any error occurs, where `data` is the _Resource_ value. (When an error occurs, `so` will pass you a string like `'_notfound_'` with `data`, you can use it as a hint to choose a status code to respond back to the requester.)  

* This table show you what results may the callback receive:   

|       err      |      data        |       Description                                                  |  
|----------------|------------------|--------------------------------------------------------------------|  
| Error object   | `'_notfound_'`   | _Resource_ not found.                                              |  
| Error object   | `'_unreadable_'` | _Resource_ is unreadable.                                          |  
| Error object   | `'_exec_'`       | _Resource_ is unreadable (Because it is an executable _Resource_). |  
| `null`         | Depends          | _Resource_ is successfully read.                                   |  

**Returns:**  

* (_none_)  

**Examples:** 

```js
ziee.read('lightingColorCtrl', 'currentHue', function (err, data) {
    if (!err)
        console.log(data);  // 10
});

ziee.read('lightingColorCtrl', 'xxxx', function (err, data) {
    if (err)
        console.log(data);  // '_nofound_'
});
```

*************************************************
<a name="API_write"></a>
### write(cid, rid, value, callback[)
Asynchronously write a value to the specified _Resource_.  
Be careful, there is no need to put `sid` in the argument. Write is only valid upon attributes.

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
3. `value` (_Depends_): The value to write to the specified _Resource_.  
4. `callback` (_Function_): `function (err, data) { ... }`. Will be called when reading is done or any error occurs, where `data` is the _Resource_ value. (When an error occurs, `so` will pass you a string like `'_notfound_'` with `data`, you can use it as a hint to choose a status code to respond back to the requester.)  

* This table show you what results may the callback receive:   

|       err      |      data        |       Description                                                  |  
|----------------|------------------|--------------------------------------------------------------------|  
| Error object   | `'_notfound_'`   | _Resource_ not found.                                              |  
| Error object   | `'_unwritable_'` | _Resource_ is unwritable.                                          |  
| Error object   | `'_exec_'`       | _Resource_ is unwritable (Becasue it is an executable _Resource_). |  
| `null`         | Depends          | _Resource_ is successfully write.                                  |  


**Returns:**  

* (_none_)  

**Examples:** 

```js
ziee.write('lightingColorCtrl', 'currentHue', 18, function (err, data) {
    if (!err)
        console.log(data);  // 18
});

ziee.write('lightingColorCtrl', 'xxx', 18, function (err, data) {
    if (err)
        console.log(data);  // '_nofound_'
});
```

*************************************************
<a name="API_exec"></a>
### exec(cid, rid, args, callback)
Execute the specified _Resource_. The executable _Resource_ is a procedure you've defined, for example, blinking a led for _N_ times when the _Resource_ is invoked.  
  
Be careful, there is no need to put `sid` in the argument. Exec is only valid upon commands.
  
**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
3. `args` (_Array_): The parameters required by the command.  
5. `callback` (_Function_): `function (err, data) { ... }`. Will be called when execution is performed or any error occurs, where `data` is your command should repond back.  
  
* This table show you what results may the callback receive:   

|       err      |      data          |       Description                                                  |  
|----------------|--------------------|--------------------------------------------------------------------|  
| Error object   | `'_notfound_'`     | _Resource_ not found.                                              |  
| Error object   | `'_unexecutable_'` | _Resource_ is unexecutable.                                        |  
| Error object   | `'_badarg_'`       | Input arguments is not an array.                                   |  
| `null`         | Depends            | _Resource_ is successfully executed, `data` depends on your will.  |  

**Returns:**  

* (_none_)  

**Examples:** 

```js
ziee.exec('hvacThermostat', 'getWeeklySchedule', [ 110, 20 ], function (err, data) {
    // paramerts: [ daystoreturn, modetoreturn ] should be wrapped up in an array
    if (!err)
        console.log(data);

    // data is 'getWeeklyScheduleRsp' obejct
    // {
    //     numoftrans:3,
    //     dayofweek: 2,
    //     mode: 1,
    //     thermoseqmode: 1
    // }
});
```

*************************************************
<a name="API_dump"></a>
### dump([cid[, sid],] callback)
Asynchronously dump data from `ziee`. This dumping method uses the asynchronous `read()` under the hood.  

* Given with `cid`, `sid`, and a `callback` to dump data of a _Spec_.  
* Given with `cid` and a `callback` to dump data of a _Cluster_.  
* Given with only a `callback` to dump data of whole _Clusters_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  
3. `callback` (_Function_): `function (err, data) { }`.  

**Returns:**  

* (none)

**Examples:** 

```js
ziee.dump(function (err, data) {    // dump all clusters
//    {
//        lightingColorCtrl: {
//            dir: { value: 1 },
//            acls: { ... },
//            attrs: { ... },
//            cmds: { ... }
//        },
//        ssIasZone: {
//            dir: { value: 0 },
//            acls: { ... },
//            attrs: { ... },
//            cmds: { ... }
//        },
//        ...
//    }
});

ziee.dump('lightingColorCtrl', function (err, data) {    // dump a cluster
//    {
//        dir: { value: 1 },
//        acls: { ... },
//        attrs: { ... },
//        cmds: { ... },
//        ...   // if you have some thing more
//    }
});

ziee.dump('lightingColorCtrl', 'acls', function (err, data) {    // dump a spec
//    {
//        currentHue: 'RW',
//        currentSaturation: 'R',
//        colorMode: 'R'
//    }
});
```

*************************************************
<a name="API_dumpSync"></a>
### dumpSync([cid[, sid]])
Synchronously dump data from `ziee`. This dumping method uses the synchronous `get()` under the hood. This method should only be used at server-side (since at server-side, all stored _Clusters_ are simply data pieces).  
  
All read/write/exec method will be dump to strings `'_read_'`, `'_write_'`, and `'_exec_'`. If you like to have the function method, use get().  

* Given with both `cid` and `sid` to dump data of a _Spec_.  
* Given with only `cid` to dump data of a _Cluster_.  
* Given with no ids to dump data of whole _Clusters_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  

**Returns:**  

* (_Object_): The dumped data, can be from a _Spec_, a _Cluster_, or whole _Clusters_.  

**Examples:** 

```js
ziee.dumpSync('lightingColorCtrl', 'acls');
//    {
//        currentHue: 'RW',
//        currentSaturation: 'R',
//        colorMode: 'R'
//    }
});

ziee.dumpSync('lightingColorCtrl', 'cmds');
//    {
//        stepColor: { exec: '_exec_'},
//        ...
//    }
});
```
