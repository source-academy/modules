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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Repeat=function(_super){__extends(Repeat,_super);function Repeat(props){var _this=_super.call(this,props)||this;_this.$video=null;_this.$canvas=null;_this.printError=function(){};_this.state={};return _this}Repeat.prototype.componentDidMount=function(){if(this.$video&&this.$canvas){this.props.debuggerContext.result.value.init(this.$video,this.$canvas,this.printError);}};Repeat.prototype.render=function(){var _this=this;return React__default['default'].createElement("div",null,React__default['default'].createElement("video",{ref:function(r){_this.$video=r;},autoPlay:true,id:"livefeed",width:400,height:300,style:{display:"none"}}),React__default['default'].createElement("canvas",{ref:function(r){_this.$canvas=r;},width:400,height:300}))};return Repeat}(React__default['default'].Component);var index = {toSpawn:function(){return true},body:function(debuggerContext){return React__default['default'].createElement(Repeat,{debuggerContext:debuggerContext})},label:"PixNFlix Live Feed",iconName:"mobile-video"};

    return index;

}(React));
