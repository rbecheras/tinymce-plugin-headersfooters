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

var uiUtils = require('../utils/ui')
var units = require('../utils/units')
var $ = uiUtils.jQuery

module.exports = Format

Format.prototype.applyToPlugin = applyToPlugin
Format.prototype.calculateBodyHeight = calculateBodyHeight
Format.prototype.hasHeader = hasHeader
Format.prototype.hasFooter = hasFooter
Format.prototype.hasHeaderBorder = hasHeaderBorder
Format.prototype.hasFooterBorder = hasFooterBorder

Format.defaults = {}
Format.defaults['A4'] = new Format('A4', {
  height: '297mm',
  width: '210mm',
  margins: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  header: {
    height: '0',
    // height: 'auto',
    margins: { right: '0', bottom: '10mm', left: '0' },
    border: { color: 'black', style: 'solid', width: '0' }
  },
  footer: {
    height: '0',
    // height: 'auto',
    margins: { right: '0', top: '10mm', left: '0' },
    border: { color: 'black', style: 'solid', width: '0' }
  },
  body: {
    border: { color: 'black', style: 'solid', width: '0' }
  }
})

if (window.env === 'development') {
  Format.defaults['dev-small'] = new Format('dev-small', {
    height: '150mm',
    width: '100mm',
    margins: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
    header: {
      height: '10mm',
      // height: 'auto',
      margins: { right: '15mm', bottom: '10mm', left: '5mm' },
      border: { color: 'red', style: 'dashed', width: '1mm' }
    },
    footer: {
      height: '10mm',
      // height: 'auto',
      margins: { right: '0', top: '1cm', left: '0' },
      border: { color: 'red', style: 'dashed', width: '1mm' }
    },
    body: {
      border: { color: 'red', style: 'dashed', width: '1mm' }
    }
  })
}

/**
 * @param {string} name
 * @param {object} config
 */
function Format (name, config) {
  this.name = name
  this.orientation = (config.height > config.width) ? 'portrait' : 'paysage'
  this.width = config.width
  this.height = config.height
  this.margins = {
    top: config.margins ? config.margins.top : '0',
    right: config.margins ? config.margins.right : '0',
    bottom: config.margins ? config.margins.bottom : '0',
    left: config.margins ? config.margins.left : '0'
  }
  this.header = {
    height: config.header ? config.header.height : '0',
    margins: {
      right: config.header && config.header.margins ? config.header.margins.right : '0',
      bottom: config.header && config.header.margins ? config.header.margins.bottom : '0',
      left: config.header && config.header.margins ? config.header.margins.left : '0'
    },
    border: {
      color: config.header && config.header.border ? config.header.border.color : 'black',
      style: config.header && config.header.border ? config.header.border.style : 'none',
      width: config.header && config.header.border ? config.header.border.width : '0'
    }
  }
  this.footer = {
    height: config.footer ? config.footer.height : '0',
    margins: {
      top: config.footer && config.footer.margins ? config.footer.margins.top : '0',
      right: config.footer && config.footer.margins ? config.footer.margins.right : '0',
      left: config.footer && config.footer.margins ? config.footer.margins.left : '0'
    },
    border: {
      color: config.footer && config.footer.border ? config.footer.border.color : 'black',
      style: config.footer && config.footer.border ? config.footer.border.style : 'none',
      width: config.footer && config.footer.border ? config.footer.border.width : '0'
    }
  }
  this.body = {
    border: {
      color: config.body && config.body.border ? config.body.border.color : 'black',
      style: config.body && config.body.border ? config.body.border.style : 'none',
      width: config.body && config.body.border ? config.body.border.width : '0'
    }
  }
  this.showAlert = true
}

/**
 * Apply the current format to the DOM and fires the `AppliedToBody` event to
 * permit the main app to bind the format object definition to the document
 * object to be saved with.
 * @method
 * @param {HeadersFooters} plugin The current HeaderFooters plugin instance
 * @fires `HeadersFooters:Format:AppliedToBody`
 * @returns {undefined}
 */
function applyToPlugin (plugin) {
  var that = this
  var editor = plugin.editor

  if (plugin.documentBody) {
    var win = plugin.editor.getWin()
    var body = plugin.documentBody

    plugin = plugin.getMaster() || plugin
    that = plugin.currentFormat

    applyToStackedLayout()
    applyToBody(plugin)

    editor.fire('HeadersFooters:Format:AppliedToBody', {
      documentFormat: that
    })
  }

  function applyToStackedLayout () {
    // var bodyHeight = uiUtils.getElementHeight(body)
    var bodyHeight
    if (plugin.type === 'body') {
      bodyHeight = that.calculateBodyHeight(editor)
    } else {
      bodyHeight = that[plugin.type].height
    }
    var rules = {
      boxSizing: 'border-box',
      height: bodyHeight,
      minHeight: bodyHeight,
      maxHeight: bodyHeight
    }

    plugin.stackedLayout.editarea.css({border: 0})
    plugin.stackedLayout.iframe.css(rules)
  }

  function applyToBody (plugin) {
    // NOTE: set padding to zero to fix unknown bug
    // where all iframe's body paddings are set to '2cm'...
    // TODO: remove this statement if the 2cm padding source is found.
    $(body, win).css({
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    })

    // Allow body panel overflow
    if (plugin.isMaster) {
      $(body, win).css({
        overflowY: 'auto'
      })
    }

    // var bodyHeight = uiUtils.getElementHeight(body, win)
    if (plugin.isMaster) {
      plugin.pageLayout.pageWrapper.css({
        overflow: 'auto', // TODO: update model spec
        background: '#464646',
        // height: 'auto', // TODO: update model spec
        position: 'absolute', // TODO: update model spec
        top: 0, // TODO: update model spec
        right: 0, // TODO: update model spec
        left: 0, // TODO: update model spec
        bottom: 0, // TODO: update model spec
        margin: 0
        // padding: '3cm 0 3cm 0',
        // width: '100%'
      })
      plugin.pageLayout.pagePanel.css({
        overflow: 'hidden', // TODO: update model spec
        background: 'white',
        border: 0,
        boxSizing: 'border-box',
        // minHeight: that.height, // @TODO update for pagination
        height: that.height, // @TODO update for pagination
        margin: '25mm auto 2cm auto',
        paddingTop: that.margins.top,
        paddingRight: that.margins.right,
        paddingBottom: that.margins.bottom,
        paddingLeft: that.margins.left,
        width: that.width
      })
      plugin.pageLayout.headerWrapper.css({
        overflow: 'hidden', // TODO: update model spec
        // border: 0,
        boxSizing: 'border-box',
        height: that.header.height + that.header.margins.bottom,
        margin: 0,
        padding: 0
        // width: '100%' // TODO: update model spec
      })

      /* TODO: split border to top/right/bottom/left */
      var hasHeader = that.hasHeader()
      var headerHasBorder = that.hasHeaderBorder()
      plugin.pageLayout.headerPanel.css({
        overflow: 'hidden', // TODO: update model spec
        borderColor: (hasHeader && !headerHasBorder) ? 'black' : that.header.border.color,
        borderStyle: (hasHeader && !headerHasBorder) ? 'solid' : that.header.border.style,
        borderWidth: (hasHeader && !headerHasBorder) ? '0.1mm' : that.header.border.width,
        boxSizing: 'border-box',
        height: that.header.height,
        marginTop: 0,
        marginRight: that.header.margins.right,
        marginBottom: that.header.margins.bottom,
        marginLeft: that.header.margins.left,
        padding: 0
        // width: '100%' // TODO: update model spec
      })
      if (plugin.pageLayout.headerIframe) {
        plugin.pageLayout.headerIframe.css({
          height: that.header.height,
          minHeight: that.header.height,
          maxHeight: that.header.height
        })
      }

      var bodyHeight = that.calculateBodyHeight(editor)
      // var bodyWrapperHeight = Number(units.getValueFromStyle(bodyHeight)) +
      //   Number(units.getValueFromStyle(that.body.border.width)) * 2
      // bodyWrapperHeight += 'mm'
      plugin.pageLayout.bodyWrapper.css({
        // overflow: 'hidden', // TODO: update model spec
        overflow: 'auto', // TODO: update for pagination
        border: 0,
        boxSizing: 'border-box',
        height: bodyHeight, // bodyWrapperHeight
        margin: 0,
        padding: 0,
        width: '100%'
      })
      plugin.pageLayout.bodyPanel.css({
        // overflow: 'hidden', // TODO: update model spec
        overflow: 'auto', // TODO: update for pagination
        borderColor: that.body.border.color,
        borderStyle: that.body.border.style,
        borderWidth: that.body.border.width,
        boxSizing: 'border-box',
        // minHeight: that.calculateBodyHeight(), // @TODO update for pagination
        height: bodyHeight, // @TODO update for pagination
        margin: 0,
        padding: 0,
        width: '100%'
      })
      plugin.pageLayout.footerWrapper.css({
        overflow: 'hidden', // TODO: update model spec
        border: 0,
        borderTop: 'dashed 1px gray', // TODO update model spec?
        boxSizing: 'border-box',
        height: that.footer.height + that.footer.margins.top,
        margin: 0,
        padding: 0
        // width: '100%' // TODO: update model spec
      })

      var hasFooter = that.hasFooter()
      var footerHasBorder = that.hasFooterBorder()
      /* TODO: split border to top/right/bottom/left */
      plugin.pageLayout.footerPanel.css({
        overflow: 'hidden', // TODO: update model spec
        borderColor: (hasFooter && !footerHasBorder) ? 'black' : that.footer.border.color,
        borderStyle: (hasFooter && !footerHasBorder) ? 'solid' : that.footer.border.style,
        borderWidth: (hasFooter && !footerHasBorder) ? '0.1mm' : that.footer.border.width,
        boxSizing: 'border-box',
        height: that.footer.height,
        marginTop: that.footer.margins.top,
        marginRight: that.footer.margins.right,
        marginBottom: 0,
        marginLeft: that.footer.margins.left,
        padding: 0
        // width: '100%' // TODO: update model spec
      })
      if (plugin.pageLayout.footerIframe) {
        plugin.pageLayout.footerIframe.css({
          height: that.footer.height,
          minHeight: that.footer.height,
          maxHeight: that.footer.height
        })
      }
    }
  }
}

/**
 * Caluculate the document Body height depending the Format propeties
 * @param {Editor}
 * @returns {String} the body height (in mm for now)
 * @fires HeadersFooters:Error:NegativeBodyHeight
 * @TODO support other size units (cm, pt)
 */
function calculateBodyHeight (editor) {
  var that = this
  var ret
  var height = units.getValueFromStyle(this.height)
  var marginTop = units.getValueFromStyle(this.margins.top)
  var marginBottom = units.getValueFromStyle(this.margins.bottom)
  var headerHeight = units.getValueFromStyle(this.header.height)
  var headerMarginBottom = units.getValueFromStyle(this.header.margins.bottom)
  var footerHeight = units.getValueFromStyle(this.footer.height)
  var footerMarginTop = units.getValueFromStyle(this.footer.margins.top)

  var value = height - marginTop - marginBottom -
    headerHeight - headerMarginBottom -
    footerHeight - footerMarginTop

  ret = value + 'mm'
  // console.log('calculateBodyHeight() => ', ret)
  if (value <= 0) {
    if (this.showAlert) {
      var message
      this.showAlert = false
      message = 'Inconsistant Custom Format: « Body height < 0 ». Do you want to fix it ?'

      editor.fire('HeadersFooters:Error:NegativeBodyHeight')
      editor.windowManager.confirm(message, function (conf) {
        if (conf) {
          editor.execCommand('editFormatCmd')
        }
        that.showAlert = true
      })
    }
  }
  return ret
}

function hasHeader () {
  return !this.header || (this.header.height && this.header.height !== '0')
}

function hasFooter () {
  return !this.footer || this.footer.height && this.footer.height !== '0'
}

function hasHeaderBorder () {
  return !this.hasHeader() || this.header.border.width && this.header.border.width !== '0'
}

function hasFooterBorder () {
  return !this.hasFooter() || this.footer.border.width && this.footer.border.width !== '0'
}

},{"../utils/ui":14,"../utils/units":15}],5:[function(require,module,exports){
'use strict'

var q = require('q')
var timeUtils = require('../utils/time')
var $ = window.jQuery

var timestamp = timeUtils.timestamp

module.exports = MenuItem

// Public API
MenuItem.prototype = {
  getUIControl: getUIControl,
  onclick: onclick,
  show: show,
  hide: hide,
  disable: disable,
  enable: enable
}

// Private API
// _setUIControlPromise()
// _camel2Dash()

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
  _setUIControlPromise.call(this)
  for (var key in options) {
    if (key !== 'visible' && key !== 'disabled') {
      this[key] = options[key]
    }
  }
  if (!options.id) {
    this.id = 'mce-plugin-headersfooters-' + _camel2Dash(name) + timestamp()
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
function getUIControl () {
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
 * => implement your own
 * }
 */
function onclick () {
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
function show () {
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
function hide () {
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
function disable () {
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
function enable () {
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
 *   _setUIControlPromise.call(this) // this step must be done more earlier as possible to get access to the DOMNode when it will be rendered
 *   // continue to build the instance
 * }
 */
function _setUIControlPromise () {
  var that = this
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
  this._renderingPromise = d.promise
}

/**
 * Converts a camel cased string to a dashed string
 * @method
 * @private
 * @memberof MenuItem
 * @param {String} inputStr The input string to dasherize
 * @example
 * var camelCasedString = 'helloWorld'
 * var dashedString = _camel2Dash(s)
 * console.log(dashedString)
 * // -> hello-world
 */
function _camel2Dash (inputStr) {
  if (!inputStr.replace) throw new Error('The replace() method is not available.')
  return inputStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

},{"../utils/time":12,"q":3}],6:[function(require,module,exports){
'use strict'

var uiHelpers = require('../utils/ui-helpers')
// var eventHandlers = require('../event-handlers')

var tinymce = window.tinymce

module.exports = {
  createFormatTab: createFormatTab,
  createMarginsTab: createMarginsTab,
  createHeaderTab: createHeaderTab,
  createFooterTab: createFooterTab,
  createBodyTab: createBodyTab
}

/**
 * Create the general tab component that show form inputs for:
 * - paper labeled formats,
 * - paper custom size
 * @method
 * @returns {TabPanel} formatTab
 */
function createFormatTab (format) {
  // format select box
  var formats = tinymce.activeEditor.plugins.headersfooters.availableFormats
  var formatValues = []
  for (var name in formats) {
    var f = formats[name]
    formatValues.push({
      text: f.name,
      value: f.name
    })
  }
  var formatSelectBox = uiHelpers.createSelectBox('Format', 'newformat', formatValues, 150)

  // orientation select box
  var orientationSelectBox = uiHelpers.createSelectBox('Orientation', 'orientation', [
    {text: 'paysage', value: 'paysage'},
    {text: 'portrait', value: 'portrait'}
  ], 150)

  // page height form inputs
  var pageHeightTextBox = uiHelpers.createTextBox('Page height', 'pageHeight', 65)
  var pageHeightUnitSelect = uiHelpers.createUnitSelectBox('pageHeightUnit', 'mm')

  // page width form inputs
  var pageWidthTextBox = uiHelpers.createTextBox('Page width', 'pageWidth', 65)
  var pageWidthUnitSelect = uiHelpers.createUnitSelectBox('pageWidthUnit', 'mm')

  formatSelectBox.on('select', function (e) {
    var selectValue = e.control.value()
    var _format = formats[selectValue]
    pageHeightTextBox.value(_format.height.slice(0, -2)) // using raw 'mm' value
    pageWidthTextBox.value(_format.width.slice(0, -2)) // using raw 'mm' value
  })
  orientationSelectBox.on('select', function (e) {
    var orientation = orientationSelectBox.value()
    var height = pageHeightTextBox.value()
    var width = pageWidthTextBox.value()
    var max, min
    if (height >= width) {
      max = height
      min = width
    } else {
      max = width
      min = height
    }
    if (orientation === 'portrait') {
      pageHeightTextBox.value(max) // using raw 'mm' value
      pageWidthTextBox.value(min) // using raw 'mm' value
    } else {
      pageHeightTextBox.value(min) // using raw 'mm' value
      pageWidthTextBox.value(max) // using raw 'mm' value
    }
  })

  // paperSize fieldset form
  var formatForm = uiHelpers.createForm([
    formatSelectBox,
    orientationSelectBox
  ], 1)

  // paperSize fieldset form
  var paperSizeForm = uiHelpers.createForm([
    pageHeightTextBox, pageHeightUnitSelect,
    pageWidthTextBox, pageWidthUnitSelect
  ], 2)

  // format fieldset
  var formatFieldSet = uiHelpers.createFieldset('Format', [formatForm], null, 300)

  // format fieldset
  var paperSizeFieldSet = uiHelpers.createFieldset('Paper Size', [paperSizeForm], 460)

  // tab
  var tab = uiHelpers.createTab('Paper', [formatFieldSet, paperSizeFieldSet])

  return tab
}

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @method
 * @returns {TabPanel} marginTab
 */
function createMarginsTab (format) {
  var marginTopTextBox = uiHelpers.createTextBox('Margin top', 'marginTop', 65)
  var marginTopUnitSelect = uiHelpers.createUnitSelectBox('marginTopUnit', 'mm')

  var marginRightTextBox = uiHelpers.createTextBox('Margin right', 'marginRight', 65)
  var marginRightUnitSelect = uiHelpers.createUnitSelectBox('marginRightUnit', 'mm')

  var marginBottomTextBox = uiHelpers.createTextBox('Margin bottom', 'marginBottom', 65)
  var marginBottomUnitSelect = uiHelpers.createUnitSelectBox('marginBottomUnit', 'mm')

  var marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'marginLeft', 65)
  var marginLeftUnitSelect = uiHelpers.createUnitSelectBox('marginLeftUnit', 'mm')

  // paperSize fieldset form
  var form = uiHelpers.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  var fieldSet = uiHelpers.createFieldset('Margins', [form], 460)

  // tab
  var tab = uiHelpers.createTab('Margin', [fieldSet])

  return tab
}

/**
 * Create the margins tab component that show form inputs for:
 * - paper margins
 * @method
 * @returns {TabPanel} marginTab
 */
function createHeaderTab (format) {
  // header height
  var heightTextBox = uiHelpers.createTextBox('Height', 'headerHeight', 65)
  var heightUnitSelect = uiHelpers.createUnitSelectBox('headerHeightUnit', 'mm')

  var heightForm = uiHelpers.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  var heightFieldSet = uiHelpers.createFieldset('Header dimensions', [heightForm], 460)

  // header margins

  var marginRightTextBox = uiHelpers.createTextBox('Margin right', 'headerMarginRight', 65)
  var marginRightUnitSelect = uiHelpers.createUnitSelectBox('headerMarginRightUnit', 'mm')

  var marginBottomTextBox = uiHelpers.createTextBox('Margin bottom', 'headerMarginBottom', 65)
  var marginBottomUnitSelect = uiHelpers.createUnitSelectBox('headerMarginBottomUnit', 'mm')

  var marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'headerMarginLeft', 65)
  var marginLeftUnitSelect = uiHelpers.createUnitSelectBox('headerMarginLeftUnit', 'mm')

  var form = uiHelpers.createForm([
    marginRightTextBox, marginRightUnitSelect,
    marginBottomTextBox, marginBottomUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  var marginsFieldSet = uiHelpers.createFieldset('Header margins', [form], 460)

  // header borders
  var borderWidthTextBox = uiHelpers.createTextBox('Border width', 'headerBorderWidth', 65)
  var borderWidthUnitSelect = uiHelpers.createUnitSelectBox('headerBorderWidthUnit', 'mm')

  // border style
  var borderStyleItemNone = uiHelpers.createListBoxItem('none')
  var borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  var borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  var borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  var borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  var borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  var borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  var borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  var borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  var borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  var borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  var borderStyleListBox = uiHelpers.createListBox('Border style', 'headerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  var borderColorPicker = uiHelpers.createColorPicker('Border color', 'headerBorderColor', function () {})

  // create form
  var borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  var borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  var borderFieldset = uiHelpers.createFieldset('Header borders', [ borderForm1, borderForm2 ], 460)

  // tab
  var tab = uiHelpers.createTab('Header', [heightFieldSet, marginsFieldSet, borderFieldset])

  return tab
}

/**
 * Create the footer tab component that show form inputs for:
 * - footer height
 * - footer margins
 * - footer borders
 * @method
 * @returns {TabPanel} footerTab
 */
function createFooterTab (format) {
  // header height
  var heightTextBox = uiHelpers.createTextBox('Height', 'footerHeight', 65)
  var heightUnitSelect = uiHelpers.createUnitSelectBox('footerHeightUnit', 'mm')

  var heightForm = uiHelpers.createForm([
    heightTextBox, heightUnitSelect
  ], 2)

  var heightFieldSet = uiHelpers.createFieldset('Footer dimensions', [heightForm], 460)

  // header margins

  var marginTopTextBox = uiHelpers.createTextBox('Margin top', 'footerMarginTop', 65)
  var marginTopUnitSelect = uiHelpers.createUnitSelectBox('footerMarginTopUnit', 'mm')

  var marginRightTextBox = uiHelpers.createTextBox('Margin right', 'footerMarginRight', 65)
  var marginRightUnitSelect = uiHelpers.createUnitSelectBox('footerMarginRightUnit', 'mm')

  var marginLeftTextBox = uiHelpers.createTextBox('Margin left', 'footerMarginLeft', 65)
  var marginLeftUnitSelect = uiHelpers.createUnitSelectBox('footerMarginLeftUnit', 'mm')

  var form = uiHelpers.createForm([
    marginTopTextBox, marginTopUnitSelect,
    marginRightTextBox, marginRightUnitSelect,
    marginLeftTextBox, marginLeftUnitSelect
  ], 2)

  var marginsFieldSet = uiHelpers.createFieldset('Footer margins', [form], 460)

  // footer borders
  var borderWidthTextBox = uiHelpers.createTextBox('Border width', 'footerBorderWidth', 65)
  var borderWidthUnitSelect = uiHelpers.createUnitSelectBox('footerBorderWidthUnit', 'mm')

  // border style
  var borderStyleItemNone = uiHelpers.createListBoxItem('none')
  var borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  var borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  var borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  var borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  var borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  var borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  var borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  var borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  var borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  var borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  var borderStyleListBox = uiHelpers.createListBox('Border style', 'footerBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  var borderColorPicker = uiHelpers.createColorPicker('Border color', 'footerBorderColor', function () {})

  // create form
  var borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  var borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  var borderFieldset = uiHelpers.createFieldset('Footer borders', [ borderForm1, borderForm2 ], 460)

  // tab
  var tab = uiHelpers.createTab('Footer', [heightFieldSet, marginsFieldSet, borderFieldset])

  return tab
}

function createBodyTab (format) {
  // body borders
  var borderWidthTextBox = uiHelpers.createTextBox('Border width', 'bodyBorderWidth', 65)
  var borderWidthUnitSelect = uiHelpers.createUnitSelectBox('bodyBorderWidthUnit', 'mm')

  // border style
  var borderStyleItemNone = uiHelpers.createListBoxItem('none')
  var borderStyleItemHidden = uiHelpers.createListBoxItem('hidden')
  var borderStyleItemDotted = uiHelpers.createListBoxItem('dotted')
  var borderStyleItemDashed = uiHelpers.createListBoxItem('dashed')
  var borderStyleItemSolid = uiHelpers.createListBoxItem('solid')
  var borderStyleItemDouble = uiHelpers.createListBoxItem('double')
  var borderStyleItemGroove = uiHelpers.createListBoxItem('groove')
  var borderStyleItemRidge = uiHelpers.createListBoxItem('ridge')
  var borderStyleItemInset = uiHelpers.createListBoxItem('inset')
  var borderStyleItemOutset = uiHelpers.createListBoxItem('outset')
  var borderStyleValues = [
    borderStyleItemNone, borderStyleItemHidden, borderStyleItemDotted,
    borderStyleItemDashed, borderStyleItemSolid, borderStyleItemDouble,
    borderStyleItemGroove, borderStyleItemRidge, borderStyleItemInset,
    borderStyleItemOutset
  ]
  var borderStyleListBox = uiHelpers.createListBox('Border style', 'bodyBorderStyle', borderStyleValues, borderStyleItemNone, 90)

  // border color picker
  var borderColorPicker = uiHelpers.createColorPicker('Border color', 'bodyBorderColor', function () {})

  // create form
  var borderForm1 = uiHelpers.createForm([ borderWidthTextBox, borderWidthUnitSelect ])
  var borderForm2 = uiHelpers.createForm([ borderStyleListBox, borderColorPicker ], 1)
  // create field set
  var borderFieldset = uiHelpers.createFieldset('Body borders', [ borderForm1, borderForm2 ], 460)

  // tab
  var tab = uiHelpers.createTab('Body', [borderFieldset])

  return tab
}

},{"../utils/ui-helpers":13}],7:[function(require,module,exports){
'use strict'

// var units = require('../units')
var editFormatTabs = require('./edit-format-tabs')
var Format = require('../classes/Format')

module.exports = openMainWinFunction

/**
 * Make the openMainWin function as a closure
 * @method
 * @param {Editor} editor The tinymce active editor instance
 * @returns {function} openMainWin The openMainWin closure function
 */
function openMainWinFunction (editor) {
  return openMainWin

  /**
   * Open the main paragraph properties window
   * @function
   * @inner
   * @returns {undefined}
   */
  function openMainWin (format) {
    var formatTab = editFormatTabs.createFormatTab(format)
    var marginsTab = editFormatTabs.createMarginsTab(format)
    var headerTab = editFormatTabs.createHeaderTab(format)
    var footerTab = editFormatTabs.createFooterTab(format)
    var bodyTab = editFormatTabs.createBodyTab(format)

    editor.windowManager.open({
      bodyType: 'tabpanel',
      title: 'Edit Document Format',
      body: [ formatTab, marginsTab, headerTab, footerTab, bodyTab ],
      data: {
        newformat: format.name,
        orientation: format.orientation,
        pageHeight: format.height.slice(0, -2),
        pageWidth: format.width.slice(0, -2),
        marginTop: format.margins.top.slice(0, -2),
        marginRight: format.margins.right.slice(0, -2),
        marginBottom: format.margins.bottom.slice(0, -2),
        marginLeft: format.margins.left.slice(0, -2),
        headerBorderWidth: format.header.border.width.slice(0, -2),
        headerBorderColor: format.header.border.color,
        headerBorderStyle: format.header.border.style,
        headerMarginLeft: format.header.margins.left.slice(0, -2),
        headerMarginBottom: format.header.margins.bottom.slice(0, -2),
        headerMarginRight: format.header.margins.right.slice(0, -2),
        headerHeight: format.header.height.slice(0, -2),
        footerBorderWidth: format.footer.border.width.slice(0, -2),
        footerBorderColor: format.footer.border.color,
        footerBorderStyle: format.footer.border.style,
        footerMarginLeft: format.footer.margins.left.slice(0, -2),
        footerMarginTop: format.footer.margins.top.slice(0, -2),
        footerMarginRight: format.footer.margins.right.slice(0, -2),
        footerHeight: format.footer.height.slice(0, -2),
        bodyBorderWidth: format.body.border.width.slice(0, -2),
        bodyBorderColor: format.body.border.color,
        bodyBorderStyle: format.body.border.style
      },
      onsubmit: onMainWindowSubmit
    })

    /**
     * Open edit format window submit callback
     *
     * @TODO implement heightUnit
     * @TODO implement widthUnit (etc...)
     */
    function onMainWindowSubmit () {
      // handle all forms values in `d` for `data`
      var d = this.toJSON()
      var formatToApply = {
        name: 'custom',
        orientation: (d.orientation) ? d.orientation : 'portrait',
        height: (d.pageHeight) ? d.pageHeight + 'mm' : format.height,
        width: (d.pageWidth) ? d.pageWidth + 'mm' : format.width,
        margins: {
          bottom: (d.marginBottom) ? d.marginBottom + 'mm' : format.margins.bottom,
          left: (d.marginLeft) ? d.marginLeft + 'mm' : format.margins.left,
          right: (d.marginRight) ? d.marginRight + 'mm' : format.margins.right,
          top: (d.marginTop) ? d.marginTop + 'mm' : format.margins.top
        },
        header: {
          border: {
            color: d.headerBorderColor || format.header.border.color,
            style: d.headerBorderStyle || format.header.border.style,
            width: (d.headerBorderWidth) ? d.headerBorderWidth + 'mm' : format.header.border.width
          },
          height: (d.headerHeight) ? d.headerHeight + 'mm' : format.header.height,
          margins: {
            bottom: (d.headerMarginBottom) ? d.headerMarginBottom + 'mm' : format.header.margins.bottom,
            left: (d.headerMarginLeft) ? d.headerMarginLeft + 'mm' : format.header.margins.left,
            right: (d.headerMarginRight) ? d.headerMarginRight + 'mm' : format.header.margins.right
          }
        },
        footer: {
          border: {
            color: d.footerBorderColor || format.footer.border.color,
            style: d.footerBorderStyle || format.footer.border.style,
            width: (d.footerBorderWidth) ? d.footerBorderWidth + 'mm' : format.footer.border.width
          },
          height: (d.footerHeight) ? d.footerHeight + 'mm' : format.footer.height,
          margins: {
            top: (d.footerMarginTop) ? d.footerMarginTop + 'mm' : format.footer.margins.top,
            left: (d.footerMarginLeft) ? d.footerMarginLeft + 'mm' : format.footer.margins.left,
            right: (d.footerMarginRight) ? d.footerMarginRight + 'mm' : format.footer.margins.right
          }
        },
        body: {
          border: {
            color: d.bodyBorderColor || format.body.border.color,
            style: d.bodyBorderStyle || format.body.border.style,
            width: (d.bodyBorderWidth) ? d.bodyBorderWidth + 'mm' : format.body.border.width
          }
        }
      }
      editor.plugins.headersfooters.currentFormat = new Format('custom', formatToApply)
      editor.plugins.headersfooters.currentFormat.applyToPlugin(editor.plugins.headersfooters)
    }
  }
}

},{"../classes/Format":4,"./edit-format-tabs":6}],8:[function(require,module,exports){
'use strict'

/**
 * MenuItems components
 * @module
 * @name menuItems
 * @description A module to provide a function to create all of the menu items for the plugin
 */

/**
 * Class MenuItem
 * @var
 * @name MenuItem
 * @type class
 */
var MenuItem = require('../classes/MenuItem')

/**
 * UI module
 * @var
 * @name ui
 * @type {Module}
 */
var ui = require('../utils/ui')

var timeUtils = require('../utils/time')
var timestamp = timeUtils.timestamp

/**
 * A selector to select the header and the footer but not the body
 * @const
 * @inner
 */
var HEADER_FOOTER_ONLY_SELECTOR = '.header-panel, .footer-panel'

/**
 * A selector to select the body but not the header and the footer
 * @const
 * @inner
 */
var BODY_ONLY_SELECTOR = '.body-panel'

// Static API
module.exports = {
  create: create
}

// Inner API
// _createInsertHeaderMenuItem()
// _createInsertFooterMenuItem()
// _createRemoveHeaderMenuItem()
// _createRemoveFooterMenuItem()
// _createInsertPageNumberMenuItem(editor)
// _createinsertNumberOfPagesMenuItem(editor)
// _createEditFormatMenuItem(editor)

/**
 * Create a hash of all the menu items for the plugin
 * @function
 * @param {Editor} editor The tinymce active editor
 * @returns {object} the created hash of menu items
 */
function create (editor) {
  return {
    insertHeader: _createInsertHeaderMenuItem(editor),
    insertFooter: _createInsertFooterMenuItem(editor),
    removeHeader: _createRemoveHeaderMenuItem(editor),
    removeFooter: _createRemoveFooterMenuItem(editor),
    insertPageNumber: _createInsertPageNumberMenuItem(editor),
    insertNumberOfPages: _createinsertNumberOfPagesMenuItem(editor),
    editFormat: _createEditFormatMenuItem(editor)
  }
}

/**
 * Create a menu item to insert a header
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createInsertHeaderMenuItem (editor) {
  return new MenuItem('insertHeader', {
    text: 'Insérer une entête',
    icon: 'template',
    id: 'plugin-headersfooters-menuitem-insert-header' + timestamp(),
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.header.height = '20mm'
      master.currentFormat.header.border.width = '1mm'
      master.currentFormat.header.margins.bottom = '5mm'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.insertHeader.hide()
      master.menuItemsList.removeHeader.show()
    }
  })
}

/**
 * Create a menu item to remove a header
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createRemoveHeaderMenuItem (editor) {
  return new MenuItem('removeHeader', {
    text: "Supprimer l'entête",
    icon: 'undo',
    id: 'plugin-headersfooters-menuitem-remove-header' + timestamp(),
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.header.height = '0'
      master.currentFormat.header.border.width = '0'
      master.currentFormat.header.margins.bottom = '0'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.removeHeader.hide()
      master.menuItemsList.insertHeader.show()
    }
  })
}

/**
 * Create a menu item to insert a footer
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createInsertFooterMenuItem (editor) {
  return new MenuItem('insertFooter', {
    text: 'Insérer un pied de page',
    icon: 'template',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.footer.height = '20mm'
      master.currentFormat.footer.border.width = '1mm'
      master.currentFormat.footer.margins.top = '5mm'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.insertFooter.hide()
      master.menuItemsList.removeFooter.show()
    }
  })
}

/**
 * Create a menu item to remove a footer
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createRemoveFooterMenuItem (editor) {
  return new MenuItem('removeFooter', {
    text: 'Supprimer le pied de page',
    icon: 'undo',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    onclick: function () {
      var master = editor.plugins.headersfooters.getMaster()
      master.currentFormat.footer.height = '0'
      master.currentFormat.footer.border.width = '0'
      master.currentFormat.footer.margins.top = '0'
      master.currentFormat.applyToPlugin(master)
      master.menuItemsList.removeFooter.hide()
      master.menuItemsList.insertFooter.show()
    }
  })
}

/**
 * Create a menu item to insert page number
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createInsertPageNumberMenuItem (editor) {
  return new MenuItem('insertPageNumber', {
    text: 'Insérer le numéro de page',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, HEADER_FOOTER_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertPageNumberCmd'
  })
}

/**
 * Create a menu item to insert the number of pages
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createinsertNumberOfPagesMenuItem (editor) {
  return new MenuItem('insertNumberOfPages', {
    text: 'Insérer le nombre de page',
    // icon: 'text',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, HEADER_FOOTER_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, HEADER_FOOTER_ONLY_SELECTOR))
    },
    cmd: 'insertNumberOfPagesCmd'
  })
}

/**
 * Create a menu item to edit the current format
 * @function
 * @inner
 * @returns {MenuItem}
 */
function _createEditFormatMenuItem (editor) {
  return new MenuItem('editFormat', {
    text: 'Format',
    icon: 'newdocument',
    context: 'document',
    onPostRender: function () {
      ui.resetMenuItemState.call(this, editor, BODY_ONLY_SELECTOR)
      editor.on('NodeChange', ui.resetMenuItemState.bind(this, editor, BODY_ONLY_SELECTOR))
    },
    cmd: 'editFormatCmd'
  })
}

},{"../classes/MenuItem":5,"../utils/time":12,"../utils/ui":14}],9:[function(require,module,exports){
'use strict'

/**
 * This module expose the plugin event handlers
 * @module
 * @name eventHandlers
 */

var uiUtils = require('./utils/ui')

module.exports = {
  'Init': {
    setBodies: setBodies,
    setStackedLayout: setStackedLayout,
    setPageLayout: setPageLayout,
    reloadMenuItems: reloadMenuItems
  },
  'NodeChange': {},
  'SetContent': {},
  'BeforeSetContent': {},
  'Focus': {
    enterHeadFoot: enterHeadFoot
  },
  'Blur': {
    leaveHeadFoot: leaveHeadFoot
  },
  'Focus Blur Paste SetContent NodeChange HeadersFooters:SetFormat': {
    applyCurrentFormat: applyCurrentFormat,
    reloadMenuItems: reloadMenuItems
  },
  'HeadersFooters:Error:NegativeBodyHeight': {
    alertErrorNegativeBodyHeight: alertErrorNegativeBodyHeight
  }
}

function setBodies (evt) {
  var editor = evt.target
  this.documentBodies.mce[this.type] = editor.getBody()
  if (!this.documentBodies.app) {
    this.documentBodies.app = window.document.body
  }
  this.documentBody = editor.getBody()
}

function setStackedLayout (evt) {
  uiUtils.mapMceLayoutElements(this.bodyClass, this.stackedLayout)
}

function setPageLayout (evt) {
  if (this.isMaster) {
    uiUtils.mapPageLayoutElements(this.pageLayout)
  }
}

function enterHeadFoot (evt) {
  this.enable()
}

function leaveHeadFoot (evt) {
  this.disable()
}

function applyCurrentFormat (evt) {
  var that = this
  if (this.currentFormat) {
    // console.info('evt', that.type, evt.type)
    if (evt.type === 'blur' || evt.type === 'focus') {
      setTimeout(function () {
        that.currentFormat.applyToPlugin(that)
      }, 200)
    } else {
      that.currentFormat.applyToPlugin(that)
    }
  }
}

/**
 * @param {Event} evt HeadersFooters:Error:NegativeBodyHeight event
 * @TODO document setting `editor.settings.SILENT_INCONSISTANT_FORMAT_WARNING`
 * @TODO document event `HeadersFooters:Error:NegativeBodyHeight`
 */
function alertErrorNegativeBodyHeight (evt) {
  var editor = evt.target
  if (!editor.settings.SILENT_INCONSISTANT_FORMAT_WARNING) {
    // editor.execCommand('editFormatCmd')
    // throw new Error('Inconsistant custom format: body height is negative. Please fix format properties')
    console.error('Inconsistant custom format: body height is negative. Please fix format properties')
  }
}

function reloadMenuItems (evt) {
  var editor = evt.target
  if (editor && editor.plugins && editor.plugins.headersfooters) {
    editor.plugins.headersfooters.reloadMenuItems()
  }
}

},{"./utils/ui":14}],10:[function(require,module,exports){
'use strict'

/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 2017 SIRAP Group All rights reserved
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
 * @see https://github.com/sirap-group/tinymce-plugin-headersfooters
 * @author Rémi Becheras
 * @author Groupe SIRAP
 * @license GNU GPL-v2 http://www.tinymce.com/license
 */

/**
 * Tinymce library - injected by the plugin loader.
 * @external tinymce
 * @see {@link https://www.tinymce.com/docs/api/class/tinymce/|Tinymce API Reference}
 */
var tinymce = window.tinymce

var menuItems = require('./components/menu-items')

var units = require('./utils/units')
var events = require('./utils/events')
var uiUtils = require('./utils/ui')

var eventHandlers = require('./event-handlers')
var Format = require('./classes/Format')
var editFormatOpenMainWin = require('./components/edit-format-window')

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
  var thisPlugin = this

  this.type = editor.settings.headersfooters_type
  this.bodyClass = editor.settings.body_class

  // bind plugin methods
  this.enable = enable
  this.disable = disable
  this.setFormat = setFormat
  this.parseParamList = parseParamList
  this.reloadMenuItems = reloadMenuItems

  this.isMaster = this.type === 'body'
  this.isSlave = !this.isMaster

  if (this.isMaster) {
    tinymce.getMasterHeadersFootersPlugin = function () {
      return thisPlugin
    }
  }
  this.getMaster = function () {
    if (tinymce.getMasterHeadersFootersPlugin) {
      return tinymce.getMasterHeadersFootersPlugin()
    } else {
      return null
    }
  }

  if (this.isMaster && window.env === 'development') {
    window.mceHF = this
  }

  this.headerFooterFactory = null

  this.units = units
  this.editor = editor

  this.documentBody = null
  this.documentBodies = {
    app: null,
    mce: {
      header: null,
      body: null,
      footer: null
    }
  }
  this.stackedLayout = {
    root: null,
    wrapper: null,
    layout: null,
    menubar: null,
    toolbar: null,
    editarea: null,
    statusbar: null
  }

  if (this.isMaster) {
    this.pageLayout = {
      pageWrapper: null,
      pagePanel: null,
      headerWrapper: null,
      headerPanel: null,
      bodyPanel: null,
      footerWrapper: null,
      footerPanel: null
    }
  }

  this.availableFormats = {}
  this.formats = []
  this.customFormats = []
  this.defaultFormat = null
  this.currentFormat = null

  _setAvailableFormats.call(this)

  this.menuItemsList = menuItems.create(editor)
  uiUtils.autoAddMenuItems.call(this)

  editor.addCommand('insertPageNumberCmd', function () {
    editor.insertContent('{{page}}')
  })
  editor.addCommand('insertNumberOfPagesCmd', function () {
    editor.insertContent('{{pages}}')
  })
  editor.addCommand('editFormatCmd', function () {
    editFormatOpenMainWin(editor)(thisPlugin.currentFormat)
  })

  events.autoBindImplementedEventCallbacks.call(this, editor, eventHandlers)

  // if (window.env === 'development' && this.isMaster) {
  //   setTimeout(function () {
  //     editor.execCommand('editFormatCmd')
  //   })
  // }
}

function enable () {
  this.stackedLayout.menubar.show()
  this.stackedLayout.toolbar.show()
  this.stackedLayout.statusbar.wrapper.show()
  this.stackedLayout.statusbar.path.show()
  this.stackedLayout.statusbar.wordcount.show()
  this.stackedLayout.statusbar.resizehandle.show()

  this.stackedLayout.statusbar.wrapper.css({left: 0, right: 0, zIndex: 9999})

  this.editor.$('body').css({opacity: 1})
}

function disable () {
  this.stackedLayout.menubar.hide()
  this.stackedLayout.toolbar.hide()
  this.stackedLayout.statusbar.wrapper.hide()
  this.stackedLayout.statusbar.path.hide()
  this.stackedLayout.statusbar.wordcount.hide()
  this.stackedLayout.statusbar.resizehandle.hide()

  if (!this.editor.selection.isCollapsed()) {
    this.editor.selection.collapse()
  }
  this.editor.$('body').css({opacity: 0.25})
}

function _setAvailableFormats () {
  var that = this
  var settings = this.editor.settings

  // set enabled default formats
  var userEnabledDefaultFormats = this.parseParamList(settings.headersfooters_formats)
  .map(function (formatName) {
    return Format.defaults[formatName]
  })
  .filter(function (v) {
    return !!v
  })
  if (userEnabledDefaultFormats.length) {
    this.formats = userEnabledDefaultFormats
  } else {
    this.formats = []
    for (var name in Format.defaults) {
      that.formats.push(Format.defaults[name])
    }
  }

  // set user custom formats
  this.customFormats = (settings.headersfooters_custom_formats || [])
  .map(function (f) {
    return new Format(f.name, f.config)
  })

  // set the formats available for the editor
  this.availableFormats = {}
  // use enabled default formats
  this.formats.map(function (f) {
    that.availableFormats[f.name] = f
  })
  // add or override custom formats
  this.customFormats.map(function (f) {
    that.availableFormats[f.name] = f
  })

  // select a default format for new doc
  this.defaultFormat = this.availableFormats[settings.headersfooters_default_format] || this.formats[0] || this.customFormats[0]

  // current format is set on editor init callback
}

function setFormat (format) {
  this.currentFormat = new Format(format.name, format)
  this.editor.fire('HeadersFooters:SetFormat')
}

function parseParamList (paramValue) {
  if (paramValue === undefined) {
    return []
  }
  if (typeof paramValue !== 'string') {
    throw new TypeError('paramValue must be a String, ' + typeof paramValue + ' given.')
  }
  return paramValue.split(' ')
}

/**
 * Helper function. Do the reload of headers and footers
 * @method
 * @returns {undefined}
 */
function reloadMenuItems () {
  if (this.currentFormat) {
    if (this.currentFormat.header.height && this.currentFormat.header.height !== '0') {
      this.menuItemsList.insertHeader.hide()
      this.menuItemsList.removeHeader.show()
    } else {
      this.menuItemsList.insertHeader.show()
      this.menuItemsList.removeHeader.hide()
    }
    if (this.currentFormat.footer.height && this.currentFormat.footer.height !== '0') {
      this.menuItemsList.insertFooter.hide()
      this.menuItemsList.removeFooter.show()
    } else {
      this.menuItemsList.insertFooter.show()
      this.menuItemsList.removeFooter.hide()
    }
  }
}

},{"./classes/Format":4,"./components/edit-format-window":7,"./components/menu-items":8,"./event-handlers":9,"./utils/events":11,"./utils/ui":14,"./utils/units":15}],11:[function(require,module,exports){
'use strict'

module.exports = {
  autoBindImplementedEventCallbacks: autoBindImplementedEventCallbacks
}

/**
 * Automatically bind event callbacks implemented in `eventHandlers` module
 */
function autoBindImplementedEventCallbacks (editor, eventHandlers) {
  for (var eventName in eventHandlers) {
    for (var callbackName in eventHandlers[eventName]) {
      editor.on(eventName, eventHandlers[eventName][callbackName].bind(this))
    }
  }
}

},{}],12:[function(require,module,exports){
'use strict'

module.exports = {
  timestamp: timestamp
}

function timestamp () {
  return Date.now()
}

},{}],13:[function(require,module,exports){
/**
 * This file contains the source code for the module `lib/ui/helpers`
 * @file
 * @author "Rémi Becheras <rbecheras@sirap.fr>"
 * @copyright 2016 © Groupe SIRAP, tout droits réservés
 * @see module:lib/ui/helpers
 */

/**
 * This module exports some useful UI helplers to create UI components
 * @module lib/ui/helpers
 */

'use strict'

var tinymce = window.tinymce

module.exports = {
  createTextBox: createTextBox,
  createUnitSelectBox: createUnitSelectBox,
  createSelectBox: createSelectBox,
  createTab: createTab,
  createFieldset: createFieldset,
  createForm: createForm,
  createListBox: createListBox,
  createListBoxItem: createListBoxItem,
  createColorPicker: createColorPicker
}

/**
 * Create a simple text box
 * @method
 * @param {string} label The textBox label
 * @param {string} name The textBox name
 * @param {number} [maxWidth=null] The maximum width for the input
 * @param {number} [minWidth=55] The minimum width for the input
 * @returns {TextBox} textBox The new textBox
 */
function createTextBox (label, name, maxWidth, minWidth) {
  var textBox = {
    label: label,
    name: name,
    maxWidth: maxWidth || null,
    minWidth: minWidth || null,
    onchange: function (e) {
      // console.log('createTextBox on action', e)
    }
  }

  return new tinymce.ui.TextBox(textBox)
}

/**
 * Create a select box to select a length unit
 * @method
 * @param {string} inputName - A name to identify the input in the form
 * @param {string} [defaultUnit=pt] - A default unit in (`pt`, `mm`, or `cm`).
 * @param {number} [maxWidth=55] - The maximum width for th input.
 * @param {number} [minWidth=55] - The minimum width for th input.
 * @returns {SelectBox} unitSelectBox The new unit select box.
 */
function createUnitSelectBox (inputName, defaultUnit, maxWidth, minWidth) {
  defaultUnit = defaultUnit || 'pt'
  return {
    label: 'Unit',
    name: inputName,
    type: 'listbox',
    minWidth: minWidth || 55,
    maxWidth: maxWidth || 55,
    values: [
      {text: 'pt', value: 'pt'},
      {text: 'cm', value: 'cm'},
      {text: 'mm', value: 'mm'}
    ],
    text: defaultUnit,
    value: defaultUnit
  }
}

function createSelectBox (label, inputName, values, maxWidth, minWidth) {
  return new tinymce.ui.ListBox({
    label: label,
    name: inputName,
    type: 'listbox',
    minWidth: minWidth || 55,
    maxWidth: maxWidth || null,
    text: label,
    values: values,
    onselect: function (e) {
      // console.log('SelectBox Selected', e)
    }
  })
}

/**
 * @function
 * @param
 * @returns {object}
 */
function createTab (title, fieldsets, direction, columns) {
  return {
    title: title,
    type: 'form',
    items: {
      type: 'form',
      layout: 'grid',
      columns: columns || 1,
      // layout: 'flex',
      direction: direction || 'collumn',
      labelGapCalc: 'children',
      padding: 0,
      items: fieldsets
    }
  }
}

/**
 * Create a field set
 * @method
 * @param {string} title The field set title
 * @param {array<object>} items The field items to put in the field set
 * @param {number} [maxWidth=null] The maximum with for the fieldset, in pixels
 * @returns {Fieldset} fieldset The new field set
 */
function createFieldset (title, items, maxWidth, minWidth) {
  var fieldset = {
    type: 'fieldset',
    title: title,
    items: items,
    maxWidth: maxWidth || null,
    minWidth: minWidth || null
  }
  return fieldset
}

/**
 * @function
 * @param
 * @returns {object}
 */
function createForm (items, columns) {
  return {
    type: 'form',
    labelGapCalc: false,
    padding: 0,
    layout: 'grid',
    columns: columns || 2,
    defaults: {
      type: 'textbox',
      maxWidth: 100
    },
    items: items
  }
}

/**
 * @method
 * @static
 * @param {string} label The label for the list box
 * @param {string} name The name of the list box to identify it in the form
 * @param {array<ListBoxItem>} values An array of list box items
 * @param {ListBoxItem} [defaultItem=N/A] An item to select as default value
 * @param {number} [maxWidth=null] The maximum width for the input
 * @returns {object}
 */
function createListBox (label, name, values, defaultItem, maxWidth) {
  return {
    label: label,
    name: name,
    type: 'listbox',
    text: 'None',
    minWidth: 90,
    maxWidth: maxWidth,
    values: values
  }
}

/**
 * Create an item for createListBox() values array
 * @param {string} text The text shown for the item
 * @param {string|number} value A value for the item
 * @return {ListBoxItem}
 */
function createListBoxItem (text, value) {
  if (value === undefined) {
    value = text
  }
  var item = {
    text: text,
    value: value
  }
  return item
}

/**
 * Create a color picker
 * @method
 * @param {string} label The label for the color picker
 * @param {string} name The name to identify the color picker in the form set
 * @returns {ColorPicker} colorPicker The new color picker
 */
function createColorPicker (label, name, callback) {
  return {
    type: 'colorbox',
    label: label,
    name: name,
    minWidth: 140,
    maxWidth: 140,
    onaction: callback
  }
}

},{}],14:[function(require,module,exports){
'use strict'

var units = require('./units')
var $ = window.jQuery

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */

module.exports = {
  jQuery: $,
  lockNode: lockNode,
  unlockNode: unlockNode,
  addUnselectableCSSClass: addUnselectableCSSClass,
  resetMenuItemState: resetMenuItemState,
  autoAddMenuItems: autoAddMenuItems,
  mapMceLayoutElements: mapMceLayoutElements,
  mapPageLayoutElements: mapPageLayoutElements,
  getElementHeight: getElementHeight
}

/**
 * Lock a node
 * @method
 * @mixin
 * @returns {undefined}
 */
function lockNode () {
  var $this = $(this)
  $this.attr('contenteditable', false)
  $this.addClass('unselectable')
}

/**
 * Unlock a node
 * @method
 * @mixin
 * @returns {undefined}
 */
function unlockNode () {
  var $this = $(this)
  $this.attr('contenteditable', true)
  $this.removeClass('unselectable')
  $this.focus()
}

/**
 * Create and apply the unselectable CSS class to the active document
 * @method
 * @static
 * @param {Editor} editor The tinymce active editor
 * @returns {undefined}
 */
function addUnselectableCSSClass (editor) {
  var head = $('head', editor.getDoc())
  var unselectableCSSRules = '.unselectable { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
  var style = $('<style>').attr('type', 'text/css').html(unselectableCSSRules)
  style.appendTo(head)
}

/**
 * Reset a menu item state
 * @method
 * @static
 * @param {Editor} editor The tinymce active editor
 * @param {String} selector The selector to use to DO WHAT ?
 * @TODO finish to describe the selector parameter
 */
function resetMenuItemState (editor, selector) {
  var selectedElement = editor.selection.getStart()
  var $sel = $(selectedElement)
  var parents = $sel.parents(selector)
  this.disabled(!parents.length)
}

/**
 * Add the plugin's menu items
 */
function autoAddMenuItems () {
  for (var itemName in this.menuItemsList) {
    this.editor.addMenuItem(itemName, this.menuItemsList[itemName])
  }
}

function mapMceLayoutElements (bodyClass, stackedLayout) {
  stackedLayout.root = $('.' + bodyClass)
  stackedLayout.wrapper = stackedLayout.root.children('.mce-tinymce')
  stackedLayout.layout = stackedLayout.wrapper.children('.mce-stack-layout')
  stackedLayout.menubar = stackedLayout.layout.children('.mce-stack-layout-item.mce-menubar.mce-toolbar')
  stackedLayout.toolbar = stackedLayout.layout.children('.mce-stack-layout-item.mce-toolbar-grp')
  stackedLayout.editarea = stackedLayout.layout.children('.mce-stack-layout-item.mce-edit-area')
  stackedLayout.iframe = stackedLayout.editarea.children('iframe')
  stackedLayout.statusbar = {}
  stackedLayout.statusbar.wrapper = stackedLayout.layout.children('.mce-stack-layout-item.mce-statusbar')
  stackedLayout.statusbar.flowLayout = stackedLayout.statusbar.wrapper.children('.mce-flow-layout')
  stackedLayout.statusbar.path = stackedLayout.statusbar.wrapper.children('.mce-path')
  stackedLayout.statusbar.wordcount = stackedLayout.layout.children('.mce-wordcount')
  stackedLayout.statusbar.resizehandle = stackedLayout.layout.children('.mce-resizehandle')
}

function mapPageLayoutElements (pageLayout) {
  pageLayout.pageWrapper = $('.page-wrapper')
  pageLayout.pagePanel = $('.page-panel')

  pageLayout.headerWrapper = $('.header-wrapper')
  pageLayout.headerPanel = $('.header-panel')
  setTimeout(function () {
    pageLayout.headerIframe = pageLayout.headerPanel.find('iframe')
  }, 100)

  pageLayout.bodyWrapper = $('.body-wrapper')
  pageLayout.bodyPanel = $('.body-panel')

  pageLayout.footerWrapper = $('.footer-wrapper')
  pageLayout.footerPanel = $('.footer-panel')
  setTimeout(function () {
    pageLayout.footerIframe = pageLayout.footerPanel.find('iframe')
  }, 100)
}

function getElementHeight (element, win, isBorderBox) {
  win = win || window
  var style = win.getComputedStyle(element)
  var height = px(style.height) // +
    // px(style.paddingTop) + px(style.paddingBottom) +
    // px(style.marginTop) + px(style.marginBottom)
  return height

  function px (style) {
    return Number(units.getValueFromStyle(style))
  }
}

},{"./units":15}],15:[function(require,module,exports){
'use strict'

/**
 * A set of static helper methods to work with units.
 * It is imported from tinymce-plugin-paragraph.
 * @module utils/units
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph
 * @see https://github.com/sirap-group/tinymce-plugin-paragraph/blob/master/src/lib/units.js
 */

var document = window.document

_createDpiTestElements()

module.exports = {
  getValueFromStyle: getValueFromStyle,
  getUnitFromStyle: getUnitFromStyle,
  getDpi: getDpi,

  in2mm: in2mm,
  mm2in: mm2in,

  px2in: px2in,
  in2px: in2px,

  px2mm: px2mm,
  mm2px: mm2px,

  in2pt: in2pt,
  pt2in: pt2in,

  px2pt: px2pt,
  pt2px: pt2px
}

// expose the module to the global scope in development environment
if (window.env === 'development' && !window._units) {
  window._units = module.exports
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
function _createDpiTestElements () {
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
 * Converts milimeters (mm) to inches (in)
 * 1 in = 25.4 mm
 * @method
 * @static
 * @param {number} mm Number of milimeters to convert to inches
 * @returns {number} - Resulting number of inches (in)
 */
function mm2in (qmm) {
  return Number(qmm) / 25.4
}

/**
* Converts pixels (px) to inches (in)
* dpi = px / in
* => in = px / dpi
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
* Converts pixels (px) to inches (in)
* dpi = px / in
* => px = in * dpi
* @method
* @static
* @param {number} in Number of inches to convert to pixels
* @returns {number} - Resulting number of pixels (px)
*/
function in2px (qin) {
  var dpi = getDpi()
  return Number(qin) * Number(dpi)
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
 * Converts milimeters (mm) to pixels (px)
 * mm2in -> in2px
 * @method
 * @static
 * @param {number} qmm Number of milimeters to convert to pixels
 * @returns {number} - Resulting number of pixels (px)
 */
function mm2px (qmm) {
  return in2px(mm2in(qmm))
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
* Converts point (pt) to inches (in)
* 72 = pt / in -> in = pt / 72
* @method
* @static
* @param {number} inches Number of inches (in) to convet to points (pt)
* @returns {number} - Resulting number of points (pt)
*/
function pt2in (qpt) {
  return qpt / 72
}

/**
 * Converts pixels (px) to points (pt)
 * px2in -> in2pt
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
 * Converts point (pt) to pixels (px)
 * pt2in -> in2px
 * @method
 * @static
 * @param {number} pt Number of points to convert to pixels
 * @returns {number} - Resulting number of pixels (px)
 */
function pt2px (qpt) {
  return in2px(pt2in(qpt))
}

},{}]},{},[1]);
