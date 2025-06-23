[**Modules Common Library**](../README.md)

***

[Modules Common Library](../README.md) / tabs/AnimationCanvas

# tabs/AnimationCanvas

## Type Aliases

### AnimCanvasProps

```ts
type AnimCanvasProps = {
  animation: glAnimation;
};
```

Defined in: [tabs/AnimationCanvas.tsx:11](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/AnimationCanvas.tsx#L11)

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

<a id="animation"></a> `animation`

</td>
<td>

[`glAnimation`](../types.md#glanimation)

</td>
<td>

[tabs/AnimationCanvas.tsx:12](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/AnimationCanvas.tsx#L12)

</td>
</tr>
</tbody>
</table>

## Functions

### AnimationCanvas()

```ts
function AnimationCanvas(props): Element;
```

Defined in: [tabs/AnimationCanvas.tsx:349](https://github.com/source-academy/modules/blob/4a6cfc213df50fe6ef11b98adee1482718d1c1eb/lib/modules-lib/src/tabs/AnimationCanvas.tsx#L349)

React Component for displaying [glAnimations](../types.md#glanimation).

Uses [WebGLCanvas](WebglCanvas.md#webglcanvas) internally.

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

[`AnimCanvasProps`](#animcanvasprops)

</td>
</tr>
</tbody>
</table>

#### Returns

`Element`
