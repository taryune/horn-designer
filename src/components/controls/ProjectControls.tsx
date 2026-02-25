/**
 * Project Controls Component
 * ==========================
 *
 * Import/Export project files (YAML) and share designs via URL.
 */

import { type ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'
import { useWaveguide } from '../../context/WaveguideContext'
import { colors } from '../../lib/design-tokens'
import { generateShareableURL } from '../../lib/export/urlSharing'
import { exportToYAML, formatValidationErrors, importFromYAML } from '../../lib/export/yaml'

const MAX_YAML_SIZE = 100 * 1024 // 100KB

export function ProjectControls() {
  const { state, dispatch } = useWaveguide()
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Export current design to YAML file
   */
  const handleExportYAML = () => {
    try {
      const yamlContent = exportToYAML(state)
      const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `horn-design-${Date.now()}.yaml`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Project exported successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Export failed: ${message}`)
    }
  }

  /**
   * Import design from YAML file (with confirmation)
   */
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear the input so the same file can be selected again
    e.target.value = ''

    // Check file size
    if (file.size > MAX_YAML_SIZE) {
      toast.error(`File too large (${(file.size / 1024).toFixed(1)}KB). Maximum is 100KB.`)
      return
    }

    try {
      const text = await file.text()
      const result = importFromYAML(text)

      if (!result.success) {
        if (result.validation) {
          const errorMsg = formatValidationErrors(result.validation)
          toast.error(errorMsg, { duration: 10000 })
        } else {
          toast.error(result.error || 'Import failed')
        }
        return
      }

      // Show confirmation dialog
      const confirmed = window.confirm('This will replace your current design. Continue?')

      if (confirmed && result.state) {
        dispatch({ type: 'LOAD_FROM_FILE', state: result.state })
        toast.success('Design loaded successfully')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Import failed: ${message}`)
    }
  }

  /**
   * Copy shareable link to clipboard
   */
  const handleCopyShareLink = async () => {
    try {
      const url = generateShareableURL(state)
      await navigator.clipboard.writeText(url)
      toast.success('Share link copied to clipboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to copy link: ${message}`)
    }
  }

  /**
   * Reset all parameters to defaults (with confirmation)
   */
  const handleReset = () => {
    const confirmed = window.confirm('Reset all parameters to defaults? This cannot be undone.')

    if (confirmed) {
      dispatch({ type: 'RESET_TO_DEFAULTS' })
      toast.success('Reset to default design')
    }
  }

  /**
   * Trigger file input click
   */
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-[4px] mb-[7px]">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".yaml,.yml"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Top row: Export and Import */}
      <div className="flex gap-[4px]">
        <button
          type="button"
          onClick={handleExportYAML}
          className="flex-1 rounded-[4px] text-xxs font-bold tracking-[1px] cursor-pointer"
          style={{
            padding: '9px',
            background: colors.panelHeaderBg,
            border: `1px solid ${colors.panelBorderMedium}`,
            color: colors.primary,
            fontFamily: 'inherit',
          }}
        >
          ▼ Export Project
        </button>
        <button
          type="button"
          onClick={handleImportClick}
          className="flex-1 rounded-[4px] text-xxs font-bold tracking-[1px] cursor-pointer"
          style={{
            padding: '9px',
            background: colors.panelHeaderBg,
            border: `1px solid ${colors.panelBorderMedium}`,
            color: colors.primary,
            fontFamily: 'inherit',
          }}
        >
          ▲ Import Project
        </button>
      </div>

      {/* Middle row: Share Link */}
      <button
        type="button"
        onClick={handleCopyShareLink}
        className="w-full rounded-[4px] text-xxs font-bold tracking-[1px] cursor-pointer"
        style={{
          padding: '9px',
          background: colors.panelHeaderBg,
          border: `1px solid ${colors.panelBorderMedium}`,
          color: colors.primary,
          fontFamily: 'inherit',
        }}
      >
        🔗 Copy Share Link
      </button>

      {/* Bottom row: Reset */}
      <button
        type="button"
        onClick={handleReset}
        className="w-full rounded-[4px] text-xxs font-bold tracking-[1px] cursor-pointer hover:bg-red-600/10"
        style={{
          padding: '9px',
          background: colors.panelHeaderBg,
          border: `1px solid ${colors.panelBorderMedium}`,
          color: '#ef4444',
          fontFamily: 'inherit',
        }}
      >
        ↺ Reset to Defaults
      </button>
    </div>
  )
}
