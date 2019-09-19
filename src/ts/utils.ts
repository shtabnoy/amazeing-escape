import Graph from './Graph'
import { Walls, Wall } from './types'
import NewGraph, { Edge, Direction } from './NewGraph'

export const mst = (source: Graph, dest: Graph) => {
  const vStart = Object.keys(source.AdjList)[0]
  dest.addVertex(vStart)

  while (source.order > 0) {
    let min = {
      src: '',
      dest: '',
      weight: Infinity,
    }
    for (let vIn of Object.keys(dest.AdjList)) {
      if (!source.AdjList[vIn]) continue
      for (let vOut of Object.keys(source.AdjList[vIn])) {
        if (source.AdjList[vIn][vOut] < min.weight) {
          min.src = vIn
          min.dest = vOut
          min.weight = source.AdjList[vIn][vOut]
        }
      }
    }
    dest.addVertex(min.dest)
    dest.addEdge(min.src, min.dest, min.weight)
    source.removeEdge(min.src, min.dest)

    // remove all the edges to dest
    for (let v of Object.keys(dest.AdjList)) {
      if (!source.AdjList[v]) continue
      if (source.AdjList[v][min.dest]) source.removeEdge(v, min.dest)
    }

    for (let v of Object.keys(source.AdjList)) {
      if (source.AdjList[v].degree === 0) source.removeVertex(v)
    }
  }
}

export const mstNew = (source: NewGraph) => {
  const result = new NewGraph()
  let v = source.vertices[0]
  let heap: Edge[] = source.getVertexEdges(v)
  let min: Edge = {
    src: '',
    dest: '',
    weight: Infinity,
    dir: undefined,
  }
  while (heap.length > 0) {
    for (let edge of heap) {
      min = edge.weight < min.weight ? edge : min
    }
    // TODO: Pass just an object { src, dest, weight, dir } to create an edge
    result.addEdge(min.src, min.dest, min.weight, min.dir)
    v = min.dest
    // Add edges coming out from new vertex 'v'
    heap = heap.concat(source.getVertexEdges(v))
    // Remove min edge
    heap = heap.filter(
      (edge: Edge) =>
        !(
          (edge.src === min.src && edge.dest === min.dest) ||
          (edge.src === min.dest && edge.dest === min.src)
        )
    )
    const srcs = result.edges.map(e => e.src)
    const dests = result.edges.map(e => e.dest)
    // Remove loops
    heap = heap.filter(
      (edge: Edge) => !(srcs.includes(edge.dest) || dests.includes(edge.dest))
    )
    min = {
      src: '',
      dest: '',
      weight: Infinity,
      dir: undefined,
    }
  }
  return result
}

export const createMazeGraph = (w: number, h: number) => {
  const g1 = new Graph()
  const g2 = new Graph()
  Object.keys(Array.from(Array(w * h))).forEach((n, index) => {
    g1.addVertex((index + 1).toString())
  })
  for (let row = 0; row < w; row++) {
    for (let col = 0; col < h; col++) {
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
  return g2
}

export const randInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const rnd = () => Math.random() // Just a shorter way to call Math.random()

export const createMazeGraphNew = (w: number, h: number): NewGraph => {
  const g = new NewGraph()
  if (w < 2 || h < 2) return g

  // const total = w * h
  // // A vertex name will be an index (0 to total)
  // for (let i = 0; i < total; i++) {
  //   // every vertex except right column
  //   if (i % w != w - 1) {
  //     g.addEdge(`${i}`, `${i + 1}`, rnd(), Direction.right) // to the right
  //   }
  //   // every vertex except bottom row
  //   if (i < total - w) {
  //     g.addEdge(`${i}`, `${i + w}`, rnd(), Direction.down) // to the bottom
  //   }
  // }
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (i != w - 1) g.addEdge(`${i},${j}`, `${i + 1},${j}`, rnd())
      if (j < h - 1) g.addEdge(`${i},${j}`, `${i},${j + 1}`, rnd())
    }
  }
  // for (let i = 0; i < h; i++) {
  //   for (let j = 0; j < w; j++) {
  //     if (j != w - 1) g.addEdge(`${i},${j}`, `${i},${j + 1}`, rnd())
  //     if (i < h - 1) g.addEdge(`${i},${j}`, `${i + 1},${j}`, rnd())
  //   }
  // }
  return g
}

interface CreateWallsConfig {
  width: number
  height: number
  cellWidth: number
  depth?: number
}

export const createWalls = (
  g: Graph,
  { width, height, cellWidth, depth = 0 }: CreateWallsConfig
): Walls => {
  const walls: Walls = {}
  Object.keys(g.AdjList).forEach((v1, index) => {
    let topLeft = {
      x: (index % width) * cellWidth,
      y: Math.floor(index / height) * cellWidth,
    }
    let topRight = {
      x: ((index % width) + 1) * cellWidth,
      y: Math.floor(index / height) * cellWidth,
    }
    let bottomLeft = {
      x: (index % width) * cellWidth,
      y: (Math.floor(index / height) + 1) * cellWidth,
    }
    let bottomRight = {
      x: ((index % width) + 1) * cellWidth,
      y: (Math.floor(index / height) + 1) * cellWidth,
    }

    walls[`${topLeft.x}${topLeft.y}${bottomLeft.x}${bottomLeft.y}`] = {
      a: topLeft,
      b: { ...bottomLeft, x: bottomLeft.x + depth },
    }
    walls[`${topLeft.x}${topLeft.y}${topRight.x}${topRight.y}`] = {
      a: topLeft,
      b: { ...topRight, y: topRight.y + depth },
    }
    walls[`${topRight.x}${topRight.y}${bottomRight.x}${bottomRight.y}`] = {
      a: topRight,
      b: { ...bottomRight, x: bottomRight.x + depth },
    }
    walls[`${bottomLeft.x}${bottomLeft.y}${bottomRight.x}${bottomRight.y}`] = {
      a: bottomLeft,
      b: { ...bottomRight, y: bottomRight.y + depth },
    }
    Object.keys(g.AdjList[v1]).forEach(v2 => {
      if (Number(v1) - Number(v2) === 1) {
        delete walls[`${topLeft.x}${topLeft.y}${bottomLeft.x}${bottomLeft.y}`]
      }
      if (Number(v1) - Number(v2) === width) {
        delete walls[`${topLeft.x}${topLeft.y}${topRight.x}${topRight.y}`]
      }
      if (Number(v1) - Number(v2) === -1) {
        delete walls[
          `${topRight.x}${topRight.y}${bottomRight.x}${bottomRight.y}`
        ]
      }
      if (Number(v1) - Number(v2) === -width) {
        delete walls[
          `${bottomLeft.x}${bottomLeft.y}${bottomRight.x}${bottomRight.y}`
        ]
      }
    })
  })
  return walls
}

const dir = (edge: Edge): Direction => {
  const [x1, y1] = edge.src.split(',')
  const [x2, y2] = edge.dest.split(',')
  if (Number(x2) - Number(x1) > 0) return Direction.right
  if (Number(x2) - Number(x1) < 0) return Direction.left
  if (Number(y2) - Number(y1) > 0) return Direction.down
  if (Number(y2) - Number(y1) < 0) return Direction.up
}

export const createWallsNew = (
  g: NewGraph
  // { width, height, cellWidth, depth = 0 }: CreateWallsConfig
) => {
  const walls: Wall[] = []
  g.edges.forEach((edge: Edge) => {
    console.log(dir(edge))
  })
}
