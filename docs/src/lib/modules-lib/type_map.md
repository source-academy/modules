[**Modules Common Library**](README.md)

***

[Modules Common Library](README.md) / type\_map

# type\_map

## Functions

### createTypeMap()

```ts
function createTypeMap(): {
  classDeclaration: (name) => (_target) => void;
  functionDeclaration: (paramTypes, returnType) => (_target, propertyKey, _descriptor) => void;
  type_map: Record<string, string>;
  typeDeclaration: (type, declaration) => (target) => void;
  variableDeclaration: (type) => (_target, propertyKey) => void;
};
```

Defined in: [type\_map.ts:7](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/type_map.ts#L7)

Utility function for creating type maps

#### Returns

```ts
{
  classDeclaration: (name) => (_target) => void;
  functionDeclaration: (paramTypes, returnType) => (_target, propertyKey, _descriptor) => void;
  type_map: Record<string, string>;
  typeDeclaration: (type, declaration) => (target) => void;
  variableDeclaration: (type) => (_target, propertyKey) => void;
}
```

A reference to a type map alongside decorators that are
used to populate it

##### classDeclaration()

```ts
classDeclaration: (name) => (_target) => void;
```

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

`name`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

###### Returns

```ts
(_target): void;
```

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

`_target`

</td>
<td>

`any`

</td>
</tr>
</tbody>
</table>

###### Returns

`void`

##### functionDeclaration()

```ts
functionDeclaration: (paramTypes, returnType) => (_target, propertyKey, _descriptor) => void;
```

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

`paramTypes`

</td>
<td>

`string`

</td>
</tr>
<tr>
<td>

`returnType`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

###### Returns

```ts
(
   _target, 
   propertyKey, 
   _descriptor): void;
```

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

`_target`

</td>
<td>

`any`

</td>
</tr>
<tr>
<td>

`propertyKey`

</td>
<td>

`string`

</td>
</tr>
<tr>
<td>

`_descriptor`

</td>
<td>

`PropertyDescriptor`

</td>
</tr>
</tbody>
</table>

###### Returns

`void`

##### type\_map

```ts
type_map: Record<string, string>;
```

##### typeDeclaration()

```ts
typeDeclaration: (type, declaration) => (target) => void;
```

###### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Default value</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`type`

</td>
<td>

`string`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`declaration`

</td>
<td>

`null`

</td>
<td>

`null`

</td>
</tr>
</tbody>
</table>

###### Returns

```ts
(target): void;
```

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

`target`

</td>
<td>

`any`

</td>
</tr>
</tbody>
</table>

###### Returns

`void`

##### variableDeclaration()

```ts
variableDeclaration: (type) => (_target, propertyKey) => void;
```

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

`type`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

###### Returns

```ts
(_target, propertyKey): void;
```

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

`_target`

</td>
<td>

`any`

</td>
</tr>
<tr>
<td>

`propertyKey`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

###### Returns

`void`
