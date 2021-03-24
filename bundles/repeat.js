(function () {
    'use strict';

    (function() {
        const env = {};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    function repeat(f,n){return n===0?function(x){return x}:function(x){return f(repeat(f,n-1)(x))}}function twice(f){return repeat(f,2)}function thrice(f){return repeat(f,3)}var index = (function(){return {repeat:repeat,twice:twice,thrice:thrice}});

    return index;

}());
