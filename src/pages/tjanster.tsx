import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Shell } from '../components/Shell'
import { PageHero, Breadcrumbs } from '../components/PageHero'
import { Services } from '../sections/Services'
import { CtaBand } from '../components/CtaBand'
import '../index.css'

function TjansterPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Tjänster"
        title="Tre nivåer av specialistutredning"
        lead="Från den omfattande grupputredningen över fem veckor till den korta, individuella bedömningen — och fördjupad testning av arbetspsykolog eller fysioterapeut när ärendet kräver det."
        image="station-precision"
      >
        <Breadcrumbs current="Tjänster" />
      </PageHero>

      <Services />
      <CtaBand
        heading="Osäkra på vilken nivå som passar ert ärende?"
        body="Beskriv ärendet så säger vi rakt ut vilken omfattning som är rimlig — även när svaret är den minsta."
      />
    </Shell>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Hittade inte #root')
createRoot(root).render(
  <StrictMode>
    <TjansterPage />
  </StrictMode>
)
