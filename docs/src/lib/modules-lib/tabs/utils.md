[**Modules Common Library**](../README.md)

***

[Modules Common Library](../README.md) / tabs/utils

# tabs/utils

## Functions

### defineTab()

```ts
function defineTab(tab): ModuleSideContent;
```

Defined in: [tabs/utils.ts:17](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/utils.ts#L17)

Helper for typing tabs

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

`tab`

</td>
<td>

[`ModuleSideContent`](../types.md#modulesidecontent)

</td>
</tr>
</tbody>
</table>

#### Returns

[`ModuleSideContent`](../types.md#modulesidecontent)

***

### getModuleState()

```ts
function getModuleState<T>(debuggerContext, name): T;
```

Defined in: [tabs/utils.ts:10](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/utils.ts#L10)

Helper function for extracting the state object for your bundle

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T`

</td>
<td>

The type of your bundle's state object

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`debuggerContext`

</td>
<td>

[`DebuggerContext`](../types.md#debuggercontext)

</td>
<td>

DebuggerContext as returned by the frontend

</td>
</tr>
<tr>
<td>

`name`

</td>
<td>

`string`

</td>
<td>

Name of your bundle

</td>
</tr>
</tbody>
</table>

#### Returns

`T`

The state object of your bundle
