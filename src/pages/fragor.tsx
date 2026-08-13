import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Shell } from '../components/Shell'
import { PageHero, Breadcrumbs } from '../components/PageHero'
import { Faq } from '../sections/Faq'
import { CtaBand } from '../components/CtaBand'
import '../index.css'

function FragorPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Vanliga frågor"
        title="Det ni brukar undra"
        lead="Lokaler, utrustning, antal deltagare, tidsplan och vad rapporten kan användas till. Hittar ni inte svaret får ni det av arbetsterapeuten själv — inte av en säljare."
      >
        <Breadcrumbs current="Frågor" />
      </PageHero>

      <Faq />
      <CtaBand
        heading="Kvarstår en fråga?"
        body="Skriv några rader så svarar vi — oftast samma dag."
      />
    </Shell>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Hittade inte #root')
createRoot(root).render(
  <StrictMode>
    <FragorPage />
  </StrictMode>
)
