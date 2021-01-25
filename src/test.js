/**
 * Test library to demonstrate the use of new flexible modules feature.
 *
 * Author: Loh Xian Ze, Bryan
 */

/**
 * The code in this page will be transpiled by babel into ES5 Javascript syntax
 * which will be located in the build folder. Js-slang library will import the
 * individual module files as a string.
 *
 * @example
 * import React from "react";
 * export function loadModule( ... ) {
 *  const moduleText = loadModuleText(path);
 *  // moduleText: ""use strict";(React,_params)=>{ ... };";
 *  const moduleFunction = eval(moduleText);
 *  // moduleFunction: (React, _params) => { ... }
 *  return moduleLib({ ... }, React)
 * }
 *
 * @param {React} React -
 * @param {Object<string, any>} _params -
 */
(React, _params) => {
  return {
    /**
     * For functions that source academy cadets will be interacting with
     * in the IDE.
     */
    functions: {
      make_empty_array: () => [],
      array_append: (arr1, arr2) => [...arr1, ...arr2],
    },

    /**
     * For generating the side content tabs on cadet-frontend.
     */
    sideContents: [
      {
        /**
         * (result) => boolean
         * This function will be called to determine if the component will be
         * rendered.
         *
         * @param {Result} result
         */
        shouldRender: (result) => {},

        /**
         * (????) => React JSX (To be transpiled by babel in Github Actions)
         * This function will be called to render the module component in the
         * sideContentTabs on cadet-frontend
         *
         * @param {Object<string, any>} props
         */
        component: (props) => {
          return (
            <div>
              <h1>{props.counter}</h1>
              <button>Click Me!</button>
            </div>
          );
        },
      },
    ],
  };
};
