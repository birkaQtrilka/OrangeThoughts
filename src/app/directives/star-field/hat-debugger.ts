import {
  DEFAULT_HAT_TRANSFORM,
  type ChristmasHatPass,
  type HatTransformConfig,
} from './render/christmas-hat';

interface SliderDef {
  label: string;
  min: number;
  max: number;
  step: number;
  get: (c: HatTransformConfig) => number;
  set: (c: HatTransformConfig, v: number) => void;
}

const SLIDERS: { section: string; items: SliderDef[] }[] = [
  {
    section: 'Placement on Moon',
    items: [
      { label: 'Place X', min: -3.14, max: 3.14, step: 0.01, get: (c) => c.place.x, set: (c, v) => (c.place.x = v) },
      { label: 'Place Z', min: -3.14, max: 3.14, step: 0.01, get: (c) => c.place.z, set: (c, v) => (c.place.z = v) },
      { label: 'Sink', min: 0, max: 2, step: 0.01, get: (c) => c.sink, set: (c, v) => (c.sink = v) },
      { label: 'Size', min: 0.2, max: 3, step: 0.05, get: (c) => c.heightInMoonRadii, set: (c, v) => (c.heightInMoonRadii = v) },
    ],
  },
  {
    section: 'Fine Offset (Moon Radii)',
    items: [
      { label: 'Offset X', min: -2, max: 2, step: 0.01, get: (c) => c.offset.x, set: (c, v) => (c.offset.x = v) },
      { label: 'Offset Y', min: -2, max: 2, step: 0.01, get: (c) => c.offset.y, set: (c, v) => (c.offset.y = v) },
      { label: 'Offset Z', min: -2, max: 2, step: 0.01, get: (c) => c.offset.z, set: (c, v) => (c.offset.z = v) },
    ],
  },
  {
    section: 'Local Rotation (rad)',
    items: [
      { label: 'Rot X', min: -3.14, max: 3.14, step: 0.01, get: (c) => c.rot.x, set: (c, v) => (c.rot.x = v) },
      { label: 'Rot Y', min: -3.14, max: 3.14, step: 0.01, get: (c) => c.rot.y, set: (c, v) => (c.rot.y = v) },
      { label: 'Rot Z', min: -3.14, max: 3.14, step: 0.01, get: (c) => c.rot.z, set: (c, v) => (c.rot.z = v) },
    ],
  },
];

export function mountHatDebugger(hat: ChristmasHatPass): () => void {
  const style = document.createElement('style');
  style.textContent = `
    .hat-dbg {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 99999;
      width: 280px;
      background: rgba(14, 16, 22, 0.88);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 10px;
      color: #e6e9ef;
      font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      pointer-events: auto;
      user-select: none;
    }
    .hat-dbg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 600;
      cursor: pointer;
    }
    .hat-dbg-body {
      padding: 10px 12px;
      max-height: 75vh;
      overflow-y: auto;
    }
    .hat-dbg.collapsed .hat-dbg-body { display: none; }
    .hat-dbg-sec {
      margin: 10px 0 6px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8b95a7;
    }
    .hat-dbg-sec:first-child { margin-top: 0; }
    .hat-dbg-row {
      display: grid;
      grid-template-columns: 64px 1fr 48px;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .hat-dbg-row input[type="range"] {
      width: 100%;
      accent-color: #f97316;
      cursor: pointer;
    }
    .hat-dbg-row input[type="number"] {
      width: 100%;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 4px;
      color: inherit;
      font: inherit;
      padding: 2px 4px;
      text-align: right;
    }
    .hat-dbg-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .hat-dbg-actions button {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      font: inherit;
      cursor: pointer;
    }
    .hat-dbg-actions button:hover {
      background: rgba(255, 255, 255, 0.16);
    }
  `;

  const root = document.createElement('div');
  root.className = 'hat-dbg';
  root.innerHTML = `
    <div class="hat-dbg-head">
      <span>Christmas Hat Transform</span>
      <span class="hat-dbg-toggle">−</span>
    </div>
    <div class="hat-dbg-body"></div>
  `;

  const body = root.querySelector('.hat-dbg-body') as HTMLDivElement;
  const head = root.querySelector('.hat-dbg-head') as HTMLDivElement;
  const toggle = root.querySelector('.hat-dbg-toggle') as HTMLSpanElement;

  head.addEventListener('click', () => {
    const collapsed = root.classList.toggle('collapsed');
    toggle.textContent = collapsed ? '+' : '−';
  });

  const updaters: (() => void)[] = [];

  for (const group of SLIDERS) {
    const sec = document.createElement('div');
    sec.className = 'hat-dbg-sec';
    sec.textContent = group.section;
    body.appendChild(sec);

    for (const def of group.items) {
      const row = document.createElement('div');
      row.className = 'hat-dbg-row';
      row.innerHTML = `
        <label>${def.label}</label>
        <input type="range" min="${def.min}" max="${def.max}" step="${def.step}">
        <input type="number" min="${def.min}" max="${def.max}" step="${def.step}">
      `;
      const range = row.querySelector('input[type="range"]') as HTMLInputElement;
      const num = row.querySelector('input[type="number"]') as HTMLInputElement;

      const sync = () => {
        const val = def.get(hat.transform).toFixed(2);
        range.value = val;
        num.value = val;
      };
      sync();
      updaters.push(sync);

      range.addEventListener('input', () => {
        const v = parseFloat(range.value);
        def.set(hat.transform, v);
        num.value = v.toFixed(2);
      });
      num.addEventListener('change', () => {
        const v = parseFloat(num.value);
        if (!Number.isNaN(v)) {
          def.set(hat.transform, v);
          range.value = String(v);
        }
      });

      body.appendChild(row);
    }
  }

  const actions = document.createElement('div');
  actions.className = 'hat-dbg-actions';
  actions.innerHTML = `
    <button type="button" data-action="reset">Reset</button>
    <button type="button" data-action="copy">Copy Config</button>
  `;
  body.appendChild(actions);

  const resetBtn = actions.querySelector('[data-action="reset"]') as HTMLButtonElement;
  const copyBtn = actions.querySelector('[data-action="copy"]') as HTMLButtonElement;

  resetBtn.addEventListener('click', () => {
    hat.transform = structuredClone(DEFAULT_HAT_TRANSFORM);
    for (const u of updaters) u();
  });

  copyBtn.addEventListener('click', async () => {
    const snippet = JSON.stringify(hat.transform, null, 2);
    try {
      await navigator.clipboard.writeText(snippet);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy Config'), 1200);
    } catch {
      console.log('Hat transform config:\n' + snippet);
    }
  });

  document.head.appendChild(style);
  document.body.appendChild(root);

  return () => {
    style.remove();
    root.remove();
  };
}