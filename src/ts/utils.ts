import { Wall } from './types'
import NewGraph, { Edge, Direction } from './NewGraph'

export const mstNew = (source: NewGraph): NewGraph => {
  const result = new NewGraph()
  let v = source.vertices[0]
  // let heap: Edge[] = source.getVertexEdges(v)
  let heap: Edge[] = v.edges
  let min: Edge = {
    src: '',
    dest: '',
    weight: Infinity,
  }
  while (heap.length > 0) {
    for (let edge of heap) {
      min = edge.weight < min.weight ? edge : min
    }
    // TODO: Pass just an object { src, dest, weight, dir } to create an edge
    result.addEdge(min.src, min.dest, min.weight)
    v = source.getVertex(min.dest)
    // Add edges coming out from new vertex 'v'
    // heap = heap.concat(source.getVertexEdges(v))
    heap = heap.concat(v.edges)
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

export const randInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const rnd = () => Math.random() // Just a shorter way to call Math.random()

export const createMazeGraphNew = (w: number, h: number): NewGraph => {
  const g = new NewGraph()
  if (w < 2 || h < 2) return g

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (i != w - 1) g.addEdge(`${i},${j}`, `${i + 1},${j}`, rnd())
      if (j < h - 1) g.addEdge(`${i},${j}`, `${i},${j + 1}`, rnd())
    }
  }

  return g
}

interface CreateWallsConfig {
  width: number
  height: number
  cellWidth: number
  depth?: number
}

// export const createWalls = (
//   g: Graph,
//   { width, height, cellWidth, depth = 0 }: CreateWallsConfig
// ): Walls => {
//   const walls: Walls = {}
//   Object.keys(g.AdjList).forEach((v1, index) => {
//     let topLeft = {
//       x: (index % width) * cellWidth,
//       y: Math.floor(index / height) * cellWidth,
//     }
//     let topRight = {
//       x: ((index % width) + 1) * cellWidth,
//       y: Math.floor(index / height) * cellWidth,
//     }
//     let bottomLeft = {
//       x: (index % width) * cellWidth,
//       y: (Math.floor(index / height) + 1) * cellWidth,
//     }
//     let bottomRight = {
//       x: ((index % width) + 1) * cellWidth,
//       y: (Math.floor(index / height) + 1) * cellWidth,
//     }

//     walls[`${topLeft.x}${topLeft.y}${bottomLeft.x}${bottomLeft.y}`] = {
//       a: topLeft,
//       b: { ...bottomLeft, x: bottomLeft.x + depth },
//     }
//     walls[`${topLeft.x}${topLeft.y}${topRight.x}${topRight.y}`] = {
//       a: topLeft,
//       b: { ...topRight, y: topRight.y + depth },
//     }
//     walls[`${topRight.x}${topRight.y}${bottomRight.x}${bottomRight.y}`] = {
//       a: topRight,
//       b: { ...bottomRight, x: bottomRight.x + depth },
//     }
//     walls[`${bottomLeft.x}${bottomLeft.y}${bottomRight.x}${bottomRight.y}`] = {
//       a: bottomLeft,
//       b: { ...bottomRight, y: bottomRight.y + depth },
//     }
//     Object.keys(g.AdjList[v1]).forEach(v2 => {
//       if (Number(v1) - Number(v2) === 1) {
//         delete walls[`${topLeft.x}${topLeft.y}${bottomLeft.x}${bottomLeft.y}`]
//       }
//       if (Number(v1) - Number(v2) === width) {
//         delete walls[`${topLeft.x}${topLeft.y}${topRight.x}${topRight.y}`]
//       }
//       if (Number(v1) - Number(v2) === -1) {
//         delete walls[
//           `${topRight.x}${topRight.y}${bottomRight.x}${bottomRight.y}`
//         ]
//       }
//       if (Number(v1) - Number(v2) === -width) {
//         delete walls[
//           `${bottomLeft.x}${bottomLeft.y}${bottomRight.x}${bottomRight.y}`
//         ]
//       }
//     })
//   })
//   return walls
// }

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
