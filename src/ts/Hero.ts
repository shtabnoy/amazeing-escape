import { Point } from './types'
import { Direction } from './MazeGraph'
import { STEP } from './constants'

const HERO_W = 48
const HERO_H = 48
const FRAMES = [0, 1, 2, 1]
const NUMBER_OF_FRAMES = FRAMES.length

export default class Hero {
  private ctx: CanvasRenderingContext2D
  private img: HTMLImageElement
  private coords: Point
  private frame: number
  private frameIndex: number
  private offsetY: number

  constructor(ctx: CanvasRenderingContext2D, coords?: Point) {
    this.ctx = ctx
    this.coords = {
      x: coords.x || 0,
      y: coords.y || 0,
    }
    this.initImgs()
    this.frameIndex = 0
    this.frame = FRAMES[this.frameIndex]
    this.offsetY = 0
  }

  private initImgs() {
    const heroSprites = new Image()
    heroSprites.src = 'src/assets/sprites1.png'
    this.img = heroSprites
  }

  clear() {
    this.ctx.clearRect(this.coords.x, this.coords.y, HERO_W, HERO_H)
  }

  getCoords() {
    return this.coords
  }

  getBottomRightCoords() {
    return {
      x: this.coords.x + HERO_W,
      y: this.coords.y + HERO_H,
    }
  }

  move(dir: Direction) {
    switch (dir) {
      case Direction.left:
        this.offsetY = 0
        this.coords.x -= STEP
        break
      case Direction.right:
        this.offsetY = 48 + 1
        this.coords.x += STEP
        break
      case Direction.up:
        this.offsetY = 48 * 2 + 1
        this.coords.y -= STEP
        break
      case Direction.down:
        this.offsetY = 48 * 3 + 1
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

  render() {
    this.ctx.drawImage(
      this.img,
      this.frame * 48 + 1,
      this.offsetY,
      HERO_W,
      HERO_H,
      this.coords.x,
      this.coords.y,
      HERO_W,
      HERO_H
    )
  }
}
