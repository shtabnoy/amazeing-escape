const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const imageMap = {
  walls: 'walls/wallsLong.png',
  hero: 'hero/hero.png',
  ground: 'ground/ground.jpg',
  intro: 'portal/intro.png',
  portal: 'portal/portal.png',
}

interface Images {
  [name: string]: HTMLImageElement
}

export default class AssetLoader {
  private images: Images

  constructor() {
    this.images = {}
  }

  loagImages = async () => {
    for (let [imageName, imageSrc] of Object.entries(imageMap)) {
      const image = await loadImage(`src/assets/${imageSrc}`)
      this.images[imageName] = image
    }
  }

  getImage = (name: string) => {
    return this.images[name]
  }
}
