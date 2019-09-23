import { Point } from './types'
import { Direction } from './MazeGraph'

const SPRITE_WIDTH = 48
const SPRITE_HEIGHT = 48
const NUMBER_OF_FRAMES = 3
const FPS_INTERVAL = 1000 / 6
const STEP = 2

export default class Hero {
  ctx: CanvasRenderingContext2D
  imgs: {
    [Direction.right]: HTMLImageElement[]
    [Direction.down]: HTMLImageElement[]
    [Direction.left]: HTMLImageElement[]
    [Direction.up]: HTMLImageElement[]
  }

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
    const right0 = new Image()
    const right1 = new Image()
    const right2 = new Image()
    const down0 = new Image()
    const down1 = new Image()
    const down2 = new Image()
    const left0 = new Image()
    const left1 = new Image()
    const left2 = new Image()
    const up0 = new Image()
    const up1 = new Image()
    const up2 = new Image()
    right0.src = 'src/assets/hero/right0.png'
    right1.src = 'src/assets/hero/right1.png'
    right2.src = 'src/assets/hero/right2.png'
    down0.src = 'src/assets/hero/down0.png'
    down1.src = 'src/assets/hero/down1.png'
    down2.src = 'src/assets/hero/down2.png'
    left0.src = 'src/assets/hero/left0.png'
    left1.src = 'src/assets/hero/left1.png'
    left2.src = 'src/assets/hero/left2.png'
    up0.src = 'src/assets/hero/up0.png'
    up1.src = 'src/assets/hero/up1.png'
    up2.src = 'src/assets/hero/up2.png'
    this.imgs = {
      [Direction.right]: [right0, right1, right2],
      [Direction.down]: [down0, down1, down2],
      [Direction.left]: [left0, left1, left2],
      [Direction.up]: [up0, up1, up2],
    }
    down0.onload = () => this.drawImage(Direction.down, 1)
  }

  private drawImage(dir: Direction, frame: number) {
    this.ctx.drawImage(
      this.imgs[dir][frame],
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

  draw(dir: Direction) {
    this.drawImage(dir, this.frame)
    this.updateFrame()
  }

  clear() {
    this.ctx.clearRect(
      this.coords.x,
      this.coords.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    )
  }

  move(keys: any) {
    if (keys[39]) {
      this.clear()
      this.coords.x += STEP
      this.draw(Direction.right)
    }
    if (keys[37]) {
      this.clear()
      this.coords.x -= STEP
      this.draw(Direction.left)
    }
    if (keys[40]) {
      this.clear()
      this.coords.y += STEP
      this.draw(Direction.down)
    }
    if (keys[38]) {
      this.clear()
      this.coords.y -= STEP
      this.draw(Direction.up)
    }
    requestAnimationFrame(() => this.move(keys))
  }

  animate(keys: any) {
    requestAnimationFrame(() => this.move(keys))
  }
}
