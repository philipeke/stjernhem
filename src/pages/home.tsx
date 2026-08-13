import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Shell } from '../components/Shell'
import { Hero } from '../sections/Hero'
import { Stats } from '../sections/Stats'
import { Challenge } from '../sections/Challenge'
import { MethodTeaser } from '../sections/home/MethodTeaser'
import { ServicesTeaser } from '../sections/home/ServicesTeaser'
import { AboutTeaser } from '../sections/home/AboutTeaser'
import { CtaBand } from '../components/CtaBand'
import '../index.css'

function HomePage() {
  return (
    <Shell>
      <Hero />
      <Stats />
      <Challenge />
      <MethodTeaser />
      <ServicesTeaser />
      <AboutTeaser />
      <CtaBand />
    </Shell>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Hittade inte #root')
createRoot(root).render(
  <StrictMode>
    <HomePage />
  </StrictMode>
)
