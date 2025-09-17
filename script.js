// ---------- Money helpers (do all $ math in cents) ----------
const toCents = (value) => Math.round(value * 100);        // dollars -> cents (nearest cent)
const centsMul = (cents, factor) => Math.round(cents * factor); // cents * factor -> cents (nearest cent)
const money = (cents) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(cents / 100);

// ---------- Core calculation ----------
function calculateBid(sf, thicknessInches) {
  const markup = 1.43;

  // constants
  const laborRate = 48;                 // $/hr
  const baseMaterialRate = 35;          // $/CY
  const compactorRentalC = toCents(250); // $250 flat, in cents
  const concreteMaterialRate = 225;     // $/CY
  const flatworkRate = 1.75;            // $/SF
  const flatworkMin = 1500;             // $
  const roadCompaction = 1.20;
  const concreteWaste = 1.20;

  // cubic yards (design)
  const cy = (sf * thicknessInches) / 324;

  // --- Soil Removal ---
  const soilLaborHours = cy * 0.6;
  const soilCostC = toCents(soilLaborHours * laborRate);
  const soilPriceC = centsMul(soilCostC, markup);

  // --- Road Base ---
  const baseDesignCY = cy;
  const baseLooseCY = baseDesignCY * roadCompaction;
  const baseMaterialCostC = toCents(baseLooseCY * baseMaterialRate);
  const baseLaborHours = baseLooseCY * 1.0;
  const baseLaborCostC = toCents(baseLaborHours * laborRate);
  const baseCostC = baseMaterialCostC + baseLaborCostC + compactorRentalC;
  const basePriceC = centsMul(baseCostC, markup);

  // --- Concrete ---
  const creteDesignCY = cy;
  const creteOrderedCY = creteDesignCY * concreteWaste;
  const creteMaterialCostC = toCents(creteOrderedCY * concreteMaterialRate);
  const creteFlatworkC = Math.max(toCents(flatworkMin), toCents(sf * flatworkRate));
  const creteCostC = creteMaterialCostC + creteFlatworkC;
  const cretePriceC = centsMul(creteCostC, markup);

  // --- Totals ---
  const totalCostC = soilCostC + baseCostC + creteCostC;
  const totalPriceC = soilPriceC + basePriceC + cretePriceC;

  return {
    input: { squareFeet: sf, thickness: thicknessInches },
    soil: {
      cubicYards: cy,
      laborHours: soilLaborHours,
      costC: soilCostC,
      priceC: soilPriceC
    },
    roadBase: {
      designCY: baseDesignCY,
      looseCY: baseLooseCY,
      materialCostC: baseMaterialCostC,
      laborHours: baseLaborHours,
      laborCostC: baseLaborCostC,
      compactorRentalC,
      costC: baseCostC,
      priceC: basePriceC
    },
    concrete: {
      designCY: creteDesignCY,
      orderedCY: creteOrderedCY,
      materialCostC: creteMaterialCostC,
      flatworkC: creteFlatworkC,
      costC: creteCostC,
      priceC: cretePriceC
    },
    totals: {
      costC: totalCostC,
      priceC: totalPriceC
    }
  };
}

// ---------- UI wiring ----------
function runCalc() {
  const sf = parseFloat(document.getElementById('sfInput').value);
  const thickness = parseFloat(document.getElementById('thicknessInput').value);

  const cards = document.getElementById('cards');
  if (isNaN(sf) || isNaN(thickness) || sf <= 0 || thickness <= 0) {
    cards.style.display = 'none';
    return;
  }

  const r = calculateBid(sf, thickness);
  cards.style.display = 'grid';

  // Soil
  document.getElementById('soilCY').textContent = r.soil.cubicYards.toFixed(2);
  document.getElementById('soilHrs').textContent = r.soil.laborHours.toFixed(2);
  document.getElementById('soilCost').textContent = money(r.soil.costC);
  document.getElementById('soilPrice').textContent = money(r.soil.priceC);

  // Road Base
  document.getElementById('baseDesignCY').textContent = r.roadBase.designCY.toFixed(2);
  document.getElementById('baseLooseCY').textContent = r.roadBase.looseCY.toFixed(2);
  document.getElementById('baseMat').textContent = money(r.roadBase.materialCostC);
  document.getElementById('baseHrs').textContent = r.roadBase.laborHours.toFixed(2);
  document.getElementById('baseLabor').textContent = money(r.roadBase.laborCostC);
  document.getElementById('baseComp').textContent = money(r.roadBase.compactorRentalC);
  document.getElementById('baseCost').textContent = money(r.roadBase.costC);
  document.getElementById('basePrice').textContent = money(r.roadBase.priceC);

  // Concrete
  document.getElementById('creteDesignCY').textContent = r.concrete.designCY.toFixed(2);
  document.getElementById('creteOrderedCY').textContent = r.concrete.orderedCY.toFixed(2);
  document.getElementById('creteMat').textContent = money(r.concrete.materialCostC);
  document.getElementById('creteFlat').textContent = money(r.concrete.flatworkC);
  document.getElementById('creteCost').textContent = money(r.concrete.costC);
  document.getElementById('cretePrice').textContent = money(r.concrete.priceC);

  // Totals
  document.getElementById('totCost').textContent = money(r.totals.costC);
  document.getElementById('totPrice').textContent = money(r.totals.priceC);

  // Optional debug (remove if not needed)
  document.getElementById('debug').textContent =
    `Inputs: ${r.input.squareFeet} SF @ ${r.input.thickness}" | CY: ${(r.soil.cubicYards).toFixed(4)}`;
}
