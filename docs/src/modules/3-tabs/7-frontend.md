---
title: Development with Frontend
---
# Development with Source Academy `frontend`

The following set of instructions explains how to use a local copy of the Source Academy [frontend](https://github.com/source-academy/frontend) with a local copy of the modules code repository. If you only need to check how your tabs are being displayed
during development, you can use the lighterweight development server instead.

Following the steps below will configure the environment of the Source Academy frontend to use your locally served modules instead of the publicly available ones. Doing this will allow you to develop and modify modules without affecting the currently publicly available ones.

You will need to already have a local instance of Source Academy frontend set up. If you do not, you can follow the instructions [here](https://github.com/source-academy/frontend#getting-started) to setup an instance of Source Academy frontend on your local development machine.

## 1. Configure Frontend Environment Variables

Ensure that the environment variable `REACT_APP_MODULE_BACKEND_URL` in the `.env` file of the Source Academy frontend is configured to the URL of the module site that you are trying to retrieve modules from.

## 2. Ensure that the modules server is running

By default, a local server is available by running `yarn run serve`, which can that be accessed at <http://localhost:8022>.
The default modules are implemented in the repository <https://github.com/source-academy/modules> and deployed to the modules site <https://source-academy.github.io/modules>.

## 3. Run Frontend

Upon starting the local instance of Source Academy frontend, the Source Academy will connect to the configured modules site when importing modules.
