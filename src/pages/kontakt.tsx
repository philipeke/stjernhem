import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Shell } from '../components/Shell'
import { PageHero, Breadcrumbs } from '../components/PageHero'
import { Contact } from '../sections/Contact'
import '../index.css'

function KontaktPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Kontakt"
        title="Boka ett förutsättningslöst möte"
        lead="Digitalt eller på plats hos er, där vi visar hur arbetsstationerna är uppbyggda. Inget åtagande, ingen kostnad."
        image="coast"
      >
        <Breadcrumbs current="Kontakt" />
      </PageHero>

      <Contact />
    </Shell>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Hittade inte #root')
createRoot(root).render(
  <StrictMode>
    <KontaktPage />
  </StrictMode>
)
