[**Modules Common Library**](README.md)

***

[Modules Common Library](README.md) / utilities

# utilities

## Functions

### degreesToRadians()

```ts
function degreesToRadians(degrees): number;
```

Defined in: [utilities.ts:4](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/utilities.ts#L4)

#### Parameters

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

`degrees`

</td>
<td>

`number`

</td>
</tr>
</tbody>
</table>

#### Returns

`number`

***

### hexToColor()

```ts
function hexToColor(hex): [number, number, number];
```

Defined in: [utilities.ts:8](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/utilities.ts#L8)

#### Parameters

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

`hex`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

\[`number`, `number`, `number`\]

***

### mockDebuggerContext()

```ts
function mockDebuggerContext<T>(state, module): DebuggerContext;
```

Defined in: [utilities.ts:20](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/utilities.ts#L20)

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

#### Parameters

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

`state`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

`module`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

[`DebuggerContext`](types.md#debuggercontext)
