(function () {
    'use strict';

    function repeat(f,n){return n===0?function(x){return x}:function(x){return f(repeat(f,n-1)(x))}}function twice(f){return repeat(f,2)}function thrice(f){return repeat(f,3)}function index(__params){return {repeat:repeat,twice:twice,thrice:thrice}}

    return index;

}());
