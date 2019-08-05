import Graph from './Graph'
import mst from './MST'

interface Point {
  x: number
  y: number
}

interface Wall {}

interface Room {
  x1: number
  y1: number
  x2: number
  y2: number
  n: Room | Wall
  e: Room | Wall
  s: Room | Wall
  w: Room | Wall
}

const WIDTH = 5
const HEIGHT = 5
const CIRCLE_R = 5

function drawOnCanvas(mazeObject: any, ctx: CanvasRenderingContext2D) {
  // TODO: just iterate over Object.keys(mazeObject)
  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < HEIGHT; col++) {
      const room = mazeObject[row * WIDTH + col + 1]
      ctx.beginPath()
      ctx.moveTo(room.x1, room.y1)
      if (room.up) {
        ctx.moveTo(room.x2, room.y1)
      } else {
        ctx.lineTo(room.x2, room.y1)
      }
      if (room.right) {
        ctx.moveTo(room.x2, room.y2)
      } else {
        ctx.lineTo(room.x2, room.y2)
      }
      if (room.down) {
        ctx.moveTo(room.x1, room.y2)
      } else {
        ctx.lineTo(room.x1, room.y2)
      }
      if (room.left) {
        ctx.moveTo(room.x1, room.y1)
      } else {
        ctx.lineTo(room.x1, room.y1)
      }
      ctx.stroke()
    }
  }
}

function drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.arc(x, y, CIRCLE_R, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
}

function prepareForDrawing(g: Graph) {
  const mazeObject: {
    [key: string]: {
      left: number | null
      right: number | null
      up: number | null
      down: number | null
      x1: number
      y1: number
      x2: number
      y2: number
    }
  } = {}
  Object.keys(g.AdjList).forEach((v1, index) => {
    mazeObject[v1] = {
      left: null,
      right: null,
      up: null,
      down: null,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    }
    const rw = 50
    const offset = 10
    mazeObject[v1].x1 = (index % WIDTH) * rw + offset
    mazeObject[v1].x2 = ((index % WIDTH) + 1) * rw + offset
    mazeObject[v1].y1 = Math.floor(index / HEIGHT) * rw + offset
    mazeObject[v1].y2 = (Math.floor(index / HEIGHT) + 1) * rw + offset
    Object.keys(g.AdjList[v1]).forEach(v2 => {
      if (Number(v1) - Number(v2) === 1) {
        mazeObject[v1].left = Number(v2)
      }
      if (Number(v1) - Number(v2) === -1) {
        mazeObject[v1].right = Number(v2)
      }
      if (Number(v1) - Number(v2) === WIDTH) {
        mazeObject[v1].up = Number(v2)
      }
      if (Number(v1) - Number(v2) === -WIDTH) {
        mazeObject[v1].down = Number(v2)
      }
    })
  })
  return mazeObject
}

function makeGraph(w: number, h: number) {
  const g1 = new Graph()
  const g2 = new Graph()
  Object.keys(Array.from(Array(w * h))).forEach((n, index) => {
    g1.addVertex((index + 1).toString())
  })
  for (let row = 0; row < w; row++) {
    for (let col = 0; col < h; col++) {
      // TODO: Allow number graph vertices
      const v = row * w + col + 1

      if (row == 0 && col == 0) {
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
      } else if (row == 0 && col == h - 1) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
      } else if (row == w - 1 && col == 0) {
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
      } else if (row == w - 1 && col == h - 1) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
      } else if (row == 0) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
      } else if (row == w - 1) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
      } else if (col == 0) {
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
      } else if (col == h - 1) {
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
      } else {
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
      }
    }
  }
  mst(g1, g2)
  // console.log(g2)
  return g2
}

document.addEventListener('DOMContentLoaded', () => {
  const graph = makeGraph(WIDTH, HEIGHT)
  const maze = prepareForDrawing(graph)

  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  // const cw = window.innerWidth
  // const ch = window.innerHeight
  const cw = 600
  const ch = 600

  // retina adjustments
  canvas.width = cw * 2
  canvas.height = ch * 2
  canvas.style.width = `${cw}px`
  canvas.style.height = `${ch}px`
  const ctx = canvas.getContext('2d')
  const ratio = window.devicePixelRatio
  ctx.scale(ratio, ratio)

  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.lineCap = 'square'

  const coords = {
    x: 30,
    y: 30,
  }
  const STEP_PER_FRAME = 2
  let room = 1
  drawOnCanvas(maze, ctx)
  drawCharacter(ctx, coords.x, coords.y)

  const move = (dir: 'right' | 'left' | 'up' | 'down') => {
    let inRoom = true
    let canGo = false
    switch (dir) {
      case 'left':
        inRoom = coords.x - STEP_PER_FRAME - CIRCLE_R >= maze[room].x1
        canGo = inRoom || Boolean(maze[room].left)
        if (canGo) coords.x -= STEP_PER_FRAME
        break
      case 'right':
        inRoom = coords.x + STEP_PER_FRAME + CIRCLE_R <= maze[room].x2
        canGo = inRoom || Boolean(maze[room].right)
        if (canGo) coords.x += STEP_PER_FRAME
        break
      case 'up':
        inRoom = coords.y - STEP_PER_FRAME - CIRCLE_R >= maze[room].y1
        canGo = inRoom || Boolean(maze[room].up)
        if (canGo) coords.y -= STEP_PER_FRAME
        break
      case 'down':
        inRoom = coords.y + STEP_PER_FRAME + CIRCLE_R <= maze[room].y2
        canGo = inRoom || Boolean(maze[room].down)
        if (canGo) coords.y += STEP_PER_FRAME
        break
      default:
        break
    }
    if (canGo) {
      ctx.clearRect(0, 0, cw, ch)
      if (!inRoom) room = maze[room][dir]
      drawOnCanvas(maze, ctx)
      drawCharacter(ctx, coords.x, coords.y)
    }
  }

  const keys: {
    [key: string]: boolean
  } = {}

  const update = () => {
    if (keys[39]) {
      move('right')
    }
    if (keys[37]) {
      move('left')
    }
    if (keys[40]) {
      move('down')
    }
    if (keys[38]) {
      move('up')
    }
    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)

  document.addEventListener('keydown', e => {
    keys[e.keyCode] = true
  })
  document.addEventListener('keyup', e => {
    keys[e.keyCode] = false
  })
})
