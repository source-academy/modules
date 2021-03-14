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
     * Leave it as a blank array if not in use.
     *
     * Use file with extension.tsx if side content tabs in use
     */
    sideContents: [],
  };
};
