import Graph from './Graph'
import { Walls } from './types'

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
