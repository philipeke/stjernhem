import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Shell } from '../components/Shell'
import { PageHero, Breadcrumbs } from '../components/PageHero'
import { About } from '../sections/About'
import { Why } from '../sections/Why'
import { CtaBand } from '../components/CtaBand'
import '../index.css'

function OmOssPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Om oss"
        title="Femton år av att se det som inte syns"
        lead="Stjernhem Rehabilitering & Hälsa AB leds av en legitimerad arbetsterapeut med erfarenhet från Arbetsförmedlingen, kommunal arbetsmarknadsavdelning, samordningsförbund och neurologisk rehabilitering."
        image="lake-dawn"
      >
        <Breadcrumbs current="Om oss" />
      </PageHero>

      <About />
      <Why />
      <CtaBand
        heading="Vill ni prata med arbetsterapeuten direkt?"
        body="Ni når Anneli utan mellanhänder. Ring, mejla eller boka ett digitalt möte."
      />
    </Shell>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Hittade inte #root')
createRoot(root).render(
  <StrictMode>
    <OmOssPage />
  </StrictMode>
)
