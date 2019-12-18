import { Point } from './types'
import { Direction } from './MazeGraph'
import { STEP, HERO_WIDTH, HERO_HEIGHT } from './constants'

const FRAMES = [1, 2, 3, 4]
const NUMBER_OF_FRAMES = FRAMES.length

// TODO: Use these number in this.shadow
const SHADOW_OX = 17
const SHADOW_OY = 7

export default class Hero {
  private img: HTMLImageElement
  private coords: Point
  private frame: number
  private frameIndex: number
  private spriteOffset: number
  private currentRoom: string
  private shadow: {
    xOffset: number
    yOffset: number
    xRadius: number
    yRadius: number
  }

  constructor(img: HTMLImageElement, coords?: Point) {
    this.img = img
    this.coords = {
      x: coords.x || 0,
      y: coords.y || 0,
    }
    this.frameIndex = 0
    // this.frame = FRAMES[this.frameIndex]
    this.frame = 0
    this.spriteOffset = HERO_HEIGHT

    // shadow init
    this.shadow = {
      xOffset: HERO_WIDTH / 2 + 6,
      yOffset: HERO_HEIGHT - 6,
      xRadius: 25,
      yRadius: 10,
    }
  }

  clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(
      this.coords.x - 2,
      this.coords.y,
      HERO_WIDTH + SHADOW_OX,
      HERO_HEIGHT + SHADOW_OY
    )
  }

  getCoords() {
    return this.coords
  }

  getBottomRightCoords() {
    return {
      x: this.coords.x + HERO_WIDTH + SHADOW_OX,
      y: this.coords.y + HERO_HEIGHT + SHADOW_OY,
    }
  }

  move(dir: Direction) {
    switch (dir) {
      case Direction.left:
        this.spriteOffset = 0
        this.coords.x -= STEP
        break
      case Direction.right:
        this.spriteOffset = HERO_HEIGHT + 1
        this.coords.x += STEP
        break
      case Direction.up:
        this.spriteOffset = HERO_HEIGHT * 2 + 1
        this.coords.y -= STEP
        break
      case Direction.down:
        this.spriteOffset = HERO_HEIGHT * 3 + 1
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

  resetFrame = () => {
    this.frame = 0
  }

  renderShadow(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.filter = 'blur(1px)'
    ctx.beginPath()
    ctx.ellipse(
      this.coords.x + this.shadow.xOffset,
      this.coords.y + this.shadow.yOffset,
      this.shadow.xRadius,
      this.shadow.yRadius,
      0,
      0,
      2 * Math.PI
    )
    ctx.fill()
    ctx.restore()
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderShadow(ctx)
    ctx.drawImage(
      this.img,
      this.frame * HERO_WIDTH,
      this.spriteOffset,
      HERO_WIDTH,
      HERO_HEIGHT,
      this.coords.x,
      this.coords.y,
      HERO_WIDTH,
      HERO_HEIGHT
    )
  }

  setCurrentRoom(room: string) {
    this.currentRoom = room
  }

  getCurrentRoom(): string {
    return this.currentRoom
  }
}
