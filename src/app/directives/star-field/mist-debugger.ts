import { MistPass } from "./shaders/mist-pass";

export function mountMistDebugger(mist: MistPass) {
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '999999',
    background: 'rgba(15, 15, 20, 0.85)',
    backdropFilter: 'blur(8px)',
    color: '#eee',
    fontFamily: 'monospace',
    fontSize: '12px',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '240px',
  });

  // Read current initial values (converted back from 0..1 to 0..255)
  let r = Math.round(mist.mistColor[0] * 255);
  let g = Math.round(mist.mistColor[1] * 255);
  let b = Math.round(mist.mistColor[2] * 255);
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

  container.innerHTML = `
    <div style="font-weight: bold; font-size: 13px; color: #fff;">🌌 Mist Tweaker</div>
    
    <label style="display:flex; justify-content:space-between; align-items:center;">
      Color:
      <input type="color" id="mist-color" value="${hex}" style="cursor:pointer; border:none; background:transparent; width:36px; height:24px;">
    </label>

    <label style="display:flex; flex-direction:column; gap:4px;">
      <span style="display:flex; justify-content:space-between;">
        Alpha: <span id="alpha-val">${mist.mistAlpha}</span>
      </span>
      <input type="range" id="mist-alpha" min="0" max="1" step="0.01" value="${mist.mistAlpha}" style="cursor:pointer;">
    </label>

    <label style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
      Mist On Top:
      <input type="checkbox" id="mist-ontop" ${mist.mistOnTop ? 'checked' : ''}>
    </label>

    <pre id="code-preview" style="background:rgba(0,0,0,0.5); padding:8px; border-radius:4px; margin:0; font-size:11px; white-space:pre-wrap;"></pre>
    <button id="copy-btn" style="background:#6366f1; color:white; border:none; padding:6px; border-radius:4px; cursor:pointer; font-weight:bold;">📋 Copy Code</button>
  `;

  document.body.appendChild(container);

  const colorInput = container.querySelector('#mist-color') as HTMLInputElement;
  const alphaInput = container.querySelector('#mist-alpha') as HTMLInputElement;
  const onTopInput = container.querySelector('#mist-ontop') as HTMLInputElement;
  const alphaVal = container.querySelector('#alpha-val') as HTMLSpanElement;
  const preview = container.querySelector('#code-preview') as HTMLElement;
  const copyBtn = container.querySelector('#copy-btn') as HTMLButtonElement;

  function update() {
    const hexVal = colorInput.value;
    const num = parseInt(hexVal.slice(1), 16);
    r = (num >> 16) & 255;
    g = (num >> 8) & 255;
    b = num & 255;

    // WebGL uniform expects normalized [0..1]
    mist.mistColor = [r / 255, g / 255, b / 255];
    mist.mistAlpha = parseFloat(alphaInput.value);
    mist.mistOnTop = onTopInput.checked;

    alphaVal.textContent = mist.mistAlpha.toFixed(2);

    const snippet = `public mistColor = [${r}, ${g}, ${b}];\npublic mistAlpha = ${mist.mistAlpha};`;
    preview.textContent = snippet;
  }

  colorInput.addEventListener('input', update);
  alphaInput.addEventListener('input', update);
  onTopInput.addEventListener('change', update);

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.textContent || '');
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => (copyBtn.textContent = '📋 Copy Code'), 1500);
  });

  update();
}