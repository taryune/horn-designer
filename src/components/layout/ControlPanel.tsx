/**
 * Control Panel Component
 * =======================
 *
 * Left sidebar containing all parameter controls and export buttons.
 */

import { colors } from '../../lib/design-tokens'
import { ExportButtons } from '../controls/ExportButtons'
import { HorizontalGuideSection } from '../controls/HorizontalGuideSection'
import { InfoBadges } from '../controls/InfoBadges'
import { ProfileShapeSection } from '../controls/ProfileShapeSection'
import { SuperellipseSection } from '../controls/SuperellipseSection'
import { ThroatSection } from '../controls/ThroatSection'
import { VerticalGuideSection } from '../controls/VerticalGuideSection'
import { XModulationSection } from '../controls/XModulationSection'

export function ControlPanel() {
  return (
    <div
      className="w-[264px] min-w-[264px] h-full overflow-y-auto border-r scrollbar-thin"
      style={{
        background: colors.panelBg,
        borderColor: colors.panelBorder,
        padding: '10px 11px',
      }}
    >
      <div
        className="mb-[1px] text-base font-black tracking-[1.5px]"
        style={{ color: colors.primary }}
      >
        Horn Designer
      </div>
      <div className="mb-[10px] text-xs tracking-[1px]" style={{ color: colors.textSubtle }}>
        X-SHAPE MODULATED WAVEGUIDE
      </div>

      <InfoBadges />

      <div className="mb-[7px]" />

      <ThroatSection />
      <HorizontalGuideSection />
      <VerticalGuideSection />
      <ProfileShapeSection />
      <SuperellipseSection />
      <XModulationSection />

      <ExportButtons />

      <div className="text-footer leading-[1.6] px-[2px]" style={{ color: colors.textSubtleDark }}>
        R-OSSE by Marcel Batík (at-horns.eu). X-shape polar modulation for diagonal coverage
        reinforcement.
      </div>
    </div>
  )
}
