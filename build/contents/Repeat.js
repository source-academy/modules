(function (React) {
  'use strict';

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);

  var index = function index(props) {
    return React__default['default'].createElement(
      'div',
      null,
      'This is spawned from the repeat package'
    );
  };
  var index$1 = {
    toSpawn: function () {
      return true;
    },
    body: index,
    label: 'Repeat Test Tab',
    iconName: 'build',
  };

  return index$1;
})(React);
