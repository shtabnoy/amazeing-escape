interface Images {
  front0: HTMLImageElement
  front1: HTMLImageElement
  front2: HTMLImageElement
}

export default class Hero {
  ctx: CanvasRenderingContext2D
  imgs: Images

  private initImgs() {
    const front0 = new Image()
    const front1 = new Image()
    const front2 = new Image()
    front0.src = 'src/assets/hero/front0.png'
    front1.src = 'src/assets/hero/front1.png'
    front2.src = 'src/assets/hero/front2.png'
    this.imgs.front0 = front0
    this.imgs.front1 = front1
    this.imgs.front2 = front2
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.initImgs()
  }

  draw() {}
}
