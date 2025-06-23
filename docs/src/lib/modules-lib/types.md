[**Modules Common Library**](README.md)

***

[Modules Common Library](README.md) / types

# types

## Classes

### `abstract` glAnimation

Defined in: [types/index.ts:8](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L8)

Represents an animation drawn using WebGL

#### Constructors

##### Constructor

```ts
new glAnimation(duration, fps): glAnimation;
```

Defined in: [types/index.ts:9](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L9)

###### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`duration`

</td>
<td>

`number`

</td>
<td>

Duration of the animation in seconds

</td>
</tr>
<tr>
<td>

`fps`

</td>
<td>

`number`

</td>
<td>

Framerate in frames per second

</td>
</tr>
</tbody>
</table>

###### Returns

[`glAnimation`](#glanimation)

#### Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Modifier</th>
<th>Type</th>
<th>Description</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="duration"></a> `duration`

</td>
<td>

`readonly`

</td>
<td>

`number`

</td>
<td>

Duration of the animation in seconds

</td>
<td>

[types/index.ts:13](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L13)

</td>
</tr>
<tr>
<td>

<a id="fps"></a> `fps`

</td>
<td>

`readonly`

</td>
<td>

`number`

</td>
<td>

Framerate in frames per second

</td>
<td>

[types/index.ts:17](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L17)

</td>
</tr>
</tbody>
</table>

#### Methods

##### getFrame()

```ts
abstract getFrame(timestamp): AnimFrame;
```

Defined in: [types/index.ts:20](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L20)

###### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`timestamp`

</td>
<td>

`number`

</td>
</tr>
</tbody>
</table>

###### Returns

[`AnimFrame`](#animframe)

##### isAnimation()

```ts
static isAnimation(obj): obj is glAnimation;
```

Defined in: [types/index.ts:22](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L22)

###### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`obj`

</td>
<td>

`any`

</td>
</tr>
</tbody>
</table>

###### Returns

`obj is glAnimation`

## Interfaces

### AnimFrame

Defined in: [types/index.ts:24](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L24)

#### Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="draw"></a> `draw`

</td>
<td>

(`canvas`) => `void`

</td>
<td>

[types/index.ts:25](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L25)

</td>
</tr>
</tbody>
</table>

***

### ReplResult

Defined in: [types/index.ts:48](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L48)

Interface to represent objects that require a string representation in the
REPL

#### Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="toreplstring"></a> `toReplString`

</td>
<td>

() => `string`

</td>
<td>

[types/index.ts:49](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L49)

</td>
</tr>
</tbody>
</table>

## Type Aliases

### DebuggerContext

```ts
type DebuggerContext = {
  code: string;
  context: Context;
  lastDebuggerResult: any;
  result: any;
  workspaceLocation?: any;
};
```

Defined in: [types/index.ts:34](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L34)

DebuggerContext type used by frontend to assist typing information

#### Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="code"></a> `code`

</td>
<td>

`string`

</td>
<td>

[types/index.ts:37](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L37)

</td>
</tr>
<tr>
<td>

<a id="context"></a> `context`

</td>
<td>

`Context`

</td>
<td>

[types/index.ts:38](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L38)

</td>
</tr>
<tr>
<td>

<a id="lastdebuggerresult"></a> `lastDebuggerResult`

</td>
<td>

`any`

</td>
<td>

[types/index.ts:36](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L36)

</td>
</tr>
<tr>
<td>

<a id="result"></a> `result`

</td>
<td>

`any`

</td>
<td>

[types/index.ts:35](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L35)

</td>
</tr>
<tr>
<td>

<a id="workspacelocation"></a> `workspaceLocation?`

</td>
<td>

`any`

</td>
<td>

[types/index.ts:39](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L39)

</td>
</tr>
</tbody>
</table>

***

### DeepPartial\<T\>

```ts
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
```

Defined in: [types/index.ts:27](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L27)

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T`

</td>
</tr>
</tbody>
</table>

***

### ModuleContexts

```ts
type ModuleContexts = Context["moduleContexts"];
```

Defined in: [types/index.ts:42](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L42)

***

### ModuleSideContent

```ts
type ModuleSideContent = {
  body: (context) => JSX.Element;
  iconName: IconName;
  label: string;
  toSpawn?: (context) => boolean;
};
```

Defined in: [types/index.ts:54](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L54)

#### Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Description</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="body"></a> `body`

</td>
<td>

(`context`) => `JSX.Element`

</td>
<td>

This function will be called to render the module tab in the side contents
on Source Academy frontend.

</td>
<td>

[types/index.ts:74](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L74)

</td>
</tr>
<tr>
<td>

<a id="iconname"></a> `iconName`

</td>
<td>

`IconName`

</td>
<td>

BlueprintJS IconName element's name, used to render the icon which will be
displayed in the side contents panel.

**See**

https://blueprintjs.com/docs/#icons

</td>
<td>

[types/index.ts:60](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L60)

</td>
</tr>
<tr>
<td>

<a id="label"></a> `label`

</td>
<td>

`string`

</td>
<td>

The Tab's icon tooltip in the side contents on Source Academy frontend.

</td>
<td>

[types/index.ts:64](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L64)

</td>
</tr>
<tr>
<td>

<a id="tospawn"></a> `toSpawn?`

</td>
<td>

(`context`) => `boolean`

</td>
<td>

This function will be called to determine if the component will be
rendered

</td>
<td>

[types/index.ts:69](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L69)

</td>
</tr>
</tbody>
</table>

***

### ModuleTab

```ts
type ModuleTab = FC<{
  context: DebuggerContext;
}>;
```

Defined in: [types/index.ts:52](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/types/index.ts#L52)
