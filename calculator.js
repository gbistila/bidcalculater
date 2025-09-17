function calculateBid() {
  // Inputs
  const length = num('length');
  const height = num('height');
  const fillYards = num('fillYards');
  const slabArea = num('slabArea');
  const thicknessIn = num('thickness');

  // Global rates and multipliers
  const markup = 1.43;
  const laborRate = 48;

  // Retaining wall rates
  const boulderRatePerTon = 75;
  const fillRatePerYd = 15;

  // Concrete section rates (per your formulas)
  // Soil removal
  const soilLaborHoursPerCY = 0.6; // hr/CY
  // Road base
  const baseLooseFactor = 1.20;    // 20% more
  const baseMaterialRatePerCYLoose = 35; // $/CY (loose)
  const baseLaborHoursPerCYLoose = 1.0;  // hr/CY at $48/hr
  const compactorRental = 250;     // flat
  // Concrete
  const concreteOverOrderFactor = 1.20;  // 20% extra
  const concreteMaterialRatePerCY = 225; // $/CY
  const flatworkMin = 1500;              // $
  const flatworkRatePerSF = 1.75;        // $/SF

  // ---------------------------
  // Retaining wall calculations
  // ---------------------------
  const wallSF = length * height;
  const boulderTons = wallSF / 8;                 // Tons = (L * H) / 8
  const boulderCost = boulderTons * boulderRatePerTon;
  const fillCost = fillYards * fillRatePerYd;
  const wallLaborHours = boulderTons + fillYards; // 1 hr/ton + 1 hr/yd
  const wallLaborCost = wallLaborHours * laborRate;
  const wallTotalCost = boulderCost + fillCost + wallLaborCost;
  const wallTotalPrice = wallTotalCost * markup;

  // ---------------------------
  // Concrete section (three lines)
  // Shared: design CY = SF * T / 324
  // ---------------------------
  const designCY = (slabArea * thicknessIn) / 324;

  // Soil removal
  const soilCY = designCY;
  const soilLaborHours = soilCY * soilLaborHoursPerCY;
  const soilCost = soilLaborHours * laborRate;
  const soilPrice = soilCost * markup;

  // Road base
  const baseDesignCY = designCY;
  const baseLooseCY = baseDesignCY * baseLooseFactor;
  const baseMaterialCost = baseLooseCY * baseMaterialRatePerCYLoose;
  const baseLaborHours = baseLooseCY * baseLaborHoursPerCYLoose;
  const baseLaborCost = baseLaborHours * laborRate;
  const baseCost = baseMaterialCost + baseLaborCost + compactorRental;
  const basePrice = baseCost * markup;

  // Concrete
  const orderedCY = designCY * concreteOverOrderFactor;
  const concreteMaterialCost = orderedCY * concreteMaterialRatePerCY;
  const flatworkCost = Math.max(flatworkMin, slabArea * flatworkRatePerSF);
  const concreteCost = concreteMaterialCost + flatworkCost;
  const concretePrice = concreteCost * markup;

  // Concrete section totals (sum of three lines)
  const concreteSectionCost = soilCost + baseCost + concreteCost;
  const concreteSectionPrice = soilPrice + basePrice + concretePrice;

  // ---------------------------
  // Grand totals (wall + concrete section)
  // ---------------------------
  const totalCost = wallTotalCost + concreteSectionCost;
  const totalPrice = wallTotalPrice + concreteSectionPrice;

  // ---------------------------
  // Output
  // ---------------------------
  document.getElementById('results').innerHTML = `
    <h3>📊 Bid summary</h3>

    <p><strong>Retaining wall:</strong></p>
    <p><strong>Square footage:</strong> ${fmt(wallSF)} ft²</p>
    <p><strong>Boulder tons:</strong> ${fmt(boulderTons)} tons</p>
    <p><strong>Boulder cost:</strong> $${fmt(boulderCost)}</p>
    <p><strong>Fill dirt cost:</strong> $${fmt(fillCost)}</p>
    <p><strong>Labor hours (wall):</strong> ${fmt(wallLaborHours)} hrs</p>
    <p><strong>Labor cost (wall):</strong> $${fmt(wallLaborCost)}</p>
    <p><strong>Total wall cost:</strong> $${fmt(wallTotalCost)}</p>
    <p><strong>Total wall price:</strong> $${fmt(wallTotalPrice)}</p>

    <hr />

    <p><strong>Concrete — soil removal:</strong></p>
    <p><strong>CY:</strong> ${fmt(soilCY)} yd³</p>
    <p><strong>Labor hours:</strong> ${fmt(soilLaborHours)} hrs (@ ${soilLaborHoursPerCY} hr/CY)</p>
    <p><strong>Cost:</strong> $${fmt(soilCost)}</p>
    <p><strong>Price:</strong> $${fmt(soilPrice)}</p>

    <p><strong>Concrete — road base:</strong></p>
    <p><strong>Design CY:</strong> ${fmt(baseDesignCY)} yd³, <strong>Loose CY (20%):</strong> ${fmt(baseLooseCY)} yd³</p>
    <p><strong>Material:</strong> $${fmt(baseMaterialCost)} (@ $${baseMaterialRatePerCYLoose}/CY)</p>
    <p><strong>Labor:</strong> $${fmt(baseLaborCost)} (${fmt(baseLaborHours)} hrs @ $${laborRate}/hr)</p>
    <p><strong>Compactor:</strong> $${fmt(compactorRental)}</p>
    <p><strong>Total cost:</strong> $${fmt(baseCost)}</p>
    <p><strong>Price:</strong> $${fmt(basePrice)}</p>

    <p><strong>Concrete — pour & finish:</strong></p>
    <p><strong>Ordered CY (20% extra):</strong> ${fmt(orderedCY)} yd³</p>
    <p><strong>Material:</strong> $${fmt(concreteMaterialCost)} (@ $${concreteMaterialRatePerCY}/CY)</p>
    <p><strong>Flatwork:</strong> $${fmt(flatworkCost)} (max of $${flatworkMin} vs ${slabArea} × $${flatworkRatePerSF})</p>
    <p><strong>Total cost:</strong> $${fmt(concreteCost)}</p>
    <p><strong>Price:</strong> $${fmt(concretePrice)}</p>

    <hr />

    <p><strong>Concrete section totals:</strong></p>
    <p><strong>Total cost:</strong> $${fmt(concreteSectionCost)}</p>
    <p><strong>Total price:</strong> $${fmt(concreteSectionPrice)}</p>

    <hr />

    <p><strong>Grand totals (wall + concrete sections):</strong></p>
    <p><strong>Total cost:</strong> $${fmt(totalCost)}</p>
    <p><strong>Total price:</strong> $${fmt(totalPrice)}</p>

    <hr />

    <p><strong>📝 Operational handoff</strong></p>
    <ul>
      <li><strong>Retaining wall:</strong> ${fmt(wallLaborHours)} labor hrs; material: boulders (${fmt(boulderTons)} tons)</li>
      <li><strong>Wall fill:</strong> ${fmt(fillYards)} yd fill</li>
      <li><strong>Soil removal:</strong> ${fmt(soilCY)} yd³; labor ${fmt(soilLaborHours)} hrs</li>
      <li><strong>Road base:</strong> ${fmt(baseLooseCY)} yd³ loose; labor ${fmt(baseLaborHours)} hrs; compactor reserved</li>
      <li><strong>Concrete:</strong> order ${fmt(orderedCY)} yd³; flatwork budget $${fmt(flatworkCost)}</li>
      <li><strong>Crew & equipment:</strong> Wall crew (boulder set, backfill); Concrete crew (excavate, base, forms, pour); Excavator, skid steer, plate compactor, forms, saw, PPE</li>
      <li><strong>Logistics:</strong> Access confirmed, utilities located (811), delivery windows, disposal site</li>
      <li><strong>Sign-offs:</strong> Thickness, base depth, joints layout, finish, curing</li>
    </ul>
  `;
}

// Helpers
function num(id, d = 0) {
  const v = parseFloat(document.getElementById(id)?.value);
  return Number.isFinite(v) ? v : d;
}
function fmt(x) {
  return Number(x).toFixed(2);
}
