// --- Helpers ---
const toCents = (value) => Math.round(Number(value) * 100);
const centsMul = (cents, factor) => Math.round(cents * Number(factor));
const money = (cents) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const round = (val) => Math.round(val * 100) / 100;

// --- Core Calculation ---
function calculateBid(sf, thicknessInches) {
  const markup = 1.43;
  const laborRate = 48;
  const baseMaterialRate = 35;
  const compactorRentalC = toCents(250);
  const concreteMaterialRate = 225;
  const flatworkRate = 1.75;
  const flatworkMin = 1500;
  const roadCompaction = 1.2;
  const concreteWaste = 1.2;

  const cy = (sf * thicknessInches) / 324;

  // Soil
  const soilLaborHours = cy * 0.6;
  const soilCostC = toCents(soilLaborHours * laborRate);
  const soilPriceC = centsMul(soilCostC, markup);

  // Road Base
  const baseDesignCY = cy;
  const baseLooseCY = baseDesignCY * roadCompaction;
  const baseMaterialCostC = toCents(baseLooseCY * baseMaterialRate);
  const baseLaborHours = baseLooseCY * 1.0;
  const baseLaborCostC = toCents(baseLaborHours * laborRate);
  const baseCostC = baseMaterialCostC + baseLaborCostC + compactorRentalC;
  const basePriceC = centsMul(baseCostC, markup);

  // Concrete
  const creteDesignCY = cy;
  const creteOrderedCY = creteDesignCY * concreteWaste;
  const creteMaterialCostC = toCents(creteOrderedCY * concreteMaterialRate);
  const creteFlatworkC = Math.max(toCents(flatworkMin), toCents(sf * flatworkRate));
  const creteCostC = creteMaterialCostC + creteFlatworkC;
  const cretePriceC = centsMul(creteCostC, markup);

  const totalPriceC = soilPriceC + basePriceC + cretePriceC;

  return {
    soil: { priceC: soilPriceC },
    roadBase: { priceC: basePriceC, looseCY: round(baseLooseCY) },
    concrete: {
      priceC: cretePriceC,
      designCY: creteDesignCY,
      orderedCY: creteOrderedCY
    },
    totals: { priceC: totalPriceC },
    handoff: {
      installPrep: {
        totalLaborHours: round(soilLaborHours + baseLaborHours)
      },
      roadBase: {
        looseCY: round(baseLooseCY)
      },
      concrete: {
        designCY: round(creteDesignCY),
        orderedCY: round(creteOrderedCY),
        budgetCents: centsMul(toCents(creteOrderedCY * concreteMaterialRate), markup)
      }
    }
  };
}

// --- Render Output ---
function render(result) {
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('soilPrice').textContent = money(result.soil.priceC);
  document.getElementById('basePrice').textContent = money(result.roadBase.priceC);
  document.getElementById('cretePrice').textContent = money(result.concrete.priceC);
  document.getElementById('totPrice').textContent = money(result.totals.priceC);

  const handoffEl = document.getElementById('handoff');
  if (document.getElementById('handoffToggle').checked) {
    const thickness = document.getElementById('thicknessInput').value;
    const labor = result.handoff.installPrep.totalLaborHours;
    const roadCY = result.handoff.roadBase.looseCY;
    const designCY = result.handoff.concrete.designCY;
    const orderedCY = result.handoff.concrete.orderedCY;
    const budget = money(result.handoff.concrete.budgetCents);

    handoffEl.classList.remove('hidden');
    handoffEl.innerHTML = `
      <h2>Operational Handoff</h2>
      <pre style="white-space: pre-wrap; font-size: 1rem;">
Concrete Installation:
– ${labor} labor hours
– ${roadCY} yards road base at ${thickness} inches thick
– ${designCY} yards concrete (${orderedCY} ordered — ${budget} budget)
      </pre>
    `;
  } else {
    handoffEl.classList.add('hidden');
  }
}

// --- Trigger Calculation ---
function calcAndRender() {
  const sf = parseFloat(document.getElementById('sfInput').value);
  const thickness = parseFloat(document.getElementById('thicknessInput').value);
  if (!isFinite(sf) || !isFinite(thickness) || sf <= 0 || thickness <= 0) {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('handoff').classList.add('hidden');
    return;
  }
  const result = calculateBid(sf, thickness);
  render(result);
}

// --- Event Wiring ---
document.getElementById('calcBtn').addEventListener('click', calcAndRender);
document.getElementById('sfInput').addEventListener('input', calcAndRender);
document.getElementById('thicknessInput').addEventListener('input', calcAndRender);
