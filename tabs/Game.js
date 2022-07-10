(function (React) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Links;(function(Links){Links["gameUserGuide"]="https://github.com/source-academy/modules/wiki/%5Bgame%5D-User-Guide";Links["gameDeveloperDocumentation"]="https://github.com/source-academy/modules/wiki/%5Bgame%5D-Developer-Documentation";Links["gameAPIDocumentation"]="https://source-academy.github.io/modules/documentation/modules/game.html";})(Links||(Links={}));

    var Game=function(_super){__extends(Game,_super);function Game(){return _super!==null&&_super.apply(this,arguments)||this}Game.prototype.render=function(){return React__default['default'].createElement("div",null,"Info: You need to visit the game to see the effect of your program. Remember to save your work first!",React__default['default'].createElement("br",null),React__default['default'].createElement("br",null),"You may find the game module"," ",React__default['default'].createElement("a",{href:Links.gameAPIDocumentation,rel:"noopener noreferrer",target:"_blank"},"documentation"," "),"and"," ",React__default['default'].createElement("a",{href:Links.gameUserGuide,rel:"noopener noreferrer",target:"_blank"},"user guide"," "),"useful.")};return Game}(React__default['default'].PureComponent);var index = {toSpawn:function(){return true},body:function(debuggerContext){return React__default['default'].createElement(Game,{debuggerContext:debuggerContext})},label:"Game Info Tab",iconName:"info-sign"};

    return index;

}(React));
