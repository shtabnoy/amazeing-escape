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
    let mx1 = 0 - translatedX
    let my1 = 0 - translatedY
    let mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    let my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y

    this.maze.clear(mx1, my1, mx2, my2)
    switch (dir) {
      case Direction.left:
        if (x1 < CAMERA_BORDER_X - translatedX) {
          // this.maze.clear(mx1, my1, mx2, my2)
          this.ctx.translate(translatedX < 0 ? STEP : 0, 0)
          // this.maze.render()
        }
        break
      case Direction.right:
        if (x2 > CANVAS_WIDTH - translatedX - CAMERA_BORDER_X) {
          // this.maze.clear(mx1, my1, mx2, my2)
          this.ctx.translate(-translatedX > RIGHT_BORDER ? 0 : -STEP, 0)
          // this.maze.render()
        }
        break
      case Direction.up:
        if (y1 < CAMERA_BORDER_Y - translatedY) {
          // this.maze.clear(mx1, my1, mx2, my2)
          this.ctx.translate(0, translatedY < 0 ? STEP : 0)
          // this.maze.render()
        }
        break
      case Direction.down:
        if (y2 > CANVAS_HEIGHT - translatedY - CAMERA_BORDER_Y) {
          // this.maze.clear(mx1, my1, mx2, my2)
          this.ctx.translate(0, -translatedY > BOTTOM_BORDER ? 0 : -STEP)
          // this.maze.render()
        }
        break
    }
    this.maze.render()
  }

  private move = () => {
    const walls = this.maze.getWalls()

    if (this.keys[ArrowKeys.ArrowRight] && !walls.some(this.collisionRight)) {
      // this.hero.clear()
      this.hero.move(Direction.right)
      this.moveCamera(Direction.right)
      this.hero.render()
    }

    if (this.keys[ArrowKeys.ArrowLeft] && !walls.some(this.collisionLeft)) {
      // this.hero.clear()
      this.hero.move(Direction.left)
      this.moveCamera(Direction.left)
      this.hero.render()
    }

    if (this.keys[ArrowKeys.ArrowDown] && !walls.some(this.collisionDown)) {
      // this.hero.clear()
      this.hero.move(Direction.down)
      this.moveCamera(Direction.down)
      this.hero.render()
    }

    if (this.keys[ArrowKeys.ArrowUp] && !walls.some(this.collisionUp)) {
      // this.hero.clear()
      this.hero.move(Direction.up)
      this.moveCamera(Direction.up)
      this.hero.render()
    }

    // if (
    //   this.keys[ArrowKeys.ArrowLeft] ||
    //   this.keys[ArrowKeys.ArrowRight] ||
    //   this.keys[ArrowKeys.ArrowUp] ||
    //   this.keys[ArrowKeys.ArrowDown]
    // ) {
    this.updateFrame()
    // }

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
