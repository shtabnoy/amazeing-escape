import { Point } from './types'
import { Direction } from './MazeGraph'

const NUMBER_OF_FRAMES = 3
export const SPRITE_WIDTH = 48
export const SPRITE_HEIGHT = 48
export const STEP = 2

export default class Hero {
  private ctx: CanvasRenderingContext2D
  private imgs: {
    [Direction.right]: HTMLImageElement[]
    [Direction.down]: HTMLImageElement[]
    [Direction.left]: HTMLImageElement[]
    [Direction.up]: HTMLImageElement[]
  }
  private img: HTMLImageElement
  private coords: Point
  private frame: number

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.coords = {
      // TODO: fix white outline (don't do offset)
      x: 1,
      y: 1,
    }
    this.initImgs()
    this.frame = 0
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
    this.img = down0
  }

  private clear() {
    this.ctx.clearRect(
      this.coords.x,
      this.coords.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT + 2 // TODO: don't do offests (fix outline)
    )
  }

  getCoords() {
    return this.coords
  }

  move(dir: Direction) {
    switch (dir) {
      case Direction.right:
        this.img = this.imgs[Direction.right][this.frame]
        this.coords.x += STEP
        break
      case Direction.left:
        this.img = this.imgs[Direction.left][this.frame]
        this.coords.x -= STEP
        break
      case Direction.down:
        this.img = this.imgs[Direction.down][this.frame]
        this.coords.y += STEP
        break
      case Direction.up:
        this.img = this.imgs[Direction.up][this.frame]
        this.coords.y -= STEP
        break
      default:
        break
    }
  }

  updateFrame() {
    this.frame = (this.frame + 1) % NUMBER_OF_FRAMES
  }

  draw() {
    this.ctx.drawImage(
      this.img,
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

  render() {
    this.clear()
    this.draw()
  }
}
