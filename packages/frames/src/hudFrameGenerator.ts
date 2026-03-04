/**
 * HUD Frame Generator
 * Sci-Fi/HUD SVG frame generator with procedural generation
 * Focus: corners, trapezoid features, nested fills, corner triangles
 */

/* Seeded RNG */
export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function rInt(rng: () => number, a: number, b: number) {
  return Math.floor(a + rng() * (b - a + 1));
}

function rFloat(rng: () => number, a: number, b: number) {
  return a + rng() * (b - a);
}

function rPick<T>(rng: () => number, arr: T[]): T {
  return arr[rInt(rng, 0, arr.length - 1)];
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function fmt(n: number) {
  return Number(n.toFixed(2)).toString();
}

/* Types */
interface Point {
  x: number;
  y: number;
}

interface TrapezoidFeature {
  edge: 'top' | 'bottom' | 'left' | 'right';
  mode: 'inset' | 'outset';
  start: number;
  end: number;
  depth: number;
  nestedFill: boolean;
  nestedInset: number;
  pathSegs: Point[];
  fillD: string | null;
}

interface Triangle {
  type: 'inner' | 'outer';
  corner: string;
  withFill: boolean;
  d: string;
  transform: string;
}

interface HudFrameConfig {
  w?: number;
  h?: number;
  seed?: number;
  pad?: number;
  strokeOuter?: string;
  strokeInner?: string;
  strokeOuterW?: number;
  strokeInnerW?: number;
  panelFill?: string;
  texDotFill?: string;
  accentFill?: string;
  accentStroke?: string;
  accentStrokeW?: number;
  glow?: boolean;
  featureFillInsetMin?: number;
  featureFillInsetMax?: number;
  triangleGapMin?: number;
  triangleGapMax?: number;
}

/* Nested polygon inset helper */
function insetPolygonTowardCentroid(points: Point[]): Point[] {
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  return points.map(p => ({ x: p.x, y: p.y }));
}

/* Trapezoid Feature Builder */
function buildTrapezoidFeature({
  edge,
  start,
  end,
  depth,
  mode,
  nestedFill,
  nestedInset,
}: {
  edge: 'top' | 'bottom' | 'left' | 'right';
  start: number;
  end: number;
  depth: number;
  mode: 'inset' | 'outset';
  nestedFill: boolean;
  nestedInset: number;
}): { pathSegs: Point[]; fillD: string | null } {
  const isInset = mode === 'inset';
  const d = Math.max(0.1, depth);

  let p1: Point, p2: Point, p3: Point, p4: Point;

  if (edge === 'top') {
    const y0 = 0;
    const y1 = isInset ? d : -d;
    p1 = { x: start, y: y0 };
    p2 = { x: end, y: y0 };
    p3 = { x: end - d, y: y1 };
    p4 = { x: start + d, y: y1 };
  } else if (edge === 'bottom') {
    const y0 = 0;
    const y1 = isInset ? -d : d;
    p1 = { x: start, y: y0 };
    p2 = { x: end, y: y0 };
    p3 = { x: end - d, y: y1 };
    p4 = { x: start + d, y: y1 };
  } else if (edge === 'left') {
    const x0 = 0;
    const x1 = isInset ? d : -d;
    p1 = { x: x0, y: start };
    p2 = { x: x0, y: end };
    p3 = { x: x1, y: end - d };
    p4 = { x: x1, y: start + d };
  } else {
    const x0 = 0;
    const x1 = isInset ? -d : d;
    p1 = { x: x0, y: start };
    p2 = { x: x0, y: end };
    p3 = { x: x1, y: end - d };
    p4 = { x: x1, y: start + d };
  }

  const pathSegs = [p1, p4, p3, p2];

  let fillD: string | null = null;
  if (nestedFill && mode === 'inset') {
    const poly = [p1, p4, p3, p2];
    const q = insetPolygonTowardCentroid(poly);

    const gap = isInset ? nestedInset : 0;
    const outerGap = isInset ? gap + gap / 2 : 0;
    const innerGap = isInset ? gap - gap / 2 : 0;

    if (edge === 'bottom') {
      fillD =
        `M ${fmt(q[0].x + outerGap)} ${fmt(q[0].y)} ` +
        `L ${fmt(q[1].x + innerGap)} ${fmt(q[1].y + gap)} ` +
        `L ${fmt(q[2].x - innerGap)} ${fmt(q[2].y + gap)} ` +
        `L ${fmt(q[3].x - outerGap)} ${fmt(q[3].y)} Z`;
    } else if (edge === 'top') {
      fillD =
        `M ${fmt(q[0].x + outerGap)} ${fmt(q[0].y)} ` +
        `L ${fmt(q[1].x + innerGap)} ${fmt(q[1].y - gap)} ` +
        `L ${fmt(q[2].x - innerGap)} ${fmt(q[2].y - gap)} ` +
        `L ${fmt(q[3].x - outerGap)} ${fmt(q[3].y)} Z`;
    } else if (edge === 'right') {
      fillD =
        `M ${fmt(q[0].x)} ${fmt(q[0].y + outerGap)} ` +
        `L ${fmt(q[1].x + gap)} ${fmt(q[1].y + innerGap)} ` +
        `L ${fmt(q[2].x + gap)} ${fmt(q[2].y - innerGap)} ` +
        `L ${fmt(q[3].x)} ${fmt(q[3].y - outerGap)} Z`;
    } else if (edge === 'left') {
      fillD =
        `M ${fmt(q[0].x)} ${fmt(q[0].y + outerGap)} ` +
        `L ${fmt(q[1].x - gap)} ${fmt(q[1].y + innerGap)} ` +
        `L ${fmt(q[2].x - gap)} ${fmt(q[2].y - innerGap)} ` +
        `L ${fmt(q[3].x)} ${fmt(q[3].y - outerGap)} Z`;
    } else {
      fillD =
        `M ${fmt(q[0].x)} ${fmt(q[0].y)} ` +
        `L ${fmt(q[1].x)} ${fmt(q[1].y)} ` +
        `L ${fmt(q[2].x)} ${fmt(q[2].y)} ` +
        `L ${fmt(q[3].x)} ${fmt(q[3].y)} Z`;
    }
  }

  return { pathSegs, fillD };
}

/* Corner Triangles */
function buildInnerCornerTriangle(corner: string, size: number): string {
  const s = Math.max(6, size);
  if (corner === 'tl') return `M 0 ${fmt(s)} L 0 0 L ${fmt(s)} 0 Z`;
  if (corner === 'tr') return `M 0 0 L ${fmt(-s)} 0 L 0 ${fmt(s)} Z`;
  if (corner === 'br') return `M 0 0 L 0 ${fmt(-s)} L ${fmt(-s)} 0 Z`;
  return `M 0 0 L ${fmt(s)} 0 L 0 ${fmt(-s)} Z`;
}

function buildOuterCornerTriangle(corner: string, size: number, gap: number): string {
  const s = Math.max(10, size);
  const negativeGap = -1 * gap;
  if (corner === 'tl') return `M ${fmt(-s)} ${negativeGap} L ${negativeGap} ${fmt(-s)} L ${fmt(-s)} ${fmt(-s)} Z`;
  if (corner === 'tr') return `M ${fmt(s)} ${negativeGap} L ${gap} ${fmt(-s)} L ${fmt(s)} ${fmt(-s)} Z`;
  if (corner === 'br') return `M ${fmt(s)} ${gap} L ${gap} ${fmt(s)} L ${fmt(s)} ${fmt(s)} Z`;
  return `M ${fmt(-s)} ${gap} L ${negativeGap} ${fmt(s)} L ${fmt(-s)} ${fmt(s)} Z`;
}

/* Main Generator Function */
export function generateHudFrameSVG(config: HudFrameConfig = {}) {
  const {
    w = 920,
    h = 160,
    seed = 1,
    pad = 18,
    strokeOuter = 'rgba(18,168,255,0.95)',
    strokeInner = 'rgba(18,168,255,0.32)',
    strokeOuterW = 1,
    strokeInnerW = 3,
    panelFill = 'rgba(4,22,34,0.72)',
    texDotFill = 'rgba(18,168,255,0.10)',
    accentFill = 'rgba(18,168,255,0.55)',
    accentStroke = 'rgba(18,168,255,0.78)',
    accentStrokeW = 1,
    glow = true,
    featureFillInsetMin = 4,
    featureFillInsetMax = 4,
    triangleGapMin = 4,
    triangleGapMax = 4,
  } = config;

  const rng = mulberry32(seed);

  /* 1) Corners */
  const maxChamfer = Math.floor(Math.min(w, h) * 0.5);

  function genChamfer() {
    const squareChance = 0.25;
    if (rng() < squareChance) return 0;

    const deepChance = 0.28;
    if (rng() < deepChance) {
      return rInt(rng, Math.floor(maxChamfer * deepChance), Math.floor(maxChamfer * 0.5));
    }

    return rInt(rng, 14, Math.floor(maxChamfer * deepChance));
  }

  const corners = {
    tl: genChamfer(),
    tr: genChamfer(),
    br: genChamfer(),
    bl: genChamfer(),
  };

  /* 2) Trapezoid features */
  const featureCount = rPick(rng, [1, 1, 1, 2]);
  const edgesPool: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'top', 'bottom', 'left', 'right'];

  const features: TrapezoidFeature[] = [];
  const featureByEdge = new Map<string, TrapezoidFeature>();

  function edgeLength(edge: string) {
    return edge === 'top' || edge === 'bottom' ? w : h;
  }

  function edgeCornerMargins(edge: string): [number, number] {
    if (edge === 'top') return [corners.tl, corners.tr];
    if (edge === 'bottom') return [corners.bl, corners.br];
    if (edge === 'left') return [corners.tl, corners.bl];
    return [corners.tr, corners.br];
  }

  for (let i = 0; i < featureCount; i++) {
    const edge = rPick(rng, edgesPool);
    if (featureByEdge.has(edge)) continue;

    const mode = rng() < 0.55 ? 'inset' : 'outset';

    const L = edgeLength(edge);
    const [mA, mB] = edgeCornerMargins(edge);

    const margin = 16;
    const minStart = (mA || 0) + margin;
    const maxEnd = L - (mB || 0) - margin;

    const maxLen = Math.max(40, (maxEnd - minStart) * 0.8);
    const minLen = Math.max(52, Math.min(160, maxLen * 0.35));
    let segLen = rInt(rng, Math.floor(minLen), Math.floor(maxLen));

    const placement = rPick(rng, ['center', 'center', 'edgeA', 'edgeB']);
    let start: number;

    if (placement === 'center') {
      const center = rFloat(rng, minStart + segLen / 2, maxEnd - segLen / 2);
      start = center - segLen / 2;
    } else if (placement === 'edgeA') {
      start = minStart;
      segLen = rInt(rng, Math.floor((maxEnd - minStart) * 0.35), Math.floor((maxEnd - minStart) * 0.8));
    } else {
      segLen = rInt(rng, Math.floor((maxEnd - minStart) * 0.35), Math.floor((maxEnd - minStart) * 0.8));
      start = maxEnd - segLen;
    }

    const end = start + segLen;
    const depth = rInt(rng, 5, 15);
    const nestedFill = rng() < 0.62;
    const nestedInset = rFloat(rng, featureFillInsetMin, featureFillInsetMax);

    const { pathSegs, fillD } = buildTrapezoidFeature({
      edge: edge as 'top' | 'bottom' | 'left' | 'right',
      start,
      end,
      depth,
      mode: mode as 'inset' | 'outset',
      nestedFill,
      nestedInset,
    });

    const f: TrapezoidFeature = {
      edge: edge as 'top' | 'bottom' | 'left' | 'right',
      mode: mode as 'inset' | 'outset',
      start,
      end,
      depth,
      nestedFill,
      nestedInset,
      pathSegs,
      fillD,
    };
    features.push(f);
    featureByEdge.set(edge, f);
  }

  /* 3) Build outline points */
  function buildTopEdge(): Point[] {
    const f = featureByEdge.get('top');
    const xL = corners.tl;
    const xR = w - corners.tr;

    if (!f) return [{ x: xL, y: 0 }, { x: xR, y: 0 }];

    const start = clamp(f.start, xL + 4, xR - 4);
    const end = clamp(f.end, start + 20, xR - 4);
    const seg = f.pathSegs.map(p => ({ x: p.x, y: p.y }));

    return [{ x: xL, y: 0 }, { x: start, y: 0 }, ...seg.slice(1, 3), { x: end, y: 0 }, { x: xR, y: 0 }];
  }

  function buildRightEdge(): Point[] {
    const f = featureByEdge.get('right');
    const yT = corners.tr;
    const yB = h - corners.br;
    const x = w;

    if (!f) return [{ x, y: yT }, { x, y: yB }];

    const start = clamp(f.start, yT + 4, yB - 4);
    const end = clamp(f.end, start + 20, yB - 4);
    const seg = f.pathSegs.map(p => ({ x: x + p.x, y: p.y }));

    return [{ x, y: yT }, { x, y: start }, ...seg.slice(1, 3), { x, y: end }, { x, y: yB }];
  }

  function buildBottomEdge(): Point[] {
    const f = featureByEdge.get('bottom');
    const xL = corners.bl;
    const xR = w - corners.br;
    const y = h;

    if (!f) return [{ x: xR, y }, { x: xL, y }];

    const start = clamp(f.start, xL + 4, xR - 4);
    const end = clamp(f.end, start + 20, xR - 4);
    const seg = f.pathSegs.map(p => ({ x: p.x, y: y + p.y }));
    const p3 = seg[2];
    const p4 = seg[1];

    return [{ x: xR, y }, { x: end, y }, p3, p4, { x: start, y }, { x: xL, y }];
  }

  function buildLeftEdge(): Point[] {
    const f = featureByEdge.get('left');
    const yT = corners.tl;
    const yB = h - corners.bl;
    const x = 0;

    if (!f) return [{ x, y: yB }, { x, y: yT }];

    const start = clamp(f.start, yT + 4, yB - 4);
    const end = clamp(f.end, start + 20, yB - 4);
    const seg = f.pathSegs.map(p => ({ x: x + p.x, y: p.y }));
    const p3 = seg[2];
    const p4 = seg[1];

    return [{ x, y: yB }, { x, y: end }, p3, p4, { x, y: start }, { x, y: yT }];
  }

  const topPts = buildTopEdge();
  const rightPts = buildRightEdge();
  const bottomPts = buildBottomEdge();
  const leftPts = buildLeftEdge();

  const outlinePts: Point[] = [];

  for (const p of topPts) outlinePts.push(p);
  if (corners.tr > 0) outlinePts.push({ x: w, y: corners.tr });
  for (let i = 1; i < rightPts.length; i++) outlinePts.push(rightPts[i]);
  if (corners.br > 0) outlinePts.push({ x: w - corners.br, y: h });
  for (let i = 1; i < bottomPts.length; i++) outlinePts.push(bottomPts[i]);
  if (corners.bl > 0) outlinePts.push({ x: 0, y: h - corners.bl });
  for (let i = 1; i < leftPts.length; i++) outlinePts.push(leftPts[i]);

  let outlineD = '';
  for (let i = 0; i < outlinePts.length; i++) {
    const p = outlinePts[i];
    outlineD += i === 0 ? `M ${fmt(p.x)} ${fmt(p.y)} ` : `L ${fmt(p.x)} ${fmt(p.y)} `;
  }
  outlineD += 'Z';

  /* 4) Triangles */
  const triangles: Triangle[] = [];

  function triangleGap() {
    return rInt(rng, triangleGapMin, triangleGapMax);
  }

  function maybeCornerTriangle(cornerKey: string) {
    const chamfer = corners[cornerKey as keyof typeof corners];
    const pTri = 0.55;
    const gap = triangleGap();

    if (chamfer === 0) {
      if (rng() < pTri) {
        const size = rInt(rng, 10, 22);
        const d = buildInnerCornerTriangle(cornerKey, size);

        let tx = 0,
          ty = 0;

        if (cornerKey === 'tl') {
          tx = gap;
          ty = gap;
        }
        if (cornerKey === 'tr') {
          tx = w - gap;
          ty = gap;
        }
        if (cornerKey === 'br') {
          tx = w - gap;
          ty = h - gap;
        }
        if (cornerKey === 'bl') {
          tx = gap;
          ty = h - gap;
        }

        triangles.push({
          type: 'inner',
          corner: cornerKey,
          withFill: rng() < 0.8,
          d,
          transform: `translate(${fmt(tx)} ${fmt(ty)})`,
        });
      }
    } else {
      if (rng() < pTri * 0.8) {
        const d = buildOuterCornerTriangle(cornerKey, chamfer, gap + strokeOuterW);

        let tx = 0,
          ty = 0;

        if (cornerKey === 'tl') {
          tx = chamfer;
          ty = chamfer;
        }
        if (cornerKey === 'tr') {
          tx = w - chamfer;
          ty = chamfer;
        }
        if (cornerKey === 'br') {
          tx = w - chamfer;
          ty = h - chamfer;
        }
        if (cornerKey === 'bl') {
          tx = chamfer;
          ty = h - chamfer;
        }

        triangles.push({
          type: 'outer',
          corner: cornerKey,
          withFill: rng() < 0.5,
          d,
          transform: `translate(${fmt(tx)} ${fmt(ty)})`,
        });
      }
    }
  }

  maybeCornerTriangle('tl');
  maybeCornerTriangle('tr');
  maybeCornerTriangle('br');
  maybeCornerTriangle('bl');

  /* 5) Feature nested fills */
  const trapezoidFills: Array<{ edge: string; mode: string; d: string; transform: string }> = [];

  for (const f of features) {
    if (!f.fillD) continue;

    let transform = '';
    if (f.edge === 'bottom') transform = `translate(0 ${fmt(h)})`;
    if (f.edge === 'right') transform = `translate(${fmt(w)} 0)`;

    trapezoidFills.push({
      edge: f.edge,
      mode: f.mode,
      d: f.fillD,
      transform,
    });
  }

  /* 6) SVG markup */
  const vbX = -pad;
  const vbY = -pad;
  const vbW = w + pad * 2;
  const vbH = h + pad * 2;

  const dotsId = `dots_${seed}`;
  const glowId = `glow_${seed}`;

  const defs = `
    <defs>
      <pattern id="${dotsId}" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="2.2" cy="2.2" r="1" fill="${texDotFill}" />
      </pattern>
      ${
        glow
          ? `<filter id="${glowId}" x="-30%" y="-30%" width="160%" height="160%">
               <feDropShadow dx="0" dy="0" stdDeviation="3.6"
                 flood-color="rgba(18,168,255,0.55)" flood-opacity="0.70" />
             </filter>`
          : ''
      }
    </defs>
  `;

  const panel = `
        <path d="${outlineD}" fill="${panelFill}" stroke="none" />
        <path d="${outlineD}" fill="url(#${dotsId})" opacity="0.65" />
      `;

  const nestedTrapFills = trapezoidFills
    .map(
      t => `
      <path d="${t.d}"
            ${t.transform ? `transform="${t.transform}"` : ''}
            fill="${accentFill}"
            stroke="${accentStroke}"
            stroke-width="${accentStrokeW}"
            vector-effect="non-scaling-stroke"
            opacity="0.95" />
    `
    )
    .join('');

  const strokes = `
    <path d="${outlineD}"
          fill="none"
          stroke="${strokeOuter}"
          stroke-width="${strokeOuterW}"
          vector-effect="non-scaling-stroke"
          ${glow ? `filter="url(#${glowId})"` : ''} />
    
    <path d="${outlineD}"
          fill="none"
          stroke="${strokeInner}"
          stroke-width="${strokeInnerW}"
          vector-effect="non-scaling-stroke"
          opacity="0.95" />
  `;

  const triPaths = triangles
    .map(
      t =>
        `<path d="${t.d}"
                transform="${t.transform}"
                fill="${t.withFill ? 'rgba(18,168,255,1)' : 'transparent'}"
                stroke="rgba(18,168,255,0.55)"
                stroke-width="${strokeOuterW}"
                vector-effect="non-scaling-stroke"
                opacity="1" />`
    )
    .join('');

  const svgMarkup = `
<svg
    id="generatedFrame"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="${vbX} ${vbY} ${vbW} ${vbH}"
    width="${fmt(w)}" height="${fmt(h)}"
    fill="none">
  ${defs}
  <g>
    ${panel}
    ${nestedTrapFills}
    ${strokes}
    ${triPaths}
  </g>
</svg>`.trim();

  return {
    svgMarkup,
    outlineD,
    meta: {
      seed,
      w,
      h,
      pad,
      corners,
      features: features.map(f => ({
        edge: f.edge,
        mode: f.mode,
        start: Number(f.start.toFixed(2)),
        end: Number(f.end.toFixed(2)),
        depth: f.depth,
        nestedFill: f.nestedFill,
        nestedInset: Number(f.nestedInset.toFixed(2)),
      })),
      triangles: triangles.map(t => ({
        type: t.type,
        corner: t.corner,
      })),
    },
  };
}
