function round(value) {
  return Math.round(value * 100) / 100;
}

function calculateBid(sf, thicknessInches) {
  const markup = 1.43;

  // Base volume
  const cy = (sf * thicknessInches) / 324;

  // --- Soil Removal ---
  const soilLaborHours = cy * 0.6;
  const soilCost = round(soilLaborHours * 48);
  const soilPrice = round(soilCost * markup);

  // --- Road Base ---
  const roadLooseCY = cy * 1.2;
  const roadMaterialCost = round(roadLooseCY * 35);
  const roadLaborCost = round(roadLooseCY * 48);
  const compactorRental = 250;
  const roadCost = round(roadMaterialCost + roadLaborCost + compactorRental);
  const roadPrice = round(roadCost * markup);

  // --- Concrete ---
  const concreteOrderedCY = cy * 1.2;
  const concreteMaterialCost = round(concreteOrderedCY * 225);
  const concreteFlatworkCost = round(Math.max(1500, sf * 1.75));
  const concreteCost = round(concreteMaterialCost + concreteFlatworkCost);
  const concretePrice = round(concreteCost * markup);

  // --- Totals ---
  const totalCost = round(soilCost + roadCost + concreteCost);
  const totalPrice = round(soilPrice + roadPrice + concretePrice);

  return {
    input: { squareFeet: sf, thickness: thicknessInches },
    soil: {
      cubicYards: round(cy),
      laborHours: round(soilLaborHours),
      cost: soilCost,
      price: soilPrice
    },
    roadBase: {
      designCY: round(cy),
      looseCY: round(roadLooseCY),
      materialCost: roadMaterialCost,
      laborCost: roadLaborCost,
      compactorRental,
      cost: roadCost,
      price: roadPrice
    },
    concrete: {
      orderedCY: round(concreteOrderedCY),
      materialCost: concreteMaterialCost,
      flatworkCost: concreteFlatworkCost,
      cost: concreteCost,
      price: concretePrice
    },
    totals: {
      cost: totalCost,
      price: totalPrice
    }
  };
}

function runCalc() {
  const sf = parseFloat(document.getElementById('sfInput').value);
  const thickness = parseFloat(document.getElementById('thicknessInput').value);
  if (isNaN(sf) || isNaN(thickness)) {
    document.getElementById('output').textContent = "Please enter valid numbers.";
    return;
  }
  const result = calculateBid(sf, thickness);
  document.getElementById('output').textContent = JSON.stringify(result, null, 2);
}
