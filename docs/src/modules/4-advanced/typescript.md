# Typescript Setup

Using the [`extends`](https://www.typescriptlang.org/tsconfig/#extends) property, `tsconfig.json` files can inherit options from another `tsconfig.json` file. The repository is set up with `tsconfig`s at
different levels to share options across both bundles and tabs.

## Missing types for dependencies and overriding `tsconfig.json`
Sometimes, your bundle might depend on packages that have published their types differently. For example, the `communication` bundle requires `mqtt`:
```ts
import { connect, type MqttClient, type QoS } from 'mqtt/dist/mqtt';
// Need to use "mqtt/dist/mqtt" as "mqtt" requires global, which SA's compiler does not define.

export const STATE_CONNECTED = 'Connected';
export const STATE_DISCONNECTED = 'Disconnected';
export const STATE_RECONNECTING = 'Reconnecting';
export const STATE_OFFLINE = 'Offline';

// ...other things
```
The `mqtt` dependency however, is specified as such in `package.json`:
```json
{
  "dependencies": {
    "mqtt": "^4.3.7",
    "uniqid": "^5.4.0"
  }
}
```
The helpful comment below the import explains the discrepancy. Without further configuration, we find that Typescript is unable to find the types for the `mqtt/dist/mqtt` package:
![](./mqtt-types.png)

`tsconfig` does provide a way for you to tell Typescript where to look for types: using either the `paths` or `types` field. The `tsconfig` for the `communication` bundle looks like this:

<<< ../../../../src/bundles/communication/tsconfig.json

The `paths` compiler option has been set to tell Typescript where to find the types for `mqtt/dist/mqtt`. Because of the way `tsconfig.json` file inheritance works, if you override a configuration option in a child `tsconfig`,
you'll need to specify the options from the parent configuration again (hence the `js-slang/context` path).

In other words, if you need to modify `tsconfig.json`, make sure to include the corresponding options inherited from the parent `tsconfig.json`.
