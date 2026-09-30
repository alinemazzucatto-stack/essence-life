import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import Nutrition from './modules/nutrition/Nutrition'

function Harness() {
  const [water, setWater] = useState(0)
  return <div className="app"><main style={{padding:16,maxWidth:920,margin:'0 auto'}}><Nutrition setWater={setWater} /></main></div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
)
