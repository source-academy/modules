# Spell Checking

Spell checking for the documentation server is provided by [`cspell`](https://cspell.org), the configuration for which can
be found in `cspell.config.js`.

Spell checking is performed automatically as part of the CI/CD pipeline and can be run automatically
using the command `yarn spellcheck`.

If the spell check fails, it will be reported in the terminal:

![image](./spellcheck.png)

If any words fail, the spell check will exit with a non-zero error code, so you will not be able
to `git push` with spelling errors and the CI/CD pipeline job will fail.

If you need to add words to the dictionary, you can do so using `words` section of the config file.
