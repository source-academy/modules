// A config storing border data
export interface BorderConfig {
  color?: string
  width?: number
}

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

// Any optional flags an area may have (e.g. color)
export interface AreaFlags {
  [name: string]: any
}

// An area within the maze
export interface Area {
  vertices: Point[]
  isObstacle: boolean
  flags: AreaFlags
}

// A test for the student to pass
export interface Test {
  type: string
  test: Function
}

// A test testing an area
export interface AreaTest extends Test {
  type: 'area'
  test: (areas: Area[]) => boolean
}

// The main maze state
export interface Maze {
  isInit: boolean
  hasCollided: boolean
  width: number
  height: number
  border: BorderConfig
  robot: Robot
  areas: Area[]
  areaLog: Area[]
  actionLog: Action[]
  tests: Test[]
  message: string
}
