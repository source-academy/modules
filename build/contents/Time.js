(function (React) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var index=function index(context){if(context.result.status!=="finished")return React__default['default'].createElement("div",null,"Your program did not finish evaluating.");return React__default['default'].createElement("div",{style:styles.root},React__default['default'].createElement("div",{style:styles.output},"The last line of your program evaluates to"," ",context.result.value.toString()),React__default['default'].createElement("div",{style:styles.clock},React__default['default'].createElement("svg",{width:"120",height:"120"},React__default['default'].createElement("circle",{style:styles.face,cx:"50",cy:"50",r:"50"}),React__default['default'].createElement("line",{style:__assign(__assign({},styles.hands),styles.hour),x1:"50",y1:"50",x2:"50",y2:"30"}),React__default['default'].createElement("line",{style:__assign(__assign({},styles.hands),styles.minute),x1:"50",y1:"50",x2:"50",y2:"20"}),React__default['default'].createElement("line",{style:__assign(__assign({},styles.hands),styles.second),x1:"50",y1:"50",x2:"50",y2:"15"}),React__default['default'].createElement("line",{style:styles.hands,x1:"50",y1:"50",x2:"50",y2:"50"}),React__default['default'].createElement("text",{x:"42",y:"14"},"12"),React__default['default'].createElement("text",{x:"90",y:"56"},"3"),React__default['default'].createElement("text",{x:"48",y:"96"},"6"),React__default['default'].createElement("text",{x:"4",y:"58"},"9"))))};var styles={root:{display:"flex","flex-direction":"column","align-items":"center"},output:{margin:"8px"},clock:{width:"110px",height:"110px",padding:"4px"},face:{stroke:"black","stroke-width":"2px",fill:"white"},hands:{stroke:"black","stroke-linecap":"round"},hour:{"stroke-width":"3px"},minute:{"stroke-width":"2px"},second:{"stroke-width":"1px"}};var index$1 = {toSpawn:function(){return true},body:index,label:"Show N Tell (Time)",iconName:"time"};

    return index$1;

}(React));
