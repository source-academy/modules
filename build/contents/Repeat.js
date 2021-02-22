(function (React) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    var styles={card:{"box-shadow":"0 4px 8px 0 rgba(0,0,0,0.2)",transition:"0.3s","border-radius":"5px","margin-bottom":"4px","background-color":"white",color:"black"}};var index=function index(context){if(context.result.status!=="finished")return React__default['default'].createElement("div",null,"Your program did not finish evaluating.");return React__default['default'].createElement(React__default['default'].Fragment,null,React__default['default'].createElement("div",{style:styles.card},"The last line of your program evaluates to"," ",context.result.value.toString()),context.result.value.toString()==="Captain America"&&React__default['default'].createElement("img",{src:"https://media.giphy.com/media/S3sc3Pg9dFpUA/giphy.gif",alt:"Captain America"}))};var index$1 = {toSpawn:function(){return true},body:index,label:"Repeat Test Tab",iconName:"build"};

    return index$1;

}(React));
