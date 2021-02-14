const { generateTemplateFiles } = require("generate-template-files");

generateTemplateFiles([
  {
    option: "Create Module Without Side Content Tab",
    defaultCase: "(snakeCase)",
    entry: {
      folderPath: "./templates/templates/__module__.ts",
    },
    stringReplacers: [
      {
        question: "What is the name of the module? (eg. binary_tree)",
        slot: "__module__",
      },
    ],
    output: {
      path: "./src/__module__(snakeCase).ts",
      pathAndFileNameDefaultCase: "(snakeCase)",
    },
  },
  {
    option: "Create Module with Side Content Tab",
    defaultCase: "(snakeCase)",
    entry: {
      folderPath: "./templates/templates/__module__.tsx",
    },
    stringReplacers: [
      {
        question: "What is the name of the module? (eg. binary_tree)",
        slot: "__module__",
      },
    ],
    output: {
      path: "./src/__module__(snakeCase).tsx",
      pathAndFileNameDefaultCase: "(snakeCase)",
    },
  },
]);
