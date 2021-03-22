(function () {
    'use strict';

    function _repeat(f,n){return n===0?function(x){return x}:function(x){return f(_repeat(f,n-1)(x))}}function twice(f){return _repeat(f,2)}function thrice(f){return _repeat(f,3)}function repeat(){return {repeat:_repeat,twice:twice,thrice:thrice}}

    return repeat;

}());
