import Maze from './Maze'
import Hero, { STEP, SPRITE_WIDTH, SPRITE_HEIGHT } from './Hero'
import { Keys, ArrowKeys, Wall, AnimationControls } from './types'
import { FPS_INTERVAL } from './constants'
import { Direction } from './MazeGraph'

export default class Renderer {
  // private ctx: CanvasRenderingContext2D
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

    this.hero.clear()
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
      if (!collide) this.hero.move(Direction.right)
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
      if (!collide) this.hero.move(Direction.left)
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
      if (!collide) this.hero.move(Direction.down)
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
      if (!collide) this.hero.move(Direction.up)
    }
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
