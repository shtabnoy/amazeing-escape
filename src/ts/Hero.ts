import { Point } from './types'

interface Images {
  front0: HTMLImageElement
  front1: HTMLImageElement
  front2: HTMLImageElement
}

const SPRITE_WIDTH = 48
const SPRITE_HEIGHT = 48

export default class Hero {
  ctx: CanvasRenderingContext2D
  imgs: Images
  coords: Point

  private initImgs() {
    const front0 = new Image()
    const front1 = new Image()
    const front2 = new Image()
    front0.src = 'src/assets/hero/front0.png'
    front1.src = 'src/assets/hero/front1.png'
    front2.src = 'src/assets/hero/front2.png'
    this.imgs = {
      front0,
      front1,
      front2,
    }
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.coords = {
      x: 2,
      y: 2,
    }
    this.initImgs()
  }

  drawFrontImage() {
    this.ctx.drawImage(
      this.imgs.front0,
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

  draw() {
    if (this.imgs.front0.complete) {
      this.drawFrontImage()
    } else {
      this.imgs.front0.onload = () => this.drawFrontImage()
    }
  }
}
