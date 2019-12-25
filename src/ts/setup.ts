import Renderer from './Renderer'
import AssetLoader from './AssetLoader'
import '../styles/global.scss'

document.addEventListener('DOMContentLoaded', () => {
  const newGameBtn = document.getElementById('new')
  const resumeGameBtn = document.getElementById('resume')
  const timeBlock = document.getElementById('time')

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
  }

  newGameBtn.addEventListener('click', async () => {
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

    // load the background audio
    // const audio = new Audio('src/assets/audio/game_music_2.mp3')
    // audio.loop = true
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
    const canvases = document.querySelectorAll('canvas')
    canvases.forEach(canvas => {
      canvas.style.display = 'block'
    })
    newGameBtn.style.display = 'none'
    resumeGameBtn.style.display = 'none'
  })

  document.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
      const canvases = document.querySelectorAll('canvas')
      canvases.forEach(canvas => {
        canvas.style.display = 'none'
      })
      newGameBtn.style.display = 'block'
      resumeGameBtn.style.display = 'block'
    }
  })
})
