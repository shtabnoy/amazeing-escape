import Maze from './Maze'
import Hero from './Hero'
import { Keys, ArrowKeys, AnimationControls } from './types'
import {
  FPS_INTERVAL,
  CAMERA_BORDER_X,
  CAMERA_BORDER_Y,
  STEP,
  CANVAS_HEIGHT,
  BOTTOM_BORDER,
  CANVAS_WIDTH,
  RIGHT_BORDER,
  OFFSET_X,
  OFFSET_Y,
  RATIO,
  ROOMS_HORIZONTAL,
  ROOMS_VERTICAL,
  ROOM_WIDTH,
  WALL_DEPTH,
} from './constants'
import { Direction } from './MazeGraph'
import AssetLoader from './AssetLoader'

type P = [number, number]
type W = [P, P]

export default class Renderer {
  private layers: CanvasRenderingContext2D[]
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
  private assetLoader: AssetLoader

  constructor() {
    document.addEventListener('keydown', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = true
    })
    document.addEventListener('keyup', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = false
    })
    this.layers = []
  }

  private collisionRight = (
    walls: W[],
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) =>
    walls.some(
      (wall: W) =>
        x1 + STEP <= wall[0][0] &&
        x2 + STEP >= wall[0][0] &&
        y1 <= wall[1][1] &&
        y2 >= wall[0][1]
    )

  private collisionLeft = (
    walls: W[],
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) =>
    walls.some(
      (wall: W) =>
        x1 - STEP <= wall[1][0] &&
        x2 - STEP >= wall[1][0] &&
        y1 <= wall[1][1] &&
        y2 >= wall[0][1]
    )

  private collisionUp = (
    walls: W[],
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) =>
    walls.some(
      (wall: W) =>
        x1 <= wall[1][0] &&
        x2 >= wall[0][0] &&
        y1 - STEP <= wall[1][1] &&
        y2 - STEP >= wall[1][1]
    )

  private collisionDown = (
    walls: W[],
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) =>
    walls.some(
      (wall: W) =>
        x1 <= wall[1][0] &&
        x2 >= wall[0][0] &&
        y1 + STEP <= wall[0][1] &&
        y2 + STEP >= wall[0][1]
    )

  private moveCamera(dir: Direction) {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    let translatedX = this.layers[1].getTransform().e / 2
    let translatedY = this.layers[1].getTransform().f / 2
    let mx1 = 0 - translatedX
    let my1 = 0 - translatedY
    let mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    let my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y

    switch (dir) {
      case Direction.left:
        if (x1 < CAMERA_BORDER_X - translatedX) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(translatedX < 0 ? STEP : 0, 0)
          this.maze.drawWalls(this.layers[1])
          this.layers[0].clearRect(mx1, my1, mx2, my2)
          this.layers[0].translate(translatedX < 0 ? STEP : 0, 0)
          this.maze.drawGround(this.layers[0])
        }
        break
      case Direction.right:
        if (x2 > CANVAS_WIDTH - translatedX - CAMERA_BORDER_X) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(-translatedX > RIGHT_BORDER ? 0 : -STEP, 0)
          this.maze.drawWalls(this.layers[1])
          this.layers[0].clearRect(mx1, my1, mx2, my2)
          this.layers[0].translate(-translatedX > RIGHT_BORDER ? 0 : -STEP, 0)
          this.maze.drawGround(this.layers[0])
        }
        break
      case Direction.up:
        if (y1 < CAMERA_BORDER_Y - translatedY) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(0, translatedY < 0 ? STEP : 0)
          this.maze.drawWalls(this.layers[1])
          this.layers[0].clearRect(mx1, my1, mx2, my2)
          this.layers[0].translate(0, translatedY < 0 ? STEP : 0)
          this.maze.drawGround(this.layers[0])
        }
        break
      case Direction.down:
        if (y2 > CANVAS_HEIGHT - translatedY - CAMERA_BORDER_Y) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(0, -translatedY > BOTTOM_BORDER ? 0 : -STEP)
          this.maze.drawWalls(this.layers[1])
          this.layers[0].clearRect(mx1, my1, mx2, my2)
          this.layers[0].translate(0, -translatedY > BOTTOM_BORDER ? 0 : -STEP)
          this.maze.drawGround(this.layers[0])
        }
        break
    }
  }

  private move = () => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()

    const walls = this.maze.getWalls()
    const cp = Object.values(walls).map((wall: any) => wall.coords)

    if (
      this.keys[ArrowKeys.ArrowRight] &&
      !this.collisionRight(cp, x1, y1, x2, y2)
    ) {
      // if (x2 + STEP < room.b.x) {
      this.hero.clear(this.layers[1])
      this.hero.move(Direction.right)
      this.moveCamera(Direction.right)
      this.hero.render(this.layers[1])
      // } else {
      // this.hero.setCurrentRoom([x + 1, y].join(','))
      // console.log('you are in the room ' + this.hero.getCurrentRoom())
      // }
    }
    if (
      this.keys[ArrowKeys.ArrowLeft] &&
      !this.collisionLeft(cp, x1, y1, x2, y2)
    ) {
      // if (x1 - STEP > room.a.x) {
      this.hero.clear(this.layers[1])
      this.hero.move(Direction.left)
      this.moveCamera(Direction.left)
      this.hero.render(this.layers[1])
      // } else {
      // this.hero.setCurrentRoom([x - 1, y].join(','))
      // console.log('you are in the room ' + this.hero.getCurrentRoom())
      // }
    }
    if (
      this.keys[ArrowKeys.ArrowDown] &&
      !this.collisionDown(cp, x1, y1, x2, y2)
    ) {
      // if (y2 + STEP < room.b.y) {
      this.hero.clear(this.layers[1])
      this.hero.move(Direction.down)
      this.moveCamera(Direction.down)
      this.hero.render(this.layers[1])
      // } else {
      // this.hero.setCurrentRoom([x, y + 1].join(','))
      // console.log('you are in the room ' + this.hero.getCurrentRoom())
      // }
    }
    if (this.keys[ArrowKeys.ArrowUp] && !this.collisionUp(cp, x1, y1, x2, y2)) {
      // if (y1 - STEP > room.a.y) {
      this.hero.clear(this.layers[1])
      this.hero.move(Direction.up)
      this.moveCamera(Direction.up)
      this.hero.render(this.layers[1])
      // } else {
      // this.hero.setCurrentRoom([x, y - 1].join(','))
      // console.log('you are in the room ' + this.hero.getCurrentRoom())
      // }
    }

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

  addLayer(canvasId: string) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.id = canvasId
    document.body.appendChild(canvas)

    // retina adjustments
    canvas.width = CANVAS_WIDTH * 2
    canvas.height = CANVAS_HEIGHT * 2
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`
    ctx.scale(RATIO, RATIO)
    ctx.translate(OFFSET_X, OFFSET_Y)

    this.layers.push(ctx)
  }

  addMaze(maze: Maze) {
    this.maze = maze
  }

  addHero(hero: Hero) {
    this.hero = hero
  }

  setAssetLoader(assetLoader: AssetLoader) {
    this.assetLoader = assetLoader
  }

  async render() {
    this.addLayer('ground')
    this.addLayer('walls-and-hero')

    this.addMaze(
      new Maze(ROOMS_HORIZONTAL, ROOMS_VERTICAL, {
        rw: ROOM_WIDTH,
        d: WALL_DEPTH,
        images: {
          walls: this.assetLoader.getImage('walls'),
          ground: this.assetLoader.getImage('ground'),
        },
      })
    )
    this.addHero(new Hero(this.assetLoader.getImage('hero'), { x: 65, y: 65 }))
    this.maze.drawGround(this.layers[0])
    this.maze.drawWalls(this.layers[1])
    this.hero.render(this.layers[1])
    this.hero.setCurrentRoom('0,0')
    this.startAnimationLoop()
  }
}
