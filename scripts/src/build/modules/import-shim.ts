// Use this file to replicate the functionality of rollup-plugin-inject-process-env
// and any other thing that needs to be defined in `process`
export const process = {
  env: {
    NODE_ENV: 'production',
  },
};

// or any other constant that needs to be injected
