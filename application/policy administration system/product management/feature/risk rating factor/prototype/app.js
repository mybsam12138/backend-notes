function factorAge() {
  const enabled = document.getElementById('factorAgeEnabled').checked;
  if (!enabled) return null;
  const age = Number(document.getElementById('driverAge').value || 0);
  if (age < 25) return 1.30;
  if (age <= 60) return 1.00;
  return 1.20;
}

function factorUsage() {
  const enabled = document.getElementById('factorUsageEnabled').checked;
  if (!enabled) return null;
  const usage = document.getElementById('vehicleUsage').value;
  return usage === 'Commercial' ? 1.20 : 1.00;
}

function factorValue() {
  const enabled = document.getElementById('factorValueEnabled').checked;
  if (!enabled) return null;
  const value = Number(document.getElementById('vehicleValue').value || 0);
  return value > 20000 ? 1.10 : 1.00;
}

function factorRegion() {
  const enabled = document.getElementById('factorRegionEnabled').checked;
  if (!enabled) return null;
  const region = document.getElementById('region').value;
  return region === 'Urban' ? 1.15 : 1.00;
}

function syncDynamicFields() {
  document.getElementById('fieldAge').classList.toggle('hidden', !document.getElementById('factorAgeEnabled').checked);
  document.getElementById('fieldUsage').classList.toggle('hidden', !document.getElementById('factorUsageEnabled').checked);
  document.getElementById('fieldValue').classList.toggle('hidden', !document.getElementById('factorValueEnabled').checked);
  document.getElementById('fieldRegion').classList.toggle('hidden', !document.getElementById('factorRegionEnabled').checked);
}

function formatFactor(value) {
  return value == null ? '—' : value.toFixed(2);
}

function recalc() {
  syncDynamicFields();

  const base = Number(document.getElementById('basePremium').value || 0);
  let premium = base;

  const age = factorAge();
  const usage = factorUsage();
  const value = factorValue();
  const region = factorRegion();

  [age, usage, value, region].forEach(v => {
    if (v != null) premium *= v;
  });

  document.getElementById('summaryBase').textContent = base.toFixed(2);
  document.getElementById('summaryAge').textContent = formatFactor(age);
  document.getElementById('summaryUsage').textContent = formatFactor(usage);
  document.getElementById('summaryValue').textContent = formatFactor(value);
  document.getElementById('summaryRegion').textContent = formatFactor(region);
  document.getElementById('finalPremium').textContent = premium.toFixed(2);
}

document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', recalc);
  el.addEventListener('change', recalc);
});

recalc();
