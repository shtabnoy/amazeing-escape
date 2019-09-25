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

  private move() {
    const walls = this.maze.getWalls()
    const { x, y } = this.hero.getCoords()
    let collide = false
    let translatedX = this.ctx.getTransform().e / 2
    let translatedY = this.ctx.getTransform().f / 2

    this.maze.clear(
      0 - translatedX,
      0 - translatedY,
      CANVAS_WIDTH - translatedX + OFFSET_X,
      CANVAS_HEIGHT - translatedY + OFFSET_Y
    )
    if (this.keys[ArrowKeys.ArrowRight]) {
      walls.forEach((wall: Wall) => {
        if (
          x + STEP <= wall.a.x &&
          x + STEP + SPRITE_WIDTH >= wall.a.x &&
          y + SPRITE_HEIGHT >= wall.a.y &&
          y <= wall.b.y
        ) {
          collide = true
        }
      })
      if (!collide) {
        if (x + SPRITE_WIDTH > CANVAS_WIDTH - translatedX - CAMERA_BORDER_X) {
          this.ctx.translate(-translatedX > RIGHT_BORDER ? 0 : -STEP, 0)
        }
        this.hero.move(Direction.right)
      }
    }
    if (this.keys[ArrowKeys.ArrowLeft]) {
      walls.forEach((wall: Wall) => {
        if (
          x - STEP + SPRITE_WIDTH >= wall.b.x &&
          x - STEP <= wall.b.x &&
          y + SPRITE_HEIGHT >= wall.a.y &&
          y <= wall.b.y
        ) {
          collide = true
        }
      })
      if (!collide) {
        if (x < CAMERA_BORDER_X - translatedX) {
          this.ctx.translate(translatedX < 0 ? STEP : 0, 0)
        }
        this.hero.move(Direction.left)
      }
    }
    if (this.keys[ArrowKeys.ArrowDown]) {
      walls.forEach((wall: Wall) => {
        if (
          y + STEP <= wall.a.y &&
          y + STEP + SPRITE_HEIGHT >= wall.a.y &&
          x + SPRITE_WIDTH >= wall.a.x &&
          x <= wall.b.x
        ) {
          collide = true
        }
      })
      if (!collide) {
        this.hero.move(Direction.down)
        if (y + SPRITE_HEIGHT > CANVAS_HEIGHT - translatedY - CAMERA_BORDER_Y) {
          this.ctx.translate(0, -translatedY > BOTTOM_BORDER ? 0 : -STEP)
        }
      }
    }
    if (this.keys[ArrowKeys.ArrowUp]) {
      walls.forEach((wall: Wall) => {
        if (
          y - STEP + SPRITE_HEIGHT >= wall.b.y &&
          y - STEP <= wall.b.y &&
          x + SPRITE_WIDTH >= wall.a.x &&
          x <= wall.b.x
        ) {
          collide = true
        }
      })
      if (!collide) {
        this.hero.move(Direction.up)
        if (y < CAMERA_BORDER_Y - translatedY) {
          this.ctx.translate(0, translatedY < 0 ? STEP : 0)
        }
      }
    }
    this.maze.render()
    this.hero.render()
    this.updateFrame()
    requestAnimationFrame(this.move.bind(this))
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
    requestAnimationFrame(this.move.bind(this))
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
