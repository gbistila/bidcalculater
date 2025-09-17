// ---- Money helpers (integer cents for accuracy) ----
const toCents = (value) => Math.round(Number(value) * 100);
const centsMul = (cents, factor) => Math.round(cents * Number(factor));
const money = (cents) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(cents / 100);

// ---- Core calculation ----
function calculateBid(sf, thicknessInches) {
  const markup = 1.43;

  // constants
  const laborRate = 48;                 // $/hr
  const baseMaterialRate = 35;          // $/CY
  const compactorRentalC = toCents(250);
  const concreteMaterialRate = 225;     // $/CY
  const flatworkRate = 1.75;            // $/SF
  const flatworkMin = 1500;             // $
  const roadCompaction = 1.20;
  const concreteWaste = 1.20;

  // cubic yards (design)
  const cy = (sf * thicknessInches) / 324;

  // Soil removal (labor only)
  const soilLaborHours = cy * 0.6;
  const soilCostC = toCents(soilLaborHours * laborRate);
  const soilPriceC = centsMul(soilCostC, markup);

  // Road base
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

  // Totals
  const totalCostC = soilCostC + baseCostC + creteCostC;
  const totalPriceC = soilPriceC + basePriceC + cretePriceC;

  return {
    input: { squareFeet: sf, thickness: thicknessInches },
    soil: { cubicYards: cy, laborHours: soilLaborHours, costC: soilCostC, priceC: soilPriceC },
    roadBase: {
      designCY: baseDesignCY, looseCY: baseLooseCY,
      materialCostC: baseMaterialCostC, laborHours: baseLaborHours, laborCostC: baseLaborCostC,
      compactorRentalC, costC: baseCostC, priceC: basePriceC
    },
    concrete: {
      designCY: creteDesignCY, orderedCY: creteOrderedCY,
      materialCostC: creteMaterialCostC, flatworkC: creteFlatworkC, costC: creteCostC, priceC: cretePriceC
    },
    totals: { costC: totalCostC, priceC: totalPriceC }
  };
}

// ---- UI wiring ----
function render(result) {
  const show = (id, value) => (document.getElementById(id).textContent = value);

  // Soil
  show('soilCY', result.soil.cubicYards.toFixed(2));
  show('soilHrs', result.soil.laborHours.toFixed(2));
  show('soilCost', money(result.soil.costC));
  show('soilPrice', money(result.soil.priceC));

  // Road base
  show('baseDesignCY', result.roadBase.designCY.toFixed(2));
  show('baseLooseCY', result.roadBase.looseCY.toFixed(2));
  show('baseMat', money(result.roadBase.materialCostC));
  show('baseHrs', result.roadBase.laborHours.toFixed(2));
  show('baseLabor', money(result.roadBase.laborCostC));
  show('baseComp', money(result.roadBase.compactorRentalC));
  show('baseCost', money(result.roadBase.costC));
  show('basePrice', money(result.roadBase.priceC));

  // Concrete
  show('creteDesignCY', result.concrete.designCY.toFixed(2));
  show('creteOrderedCY', result.concrete.orderedCY.toFixed(2));
  show('creteMat', money(result.concrete.materialCostC));
  show('creteFlat', money(result.concrete.flatworkC));
  show('creteCost', money(result.concrete.costC));
  show('cretePrice', money(result.concrete.priceC));

  // Totals
  show('totCost', money(result.totals.costC));
  show('totPrice', money(result.totals.priceC));
}

function calcAndRender() {
  const sf = parseFloat(document.getElementById('sfInput').value);
  const thickness = parseFloat(document.getElementById('thicknessInput').value);
  const resultsEl = document.getElementById('results');

  if (!isFinite(sf) || !isFinite(thickness) || sf <= 0 || thickness <= 0) {
    resultsEl.classList.add('hidden');
    return;
  }
  const result = calculateBid(sf, thickness);
  resultsEl.classList.remove('hidden');
  render(result);
}

// --- Button and input wiring (runs immediately after DOM loads) ---
document.getElementById('calcBtn').addEventListener('click', calcAndRender);
document.getElementById('sfInput').addEventListener('input', calcAndRender);
document.getElementById('thicknessInput').addEventListener('input', calcAndRender);
