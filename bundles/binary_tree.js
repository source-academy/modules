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

    function make_empty_tree(){return null}function make_tree(value,left,right){return [left,value,right]}

    var index = (function(){return {make_empty_tree:make_empty_tree,make_tree:make_tree}});

    return index;

}());
