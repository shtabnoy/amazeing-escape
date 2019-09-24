import Maze from './Maze'
import Hero from './Hero'
import { Keys, ArrowKeys } from './types'
import { Direction } from './MazeGraph'

interface AnimationControls {
  now: number
  then: number
  elapsed: number
}

const FPS_INTERVAL = 1000 / 6

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

  private move() {
    if (this.keys[ArrowKeys.ArrowRight]) {
      this.hero.move(Direction.right)
    }
    if (this.keys[ArrowKeys.ArrowLeft]) {
      this.hero.move(Direction.left)
    }
    if (this.keys[ArrowKeys.ArrowDown]) {
      this.hero.move(Direction.down)
    }
    if (this.keys[ArrowKeys.ArrowUp]) {
      this.hero.move(Direction.up)
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
}
