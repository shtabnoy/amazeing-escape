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
      if (room.n) {
        ctx.moveTo(room.x2, room.y1)
      } else {
        ctx.lineTo(room.x2, room.y1)
      }
      if (room.e) {
        ctx.moveTo(room.x2, room.y2)
      } else {
        ctx.lineTo(room.x2, room.y2)
      }
      if (room.s) {
        ctx.moveTo(room.x1, room.y2)
      } else {
        ctx.lineTo(room.x1, room.y2)
      }
      if (room.w) {
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
      w: number | null
      e: number | null
      n: number | null
      s: number | null
      x1: number
      y1: number
      x2: number
      y2: number
    }
  } = {}
  Object.keys(g.AdjList).forEach((v1, index) => {
    mazeObject[v1] = {
      w: null,
      e: null,
      n: null,
      s: null,
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
        mazeObject[v1].w = Number(v2)
      }
      if (Number(v1) - Number(v2) === -1) {
        mazeObject[v1].e = Number(v2)
      }
      if (Number(v1) - Number(v2) === WIDTH) {
        mazeObject[v1].n = Number(v2)
      }
      if (Number(v1) - Number(v2) === -WIDTH) {
        mazeObject[v1].s = Number(v2)
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
  const mazeObj = prepareForDrawing(graph)

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
  let INCREMENT = 10
  let inc = 1
  let counter = 0
  let currentRoom = 1
  drawOnCanvas(mazeObj, ctx)
  drawCharacter(ctx, coords.x, coords.y)

  const moveRight = () => {
    if (
      !mazeObj[currentRoom].e &&
      coords.x + inc + CIRCLE_R > mazeObj[currentRoom].x2
    ) {
      console.log('RIGHT WALL')
    } else {
      ctx.clearRect(0, 0, cw, ch)
      if (coords.x + inc + CIRCLE_R > mazeObj[currentRoom].x2) {
        currentRoom = mazeObj[currentRoom].e
      }
      coords.x += inc
      drawOnCanvas(mazeObj, ctx)
      drawCharacter(ctx, coords.x, coords.y)
      counter++
      if (counter < INCREMENT) {
        requestAnimationFrame(moveRight)
      } else {
        counter = 0
      }
    }
  }
  const moveLeft = () => {
    if (
      !mazeObj[currentRoom].w &&
      coords.x - inc - CIRCLE_R < mazeObj[currentRoom].x1
    ) {
      console.log('LEFT WALL')
    } else {
      ctx.clearRect(0, 0, cw, ch)
      if (coords.x - inc - CIRCLE_R < mazeObj[currentRoom].x1) {
        currentRoom = mazeObj[currentRoom].w
      }
      coords.x -= inc
      drawOnCanvas(mazeObj, ctx)
      drawCharacter(ctx, coords.x, coords.y)
      counter++
      if (counter < INCREMENT) {
        requestAnimationFrame(moveLeft)
      } else {
        counter = 0
      }
    }
  }
  const moveUp = () => {
    if (
      !mazeObj[currentRoom].n &&
      coords.y - inc - CIRCLE_R < mazeObj[currentRoom].y1
    ) {
      console.log('TOP WALL')
    } else {
      ctx.clearRect(0, 0, cw, ch)
      if (coords.y - inc - CIRCLE_R < mazeObj[currentRoom].y1) {
        currentRoom = mazeObj[currentRoom].n
      }
      coords.y -= inc
      drawOnCanvas(mazeObj, ctx)
      drawCharacter(ctx, coords.x, coords.y)
      counter++
      if (counter < INCREMENT) {
        requestAnimationFrame(moveUp)
      } else {
        counter = 0
      }
    }
  }
  const moveDown = () => {
    if (
      !mazeObj[currentRoom].s &&
      coords.y + inc + CIRCLE_R > mazeObj[currentRoom].y2
    ) {
      console.log('BOTTOM WALL')
    } else {
      ctx.clearRect(0, 0, cw, ch)
      if (coords.y + inc + CIRCLE_R > mazeObj[currentRoom].y2) {
        currentRoom = mazeObj[currentRoom].s
      }
      coords.y += inc
      drawOnCanvas(mazeObj, ctx)
      drawCharacter(ctx, coords.x, coords.y)
      counter++
      if (counter < INCREMENT) {
        requestAnimationFrame(moveDown)
      } else {
        counter = 0
      }
    }
  }

  document.addEventListener('keydown', e => {
    if (e.which === 39) {
      requestAnimationFrame(moveRight)
    }
    if (e.which === 37) {
      requestAnimationFrame(moveLeft)
    }
    if (e.which === 40) {
      requestAnimationFrame(moveDown)
    }
    if (e.which === 38) {
      requestAnimationFrame(moveUp)
    }
  })
})
