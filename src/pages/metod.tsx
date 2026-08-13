import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Shell } from '../components/Shell'
import { PageHero, Breadcrumbs } from '../components/PageHero'
import { Method } from '../sections/Method'
import { Answers } from '../sections/Answers'
import { CtaBand } from '../components/CtaBand'
import '../index.css'

function MetodPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Metod"
        title="Vi flyttar testmiljön till era lokaler"
        lead="Under en tidsbunden och transparent femveckorsperiod bygger vi upp en arbetsterapeutisk testmiljö hos er. Deltagaren prövar riktiga arbetsmoment i en sluten, trygg miljö — och vi observerar i aktivitet, dagligen, över tid."
        image="forest-layers"
      >
        <Breadcrumbs current="Metod" />
      </PageHero>

      <Method />
      <Answers />
      <CtaBand
        heading="Ska vi visa hur en utredningsperiod skulle se ut hos er?"
        body="Vi går igenom upplägget, lokalbehovet och tidsplanen tillsammans — utan kostnad och utan åtagande."
      />
    </Shell>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Hittade inte #root')
createRoot(root).render(
  <StrictMode>
    <MetodPage />
  </StrictMode>
)
