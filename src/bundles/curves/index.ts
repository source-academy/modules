import __Params from '../../typings/__Params';
import { mat4, vec3 } from 'gl-matrix';

/**
 * <Brief description of the module>
 * @author <Author Name>
 * @author <Author Name>
 */

// =============================================================================
// Module's Private Functions
// =============================================================================

class Point{
  x: number
  y: number
  z: number
  color: number[]

  constructor(x: number, y: number, z: number, r: number, g: number, b: number) {
    this.x = x
    this.y = y
    this.z = z
    this.color = [r, g, b, 1]
  }
  getColor(): number[]{
    return this.color
  }
  getX(): number{
    return this.x
  }
  getY(): number{
    return this.y
  }
  getZ(): number{
    return this.z
  }
}

var cubeRotation = 0 //Used for testing
function generateCurve(scaleMode, drawMode, numPoints, func, space, isFullView): void {
  const viewport_size: number = 600
  const frame = open_pixmap('frame', viewport_size, viewport_size, true); // TODO: replace this
  var curvePosArray: number[] = []
  var curveColorArray: number[] = []
  var drawCubeArray: number[] = []
  var transMat = mat4.create()
  var projMat = mat4.create()
  type curveObject = {
    drawCube: number[],
    color: number[],
    curvePos: number[]
  }
  var curveObject = {} as curveObject
  // initialize the min/max to extreme values
  var min_x = Infinity
  var max_x = -Infinity
  var min_y = Infinity
  var max_y = -Infinity
  var min_z = Infinity
  var max_z = -Infinity

  function evaluator(num, func) {
    curveObject = {} as curveObject
    curvePosArray = []
    curveColorArray = []
    for (var i = 0; i <= num; i += 1) {
      var point = func(i / num)
      if (
        !(point instanceof Point)
      ) {
        throw 'Expected a point, encountered ' + point
      }
      var x = point.getX() * 2 - 1
      var y = point.getY() * 2 - 1
      var z = point.getZ() * 2 - 1
      space == '2D' ? curvePosArray.push(x, y) : curvePosArray.push(x, y, z)
      var color_r = point.getColor()[0]
      var color_g = point.getColor()[1]
      var color_b = point.getColor()[2]
      var color_a = point.getColor()[3]
      curveColorArray.push(color_r, color_g, color_b, color_a)
      min_x = Math.min(min_x, x)
      max_x = Math.max(max_x, x)
      min_y = Math.min(min_y, y)
      max_y = Math.max(max_y, y)
      min_z = Math.min(min_z, z)
      max_z = Math.max(max_z, z)
    }
  }
  evaluator(numPoints, func)

  // padding for 2d draw connected full-view
  if (isFullView) {
    var horiz_padding = 0.05 * (max_x - min_x)
    min_x -= horiz_padding
    max_x += horiz_padding
    var vert_padding = 0.05 * (max_y - min_y)
    min_y -= vert_padding
    max_y += vert_padding
    var depth_padding = 0.05 * (max_z - min_z)
    min_z -= depth_padding
    max_z += depth_padding
  }

  // box generation
  if (space == '3D') {
    drawCubeArray.push(
      -1, 1, 1, -1, -1, 1,
      -1, -1, -1, -1, 1, -1,
      1, 1, -1, 1, -1, -1,
      -1, -1, -1, 1, -1, -1,
      1, -1, 1, -1, -1, 1,
      1, -1, 1, 1, 1, 1,
      -1, 1, 1, -1, 1, -1,
      1, 1, -1, 1, 1, 1
    )
  } else {
    min_z = max_z = 0
  }

  if (scaleMode == 'fit') {
    var center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2]
    var scale = Math.max(max_x - min_x, max_y - min_y, max_z - min_z)
    scale = scale === 0 ? 1 : scale;
    if (space == '3D') {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 3 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= scale/2
        } else if (i % 3 == 1) {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= scale/2
        } else {
          curvePosArray[i] -= center[2]
          curvePosArray[i] /= scale/2
        }
      }
    } else {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 2 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= scale/2
        } else {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= scale/2
        }
      }
    }
  } else if (scaleMode == 'stretch') {
    var center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2]
    var x_scale = max_x === min_x ? 1 : (max_x - min_x)
    var y_scale = max_y === min_y ? 1 : (max_y - min_y)
    var z_scale = max_z === min_z ? 1 : (max_z - min_z)
    if (space == '3D') {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 3 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= x_scale/2
        } else if (i % 3 == 1) {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= y_scale/2
        } else {
          curvePosArray[i] -= center[2]
          curvePosArray[i] /= z_scale/2
        }
      }
    } else {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 2 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= x_scale/2
        } else {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= y_scale/2
        }
      }
    }
  }

  if (space == '3D') {
    var scale = Math.sqrt(1 / 3.1)
    mat4.scale(transMat, transMat, vec3.fromValues(scale, scale, scale))
    curveObject.drawCube = drawCubeArray
    mat4.translate(transMat, transMat, [0, 0, -5])
    mat4.rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0])  // axis to rotate around X
    mat4.rotate(transMat, transMat, -0.5, [0, 0, 1])            // axis to rotate around Z
    cubeRotation += 0.1 * Math.PI

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0;
    const zFar = 50.0;
    mat4.perspective(projMat, fieldOfView, aspect, zNear, zFar);
  }

  clear_viewport() // TODO: replace
  gl.uniformMatrix4fv(u_projectionMatrix, false, projMat)
  gl.uniformMatrix4fv(u_transformMatrix, false, transMat)
  curveObject.curvePos = curvePosArray
  curveObject.color = curveColorArray
  curveObject.drawCube = drawCubeArray
  drawCurve(drawMode, curveObject, space)
  copy_viewport(gl.canvas, frame)
  return new ShapeDrawn(frame)
}


export default function (_params: __Params) {
  return {
  };
}
