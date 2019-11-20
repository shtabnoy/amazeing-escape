import { Point } from './types'
import { Direction } from './MazeGraph'
import { STEP, SPRITE_SIZE, HERO_SIZE } from './constants'

// const FRAMES = [0, 1, 2, 3]
const FRAMES = [1, 2, 3, 4]
const NUMBER_OF_FRAMES = FRAMES.length

export default class Hero {
  private img: HTMLImageElement
  private coords: Point
  private frame: number
  private frameIndex: number
  private spriteOffset: number
  private currentRoom: [number, number]

  constructor(img: HTMLImageElement, coords?: Point) {
    this.img = img
    this.coords = {
      x: coords.x || 0,
      y: coords.y || 0,
    }
    this.frameIndex = 0
    this.frame = FRAMES[this.frameIndex]
    this.spriteOffset = 0
  }

  clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(this.coords.x, this.coords.y, HERO_SIZE, HERO_SIZE)
  }

  getCoords() {
    return this.coords
  }

  getBottomRightCoords() {
    return {
      x: this.coords.x + HERO_SIZE,
      y: this.coords.y + HERO_SIZE,
    }
  }

  move(dir: Direction) {
    switch (dir) {
      case Direction.left:
        this.spriteOffset = 0
        this.coords.x -= STEP
        break
      case Direction.right:
        this.spriteOffset = SPRITE_SIZE + 1
        this.coords.x += STEP
        break
      case Direction.up:
        this.spriteOffset = SPRITE_SIZE * 2 + 1
        this.coords.y -= STEP
        break
      case Direction.down:
        this.spriteOffset = SPRITE_SIZE * 3 + 1
        this.coords.y += STEP
        break
      default:
        break
    }
  }

  updateFrame() {
    this.frameIndex = (this.frameIndex + 1) % NUMBER_OF_FRAMES
    this.frame = FRAMES[this.frameIndex]
  }

  render(ctx: CanvasRenderingContext2D) {
    // ctx.lineWidth = 1
    // ctx.strokeStyle = '#ff0000'
    // ctx.strokeRect(this.coords.x, this.coords.y, HERO_SIZE, HERO_SIZE)
    ctx.drawImage(
      this.img,
      this.frame * SPRITE_SIZE + 1,
      this.spriteOffset,
      SPRITE_SIZE,
      SPRITE_SIZE,
      this.coords.x,
      this.coords.y,
      HERO_SIZE,
      HERO_SIZE
    )
  }

  setCurrentRoom(room: [number, number]) {
    this.currentRoom = room
  }

  getCurrentRoom(): [number, number] {
    return this.currentRoom
  }
}
