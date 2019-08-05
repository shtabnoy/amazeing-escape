import Graph from './Graph'

const mst = (source: Graph, dest: Graph) => {
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

export default mst
