// A point (x, y)
export interface Point {
  x: number
  y: number
}

// A point (x, y) with rotation
export interface PointWithRotation extends Point {
  rotation: number
}

// The robot with position and radius
export interface Robot extends PointWithRotation {
  radius: number
}

// A stored action
export interface Action {
  type: 'begin' | 'move' | 'rotate' | 'sensor'
  position: PointWithRotation
}

export interface AreaFlags {
  [name: string]: any
}

export interface Area {
  vertices: Point[]
  isObstacle: boolean
  flags: AreaFlags
}

export interface Test {
  type: string
  test: Function
}

export interface AreaTest extends Test {
  type: 'area'
  test: (areas: Area[]) => boolean
}

export interface RobotMinigame {
  isInit: boolean
  width: number
  height: number
  robot: Robot
  areas: Area[]
  areaLog: Area[]
  actionLog: Action[]
  tests: Test[]
  message: string
}
