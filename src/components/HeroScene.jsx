import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Handheld from './Handheld'
import HeroCopy from './HeroCopy'

gsap.registerPlugin(ScrollTrigger)

function HeroScene() {
  const stageRef = useRef(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const scene = stage.querySelector('.scene')
    const deviceLayer = stage.querySelector('.scene-device-layer')
    const handheld = stage.querySelector('.handheld')
    const sceneArt = stage.querySelector('.scene-art')
    const sceneWall = stage.querySelector('.scene-wall')
    const nameHeading = stage.querySelector('.hero-copy h1')
    const handheldAnchor = stage.querySelector('.handheld-anchor')

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const isMobile = window.matchMedia('(max-width: 700px)').matches
      const finalScale = isMobile ? 0.77 : 2.74
      const initialScale = isMobile ? 0.52 : 1
      const initialRotation = isMobile ? -10 : -9

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          pin: scene,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .fromTo(sceneWall, { autoAlpha: 1 }, { autoAlpha: 0.2, duration: 0.6 }, 0.08)
        .fromTo(sceneArt, { filter: 'brightness(1) blur(0px)' }, { filter: 'brightness(.78) blur(10px)', duration: 1 }, 0)
        .fromTo(nameHeading, { filter: 'blur(0px)' }, { filter: isMobile ? 'blur(5px)' : 'blur(0px)', duration: 1 }, 0)
        .fromTo(deviceLayer, {
          x: 0,
          y: 0,
        }, {
          x: () => `${isMobile ? -window.innerWidth * 0.12 : -window.innerWidth * 0.22}px`,
          y: () => `${isMobile ? window.innerHeight * 0.04 : window.innerHeight * 0.06}px`,
          duration: 0.9,
        }, 0)
        .fromTo(handheld, { scale: initialScale }, { scale: finalScale, duration: 1 }, 0)
        .fromTo(handheldAnchor, { rotation: initialRotation }, { rotation: 0, duration: 1 }, 0)

      return () => timeline.kill()
    })

    return () => media.revert()
  }, [])

  return (
    <div className="transition-stage" ref={stageRef}>
      <div className="scene" id="top">
        <div className="scene-art" aria-hidden="true" />
        <div className="scene-wall" aria-hidden="true" />
        <HeroCopy />
        <div className="scene-device-layer">
          <div className="handheld-anchor" id="work"><Handheld /></div>
        </div>
      </div>
      <div id="transition-end" className="transition-end" aria-hidden="true" />
    </div>
  )
}

export default HeroScene
