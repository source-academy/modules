[**Modules Common Library**](../README.md)

***

[Modules Common Library](../README.md) / tabs/ButtonComponent

# tabs/ButtonComponent

## Type Aliases

### ButtonComponentProps

```ts
type ButtonComponentProps = {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
};
```

Defined in: [tabs/ButtonComponent.tsx:12](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/ButtonComponent.tsx#L12)

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

<a id="children"></a> `children?`

</td>
<td>

`ReactNode`

</td>
<td>

[tabs/ButtonComponent.tsx:15](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/ButtonComponent.tsx#L15)

</td>
</tr>
<tr>
<td>

<a id="disabled"></a> `disabled?`

</td>
<td>

`boolean`

</td>
<td>

[tabs/ButtonComponent.tsx:14](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/ButtonComponent.tsx#L14)

</td>
</tr>
<tr>
<td>

<a id="onclick"></a> `onClick?`

</td>
<td>

`MouseEventHandler`\<`HTMLElement`\>

</td>
<td>

[tabs/ButtonComponent.tsx:13](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/ButtonComponent.tsx#L13)

</td>
</tr>
</tbody>
</table>

## Functions

### ButtonComponent()

```ts
function ButtonComponent(props): Element;
```

Defined in: [tabs/ButtonComponent.tsx:22](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/ButtonComponent.tsx#L22)

Button Component that retains interactability even when disabled. Refer to
[https://blueprintjs.com/docs/#core/components/buttons.anchorbutton\|this](https://blueprintjs.com/docs/#core/components/buttons.anchorbutton|this) for more information

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

[`ButtonComponentProps`](#buttoncomponentprops)

</td>
</tr>
</tbody>
</table>

#### Returns

`Element`
