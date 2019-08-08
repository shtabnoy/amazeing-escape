export interface Point {
  x: number
  y: number
}

export interface Keys {
  [key: string]: boolean
}

export interface Wall {
  a: Point
  b: Point
}

export interface Walls {
  [key: string]: Wall
}
