import Maze from './Maze'
import Hero from './Hero'
import { Keys, ArrowKeys, Wall, AnimationControls } from './types'
import {
  FPS_INTERVAL,
  CAMERA_BORDER_X,
  CAMERA_BORDER_Y,
  STEP,
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
  CANVAS_HEIGHT,
  BOTTOM_BORDER,
  CANVAS_WIDTH,
  RIGHT_BORDER,
  OFFSET_X,
  OFFSET_Y,
} from './constants'
import { Direction } from './MazeGraph'

export default class Renderer {
  private ctx: CanvasRenderingContext2D
  private maze: Maze
  private hero: Hero

  private animCtrl: AnimationControls = {
    now: 0,
    then: 0,
    elapsed: 0,
  }
  private keys: Keys = {
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowUp: false,
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    document.addEventListener('keydown', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = true
    })
    document.addEventListener('keyup', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = false
    })
  }

  private collisionRight = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 + STEP <= wall.a.x &&
      x2 + STEP >= wall.a.x &&
      y1 <= wall.b.y &&
      y2 >= wall.a.y
    )
  }

  private collisionLeft = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 - STEP <= wall.b.x &&
      x2 - STEP >= wall.b.x &&
      y1 <= wall.b.y &&
      y2 >= wall.a.y
    )
  }

  private collisionUp = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 <= wall.b.x &&
      x2 >= wall.a.x &&
      y1 - STEP <= wall.b.y &&
      y2 - STEP >= wall.b.y
    )
  }

  private collisionDown = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 <= wall.b.x &&
      x2 >= wall.a.x &&
      y1 + STEP <= wall.a.y &&
      y2 + STEP >= wall.a.y
    )
  }

  private moveCamera(dir: Direction) {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    let translatedX = this.ctx.getTransform().e / 2
    let translatedY = this.ctx.getTransform().f / 2

    this.maze.clear(
      0 - translatedX,
      0 - translatedY,
      CANVAS_WIDTH - translatedX + OFFSET_X,
      CANVAS_HEIGHT - translatedY + OFFSET_Y
    )
    switch (dir) {
      case Direction.left:
        if (x1 < CAMERA_BORDER_X - translatedX) {
          this.ctx.translate(translatedX < 0 ? STEP : 0, 0)
        }
        break
      case Direction.right:
        if (x2 > CANVAS_WIDTH - translatedX - CAMERA_BORDER_X) {
          this.ctx.translate(-translatedX > RIGHT_BORDER ? 0 : -STEP, 0)
        }
        break
      case Direction.up:
        if (y1 < CAMERA_BORDER_Y - translatedY) {
          this.ctx.translate(0, translatedY < 0 ? STEP : 0)
        }
        break
      case Direction.down:
        if (y2 > CANVAS_HEIGHT - translatedY - CAMERA_BORDER_Y) {
          this.ctx.translate(0, -translatedY > BOTTOM_BORDER ? 0 : -STEP)
        }
        break
    }
    this.maze.render()
  }

  private move = () => {
    const walls = this.maze.getWalls()

    if (this.keys[ArrowKeys.ArrowRight]) {
      if (!walls.some(this.collisionRight)) {
        this.hero.move(Direction.right)
        this.moveCamera(Direction.right)
      }
    }
    if (this.keys[ArrowKeys.ArrowLeft]) {
      if (!walls.some(this.collisionLeft)) {
        this.hero.move(Direction.left)
        this.moveCamera(Direction.left)
      }
    }
    if (this.keys[ArrowKeys.ArrowDown]) {
      if (!walls.some(this.collisionDown)) {
        this.hero.move(Direction.down)
        this.moveCamera(Direction.down)
      }
    }
    if (this.keys[ArrowKeys.ArrowUp]) {
      if (!walls.some(this.collisionUp)) {
        this.hero.move(Direction.up)
        this.moveCamera(Direction.up)
      }
    }

    this.hero.render()
    this.updateFrame()
    requestAnimationFrame(this.move)
  }

  private updateFrame() {
    this.animCtrl.now = Date.now()
    this.animCtrl.elapsed = this.animCtrl.now - this.animCtrl.then
    if (this.animCtrl.elapsed > FPS_INTERVAL) {
      // adjust fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.animCtrl.then =
        this.animCtrl.now - (this.animCtrl.elapsed % FPS_INTERVAL)
      this.hero.updateFrame()
    }
  }

  private startAnimationLoop() {
    this.animCtrl.then = Date.now()
    requestAnimationFrame(this.move)
  }

  addMaze(maze: Maze) {
    this.maze = maze
  }

  addHero(hero: Hero) {
    this.hero = hero
  }

  render() {
    this.maze.render()
    this.hero.render()
    this.startAnimationLoop()
  }
}
