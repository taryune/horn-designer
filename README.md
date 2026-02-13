# R-OSSE Waveguide Designer

An interactive parametric tool for designing rectangular acoustic waveguides (horns) for loudspeaker compression drivers. Combines **R-OSSE axial expansion curves**, **superellipse cross-section morphing**, and **X-shape polar modulation** for complete waveguide geometry generation.

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```

## What This Does

This tool generates 3D waveguide geometry suitable for 3D printing or CNC machining. It outputs the complete surface mesh that you can import into CAD software (FreeCAD, Fusion 360, SolidWorks, Blender, etc.) to create a solid body.

The design approach combines three layers:

```
Layer 1: R-OSSE Axial Profiles (H and V guide curves)
   ↓
Layer 2: Superellipse Cross-Section Morphing (circle → rectangle)
   ↓
Layer 3: X-Shape Polar Modulation (diagonal reinforcement)
   ↓
Final: Complete 3D waveguide mesh
```

---

## Mathematical Background

### 1. R-OSSE Parametric Equations

Based on Marcel Batík's paper "R-OSSE Acoustic Waveguide" (December 2022, at-horns.eu).

The profile of an axisymmetric waveguide is described as `[x(t), y(t)]` for `t ∈ [0, 1]`:

```
x(t) = L·[√(ρ² + m²) - √(ρ² + (t-m)²)] + b·L·[√(ρ² + (1-m)²) - √(ρ² + m²)]·t²

y(t) = (1 - t^q)·[√(c₁ + c₂·L·t + c₃·L²·t²) + r₀·(1-k)]
     + t^q·[R + L·(1 - √(1 + c₃·(t-1)²))]
```

Where the auxiliary constants are:
```
c₁ = (k·r₀)²
c₂ = 2·k·r₀·tan(α₀)
c₃ = tan²(α)
L  = [√(c₂² - 4·c₃·(c₁ - (R + r₀·(k-1))²)) - c₂] / (2·c₃)
```

**This tool uses two independent R-OSSE curves** — one for horizontal expansion, one for vertical — enabling different coverage angles per axis (e.g., 90° × 60°).

### 2. Superellipse Cross-Section

The cross-section at each axial station is a superellipse:

```
|x/hw|^n + |y/hh|^n = 1
```

Where:
- `hw` = half-width (from H guide curve)
- `hh` = half-height (from V guide curve)
- `n` = shape exponent, transitioning from 2 (circle) to `nMouth` (rectangle)

The exponent transition follows: `n(t) = 2 + (nMouth - 2) · f(t)^shapePow`

### 3. X-Shape Polar Modulation

A radial multiplier function adds material at the diagonals:

```
r(θ) = base + amp · |sin(freq · θ)|^exp
```

Default values: `r(θ) = 0.3 + 0.5·|sin(2θ)|⁴`

This produces four lobes at 45°/135°/225°/315°, addressing the **cross wavefront syndrome** in rectangular horns by equalizing path lengths between the cardinal and diagonal directions.

The modulation blends from zero effect at the throat to full effect at the mouth:
```
blend_factor = clamp((t - blendStart) / (1 - blendStart))^blendPow
```

---

## Design Parameters

### Throat Parameters (shared by both guides)

| Parameter | Symbol | Default | Range | Description |
|-----------|--------|---------|-------|-------------|
| Throat radius | r₀ | 12.7 mm | 6–36 | Half the throat diameter. 12.7mm = 1" driver |
| Throat angle | α₀ | 7.5° | 0–20 | Half-angle of the throat opening |
| Expansion factor | k | 1.8 | 0.3–5 | Throat curve scaling. k=1 is exact OS, k>1 expands faster |

### Horizontal Guide

| Parameter | Symbol | Default | Range | Description |
|-----------|--------|---------|-------|-------------|
| H radius | R_h | 145 mm | 40–350 | Half-width of waveguide mouth |
| H half-angle | α_h | 45° | 15–60 | Horizontal coverage half-angle (total = 2×α_h) |

### Vertical Guide

| Parameter | Symbol | Default | Range | Description |
|-----------|--------|---------|-------|-------------|
| V radius | R_v | 95 mm | 30–300 | Half-height of waveguide mouth |
| V half-angle | α_v | 30° | 10–55 | Vertical coverage half-angle (total = 2×α_v) |

### Profile Shape

| Parameter | Symbol | Default | Range | Description |
|-----------|--------|---------|-------|-------------|
| Apex radius | ρ | 0.3 | 0.05–0.9 | Controls curvature at the apex of x(t) |
| Apex shift | m | 0.8 | 0.5–1.0 | Shifts the apex position along the curve |
| Bending | b | 0.3 | 0–0.8 | Controls the rollback bending |
| Throat shape | q | 3.7 | 1–10 | Controls throat-to-body transition sharpness |

### Superellipse

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| n rectangularity | 4.5 | 2–10 | Mouth shape: 2=ellipse, 4-6=squircle, 10≈rectangle |
| Transition start | 0.12 | 0–0.5 | Where along the horn the shape starts rectangularizing |
| Shape power | 1.6 | 0.3–4 | How aggressively the transition happens |

### X-Shape Modulation

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| base | 0.3 | 0.05–1 | Minimum radial factor (at H/V axes) |
| amplitude | 0.5 | 0–1.5 | Extra radial factor at diagonals |
| frequency | 2 | 1–6 | Number of lobe pairs (2 = four-lobed X) |
| exponent | 4 | 1–12 | Sharpness of lobes (higher = more pinched) |
| blend start | 0.2 | 0–0.6 | Where modulation begins along horn |
| blend power | 2.0 | 0.5–5 | Ramp-up aggressiveness |

---

## Export Formats

### CSV
Columns: `ring, slice, x_mm, y_mm, z_mm, t`

- **ring**: index along horn axis (0 = throat)
- **slice**: index around circumference
- **x_mm, y_mm**: cross-section plane coordinates
- **z_mm**: axial position (distance from throat)
- **t**: R-OSSE parameter value

**Import into FreeCAD:**
1. Use a Python macro to read CSV and create point clouds per ring
2. Create B-spline curves through each ring's points
3. Use Part → Loft to create the solid surface
4. Shell or thicken to add wall thickness

### OBJ
Standard Wavefront OBJ with quad faces. Can be directly imported into:
- **Blender**: File → Import → Wavefront (.obj)
- **FreeCAD**: File → Import (with mesh workbench)
- **Fusion 360**: Insert → Insert Mesh
- **MeshMixer**: for mesh repair and 3D print prep

---

## Typical Design Workflow

### 1. Set the throat for your compression driver

| Driver | r₀ (mm) | α₀ (°) |
|--------|---------|---------|
| 1" exit (25.4mm) | 12.7 | 5–10 |
| 1.4" exit (36mm) | 18 | 5–10 |
| 2" exit (50mm) | 25 | 5–10 |

### 2. Set coverage angles

Common patterns:
- **90° × 60°**: α_h = 45°, α_v = 30° (most common home/studio)
- **80° × 50°**: α_h = 40°, α_v = 25° (tighter control)
- **60° × 40°**: α_h = 30°, α_v = 20° (long-throw PA)

### 3. Set mouth size

Larger mouth = lower frequency control. Rules of thumb:
- **R_h = 125mm** (250mm wide): control down to ~1.2 kHz
- **R_h = 170mm** (340mm wide): control down to ~800 Hz
- **R_h = 200mm** (400mm wide): control down to ~650 Hz

### 4. Tune the expansion

- **k = 1.0**: gentle OS expansion, flat DI
- **k = 1.5–2.0**: moderate, gently rising DI (good starting point)
- **k = 3.0+**: aggressive, higher loading but more irregularity

### 5. Adjust rectangularity

- **n = 2**: pure ellipse (no rectangular features)
- **n = 4–5**: nicely rounded rectangle (good for 3D printing)
- **n = 8+**: nearly sharp rectangle (may need edge rounding)

### 6. Add X-modulation (optional)

Enable and adjust to taste. The default `0.3 + 0.5·sin(2θ)⁴` adds about 30% more material at the diagonals, which helps equalize the diagonal polar response.

---

## 3D Printing Notes

- **Wall thickness**: Add 5–6mm walls minimum to avoid resonances
- **Layer height**: Use 0.1–0.15mm in the throat region for smooth internal surface
- **Material**: PLA for indoor, PETG-CF for outdoor/structural
- **Orientation**: Print mouth-down if possible for best throat quality
- **Post-processing**: Sand interior, apply spray putty, then primer/paint
- **Mouth edge**: The R-OSSE rollback provides a smooth termination. If mounting in a baffle, add a 20–25mm radius round-over at the junction.

---

## References

- Batík, M. (2022). "R-OSSE Acoustic Waveguide". at-horns.eu
- Batík, M. "OS-SE Waveguide". http://www.at-horns.eu/release/OS-SE%20Waveguide.pdf

---

## License

This tool is provided for educational and personal use. The R-OSSE equations are by Marcel Batík (at-horns.eu). Please credit the original author if using the R-OSSE formulae in published work or commercial products.
