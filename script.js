const pool = document.getElementById('source-pool');
const selfDrop = document.getElementById('self-source');
const passiveDrop = document.getElementById('passive-source');
const feedbackSource = document.getElementById('feedback-source');

function addDragEvents(el) {
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      el.classList.add('dragging');
    }, 0);
  });
  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
  });
}

function prepareDraggables() {
  document.querySelectorAll('.draggable').forEach((el, idx) => {
    if (!el.id) el.id = `drag-${idx}`;
    addDragEvents(el);
  });
}

function attachDropTargets() {
  const dropTargets = document.querySelectorAll('.dropzone, #source-pool');
  dropTargets.forEach((zone) => {
    const clearHighlights = () =>
      dropTargets.forEach((z) => z.classList.remove('active-drop'));

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('active-drop');
    });
    zone.addEventListener('dragenter', (e) => {
      if (e.target.closest('.draggable')) return;
      zone.classList.add('active-drop');
    });
    zone.addEventListener('dragleave', (e) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      zone.classList.remove('active-drop');
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const el = document.getElementById(id);
      if (el) zone.appendChild(el);
      clearHighlights();
    });
  });
}

prepareDraggables();
attachDropTargets();

document.querySelector('[data-target="source"]').addEventListener('click', () => {
  const checkZone = (zone, expected) =>
    Array.from(zone.children).every((child) => child.dataset.answer === expected);
  const complete = selfDrop.children.length + passiveDrop.children.length === pool.children.length + selfDrop.children.length + passiveDrop.children.length;
  if (!complete) {
    feedbackSource.textContent = 'Verteile alle Begriffe, bevor du prüfst!';
    feedbackSource.style.color = '#f7a400';
    return;
  }
  const correctSelf = checkZone(selfDrop, 'self');
  const correctPassive = checkZone(passiveDrop, 'passive');
  if (correctSelf && correctPassive) {
    feedbackSource.textContent = 'Perfekt! Du erkennst Selbst- und Zwischensender.';
    feedbackSource.style.color = '#26d0ce';
  } else {
    feedbackSource.textContent = 'Fast! Schau dir nochmals an, welche Quellen Licht senden und welche nur reflektieren.';
    feedbackSource.style.color = '#f7797d';
  }
});

// Eye simulation
const eyeCanvas = document.getElementById('eye-canvas');
const eyeCtx = eyeCanvas.getContext('2d');
const lightSlider = document.getElementById('light-slider');
const focusSlider = document.getElementById('focus-slider');

function drawEye() {
  const light = Number(lightSlider.value);
  const focus = Number(focusSlider.value);
  const pupilRadius = 18 - (light / 100) * 12;
  const lensCurve = 0.6 + (110 - focus) / 160;

  eyeCtx.clearRect(0, 0, eyeCanvas.width, eyeCanvas.height);
  eyeCtx.save();
  eyeCtx.translate(30, eyeCanvas.height / 2);

  // incoming rays
  eyeCtx.strokeStyle = 'rgba(247, 164, 0, 0.7)';
  eyeCtx.lineWidth = 2;
  for (let y = -30; y <= 30; y += 15) {
    eyeCtx.beginPath();
    eyeCtx.moveTo(0, y);
    eyeCtx.lineTo(120, y * 0.6);
    eyeCtx.stroke();
  }

  // eyeball outline
  eyeCtx.fillStyle = '#0f172a';
  eyeCtx.strokeStyle = 'rgba(255,255,255,0.2)';
  eyeCtx.lineWidth = 3;
  eyeCtx.beginPath();
  eyeCtx.ellipse(220, 0, 160, 90, 0, 0, Math.PI * 2);
  eyeCtx.fill();
  eyeCtx.stroke();

  // cornea + lens
  eyeCtx.save();
  eyeCtx.translate(140, 0);
  eyeCtx.fillStyle = 'rgba(38, 208, 206, 0.4)';
  eyeCtx.beginPath();
  eyeCtx.ellipse(30, 0, 20, 30, 0, Math.PI / 2, -Math.PI / 2, true);
  eyeCtx.ellipse(70, 0, 20 * lensCurve, 40 * lensCurve, 0, -Math.PI / 2, Math.PI / 2, true);
  eyeCtx.closePath();
  eyeCtx.fill();
  eyeCtx.restore();

  // pupil
  eyeCtx.fillStyle = '#05060b';
  eyeCtx.beginPath();
  eyeCtx.arc(160, 0, pupilRadius, 0, Math.PI * 2);
  eyeCtx.fill();

  // retina
  eyeCtx.strokeStyle = '#f7797d';
  eyeCtx.lineWidth = 4;
  eyeCtx.beginPath();
  eyeCtx.arc(300, 0, 75, -0.9, 0.9);
  eyeCtx.stroke();

  // focus point
  const focalShift = (focus - 60) / 6;
  eyeCtx.fillStyle = '#26d0ce';
  eyeCtx.beginPath();
  eyeCtx.arc(300 - focalShift, (focus - 70) / 6, 6, 0, Math.PI * 2);
  eyeCtx.fill();

  eyeCtx.restore();
}

lightSlider.addEventListener('input', drawEye);
focusSlider.addEventListener('input', drawEye);
drawEye();

// Shadow simulation
const shadowCanvas = document.getElementById('shadow-canvas');
const shadowCtx = shadowCanvas.getContext('2d');
const lightA = document.getElementById('lightA');
const lightB = document.getElementById('lightB');

function drawShadow() {
  shadowCtx.clearRect(0, 0, shadowCanvas.width, shadowCanvas.height);
  const objX = 240;
  const objY = 140;
  const objW = 40;
  const objH = 70;

  const lights = [];
  if (lightA.checked) lights.push({ x: 100, y: 40, color: '#ffd166' });
  if (lightB.checked) lights.push({ x: 380, y: 40, color: '#aaf7ff' });

  // draw lights
  lights.forEach((l) => {
    shadowCtx.fillStyle = l.color;
    shadowCtx.beginPath();
    shadowCtx.arc(l.x, l.y, 10, 0, Math.PI * 2);
    shadowCtx.fill();
  });

  // shadow layers
  lights.forEach((l) => {
    shadowCtx.fillStyle = 'rgba(0,0,0,0.35)';
    shadowCtx.beginPath();
    shadowCtx.moveTo(objX + objW / 2, objY);
    shadowCtx.lineTo(objX + objW / 2 + (objX - l.x) * 0.8, objY + 140);
    shadowCtx.lineTo(objX - objW / 2 + (objX - l.x) * 0.8, objY + 140);
    shadowCtx.closePath();
    shadowCtx.fill();
  });

  if (lights.length === 2) {
    // penumbra highlight
    shadowCtx.fillStyle = 'rgba(0,0,0,0.2)';
    shadowCtx.fillRect(objX - objW / 2 - 40, objY + 10, objW + 80, 120);
  }

  // object
  shadowCtx.fillStyle = '#f7a400';
  shadowCtx.fillRect(objX - objW / 2, objY - objH, objW, objH);
}

lightA.addEventListener('change', drawShadow);
lightB.addEventListener('change', drawShadow);
drawShadow();

// Mirror simulation
const mirrorCanvas = document.getElementById('mirror-canvas');
const mirrorCtx = mirrorCanvas.getContext('2d');
const mirrorSelect = document.getElementById('mirror-select');

function drawMirror() {
  mirrorCtx.clearRect(0, 0, mirrorCanvas.width, mirrorCanvas.height);
  const centerX = 200;
  const centerY = mirrorCanvas.height / 2;

  // mirror shape
  mirrorCtx.strokeStyle = '#8ec5fc';
  mirrorCtx.lineWidth = 4;
  mirrorCtx.beginPath();
  if (mirrorSelect.value === 'plane') {
    mirrorCtx.moveTo(centerX, 20);
    mirrorCtx.lineTo(centerX, mirrorCanvas.height - 20);
  } else if (mirrorSelect.value === 'concave') {
    mirrorCtx.moveTo(centerX + 15, 20);
    mirrorCtx.quadraticCurveTo(centerX - 45, centerY, centerX + 15, mirrorCanvas.height - 20);
  } else {
    mirrorCtx.moveTo(centerX - 15, 20);
    mirrorCtx.quadraticCurveTo(centerX + 45, centerY, centerX - 15, mirrorCanvas.height - 20);
  }
  mirrorCtx.stroke();

  // object arrow
  mirrorCtx.fillStyle = '#f7a400';
  mirrorCtx.fillRect(centerX - 120, centerY - 50, 10, 100);
  mirrorCtx.beginPath();
  mirrorCtx.moveTo(centerX - 125, centerY - 60);
  mirrorCtx.lineTo(centerX - 95, centerY - 20);
  mirrorCtx.lineTo(centerX - 125, centerY - 20);
  mirrorCtx.fill();

  // reflected arrow
  mirrorCtx.fillStyle = '#26d0ce';
  const isConcave = mirrorSelect.value === 'concave';
  const isConvex = mirrorSelect.value === 'convex';
  let imgX = centerX + (isConcave ? 160 : isConvex ? 90 : 120);
  let imgHeight = isConcave ? 120 : isConvex ? 60 : 100;
  let upright = isConcave ? true : isConvex ? true : false;

  mirrorCtx.save();
  mirrorCtx.translate(imgX, centerY);
  mirrorCtx.scale(1, upright ? 1 : -1);
  mirrorCtx.fillRect(-5, -imgHeight / 2, 10, imgHeight);
  mirrorCtx.beginPath();
  mirrorCtx.moveTo(-10, -imgHeight / 2 - 10);
  mirrorCtx.lineTo(20, -imgHeight / 2 + 30);
  mirrorCtx.lineTo(-10, -imgHeight / 2 + 30);
  mirrorCtx.fill();
  mirrorCtx.restore();
}

mirrorSelect.addEventListener('change', drawMirror);
drawMirror();

// Refraction simulation
const refCanvas = document.getElementById('refraction-canvas');
const refCtx = refCanvas.getContext('2d');
const angleSlider = document.getElementById('angle-slider');

function drawRefraction() {
  refCtx.clearRect(0, 0, refCanvas.width, refCanvas.height);
  const midY = refCanvas.height / 2;
  refCtx.fillStyle = 'rgba(255,255,255,0.04)';
  refCtx.fillRect(0, midY, refCanvas.width, midY);
  refCtx.fillStyle = 'rgba(38, 208, 206, 0.05)';
  refCtx.fillRect(0, 0, refCanvas.width, midY);

  refCtx.strokeStyle = 'rgba(255,255,255,0.2)';
  refCtx.setLineDash([6, 6]);
  refCtx.beginPath();
  refCtx.moveTo(refCanvas.width / 2, 0);
  refCtx.lineTo(refCanvas.width / 2, refCanvas.height);
  refCtx.stroke();
  refCtx.setLineDash([]);

  const angleDeg = Number(angleSlider.value);
  const angle = (angleDeg * Math.PI) / 180;
  const nWater = 1.33;
  const nAir = 1.0;
  const critical = Math.asin(nAir / nWater);

  const startX = refCanvas.width / 2 - 160;
  const startY = refCanvas.height - 30;
  const hitX = refCanvas.width / 2;
  const hitY = midY;

  // incident ray (aus Wasser)
  refCtx.strokeStyle = '#f7a400';
  refCtx.lineWidth = 3;
  refCtx.beginPath();
  refCtx.moveTo(startX, startY);
  refCtx.lineTo(hitX, hitY);
  refCtx.stroke();

  const incidence = (angleDeg / 90) * (Math.PI / 2 - 0.05);
  const refracted = Math.asin((nWater / nAir) * Math.sin(incidence));
  const isTotal = incidence > critical;

  // refracted or reflected ray
  refCtx.strokeStyle = '#26d0ce';
  refCtx.beginPath();
  if (isTotal) {
    const reflectAngle = incidence;
    const endX = hitX - 180 * Math.sin(reflectAngle);
    const endY = hitY + 180 * Math.cos(reflectAngle);
    refCtx.moveTo(hitX, hitY);
    refCtx.lineTo(endX, endY);
  } else {
    const endX = hitX + 180 * Math.sin(refracted);
    const endY = hitY - 180 * Math.cos(refracted);
    refCtx.moveTo(hitX, hitY);
    refCtx.lineTo(endX, endY);
  }
  refCtx.stroke();

  // labels
  refCtx.fillStyle = '#fff';
  refCtx.font = '12px Inter, sans-serif';
  refCtx.fillText('Wasser (dicht)', 10, refCanvas.height - 10);
  refCtx.fillText('Luft (dünn)', 10, 16);
  refCtx.fillText(`Einfallswinkel: ${angleDeg}°`, refCanvas.width - 150, 20);
  if (isTotal) {
    refCtx.fillStyle = '#f7797d';
    refCtx.fillText('Totalreflexion!', refCanvas.width - 140, 40);
  }
}

angleSlider.addEventListener('input', drawRefraction);
drawRefraction();

// Lens simulation
const lensCanvas = document.getElementById('lens-canvas');
const lensCtx = lensCanvas.getContext('2d');
const lensSelect = document.getElementById('lens-select');

function drawLens() {
  lensCtx.clearRect(0, 0, lensCanvas.width, lensCanvas.height);
  const cx = lensCanvas.width / 2;
  const cy = lensCanvas.height / 2;

  // lens body
  lensCtx.fillStyle = 'rgba(38, 208, 206, 0.4)';
  lensCtx.beginPath();
  if (lensSelect.value === 'convex') {
    lensCtx.ellipse(cx, cy, 20, 70, 0, 0, Math.PI * 2);
  } else {
    lensCtx.moveTo(cx - 8, cy - 70);
    lensCtx.quadraticCurveTo(cx + 30, cy - 20, cx - 8, cy);
    lensCtx.quadraticCurveTo(cx - 30, cy + 20, cx - 8, cy + 70);
    lensCtx.lineTo(cx + 8, cy + 70);
    lensCtx.quadraticCurveTo(cx - 30, cy + 20, cx + 8, cy);
    lensCtx.quadraticCurveTo(cx + 30, cy - 20, cx + 8, cy - 70);
  }
  lensCtx.closePath();
  lensCtx.fill();

  // incoming rays
  for (let y = -40; y <= 40; y += 20) {
    lensCtx.strokeStyle = '#f7a400';
    lensCtx.lineWidth = 2;
    lensCtx.beginPath();
    lensCtx.moveTo(20, cy + y);
    lensCtx.lineTo(cx - 20, cy + y);
    lensCtx.stroke();

    lensCtx.strokeStyle = '#26d0ce';
    lensCtx.beginPath();
    lensCtx.moveTo(cx + 20, cy + y * (lensSelect.value === 'convex' ? 0 : 1));
    if (lensSelect.value === 'convex') {
      lensCtx.lineTo(cx + 140, cy + y * 0.2);
    } else {
      lensCtx.lineTo(cx + 140, cy + y * 1.4);
    }
    lensCtx.stroke();
  }

  lensCtx.fillStyle = '#fff';
  lensCtx.font = '12px Inter, sans-serif';
  lensCtx.fillText(
    lensSelect.value === 'convex'
      ? 'Sammellinse bündelt im Brennpunkt'
      : 'Zerstreuungslinse streut die Strahlen',
    20,
    20
  );
}

lensSelect.addEventListener('change', drawLens);
drawLens();

// Color mixing
const additiveDisplay = document.getElementById('additive-display');
const subtractiveDisplay = document.getElementById('subtractive-display');

function updateAdditive() {
  const toggles = document.querySelectorAll('.color-toggle');
  let r = 0,
    g = 0,
    b = 0;
  toggles.forEach((t) => {
    if (t.checked) {
      if (t.dataset.color === 'red') r = 255;
      if (t.dataset.color === 'green') g = 255;
      if (t.dataset.color === 'blue') b = 255;
    }
  });
  additiveDisplay.style.background = `rgb(${r}, ${g}, ${b})`;
  additiveDisplay.style.color = r + g + b > 400 ? '#0a0c1d' : '#fff';
}

function updateSubtractive() {
  const toggles = document.querySelectorAll('.paint-toggle');
  let r = 255,
    g = 255,
    b = 255;
  toggles.forEach((t) => {
    if (t.checked) {
      if (t.dataset.color === 'cyan') r -= 120;
      if (t.dataset.color === 'magenta') g -= 120;
      if (t.dataset.color === 'yellow') b -= 120;
    }
  });
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  subtractiveDisplay.style.background = `rgb(${r}, ${g}, ${b})`;
  subtractiveDisplay.style.color = r + g + b > 400 ? '#0a0c1d' : '#fff';
}

document.querySelectorAll('.color-toggle').forEach((t) => t.addEventListener('change', updateAdditive));
document.querySelectorAll('.paint-toggle').forEach((t) => t.addEventListener('change', updateSubtractive));
updateAdditive();
updateSubtractive();
