import { Point } from './types'
import { Direction } from './MazeGraph'
import { STEP } from './constants'

const NUMBER_OF_FRAMES = 3

const HERO_W = 48
const HERO_H = 48

export default class Hero {
  private ctx: CanvasRenderingContext2D
  private img: HTMLImageElement
  private coords: Point
  private frame: number
  private offsetY: number

  constructor(ctx: CanvasRenderingContext2D, coords?: Point) {
    this.ctx = ctx
    this.coords = {
      x: coords.x || 0,
      y: coords.y || 0,
    }
    this.initImgs()
    this.frame = 0
    this.offsetY = 0
  }

  private initImgs() {
    const heroSprites = new Image()
    heroSprites.src = 'src/assets/sprites.png'
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
    this.frame = (this.frame + 1) % NUMBER_OF_FRAMES
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
