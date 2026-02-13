/**
 * Horn Designer - Main Application
 * =================================
 *
 * R-OSSE Waveguide Designer with TypeScript and React
 */

import { AppLayout } from './components/layout/AppLayout'
import { ControlPanel } from './components/layout/ControlPanel'
import { VisualizationPanel } from './components/layout/VisualizationPanel'
import { WaveguideProvider } from './context/WaveguideContext'

function App() {
  return (
    <WaveguideProvider>
      <AppLayout>
        <ControlPanel />
        <VisualizationPanel />
      </AppLayout>
    </WaveguideProvider>
  )
}

export default App
