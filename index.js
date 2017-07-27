 'use strict';

/**
* The asyncRunner works in two ways with a different set of parameters
* First one
* @param {number} limit
* @param {array} tasks : array of functions with a cb parameter
* @param {function} callback
* Second one
* @param {number} limit
* @param {array} tasks : array of objects
* @param {function} asyncFunc : (param : object, cb : function) => {... cb(err, result); }
* @param {function} callback
* 
**/

module.exports = (function () {
    function validate (args) {
        if (typeof args[0] !== 'number') {
            throw new Error('first argument should be number');
        }
        if (!Array.isArray(args[1])) {
            throw new Error('second argument should be array');
        }
        if (typeof args[2] !== 'function') {
            throw new Error('third argument should be function');
        }
    }
    function promisifyAll (tasks, fn) {
        const promises = tasks.map((task) => {
            return new Promise((resolve, reject) => {
                const cb = (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                };
                fn ? fn(task, cb) : task(cb);
            });
        });
        return Promise.all(promises);
    }
    return async function asyncRunner (...args) {
        let limit = args[0] || 1, tasks = args[1], asyncFunc = args[2], callback = args[3];
        const queue = [], results = [];

        if (args.length === 3) {
            asyncFunc = undefined;
            callback = args[2];
        }
        try {
            validate(args);
        } catch (e) {
            return callback(e, null);
        }
        while (tasks.length > 0) {
            if (queue.length < limit) {
                queue.push(tasks.shift());
            } else {
                try {
                    results.push(await promisifyAll(queue, asyncFunc));
                } catch (e) {
                    return callback(e, null);
                }
                queue.length = 0;
            }
        }
        if (queue.length > 0) {
            try {
                results.push(await promisifyAll(queue, asyncFunc));
            } catch (e) {
                return callback(e, null);
            }        
        }
        callback(null, results);
    };
})();
