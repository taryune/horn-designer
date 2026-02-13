/**
 * Control Panel Component
 * =======================
 *
 * Left sidebar containing all parameter controls and export buttons.
 */

import { colors } from '../../lib/design-tokens'
import { CardinalModSection } from '../controls/CardinalModSection'
import { DiagonalModSection } from '../controls/DiagonalModSection'
import { ExportButtons } from '../controls/ExportButtons'
import { HorizontalGuideSection } from '../controls/HorizontalGuideSection'
import { InfoBadges } from '../controls/InfoBadges'
import { ModulationBlendSection } from '../controls/ModulationBlendSection'
import { ProfileShapeSection } from '../controls/ProfileShapeSection'
import { ShapeBlendSection } from '../controls/ShapeBlendSection'
import { ThroatSection } from '../controls/ThroatSection'
import { VerticalGuideSection } from '../controls/VerticalGuideSection'

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
        DUAL MODULATED WAVEGUIDE
      </div>

      <InfoBadges />

      <div className="mb-[7px]" />

      <ThroatSection />
      <HorizontalGuideSection />
      <VerticalGuideSection />
      <ProfileShapeSection />
      <ShapeBlendSection />
      <ModulationBlendSection />
      <DiagonalModSection />
      <CardinalModSection />

      <ExportButtons />

      <div className="text-footer leading-[1.6] px-[2px]" style={{ color: colors.textSubtleDark }}>
        R-OSSE v2 with dual modulation system. Based on R-OSSE by Marcel Batík (at-horns.eu).
        Features smoothstep blending and diagonal/cardinal modulation.
      </div>
    </div>
  )
}
