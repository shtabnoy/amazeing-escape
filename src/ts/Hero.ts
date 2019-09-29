import { Point } from './types'
import { Direction } from './MazeGraph'
import { STEP, SPRITE_SIZE } from './constants'

const FRAMES = [0, 1, 2, 1]
const NUMBER_OF_FRAMES = FRAMES.length

export default class Hero {
  // private ctx: CanvasRenderingContext2D
  private img: HTMLImageElement
  private coords: Point
  private frame: number
  private frameIndex: number
  private spriteOffset: number

  constructor(
    // ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    coords?: Point
  ) {
    // this.ctx = ctx
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
    ctx.clearRect(this.coords.x, this.coords.y, SPRITE_SIZE, SPRITE_SIZE)
  }

  getCoords() {
    return this.coords
  }

  getBottomRightCoords() {
    return {
      x: this.coords.x + SPRITE_SIZE,
      y: this.coords.y + SPRITE_SIZE,
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
    ctx.drawImage(
      this.img,
      this.frame * SPRITE_SIZE + 1,
      this.spriteOffset,
      SPRITE_SIZE,
      SPRITE_SIZE,
      this.coords.x,
      this.coords.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    )
  }
}
