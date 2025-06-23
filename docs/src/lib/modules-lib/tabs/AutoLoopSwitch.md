[**Modules Common Library**](../README.md)

***

[Modules Common Library](../README.md) / tabs/AutoLoopSwitch

# tabs/AutoLoopSwitch

## Type Aliases

### AutoLoopSwitchProps

```ts
type AutoLoopSwitchProps = Omit<SwitchProps, "checked" | "style"> & {
  isAutoLooping: boolean;
};
```

Defined in: [tabs/AutoLoopSwitch.tsx:5](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/AutoLoopSwitch.tsx#L5)

#### Type declaration

##### isAutoLooping

```ts
isAutoLooping: boolean;
```

## Functions

### AutoLoopSwitch()

```ts
function AutoLoopSwitch(props): Element;
```

Defined in: [tabs/AutoLoopSwitch.tsx:10](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/AutoLoopSwitch.tsx#L10)

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

`props`

</td>
<td>

[`AutoLoopSwitchProps`](#autoloopswitchprops)

</td>
</tr>
</tbody>
</table>

#### Returns

`Element`
