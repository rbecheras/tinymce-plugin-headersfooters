(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./src/main');

},{"./src/main":10}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };

    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
                deferred.reject(new Error(
                    "Can't get fulfillment value from any promise, all " +
                    "promises were rejected."
                ));
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))
},{"_process":2}],4:[function(require,module,exports){
'use strict'

var HeadFoot = require('./HeadFoot')

var $ = window.jQuery

module.exports = Body

/**
 * Body class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function Body (editor, _documentBody, existingElement, hasHeader, hasFooter, header) {
  HeadFoot.call(this, editor, _documentBody, existingElement)

  var hasBoth = hasHeader && hasFooter
  var hasNoOne = !hasHeader && !hasFooter
  var hasJustHeader = hasHeader && !hasFooter
  var hasJustFooter = !hasHeader && hasFooter

  if (hasBoth || hasJustHeader) {
    $(this.node).insertAfter(header.node)
  } else if (hasNoOne || hasJustFooter) {
    $(this.node).prependTo(this._documentBody)
  } else {
    throw new Error('Unexpected context to insert the body section')
  }
}

Body.prototype = Object.create(HeadFoot.prototype)

/**
 * Create a new node for the body.
 * @private
 * @method
 * @override
 */
Body.prototype._createNode = function () {
  HeadFoot.prototype._createNode.call(this)
  $(this.node).attr('data-headfoot-body', true)
}

},{"./HeadFoot":6}],5:[function(require,module,exports){
'use strict'

var HeadFoot = require('./HeadFoot')

var $ = window.jQuery

module.exports = Footer

/**
 * Footer class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function Footer (editor, _documentBody, existingElement) {
  HeadFoot.call(this, editor, _documentBody, existingElement)
  $(this.node).appendTo(this._documentBody)
}

Footer.prototype = Object.create(HeadFoot.prototype)

/**
 * Create a new node for the footer.
 * @private
 * @method
 * @override
 */
Footer.prototype._createNode = function () {
  HeadFoot.prototype._createNode.call(this)
  $(this.node).attr('data-headfoot-footer', true)
}

},{"./HeadFoot":6}],6:[function(require,module,exports){
'use strict'

var ui = require('../utils/ui')
var domUtils = require('../utils/dom')

var $ = window.jQuery
var tinymce = window.tinymce

module.exports = HeadFoot

/**
 * Abstract class to inherit Header and Footer sub classes from.
 * @constructor
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function HeadFoot (editor, documentBody, existingElement) {
  // bind useful vars
  var that = this
  this._editor = editor
  this._documentBody = documentBody
  this.pluginPaginate = editor.plugins.paginate

  // load the existing element if it exists or create a new one.
  if (existingElement) {
    this.node = existingElement
  } else {
    this._createNode()
  }

  var $thisNode = $(this.node)
  // live the node and implements the double click handler to switch the contentEditable mode.
  this.isActive = false
  this.liveNode()
  $thisNode.dblclick(this.enterNode.bind(this))
  $(this._documentBody).on('EnterNode', function (evt) {
    if (that.node !== evt.target) {
      that.liveNode()
    }
  })
}

/**
 * Create a new node for an header or a footer.
 * @private
 * @method
 */
HeadFoot.prototype._createNode = function () {
  this.node = $('<section>').attr('data-headfoot', true)[0]
  this.initParagraph()
}

/**
 * Disable the page edition and enable the edition for the header or the footers
 * @method
 * @returns void
 */
HeadFoot.prototype.enterNode = function () {
  if (!this.isActive) {
    // var that = this
    // var currentPageContent
    var headfootContent
    var $thisNode = $(this.node)

    this.isActive = true
    $thisNode.trigger('EnterNode', this.node)

    // disable paginator watching
    // if (this.pluginPaginate) {
    //   this.pluginPaginate.disableWatchPage()
    //
    //   // toggle elements states (contentEditable or not)
    //   $.each(this.pluginPaginate.paginator.getPages(), function () {
    //     ui.lockNode.call(this)
    //   })
    // }

    ui.unlockNode.call(this.node)

    // select the unlocked node content or not
    headfootContent = this.node.firstChild
    if (!headfootContent) {
      throw new Error('no child is not allowed in a headfoot')
    }
    if (this.pristine()) {
      this.initParagraph()
    }
    this._editor.focus()
    this._editor.selection.setCursorLocation(this.node, this.node.childNodes.length)
    $thisNode.focus()

    // if (this.pluginPaginate) {
    //   // bind a click handler to the current page to toggle contentEditable state between header/footer and the page
    //   currentPageContent = this.pluginPaginate.getCurrentPage().content()
    //   $(currentPageContent).click(that.liveNode.bind(that))
    // }
  }
}

/**
 * Do the inverse of .enterNode(). Disable edition for the header or footer, and re-enable it for the current page.
 * @method
 * @returns void
 */
HeadFoot.prototype.liveNode = function () {
  this.isActive = false
  $(this.node).trigger('LiveNode', this.node)
  if (this.pluginPaginate) {
    this.pluginPaginate.enableWatchPage()
    $.each(this.pluginPaginate.paginator.getPages(), function () {
      ui.unlockNode.call(this)
    })
  }
  if (domUtils.elementIsEmpty(this.node, this._editor.getWin())) {
    this.setPlaceholder()
  }
  ui.lockNode.call(this.node)
}

HeadFoot.prototype.setPlaceholder = function () {
  var translatedLabel = tinymce.i18n.translate('Double-click to edit this content')
  var $p = this.initParagraph().html(translatedLabel)
  $(this.node).append($p)
  this.pristine(true)
}

HeadFoot.prototype.initParagraph = function () {
  var $span = $('<span>').css({ 'font-family': 'calibri', 'font-size': '12pt' })
  var $p = $('<p>').append($span)
  $span.html('<br data-mce-bogus="1">')
  $(this.node).removeAttr('data-headfoot-pristine').empty().append($p)
  return $p
}

/**
 * [Getter/Setter] Get or set the pristine state of the headfoot node
 * @method
 * @param {Boolean} [b] If defined, the value to set
 * @returns {Boolean|undefined} - The pristine value if no argument is given.
 * @throws {Error} - if this.node is unset an error is thrown
 */
HeadFoot.prototype.pristine = function (b) {
  if (!this.node || !this.node.nodeType) {
    throw new Error('Missing node can not be pristine or not.')
  }
  var attr = 'data-headfoot-pristine'
  if (b === undefined) {
    return this.node.getAttribute(attr) === 'true'
  } else {
    this.node.setAttribute(attr, !!b)
  }
}

},{"../utils/dom":11,"../utils/ui":12}],7:[function(require,module,exports){
'use strict'

var HeadFoot = require('./HeadFoot')

var $ = window.jQuery

module.exports = Header

/**
 * Header class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function Header (editor, _documentBody, existingElement) {
  HeadFoot.call(this, editor, _documentBody, existingElement)
  $(this.node).prependTo(this._documentBody)
}

Header.prototype = Object.create(HeadFoot.prototype)

/**
 * Create a new node for the header.
 * @private
 * @method
 * @override
 */
Header.prototype._createNode = function () {
  HeadFoot.prototype._createNode.call(this)
  $(this.node).attr('data-headfoot-header', true)
}

},{"./HeadFoot":6}],8:[function(require,module,exports){
'use strict'

var Header = require('./Header')
var Footer = require('./Footer')
var Body = require('./Body')

var $ = window.jQuery

module.exports = HeaderFooterFactory

/**
 * HeaderFactory class. The aim of this class is to manage the document header and footer.
 * @constructor
 * @param {Editor} editor The current editor
 * @property {Editor} _editor The current editor
 * @property {Boolean} _hasHeader Tell if the document has a header or not
 * @property {Boolean} _hasBody Tell if the document has a body or not
 * @property {Boolean} _hasFooter Tell if the document has a fooer or not
 * @property {Header} header The current header if exists
 * @property {Footer} footer The current footer if exists
 */
function HeaderFooterFactory (editor) {
  this._editor = editor
  this._hasHeader = false
  this._hasBody = false
  this._hasFooter = false
}

/**
 * Load an existing header or footer depending of its nature, from its DOM element.
 * @method
 * @param {DOMElement} element
 * @returns void
 */
HeaderFooterFactory.prototype.loadElement = function (element) {
  var $el = $(element)
  if ($el.attr('data-headfoot-header')) {
    this._hasHeader = true
    this.header = new Header(this._editor, this._editor.getBody(), element)
  } else if ($el.attr('data-headfoot-footer')) {
    this._hasFooter = true
    this.footer = new Footer(this._editor, this._editor.getBody(), element)
  } else if ($el.attr('data-headfoot-body')) {
    this._hasBody = true
    this.body = new Body(this._editor, this._editor.getBody(), element, this.hasHeader(), this.hasFooter(), this.header)
  } else throw new Error('This element is not a header, footer neither a body element.')
}

/**
 * Insert a new header
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertHeader = function () {
  this.header = new Header(this._editor, this._editor.getBody())
  this._hasHeader = true
  this.header.enterNode()
}

/**
 * Insert a new body
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertBody = function () {
  this.body = new Body(this._editor, this._editor.getBody(), this._hasHeader, this._hasFooter, this.header)
  this._hasBody = true
  this.body.enterNode()
}

/**
 * Insert a new footer
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertFooter = function () {
  this.footer = new Footer(this._editor, this._editor.getBody())
  this._hasFooter = true
  this.footer.enterNode()
}

/**
 * Remove the current header
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.removeHeader = function () {
  // the header can be removed only if it exists
  if (!this.hasHeader()) throw new Error('No header available to remove')

  $(this.header.node).remove()
  this.header = null
  this._hasHeader = false
}

/**
 * Insert a new footer
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.removeFooter = function () {
  // the footer can be removed only if it exists
  if (!this.hasFooter()) throw new Error('No footer available to remove')

  $(this.footer.node).remove()
  this.footer = null
  this._hasFooter = false
}

/**
 * Check if the document has a header or not
 * @method
 * @returns {Boolean} true if the document has a header, false if not
 */
HeaderFooterFactory.prototype.hasHeader = function () {
  return this._hasHeader
}

/**
 * Check if the document has a body or not
 * @method
 * @returns {Boolean} true if the document has a body, false if not
 */
HeaderFooterFactory.prototype.hasBody = function () {
  return this._hasBody
}

/**
 * Check if the document has a footer or not
 * @method
 * @returns {Boolean} true if the document has a footer, false if not
 */
HeaderFooterFactory.prototype.hasFooter = function () {
  return this._hasFooter
}

HeaderFooterFactory.prototype.focusToEndOfBody = function () {
  var $body = $(this.body.node)
  var lastBodyChild = $body.children().last()[0]
  this.body.enterNode()
  this._editor.selection.setCursorLocation(lastBodyChild, lastBodyChild.childNodes.length)
}

HeaderFooterFactory.prototype.forceCursorToAllowedLocation = function (node, parents) {
  if (this.hasBody()) {
    if (!parents) {
      var $node = $(node)
      var allparents = $node.parents()
      parents = allparents.slice(0, -2)
    }

    var lastParent = parents[parents.length - 1]
    var allowedLocations = [this.body.node]

    if (this.hasHeader()) {
      allowedLocations.push(this.header.node)
    }
    if (this.hasFooter()) {
      allowedLocations.push(this.footer.node)
    }

    if (!~allowedLocations.indexOf(lastParent) && !~allowedLocations.indexOf(node)) {
      this.focusToEndOfBody()
    }
  }
}

HeaderFooterFactory.prototype.getActiveSection = function () {
  return [this.header, this.body, this.footer]
  .reduce(function (prev, section) {
    if (prev) {
      return prev
    } else {
      if (section && section.isActive) {
        return section
      }
    }
  }, null)
}

},{"./Body":4,"./Footer":5,"./Header":7}],9:[function(require,module,exports){
'use strict'

var q = require('q')
var $ = window.jQuery

module.exports = MenuItem

/**
 * MenuItem Class
 * @class
 * @param {String} name The item name
 * @param {object} options The menu item options
 * @example
 * tinymce.activeEditor.addMenuItem(new MenuItem('myAction',{
 *   icon: 'text',
 *   text: 'My Action',
 *   visible: true,
 *   disabled: true,
 *   onclick: function(){
 *    window.alert('overiden default onclick action')
 *   }
 * }))
 */
function MenuItem (name, options) {
  this.name = name
  _setUIControlPromise(this)
  for (var key in options) {
    if (key !== 'visible' && key !== 'disabled') {
      this[key] = options[key]
    }
  }
  if (!options.id) {
    this.id = 'mce-plugin-headersfooters-' + camel2Dash(name)
  }
  if (options.visible === false) this.hide()
  if (options.disabled) this.disable()
}

/**
 * Returns the menu item UI control as a jquery object
 * @method
 * @returns {Promise} A promise resolved by the jquery wrapper of the menu item's node element
 * @example
 * var menuElement = ui.menuItems.insertHeader.getUIControl()
 * menuElement.css('color','red')
 */
MenuItem.prototype.getUIControl = function () {
  var that = this
  return this._renderingPromise.then(function () {
    return $('#' + that.id)
  })
}

/**
 * By default on click, the menu item logs on console it has been clicked and returns it to allow chainable behavior.
 * This method should be overriden after instanciation (see example).
 * @method
 * @returns void
 * @example
 * // to override this placehoder callback, juste assign a new one
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.onclick = function () {
 * 	// implement your own
 * }
 */
MenuItem.prototype.onclick = function () {
  console.info('%s menu item has been clicked', this.name)
}

/**
 * Show the menu item UI control and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 * @example
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.show().then(function (menuItem) {
 *   // the menuItem is given as first argument
 *   menuItem.disable() // now the menu item is shown but disabled
 * })
 */
MenuItem.prototype.show = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.show()
    return uiControl
  })
}

/**
 * Hide the menu item UI control and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 */
MenuItem.prototype.hide = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.hide()
    return uiControl
  })
}

/**
 * Disable the menu item and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 * @example
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.show().then(function (menuItem) {
 *   // the menuItem is given as first argument
 *   menuItem.disable().then(function (menuItem) {
 *     // now the menu item is shown but disabled
 *     // the menuItem is again given as first argument
 *     setTimeout(function () {
 *       menuItem.enable() // enable the menu item 2sec after it has been disabled
 *     },2000)
 *   })
 * })
 */
MenuItem.prototype.disable = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.addClass('mce-disabled')
    return uiControl
  })
}

/**
 * Enable the menu item and returns it to allow chainable behavior.
 * @method
 * @returns {Promise} A promise resolved by the menu item
 * @example
 * var menuItem = new MenuItem('my menu item', options)
 * menuItem.enable().then(function (menuItem) {
 *   setTimeout(function () {
 *     menuItem.disable() // disable the menu item 2sec after it has been enabled
 *   },2000)
 * })
 */
MenuItem.prototype.enable = function () {
  return this.getUIControl().then(function (uiControl) {
    uiControl.removeClass('mce-disabled')
    return uiControl
  })
}

/**
 * Create a promise that will be resolved when the menu item will be rendered the first time.
 * This promise will be used by all methods needing to get the UI control (node element)
 * It returns nothing and it must be called on top of the MenuItem constructor
 * @method
 * @memberof MenuItem
 * @private
 * @param {MenuItem} that The context for the private method
 * @returns void
 * @example
 * function MenuItem (name, options) {
 *   this.name = name
 *   _setUIControlPromise(this) // this step must be done more earlier as possible to get access to the DOMNode when it will be rendered
 *   // continue to build the instance
 * }
 */
function _setUIControlPromise (that) {
  var d = q.defer()
  var $body = $('body')

  // resolve menuItems DOM elements
  $body.on('menusController:mceMenuRendered', function (evt, menu) {
    $('.mce-menu-item', menu).each(function (i, item) {
      if ($(item).attr('id') === that.id) d.resolve(item)
    })
  })
  // $body.on('menusController:mceMenuItemRendered', function (evt, itemID) {
  //   console.info('menusController:mceMenuItemRendered', itemID)
  //   if (itemID === that.id) d.resolve()
  // })
  that._renderingPromise = d.promise
}

/**
 * Converts a camel cased string to a dashed string
 * @method
 * @private
 * @memberof MenuItem
 * @param {String} inputStr The input string to dasherize
 * @example
 * var camelCasedString = 'helloWorld'
 * var dashedString = camel2Dash(s)
 * console.log(dashedString)
 * // -> hello-world
 */
function camel2Dash (inputStr) {
  if (!inputStr.replace) throw new Error('The replace() method is not available.')
  return inputStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

},{"q":3}],10:[function(require,module,exports){
'use strict'

/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 2016 SIRAP Group All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * plugin.js Tinymce plugin headersfooters
 * @file plugin.js
 * @module
 * @name tinycmce-plugin-headersfooters
 * @description
 * A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers
 * It will may be used with requires tinymce-plugin-paginate the a near future, but not for now.
 * @link https://github.com/sirap-group/tinymce-plugin-headersfooters
 * @author Rémi Becheras
 * @author Groupe SIRAP
 * @license GNU GPL-v2 http://www.tinymce.com/license
 * @version 1.0.0
 */

/**
 * Tinymce library - injected by the plugin loader.
 * @external tinymce
 * @see {@link https://www.tinymce.com/docs/api/class/tinymce/|Tinymce API Reference}
 */
var tinymce = window.tinymce

/**
 * The jQuery plugin namespace - plugin dependency.
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
var $ = window.jQuery
var getComputedStyle = window.getComputedStyle

var ui = require('./utils/ui')
var units = require('./utils/units')
var HeaderFooterFactory = require('./classes/HeaderFooterFactory')

// Add the plugin to the tinymce PluginManager
tinymce.PluginManager.add('headersfooters', tinymcePluginHeadersFooters)

/**
 * Tinymce plugin headers/footers
 * @function
 * @global
 * @param {tinymce.Editor} editor - The injected tinymce editor.
 * @returns void
 */
function tinymcePluginHeadersFooters (editor, url) {
  var headerFooterFactory
  var lastActiveSection = null

  var menuItems = {
    insertHeader: ui.createInsertHeaderMenuItem(),
    insertFooter: ui.createInsertFooterMenuItem(),
    removeHeader: ui.createRemoveHeaderMenuItem(),
    removeFooter: ui.createRemoveFooterMenuItem(),
    insertPageNumber: ui.createInsertPageNumber(editor),
    insertNumberOfPages: ui.createinsertNumberOfPages(editor)
  }

  this.units = units

  // add menu items
  editor.addMenuItem('insertHeader', menuItems.insertHeader)
  editor.addMenuItem('removeHeader', menuItems.removeHeader)
  editor.addMenuItem('insertFooter', menuItems.insertFooter)
  editor.addMenuItem('removeFooter', menuItems.removeFooter)
  editor.addMenuItem('insertPageNumber', menuItems.insertPageNumber)
  editor.addMenuItem('insertNumberOfPages', menuItems.insertNumberOfPages)

  editor.addCommand('insertPageNumberCmd', function () {
    editor.insertContent('{{page}}')
  })

  editor.addCommand('insertNumberOfPagesCmd', function () {
    editor.insertContent('{{pages}}')
  })

  editor.on('init', onInitHandler)
  editor.on('SetContent', reloadHeadFootIfNeededOnSetContent)
  editor.on('NodeChange', onNodeChange)
  editor.on('NodeChange', forceBodyMinHeightOnNodeChange)
  editor.on('SetContent NodeChange', enterBodyNodeOnLoad)
  editor.on('BeforeSetContent', saveLastActiveSectionOnBeforeSetContent)
  editor.on('SetContent', removeAnyOuterElementOnSetContent)
  editor.on('NodeChange', fixSelectAllOnNodeChange)

  /**
   * Make sure the body minimum height is correct, depending the margins, header and footer height.
   * NodeChange event handler.
   * @function
   * @inner
   * @returns void
   */
  function forceBodyMinHeightOnNodeChange (evt) {
    if (headerFooterFactory.hasBody()) {
      var bodyTag = {}
      var bodySection = {}
      var headerSection = {}
      var footerSection = {}
      var pageHeight

      bodySection.node = headerFooterFactory.body.node
      bodySection.height = headerFooterFactory.body.node.offsetHeight
      bodySection.style = window.getComputedStyle(bodySection.node)

      if (headerFooterFactory.hasHeader()) {
        headerSection.node = headerFooterFactory.header.node
        headerSection.height = headerFooterFactory.header.node.offsetHeight
        headerSection.style = window.getComputedStyle(headerSection.node)
      } else {
        headerSection.node = null
        headerSection.height = 0
        headerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
      }

      if (headerFooterFactory.hasFooter()) {
        footerSection.node = headerFooterFactory.footer.node
        footerSection.height = headerFooterFactory.footer.node.offsetHeight
        footerSection.style = window.getComputedStyle(footerSection.node)
      } else {
        footerSection.node = null
        footerSection.height = 0
        footerSection.style = window.getComputedStyle(document.createElement('bogusElement'))
      }

      bodyTag.node = editor.getBody()
      bodyTag.height = units.getValueFromStyle(getComputedStyle(editor.getBody()).minHeight)
      bodyTag.style = window.getComputedStyle(bodyTag.node)
      bodyTag.paddingTop = units.getValueFromStyle(bodyTag.style.paddingTop)
      bodyTag.paddingBottom = units.getValueFromStyle(bodyTag.style.paddingBottom)

      pageHeight = bodyTag.height - bodyTag.paddingTop - bodyTag.paddingBottom - headerSection.height - footerSection.height
      $(bodySection.node).css({ minHeight: pageHeight })
    }
  }

  /**
   * Auto-enter in the body section on document load.
   * (SetContent or NodeChange with some conditions) event handler.
   * @function
   * @inner
   * @returns void
   */
  function enterBodyNodeOnLoad (evt) {
    setTimeout(function () {
      if (headerFooterFactory && headerFooterFactory.hasBody() && !headerFooterFactory.getActiveSection()) {
        headerFooterFactory.body.enterNode()
      }
    }, 500)
  }

  /**
   * Save the last active section on BeforeSetContent to be able to restore it if needed on SetContent event.
   * BeforeSetContent event handler.
   * @function
   * @inner
   * @returns void
   */
  function saveLastActiveSectionOnBeforeSetContent () {
    if (headerFooterFactory) {
      lastActiveSection = headerFooterFactory.getActiveSection()
    }
  }

  /**
   * Remove any element located out of the allowed sections.
   * SetContent event handler.
   * @function
   * @inner
   * @returns void
   */
  function removeAnyOuterElementOnSetContent (evt) {
    var conditions = [
      !!evt.content,
      !!evt.content.length,
      !!editor.getContent(),
      !!editor.getContent().length,
      !!headerFooterFactory
    ]
    if (!~conditions.indexOf(false)) {
      var $body = $(editor.getBody())
      $body.children().each(function (i) {
        var allowedRootNodes = [headerFooterFactory.body.node]
        if (headerFooterFactory.hasHeader()) {
          allowedRootNodes.push(headerFooterFactory.header.node)
        }
        if (headerFooterFactory.hasFooter()) {
          allowedRootNodes.push(headerFooterFactory.footer.node)
        }
        if (!~allowedRootNodes.indexOf(this)) {
          console.error('Removing the following element because it is out of the allowed sections')
          console.log(this)
          $(this).remove()
        }
      })
    }
    if (lastActiveSection) {
      console.info('entering to the last node', lastActiveSection)
      lastActiveSection.enterNode()
      lastActiveSection = null
    }
  }

  /**
   * When pressing Ctrl+A to select all content, force the selection to be contained in the current active section.
   * onNodeChange event handler.
   * @function
   * @inner
   * @returns void
   */
  function fixSelectAllOnNodeChange (evt) {
    if (evt.selectionChange && !editor.selection.isCollapsed()) {
      if (editor.selection.getNode() === editor.getBody()) {
        editor.selection.select(headerFooterFactory.getActiveSection().node)
      }
    }
  }

  /**
   * On init event handler. Instanciate the factory and initialize menu items states
   * @function
   * @inner
   * @returns void
   */
  function onInitHandler () {
    headerFooterFactory = new HeaderFooterFactory(editor)
    initMenuItems(headerFooterFactory, menuItems)
    ui.addUnselectableCSSClass(editor)
  }

  /**
   * On SetContent event handler. Load or reload headers and footers from existing elements if it should do.
   * @function
   * @inner
   * @returns void
   */
  function reloadHeadFootIfNeededOnSetContent (evt) {
    if (headerFooterFactory) {
      reloadHeadFoots(menuItems)
    } else {
      setTimeout(reloadHeadFootIfNeededOnSetContent.bind(null, evt), 100)
    }
  }

  function onNodeChange (evt) {
    headerFooterFactory.forceCursorToAllowedLocation(evt.element)
  }

  /**
   * Helper function. Do the reload of headers and footers
   * @function
   * @inner
   * @returns void
   */
  function reloadHeadFoots (menuItems) {
    var $headFootElmts = $('*[data-headfoot]', editor.getDoc())
    var $bodyElmt = $('*[data-headfoot-body]', editor.getDoc())
    var hasBody = !!$bodyElmt.length
    var $allElmts = null

    // init starting states
    menuItems.insertHeader.show()
    menuItems.insertFooter.show()
    menuItems.removeHeader.hide()
    menuItems.removeFooter.hide()

    // set another state and load elements if a header or a footer exists
    $headFootElmts.each(function (i, el) {
      var $el = $(el)
      if ($el.attr('data-headfoot-header')) {
        menuItems.insertHeader.hide()
        menuItems.removeHeader.show()
      } else if ($el.attr('data-headfoot-body')) {
        // @TODO something ?
      } else if ($el.attr('data-headfoot-footer')) {
        menuItems.insertFooter.hide()
        menuItems.removeFooter.show()
      }
      headerFooterFactory.loadElement(el)
    })

    if (!hasBody) {
      $allElmts = $(editor.getBody()).children()
      headerFooterFactory.insertBody()
      var $body = $(headerFooterFactory.body.node)
      $body.empty()
      $allElmts.each(function (i, el) {
        var $el = $(el)
        if (!$el.attr('data-headfoot')) {
          $body.append($el)
        }
      })
    }
  }
}

/**
 * Initialize menu items states (show, hide, ...) and implements onclick handlers
 * @function
 * @inner
 * @param {HeaderFooterFactory} factory The header and footer factory
 * @param {object} menuItems The set of plugin's menu items
 * @returns undefined
 */
function initMenuItems (factory, menuItems) {
  // on startup, hide remove buttons
  menuItems.removeHeader.hide()
  menuItems.removeFooter.hide()

  // override insertHeader, insertFooter, removeHeader and removeFooter onclick handlers
  menuItems.insertHeader.onclick = function () {
    factory.insertHeader()
    menuItems.insertHeader.hide()
    menuItems.removeHeader.show()
  }
  menuItems.insertFooter.onclick = function () {
    factory.insertFooter()
    menuItems.insertFooter.hide()
    menuItems.removeFooter.show()
  }
  menuItems.removeHeader.onclick = function () {
    factory.removeHeader()
    menuItems.insertHeader.show()
    menuItems.removeHeader.hide()
  }
  menuItems.removeFooter.onclick = function () {
    factory.removeFooter()
    menuItems.insertFooter.show()
    menuItems.removeFooter.hide()
  }
}

},{"./classes/HeaderFooterFactory":8,"./utils/ui":12,"./utils/units":13}],11:[function(require,module,exports){
'use strict'

module.exports = {
  elementIsEmpty: elementIsEmpty
}

/**
 * Tells if an element is empty (pure JS)
 * i.e. if:
 * - it contains nothing,
 * - or it contains an empty element,
 * - or the only contained element is the mceBogus element
 * @method
 * @static
 * @param {HTMLElement} element The node element to check if it is empty
 * @param {window} [contextWindow] The contextual window for this element
 * @returns {Boolean} true if the element is considered empty.
 */
function elementIsEmpty (element, contextWindow) {
  if (!contextWindow) { contextWindow = window }
  if (!(element instanceof window.HTMLElement || element instanceof contextWindow.HTMLElement)) {
    console.error('TypeError element: ', element, 'contextWindow', contextWindow)
    throw new TypeError('argument 1 must be an instance of HTMLElement.')
  }
  return !element.textContent.trim()
}

},{}],12:[function(require,module,exports){
'use strict'

var $ = window.jQuery
var HEADER_FOOTER_ONLY_SELECTOR = 'section[data-headfoot-header], section[data-headfoot-footer]'

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */

/**
 * Class MenuItem
 * @var
 * @name MenuItem
 * @type class
 */
var MenuItem = require('../classes/MenuItem')

/**
 * A hash of menu items options
 * @var
 * @name menuItems
 * @type  {object}
 *
 */
module.exports = {
  createInsertHeaderMenuItem: createInsertHeaderMenuItem,
  createRemoveHeaderMenuItem: createRemoveHeaderMenuItem,
  createInsertFooterMenuItem: createInsertFooterMenuItem,
  createRemoveFooterMenuItem: createRemoveFooterMenuItem,
  createInsertPageNumber: createInsertPageNumber,
  createinsertNumberOfPages: createinsertNumberOfPages,
  lockNode: lockNode,
  unlockNode: unlockNode,
  addUnselectableCSSClass: addUnselectableCSSClass
}

/**
 * Create a menu item to insert a header
 * @function
 * @static
 * @returns {MenuItem}
 */
function createInsertHeaderMenuItem () {
  return new MenuItem('insertHeader', {
    text: 'Insérer une entête',
    icon: 'abc',
    id: 'plugin-headersfooters-menuitem-insert-header',
    context: 'insert',
    onclick: function () {
      window.alert('insert header')
    }
  })
}

/**
 * Create a menu item to remove a header
 * @function
 * @static
 * @returns {MenuItem}
 */
function createRemoveHeaderMenuItem () {
  return new MenuItem('removeHeader', {
    text: "Supprimer l'entête",
    icon: 'text',
    context: 'insert',
    onclick: function () {
      window.alert('remove header')
    }
  })
}

/**
 * Create a menu item to insert a footer
 * @function
 * @static
 * @returns {MenuItem}
 */
function createInsertFooterMenuItem () {
  return new MenuItem('insertFooter', {
    text: 'Insérer un pied de page',
    icon: 'abc',
    context: 'insert',
    onclick: function () {
      window.alert('insert footer')
    }
  })
}

/**
 * Create a menu item to remove a footer
 * @function
 * @static
 * @returns {MenuItem}
 */
function createRemoveFooterMenuItem () {
  return new MenuItem('removeFooter', {
    text: 'Supprimer le pied de page',
    icon: 'text',
    context: 'insert',
    onclick: function () {
      window.alert('remove footer')
    }
  })
}

function createInsertPageNumber (editor) {
  return new MenuItem('insertPageNumber', {
    text: 'Insérer le numéro de page',
    context: 'document',
    onPostRender: function () {
      editor.on('NodeChange', resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertPageNumberCmd'
  })
}

function createinsertNumberOfPages (editor) {
  return new MenuItem('insertNumberOfPages', {
    text: 'Insérer le nombre de page',
    // icon: 'text',
    context: 'document',
    onPostRender: function () {
      editor.on('NodeChange', resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertNumberOfPagesCmd'
  })
}

/**
 * Lock a node
 * @method
 * @memberof ::callerFunction
 */
function lockNode () {
  var $this = $(this)
  $this.attr('contenteditable', false)
  $this.addClass('unselectable')
}

/**
 * Unlock a node
 * @method
 * @memberof ::callerFunction
 */
function unlockNode () {
  var $this = $(this)
  $this.attr('contenteditable', true)
  $this.removeClass('unselectable')
  $this.focus()
}

function addUnselectableCSSClass (editor) {
  var head = $('head', editor.getDoc())
  var unselectableCSSRules = '.unselectable { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
  var style = $('<style>').attr('type', 'text/css').html(unselectableCSSRules)
  style.appendTo(head)
}

/**
* @function
* @inner
*/
function resetMenuItemState (editor, selector) {
  var selectedElement = editor.selection.getStart()
  var $sel = $(selectedElement)
  var parents = $sel.parents(selector)
  this.disabled(!parents.length)
}

},{"../classes/MenuItem":9}],13:[function(require,module,exports){
'use strict'

/**
 * A set of static helper methods to work with units.
 * It is imported from tinymce-plugin-paragraph.
 * @module utils/units
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph/blob/master/src/lib/units.js
 */

var document = window.document

createDpiTestElements()

module.exports = {
  getValueFromStyle: getValueFromStyle,
  getUnitFromStyle: getUnitFromStyle,
  px2mm: px2mm,
  px2pt: px2pt,
  px2in: px2in,
  in2pt: in2pt,
  in2mm: in2mm,
  getDpi: getDpi
}

/**
 * Get the numerc value of a style value with unit (remove the 2-digits unit and cast as number)
 * For example, returns `11` from a style value of `11px`
 * @method
 * @static
 * @param {string} styleValue A style value with a 2-digits unit
 * @returns {number} - The absolute value of the given style value
 */
function getValueFromStyle (styleValue) {
  return styleValue.slice(0, styleValue.length - 2)
}

/**
 * Get the 2-digit unit representation of a style value with unit.
 * For example, returns `px` from a style value of `11px`
 * @method
 * @static
 * @param {string} styleValue A style value with a 2-digits unit
 * @returns {string} - The unit as a 2-digits representation
 */
function getUnitFromStyle (styleValue) {
  return styleValue.slice(styleValue.length - 2, styleValue.length)
}

/**
 * Converts a quantity of pixels to a quantity of milimeters
 * 1 in = 25.4 mm
 * Calculate pixels to inches then inches to milimeters
 * @method
 * @static
 * @param {Number} qPx The quantity of pixels to convert to milimeters
 * @returns {Number} qMm The resuluting quantity of milimeters
 */
function px2mm (qPx) {
  return in2mm(px2in(qPx))
}

/**
 * Converts a quantity of inches to a quantity of milimeters
 * 1 in = 25.4 mm
 * @method
 * @static
 * @param {Number} qPx The quantity of inches to convert to milimeters
 * @returns {Number} qMm The resulting length in milimeters
 */
function in2mm (qIn) {
  return Number(qIn) * 25.4
}

/**
 * Converts pixels (px) to points (pt)
 * px -> in -> pt
 * @method
 * @static
 * @param {number} px Number of pixels to convert to points
 * @returns {number} - Resulting number of points (pt)
 */
function px2pt (px) {
  var inches = px2in(px)
  return in2pt(inches)
}

/**
 * Converts pixels (px) to inches (in)
 * dpi = px / in -> in = px / dpi
 * @method
 * @static
 * @param {number} px Number of pixels to convert to inches
 * @returns {number} - Resulting number of inches (in)
 */
function px2in (px) {
  var dpi = getDpi()
  return Number(px) / Number(dpi)
}

/**
 * Converts inches (in) to points (pt)
 * 72 = pt / in -> pt = 72 * in
 * @method
 * @static
 * @param {number} inches Number of inches (in) to convet to points (pt)
 * @returns {number} - Resulting number of points (pt)
 */
function in2pt (inches) {
  return Number(inches) * 72
}

/**
 * Evaluate the DPI of the device's screen (pixels per inche).
 * It creates and inpect a dedicated and hidden `data-dpi-test` DOM element to
 * deduct the screen DPI.
 * @method
 * @static
 * @returns {number} - The current screen DPI, so in pixels per inch.
 */
function getDpi () {
  return document.getElementById('dpi-test').offsetHeight
}

/**
 * @function
 * @inner
 */
function createDpiTestElements () {
  var getDpiHtmlStyle = 'data-dpi-test { height: 1in; left: -100%; position: absolute; top: -100%; width: 1in; }'

  var head = document.getElementsByTagName('head')[0]
  var getDPIElement = document.createElement('style')
  getDPIElement.setAttribute('type', 'text/css')
  getDPIElement.setAttribute('rel', 'stylesheet')
  getDPIElement.innerHTML = getDpiHtmlStyle
  head.appendChild(getDPIElement)

  var body = document.getElementsByTagName('body')[0]
  var dpiTestElement = document.createElement('data-dpi-test')
  dpiTestElement.setAttribute('id', 'dpi-test')
  body.appendChild(dpiTestElement)
}

},{}]},{},[1]);
