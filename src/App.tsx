/**
 * Horn Designer - Main Application
 * =================================
 *
 * R-OSSE Waveguide Designer with TypeScript and React
 */

import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { AppLayout } from './components/layout/AppLayout'
import { ControlPanel } from './components/layout/ControlPanel'
import { VisualizationPanel } from './components/layout/VisualizationPanel'
import { useWaveguide, WaveguideProvider } from './context/WaveguideContext'
import { decompressStateFromURL } from './lib/export/urlSharing'

/**
 * App content with access to context
 */
function AppContent() {
  const { dispatch } = useWaveguide()

  // Load design from URL parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const designParam = urlParams.get('design')

    if (designParam) {
      try {
        const state = decompressStateFromURL(designParam)
        if (state) {
          dispatch({ type: 'LOAD_FROM_FILE', state })
          toast.success('Design loaded from shared link')
        } else {
          toast.error('Invalid share link - using default design')
        }
      } catch (error) {
        console.error('Failed to load design from URL:', error)
        toast.error('Failed to load design from URL')
      }
    }
  }, [dispatch])

  return (
    <AppLayout>
      <ControlPanel />
      <VisualizationPanel />
    </AppLayout>
  )
}

function App() {
  return (
    <WaveguideProvider>
      <Toaster position="top-right" richColors closeButton />
      <AppContent />
    </WaveguideProvider>
  )
}

export default App
