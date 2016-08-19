# ziee
A base class to create clusters and abstract hardware for zigbee applications.  

[![NPM](https://nodei.co/npm/ziee.png?downloads=true)](https://nodei.co/npm/ziee/)  

[![Build Status](https://travis-ci.org/zigbeer/ziee.svg?branch=master)](https://travis-ci.org/zigbeer/ziee)
[![npm](https://img.shields.io/npm/v/ziee.svg?maxAge=2592000)](https://www.npmjs.com/package/ziee)
[![npm](https://img.shields.io/npm/l/ziee.svg?maxAge=2592000)](https://www.npmjs.com/package/ziee)

<br />

## Table of Contents

1. [Overview](#Overview)  
2. [Installation](#Installation)  
3. [Initialization of Clusters](#Initialization)  
4. [Access Clusters](#access)  
5. [Dump Data](#dump)  
5. [APIs](#APIs)  

<br />

<a name="Overview"></a>
## 1. Overview

**ziee** is a Class that helps you create _ZCL Clusters_ in your JavaScript applications. You can use **ziee** as the base class to abstract your hardware, sensor modules, or gadgets into plugins (node.js packages) for your users convenience.  
  

<a name="Installation"></a>
## 2. Installation

> $ npm install ziee --save

<a name="Initialization"></a>
## 3. Initialization of Clusters: Step by step

Here is a quick example that will walk you through the steps of initializing a 'lightingColorCtrl' cluster.  

* **Step 1**: Import the Ziee Class

    ```js
    var Ziee = require('ziee'),
        zApp = {};  //  Your zigbee application, I take a mock object here as an example
    ```

* **Step 2**: New a ziee instance. Then, initialize a 'lightingColorCtrl' cluster in your ziee, including the cluster's (1) direction (2) attributes (3) access control flgas, and (4) zcl commands.

    ```js
    var ziee = new ziee();
    ```

    - Step **(2-1)**: Direction. Tell ziee that this is an input, output, or input/output cluster.  

        ```js
        ziee.init('lightingColorCtrl', 'dir', { value: 1 });    // 1: input, 2: output, 3: input/output
        ```

    - Step **(2-2)**: Attributes. Abstract hardware operation with read/write callbacks if needed. Here, we initialize attributes of 'currentHue', 'currentSaturation', and 'colorMode' as an example.  

        ```js
        ziee.init('lightingColorCtrl', 'attrs', {
            currentHue: 10,             // (A) a simple primitive
            currentSaturation: {        // (B) with read/write method
                read: function (cb) {
                    // ... do something to get data
                    cb(null, data);
                },
                write: function (val, cb) {
                    // ... do something to set data
                    cb(null, val);
                }
            },
            colorMode: {                // (C) with read method
                read: function (cb) {
                    // ... do something to get data
                    cb(null, data);
                }
            }
        }); 
        ```

    - Step **(2-3)**: Access control flgas. Specify the access control of each attribute. The `'acls'` spec is used to control the authority from remote access. The local access depends on read/write methods, not depends on these flags.  

        ```js
        // 'RW': readable and writable, 'R': read-only, 'W': write-only
        ziee.init('lightingColorCtrl', 'acls', {
            currentHue: 'RW',       
            currentSaturation: 'R',
            colorMode: 'R'
        });
        ```

    - Step **(2-4)**: Zcl commands. Define commands that your cluster supports. In each command method, ziee will pass you the `zapp` with 1st argument,  and pass you the `cb` with the last argument. Here, we initialize ZCL commands of 'moveToHue', 'stepHue', and 'stepColor' as an example. 

        ```js
        ziee.init('lightingColorCtrl', 'cmds', {
            moveToHue: function (zapp, movemode, rate, cb) {
                // ... do something, then call the err-first callback
                cb(null, something);
            },
            stepHue: function (zapp, stepmode, stepsize, transtime, cb) {
                // ...
            },
            stepColor: {    // you can also wrap a command within an object by key 'exec'
                exec: function (zapp, argObj, cb) {
                    // argObj = { stepx, stepy, transtime }
                    // ...
                }
            }
        });
        ```

* **Step 3**: Glue your ziee to the zapp.

    ```js
    ziee.glue(zApp);
    ```

    - After glued, invoke ziee.init() again will throw you an error. Which means you have to init every thing before gluing ziee to zapp.

<a name="access"></a>
## 4. Access Clusters

ziee provides you with `read()`, `write()`, `exec()`, `get()`, and `set()` methods to access the clusters. It is highly recommended to use asynchronous read/write methods to access the attributes, especially for those should be got from certain operations, i.e. reading from an ADC, writing to a PWM port.  

### Asynchronous read/write/exec methods

* read(): Asynchronously read the specified _**Attribute**_ value. 
* write(): Asynchronously write a value to the specified _**Attribute**_.
* exec(): Asynchronously execute the specified _Command_.

```js
// read/write methods are only valid to access attributes.
ziee.read('lightingColorCtrl', 'currentHue', function (err, data) {
    if (!err)
        console.log(data);  // 10
});

ziee.write('lightingColorCtrl', 'currentHue', 18, function (err, data) {
    if (!err)
        console.log(data);  // 18
});

// exec method is only valid to commands.
ziee.exec('lightingColorCtrl', 'stepColor', { stepx: 6, stepy: 110, transtime: 20 }, function (err, data) {
    if (!err)
        console.log(data);
});
```

### Synchronous getter and setter

* get(): Synchronously get the specified _Resource_. This getter will return you the raw content of the specified _Resource_.
* set(): Synchronously set a value to the specified _Resource_. This setter will mutate the raw content of the specified _Resource_.

```js
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
```

<a name="dump"></a>
## 5. Dump Data

### Asynchronous dump

```js
// dump all clusters
ziee.dump(function (err, data) {
/*
    {
        lightingColorCtrl: {
            dir: { value: 1 },
            acls: { ... },
            attrs: { ... },
            cmds: { ... }
        },
        ssIasZone: {
            dir: { value: 0 },
            acls: { ... },
            attrs: { ... },
            cmds: { ... }
        },
        ...
    }
*/
});

// dump a cluster
ziee.dump('lightingColorCtrl', function (err, data) {
/*
    {
        dir: { value: 1 },
        acls: { ... },
        attrs: { ... },
        cmds: { ... },
        ...   // if you have some thing more
    }
*/
});

// dump a spec
ziee.dump('lightingColorCtrl', 'acls', function (err, data) {
/*
    {
        currentHue: 'RW',
        currentSaturation: 'R',
        colorMode: 'R'
    }
*/
});
```

### Synchronous dump

```js
// dump acces control flags
ziee.dumpSync('lightingColorCtrl', 'acls');
/*
    {
        currentHue: 'RW',
        currentSaturation: 'R',
        colorMode: 'R'
    }
*/

// dump commands, the function cannot be serialized and it will be 
// dumped into a string '_exec_'
ziee.dumpSync('lightingColorCtrl', 'cmds');
/*
    {
        stepColor: { exec: '_exec_'},
        ...
    }
*/
```

<a name="APIs"></a>
## 6. APIs

* [new Ziee()](#API_ziee)
* [init()](#API_init)
* [glue()](#API_glue)
* [clusterList()](#API_clusterList)
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

<a name="API_ziee"></a>
### new Ziee()
Create an instance of Ziee class. This document will use `ziee` to indicate this kind of instance. A `ziee` can hold many _Clusters_ in it.  

**Arguments:**  

1. (_none_) 

**Returns:**  

* (_Object_): ziee  

**Examples:** 

```js
var Ziee = require('ziee');
var ziee = new Ziee();
```

*************************************************
<a name="API_init"></a>
### init(cid, sid, spec[, isZcl])
Initialize your cluster and all its specs. Here, a `spec` is an object required by the corresponding init procedure.  
  
**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_. Will be turned into a key in string internally.  
2. `sid` (_String_): _Spec Id_, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  
3. `spec` (_Object_): An object holds all _Resources_ (attribues, flags, command methods, ...) corresponding to which `sid` to be initialized.  
4. `isZcl` (_Boolean_): Optional. Force to use ZCL-defined ids if `true`, and default is `true`. If you like to add something that is not ZCL-defined, please init() it with `false` (highly not recommended).  

**Returns:**  

* (_Object_): ziee  

**Examples:** 

```js
ziee.init('lightingColorCtrl', 'dir', { value: 1 });

ziee.init('lightingColorCtrl', 'attrs', {
    currentHue: 10,             // (A) a simple primitive
    currentSaturation: {        // (B) with read/write method
        read: function (cb) {
            // ... do something to get data
            cb(null, data);
        },
        write: function (val, cb) {
            // ... do something to set data
            cb(null, val);
        }
    },
    colorMode: {                // (C) with read method
        read: function (cb) {
            // ... do something to get data
            cb(null, data);
        }
    }
}); 

ziee.init('lightingColorCtrl', 'acls', {
    currentHue: 'RW',
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
        exec: function (zapp, argObj, cb) {
            // argObj = { stepx, stepy, transtime }
            // ...
        }
    }
});
```

*************************************************
<a name="API_glue"></a>
### glue(zapp)
Glue `ziee` to a zapp.  
  
**Arguments:**  

1. (_Object_): zigbee app  

**Returns:**  

* (_Object_): `ziee`   

**Examples:** 

```js
var zApp = {};  //  Your zigbee application, I take a mock object here as an example

// ... do the initialization

ziee.glue(zApp);
```

*************************************************
<a name="API_clusterList"></a>
### clusterList()
Export the input and out cluster lists within this ziee.  
  
**Arguments:**  

1. _none_  

**Returns:**  

* (_Object_): Returns an object with `'in'` and `'out'` properties to show the input and output cluster lists. Each element in the list is a numeric cluster id. 

**Examples:** 

```js
ziee.clusterList();
/*
{
    in: [ 768, 2818, 1280, 513, 257, 6 ],
    out: [ 513, 257, 11, 9, 6 ]
}
*/
```

*************************************************
<a name="API_has"></a>
### has(cid[, sid[, rid]])
To see if `ziee` has the specified _Cluster_, Cluster Spec_, or _Cluster Resource_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target. (_Resource Id_ is also the _Attribute Id_ if `sid == 'attrs'`)  

**Returns:**  

* (_Boolean_): Returns `true` if target exists, otherwise `false`.  

**Examples:** 

```js
ziee.has('lightingColorCtrl', 'cmds', 'stepHue');            // true
ziee.has('lightingColorCtrl', 'cmds', 'xxx');                // false
ziee.has('lightingColorCtrl', 'attrs', 'currentSaturation'); // true
ziee.has('lightingColorCtrl', 'attrs', 'yyy');               // false
ziee.has('lightingColorCtrl', 'acls', 'currentSaturation');  // true
```

*************************************************
<a name="API_get"></a>
### get(cid, sid, rid)
Synchronously get the specified _Resource_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target. (_Resource Id_ is also the _Attribute Id_ if `sid == 'attrs'`)  

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
3. `rid` (_String_ | _Number_): _Resource Id_ of the target. (_Resource Id_ is also the _Attribute Id_ if `sid == 'attrs'`)  
4. `value` (_Primitives_ | _Object_): _Resource_ data or an object with read/write/exec method(s). This method will throw you an error if `value` is given with a function.  

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
### read(cid, attrId, callback)
Asynchronously read the specified _Attribute_ value.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `attrId` (_String_ | _Number_): _Attribute Id_ within the cluster.  
3. `callback` (_Function_): `function (err, data) { ... }`. Will be called when reading is done or any error occurs, where `data` is the _Resource_ value. (When an error occurs, `ziee` will pass you a string like `'_notfound_'` with `data`)  

* This table show you what results may the callback receive:   

|       err      |      data        |       Description                                                   |  
|----------------|------------------|---------------------------------------------------------------------|  
| Error object   | `'_notfound_'`   | _Attribute_ not found.                                              |  
| Error object   | `'_unreadable_'` | _Attribute_ is unreadable.                                          |  
| Error object   | `'_exec_'`       | _Attribute_ is unreadable (Because it is an executable _Resource_). |  
| `null`         | Depends          | _Attribute_ is successfully read.                                   |  

**Returns:**  

* (_none_)  

**Examples:** 

```js
ziee.read('lightingColorCtrl', 'currentHue', function (err, data) {
    if (!err)
        console.log(data);  // 10
});

ziee.read('lightingColorCtrl', 'xxxx', function (err, data) {
    if (err) {
        console.log(err);
        console.log(data);  // '_nofound_'
    }
});
```

*************************************************
<a name="API_write"></a>
### write(cid, attrId, value, callback)
Asynchronously write a value to the specified _Attribute_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `attrId` (_String_ | _Number_): _Attribute Id_ within the cluster.  
3. `value` (_Depends_): The value to write to the specified attribute.  
4. `callback` (_Function_): `function (err, data) { ... }`. Will be called when writing is done or any error occurs, where `data` is the _Attribute_ value. (When an error occurs, `ziee` will pass you a string like `'_notfound_'` with `data`)  

* This table show you what results may the callback receive:   

|       err      |      data        |       Description                                                   |  
|----------------|------------------|---------------------------------------------------------------------|  
| Error object   | `'_notfound_'`   | _Attribute_ not found.                                              |  
| Error object   | `'_unwritable_'` | _Attribute_ is unwritable.                                          |  
| Error object   | `'_exec_'`       | _Attribute_ is unwritable (Becasue it is an executable _Resource_). |  
| `null`         | Depends          | _Attribute_ is successfully write.                                  |  

**Returns:**  

* (_none_)  

**Examples:** 

```js
ziee.write('lightingColorCtrl', 'currentHue', 18, function (err, data) {
    if (!err)
        console.log(data);  // 18
});

ziee.write('lightingColorCtrl', 'xxx', 18, function (err, data) {
    if (err) {
        console.log(err);
        console.log(data);  // '_nofound_'
    }
});
```

*************************************************
<a name="API_exec"></a>
### exec(cid, cmdId, argObj, callback)
Execute the specified _Command_. The executable _Command_ is a ZCL-defined functional procedure.  
  
**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_.
2. `cmdId` (_String_ | _Number_): _Command Id_ within the cluster.
3. `argObj` (_Object_): The parameters required by the command.
4. `callback` (_Function_): `function (err, data) { ... }`. Will be called when execution is performed or any error occurs, where `data` is your command should repond back.
  
* To see what kind of data you should respond back upon receiving a command, please go to [ZCL Functional Command Reference Table](https://github.com/zigbeer/zcl-packet#32-zcl-functional-command-reference-table) for more information.
    - For example, when you receive a **'getWeeklySchedule'** command, you should respond a **'getWeeklyScheduleRsp'** response to the requester.  
* This table shows you what results may the callback receive:   

|       err      |      data          |       Description                                                         |  
|----------------|--------------------|---------------------------------------------------------------------------|  
| Error object   | `'_notfound_'`     | _Resource_ not found.                                                     |  
| Error object   | `'_unexecutable_'` | _Resource_ is unexecutable.                                               |  
| Error object   | `'_badarg_'`       | Input arguments is not an array.                                          |  
| `null`         | Depends            | _Command_ is successfully executed, and `data` depends on [ZCL definition](https://github.com/zigbeer/zcl-packet#32-zcl-functional-command-reference-table). |  

**Returns:**  

* (_none_)  

**Examples:** 

```js
ziee.exec('hvacThermostat', 'getWeeklySchedule', {
    daystoreturn: 110,
    modetoreturn: 20
}, function (err, data) {
    if (!err)
        console.log(data);
/*
    data is 'getWeeklyScheduleRsp' response data obejct defined by ZCL, and
    your exec function should return an object like:

    {
        numoftrans:3,
        dayofweek: 2,
        mode: 1,
        thermoseqmode: 1
    }

    back through the callback.
*/
});
```

*************************************************
<a name="API_dump"></a>
### dump([cid[, sid],] callback)
Asynchronously dump data from `ziee`. This method uses the asynchronous `read()` under the hood.  

* Given with `cid`, `sid`, and a `callback` to dump data of a _Spec_.  
* Given with `cid` and a `callback` to dump data of a _Cluster_.  
* Given with only a `callback` to dump data of all _Clusters_.  

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  
3. `callback` (_Function_): `function (err, data) { }`.  

**Returns:**  

* (none)

**Examples:** 

```js
// (1) Dump all clusters
ziee.dump(function (err, data) {
/*
    {
        lightingColorCtrl: {
            dir: { value: 1 },
            acls: { ... },
            attrs: { ... },
            cmds: { ... }
        },
        ssIasZone: {
            dir: { value: 0 },
            acls: { ... },
            attrs: { ... },
            cmds: { ... }
        },
        ...
    }
*/
});

// (2) Dump a cluster
ziee.dump('lightingColorCtrl', function (err, data) {
/*
    {
        dir: { value: 1 },
        acls: { ... },
        attrs: { ... },
        cmds: { ... },
        ...   // if you have some thing more
    }
*/
});

// (3) Dump a spec
ziee.dump('lightingColorCtrl', 'acls', function (err, data) {
/*
    {
        currentHue: 'RW',
        currentSaturation: 'R',
        colorMode: 'R'
    }
*/
});
```

*************************************************
<a name="API_dumpSync"></a>
### dumpSync([cid[, sid]])
Synchronously dump data from `ziee`. This method uses the synchronous `get()` under the hood.  

* Given with both `cid` and `sid` to dump data of a _Spec_.
* Given with only `cid` to dump data of a _Cluster_.
* Given with no ids to dump data of all _Clusters_.
* This method should only be used at server-side (since at server-side, all stored _Clusters_ are simply data pieces).
* All read/write/exec method will be dump to strings `'_read_'`, `'_write_'`, and `'_exec_'`. If you like to have the function method, use `get()` instead.

**Arguments:**  

1. `cid` (_String_ | _Number_): _Cluster Id_ of the target.  
2. `sid` (_String_): Spec Id_ of the target, which accepts `'dir'`, `'acls'`, `'attrs'`, and `'cmds'`.  

**Returns:**  

* (_Object_): The dumped data, can be from a _Spec_, a _Cluster_, or whole _Clusters_.  

**Examples:** 

```js
ziee.dumpSync('lightingColorCtrl', 'acls');
/* 
    {
       currentHue: 'RW',
       currentSaturation: 'R',
       colorMode: 'R'
    }
*/

ziee.dumpSync('lightingColorCtrl', 'cmds');
/*
    {
      stepColor: { exec: '_exec_'},
      ...
    }
*/
```
