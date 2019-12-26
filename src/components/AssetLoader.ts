import Walls from '../assets/images/walls.png'
import Ground from '../assets/images/ground.jpg'
import Hero from '../assets/images/hero.png'
import Intro from '../assets/images/intro.png'
import Portal from '../assets/images/portal.png'

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const imageMap = {
  walls: Walls,
  hero: Hero,
  ground: Ground,
  intro: Intro,
  portal: Portal,
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
      // const image = await loadImage(`src/assets/${imageSrc}`)
      const image = await loadImage(imageSrc)
      this.images[imageName] = image
    }
  }

  getImage = (name: string) => {
    return this.images[name]
  }
}
