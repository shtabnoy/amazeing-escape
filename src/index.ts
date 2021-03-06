import Renderer from './components/Renderer'
import AssetLoader from './components/AssetLoader'
import GameMusic from './assets/audio/gameMusic.mp3'
import PortalIntro from './assets/audio/portalIntro.wav'
import './styles/global.scss'

document.addEventListener('DOMContentLoaded', () => {
  const newGameBtn = document.getElementById('new') as HTMLButtonElement
  const resumeGameBtn = document.getElementById('resume')
  const timeBlock = document.getElementById('time')

  // load all audios
  const mainTheme = new Audio(GameMusic)
  const portalIntro = new Audio(PortalIntro)

  mainTheme.loop = true

  let startTime = 0
  // TODO: finishTime should exclude final fade out animation
  let finishTime = 0

  const roundTime = (time: number) => (time < 10 ? `0${time}` : time)

  const renderTime = (finishTime: number, startTime: number) => {
    const dist = finishTime - startTime
    const minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((dist % (1000 * 60)) / 1000)
    const timer = document.getElementById('time')
    timer.innerHTML = `Y o u r&nbsp;&nbsp;&nbsp;t i m e&nbsp;&nbsp;&nbsp;${roundTime(
      minutes
    )} : ${roundTime(seconds)}`
  }

  const onFinish = () => {
    // setup current time as finish time
    finishTime = new Date().getTime()

    const canvases = document.querySelectorAll('canvas')
    canvases.forEach(canvas => {
      canvas.style.display = 'none'
    })
    resumeGameBtn.style.display = 'none'
    timeBlock.style.display = 'block'
    newGameBtn.style.display = 'block'

    renderTime(finishTime, startTime)

    mainTheme.pause()
    mainTheme.currentTime = 0
  }

  newGameBtn.addEventListener('click', async () => {
    newGameBtn.disabled = true

    // setup current time as start time
    startTime = new Date().getTime()

    // remove all canvases if they exist
    const canvases = document.querySelectorAll('canvas')
    if (canvases && canvases.length) {
      canvases.forEach(canvas => document.body.removeChild(canvas))
    }

    // preload all the images
    const al = new AssetLoader()
    await al.loagImages()

    // render the canvas
    const r = new Renderer(onFinish)
    r.setAssetLoader(al)
    r.render()

    mainTheme.currentTime = 0
    portalIntro.currentTime = 0
    const audioPromise1 = mainTheme.play()
    const audioPromise2 = portalIntro.play()

    newGameBtn.disabled = false
    // start audio
    // audio.currentTime = 0
    // const audioPromise = audio.play()
    // if (audioPromise !== undefined) {
    //   audioPromise
    //     .then(_ => {
    //       console.log('Autoplay started!')
    //     })
    //     .catch(error => {
    //       console.log('Autoplay was rejected. Show a button')
    //     })
    // }
  })

  resumeGameBtn.addEventListener('click', () => {
    // audio.play()
    const canvases = document.querySelectorAll('canvas')
    canvases.forEach(canvas => {
      canvas.style.display = 'block'
    })
    timeBlock.style.display = 'none'
    newGameBtn.style.display = 'none'
    resumeGameBtn.style.display = 'none'
  })

  document.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
      // audio.pause()
      const canvases = document.querySelectorAll('canvas')
      canvases.forEach(canvas => {
        canvas.style.display = 'none'
      })
      timeBlock.style.display = 'none'
      newGameBtn.style.display = 'block'
      resumeGameBtn.style.display = 'block'
    }
  })
})
