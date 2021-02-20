/**
 * Test library to demonstrate the use of new flexible modules feature.
 *
 * @author Loh Xian Ze, Bryan
 * @author Marcus Tang Xin Kye
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
 * @param {Object<string, any>} _params -
 */
(_params: any) => {
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
         * Currently spawns when the result in the REPL is "test"
         *
         * @param {DebuggerContext} context
         * @returns {boolean}
         */
        toSpawn: (context) => {
          return context.result.value === 'test';
        },

        /**
         * (DebuggerContext) => React JSX (To be transpiled by babel in Github Actions)
         * This function will be called to render the module component in the
         * sideContentTabs on cadet-frontend
         *
         * @param {Object<string, any>} props
         */
        body: (React: any) => (props: any) => {
          return (
            <div>
              <p>Sample text</p>
            </div>
          );
        },

        /**
         * A string that will appear as the tooltip.
         *
         * @type {String}
         */
        label: 'Test Component',

        /**
         * BlueprintJS IconName element, used to render the icon which will be \
         * displayed over the SideContent panel.
         * @see https://blueprintjs.com/docs/#icons
         *
         * @type {String}
         */
        iconName: 'mugshot',
      },
    ],
  };
};
