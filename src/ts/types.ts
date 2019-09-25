export interface Point {
  x: number
  y: number
}

export enum ArrowKeys {
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
}

export interface Keys {
  [ArrowKeys.ArrowRight]: boolean
  [ArrowKeys.ArrowDown]: boolean
  [ArrowKeys.ArrowLeft]: boolean
  [ArrowKeys.ArrowUp]: boolean
}

export interface Wall {
  a: Point
  b: Point
}

export interface Walls {
  [key: string]: Wall
}

export interface AnimationControls {
  now: number
  then: number
  elapsed: number
}
