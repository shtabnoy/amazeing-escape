import { Point } from './types'
import { Direction } from './MazeGraph'

const SPRITE_WIDTH = 48
const SPRITE_HEIGHT = 48
const NUMBER_OF_FRAMES = 3
const FPS_INTERVAL = 1000 / 6
const STEP = 2

export default class Hero {
  ctx: CanvasRenderingContext2D
  imgs: HTMLImageElement[]
  coords: Point
  now: number
  then: number
  elapsed: number
  frame: number

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.coords = {
      x: 0,
      y: 0,
    }
    this.initImgs()
    this.frame = 0
    this.then = Date.now()
  }

  private initImgs() {
    const front0 = new Image()
    const front1 = new Image()
    const front2 = new Image()
    front0.src = 'src/assets/hero/front0.png'
    front1.src = 'src/assets/hero/front1.png'
    front2.src = 'src/assets/hero/front2.png'
    this.imgs = [front0, front1, front2]

    front1.onload = () => this.drawImage(1)
  }

  private drawImage(frame: number) {
    this.ctx.drawImage(
      this.imgs[frame],
      0,
      0,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.coords.x,
      this.coords.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    )
  }

  // For animation
  private updateFrame() {
    this.now = Date.now()
    this.elapsed = this.now - this.then
    if (this.elapsed > FPS_INTERVAL) {
      // adjust fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.then = this.now - (this.elapsed % FPS_INTERVAL)
      this.frame = (this.frame + 1) % NUMBER_OF_FRAMES
    }
  }

  draw() {
    this.drawImage(this.frame)
    this.updateFrame()
  }

  move(dir: Direction) {
    this.ctx.clearRect(
      this.coords.x,
      this.coords.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    )
    switch (dir) {
      case Direction.right:
        this.coords.x += STEP
        break
      case Direction.left:
        this.coords.x -= STEP
        break
      case Direction.down:
        this.coords.y += STEP
        break
      case Direction.up:
        this.coords.y -= STEP
        break
      default:
        break
    }
    this.draw()
  }
}
