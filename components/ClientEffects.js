'use client'
import { useEffect } from 'react'

export default function ClientEffects() {
  useEffect(() => {
    // Navbar scroll state
    const navbar = document.getElementById('navbar')
    const onScroll = () => {
      if (window.scrollY > 20) navbar?.classList.add('scrolled')
      else navbar?.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Reveal on load
    const els = document.querySelectorAll('[data-reveal]')
    els.forEach((el, i) => {
      const delay = el.dataset.revealDelay ? parseInt(el.dataset.revealDelay) : i * 80
      setTimeout(() => el.classList.add('revealed'), delay + 120)
    })

    // Smooth scroll
    const anchors = document.querySelectorAll('a[href^="#"]')
    const onClick = (e) => {
      const target = document.querySelector(e.currentTarget.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    anchors.forEach((a) => a.addEventListener('click', onClick))

    return () => {
      window.removeEventListener('scroll', onScroll)
      anchors.forEach((a) => a.removeEventListener('click', onClick))
    }
  }, [])

  return null
}
