const toCents = (value) => Math.round(Number(value) * 100);
const centsMul = (cents, factor) => Math.round(cents * Number(factor));
const money = (cents) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const round = (val) => Math.round(val * 100) / 100;

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

  const soilLaborHours = cy * 0.6;
  const soilCostC = toCents(soilLaborHours * laborRate);
  const soilPriceC = centsMul(soilCostC, markup);

  const baseDesignCY = cy;
  const baseLooseCY = baseDesignCY * roadCompaction;
  const baseMaterialCostC = toCents(baseLooseCY * baseMaterialRate);
  const baseLaborHours = baseLooseCY * 1.0;
  const baseLaborCostC = toCents(baseLaborHours * laborRate);
  const baseCostC = baseMaterialCostC + baseLaborCostC + compactorRentalC;
  const basePriceC = centsMul(baseCostC, markup);

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
    concrete: { priceC: cretePriceC, orderedCY: round(creteOrderedCY), equipment: ["Screed", "Bull float", "Mixer"] },
    totals: { priceC: totalPriceC },
    handoff: {
      roadBase: {
        material: "Road base",
        looseCY: round(baseLooseCY),
        notes: "Compactor on site. Drop at east pad."
      },
      concrete: {
        material: "Concrete",
        orderedCY: round(creteOrderedCY),
        flatworkCap: "$1,500",
        equipment: ["Screed", "Bull float", "Mixer"]
      },
      installPrep: {
        totalLaborHours: round(soilLaborHours + baseLaborHours),
        siteNotes: "Level pad. Access via west gate."
      },
      checklist: [
        "Stakes and stringline set",
        "Subgrade compacted",
        "Forms placed and braced",
        "Rebar or mesh installed",
        "Mix confirmed with supplier",
        "Water access available",
        "Finish tools on site"
      ]
    }
  };
}

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
  const designCY = round(result.concrete.designCY);
  const orderedCY = round(result.concrete.orderedCY);
  const budgetCents = toCents(orderedCY * 225);
  const budgetTotal = centsMul(budgetCents, 1.43);
  const budget = money(budgetTotal);

  handoffEl.classList.remove('hidden');
  handoffEl.innerHTML = `
    <h2>Operational Handoff</h2>
    <pre style="white-space: pre-wrap; font-size: 1rem;">
Concrete Installation:
- ${labor} labor hours
- ${roadCY} yards road base at ${thickness} inches thick
- ${designCY} yards concrete (${orderedCY} ordered — ${budget} budget)
    </pre>
  `;
} else {
  handoffEl.classList.add('hidden');
}

}

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

document.getElementById('calcBtn').addEventListener('click', calcAndRender);
document.getElementById('sfInput').addEventListener('input', calcAndRender);
document.getElementById('thicknessInput').addEventListener('input', calcAndRender);
