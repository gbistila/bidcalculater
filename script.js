function val(id, fallback = 0) {
  const v = parseFloat(document.getElementById(id)?.value);
  return Number.isFinite(v) ? v : fallback;
}

function calculateBid() {
  // MARKUP AND RATES (editable, with safe defaults)
  const markup = val('markup', 1.43);
  const laborRate = val('laborRate', 48);

  // Retaining wall inputs
  const length = val('length');
  const height = val('height');
  const fillYards = val('fillYards');

  // Concrete inputs
  const slabArea = val('slabArea');
  const thicknessIn = val('thickness');
  const excavDepthIn = val('excavDepthIn', 6);
  const baseDepthIn = val('baseDepthIn', 4);

  // Material rates and densities
  const concreteRate = val('concreteRate', 135);          // $/yd³
  const baseRatePerTon = val('baseRatePerTon', 28);       // $/ton
  const haulRatePerTon = val('haulRatePerTon', 18);       // $/ton
  const baseDensityTonsPerYd = val('baseDensityTonsPerYd', 1.5);
  const soilDensityTonsPerYd = val('soilDensityTonsPerYd', 1.2);

  // LABOR PRODUCTIVITY (tweak if needed)
  const wallLaborPerTon = 1.0;        // hr/ton (boulders)
  const wallLaborPerFillYd = 1.0;     // hr/yd (fill)
  const excavHoursPerYd = 0.5;        // hr/yd (soil)
  const baseInstallHoursPerTon = 0.3; // hr/ton (roadbase place/compact)
  const finishHoursPerYd = 0.75;      // hr/yd³ (concrete place/finish)

  // ------------------------------
  // RETAINING WALL CALCULATIONS
  // ------------------------------
  const squareFootage = length * height;
  const tons = squareFootage / 8;          // Tons of boulders
  const boulderCost = tons * 75;           // $75/ton for boulders
  const fillCost = fillYards * 15;         // $15/yd for fill dirt
  const laborHoursWall = (tons * wallLaborPerTon) + (fillYards * wallLaborPerFillYd);
  const laborCostWall = laborHoursWall * laborRate;
  const totalWallCost = boulderCost + fillCost + laborCostWall;
  const totalWallPrice = totalWallCost * markup;

  // ------------------------------
  // CONCRETE CALCULATIONS
  // ------------------------------
  // Concrete volume
  const thicknessFt = thicknessIn / 12;
  const concreteYds = (slabArea * thicknessFt) / 27;

  // Soil excavation & haul-off
  const excavFt = excavDepthIn / 12;
  const soilYds = (slabArea * excavFt) / 27;
  const soilTons = soilYds * soilDensityTonsPerYd;
  const haulCost = soilTons * haulRatePerTon;

  // Roadbase supply & installation
  const baseFt = baseDepthIn / 12;
  const baseYds = (slabArea * baseFt) / 27;
  const baseTons = baseYds * baseDensityTonsPerYd;
  const baseMaterialCost = baseTons * baseRatePerTon;

  // Concrete material
  const concreteMaterialCost = concreteYds * concreteRate;

  // Labor (excav + base + place/finish concrete)
  const excavLaborHours = soilYds * excavHoursPerYd;
  const baseLaborHours = baseTons * baseInstallHoursPerTon;
  const finishLaborHours = concreteYds * finishHoursPerYd;
  const laborHoursConcrete = excavLaborHours + baseLaborHours + finishLaborHours;
  const laborCostConcrete = laborHoursConcrete * laborRate;

  // Totals (Concrete)
  const totalConcreteCost = concreteMaterialCost + baseMaterialCost + haulCost + laborCostConcrete;
  const totalConcretePrice = totalConcreteCost * markup;

  // ------------------------------
  // GRAND TOTALS
  // ------------------------------
  const totalCost = totalWallCost + totalConcreteCost;
  const totalPrice = totalWallPrice + totalConcretePrice;

  // ------------------------------
  // OUTPUT
  // ------------------------------
  const results = `
    <h3>📊 Bid summary</h3>

    <p><strong>Retaining wall:</strong></p>
    <p><strong>Square footage:</strong> ${squareFootage.toFixed(2)} ft²</p>
    <p><strong>Boulder tons:</strong> ${tons.toFixed(2)} tons</p>
    <p><strong>Boulder cost:</strong> $${boulderCost.toFixed(2)}</p>
    <p><strong>Fill dirt cost:</strong> $${fillCost.toFixed(2)}</p>
    <p><strong>Labor hours (wall):</strong> ${laborHoursWall.toFixed(2)} hrs</p>
    <p><strong>Labor cost (wall):</strong> $${laborCostWall.toFixed(2)}</p>
    <p><strong>Total wall cost:</strong> $${totalWallCost.toFixed(2)}</p>
    <p><strong>Total wall price:</strong> $${totalWallPrice.toFixed(2)}</p>

    <hr />

    <p><strong>Concrete:</strong></p>
    <p><strong>Concrete volume:</strong> ${concreteYds.toFixed(2)} yd³</p>
    <p><strong>Excavation volume:</strong> ${soilYds.toFixed(2)} yd³ (${soilTons.toFixed(2)} tons)</p>
    <p><strong>Roadbase volume:</strong> ${baseYds.toFixed(2)} yd³ (${baseTons.toFixed(2)} tons)</p>
    <p><strong>Concrete material cost:</strong> $${concreteMaterialCost.toFixed(2)}</p>
    <p><strong>Roadbase material cost:</strong> $${baseMaterialCost.toFixed(2)}</p>
    <p><strong>Haul-off cost:</strong> $${haulCost.toFixed(2)}</p>
    <p><strong>Labor hours (concrete):</strong> ${laborHoursConcrete.toFixed(2)} hrs</p>
    <p><strong>Labor cost (concrete):</strong> $${laborCostConcrete.toFixed(2)}</p>
    <p><strong>Total concrete cost:</strong> $${totalConcreteCost.toFixed(2)}</p>
    <p><strong>Total concrete price:</strong> $${totalConcretePrice.toFixed(2)}</p>

    <hr />

    <p><strong>Grand total cost:</strong> $${totalCost.toFixed(2)}</p>
    <p><strong>Grand total price:</strong> $${totalPrice.toFixed(2)}</p>

    <hr />

    <p><strong>Operational handoff checklist:</strong></p>
    <ul>
      <li><strong>Scope:</strong> Wall + slab (${slabArea.toFixed(0)} ft² @ ${thicknessIn}" with ${baseDepthIn}" base; excav ${excavDepthIn}")</li>
      <li><strong>Quantities:</strong> ${tons.toFixed(2)} tons boulders; ${fillYards.toFixed(2)} yd fill (wall); ${concreteYds.toFixed(2)} yd³ concrete; ${baseTons.toFixed(2)} tons base; ${soilTons.toFixed(2)} tons haul-off</li>
      <li><strong>Crew & hours:</strong> Wall ${laborHoursWall.toFixed(1)} hrs; Concrete ${laborHoursConcrete.toFixed(1)} hrs</li>
      <li><strong>Materials:</strong> Concrete @ $${concreteRate}/yd³; Base @ $${baseRatePerTon}/ton; Haul @ $${haulRatePerTon}/ton</li>
      <li><strong>Equipment:</strong> Skid steer, plate compactor, forms, screed, saw, PPE</li>
      <li><strong>Subgrade:</strong> Excavate ${excavDepthIn}"; compact to spec; place ${baseDepthIn}" base, compact</li>
      <li><strong>Pour plan:</strong> Access route, truck/pump if needed, curing plan, control joints</li>
      <li><strong>Utilities:</strong> Call 811, verify locates before dig</li>
      <li><strong>Logistics:</strong> Delivery windows, traffic control if needed, disposal site confirmed</li>
      <li><strong>Contacts:</strong> Client, GC, dispatch, plant, disposal site</li>
      <li><strong>Sign-offs:</strong> Mix design, thickness, base depth, finish, joints, curing</li>
    </ul>
  `;

  document.getElementById('results').innerHTML = results;
}
