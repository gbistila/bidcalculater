function calculateBid(sf, thicknessInches) {
  const markup = 1.43;

  const cy = (sf * thicknessInches) / 324;

  // Soil Removal
  const soilLaborHours = cy * 0.6;
  const soilCost = soilLaborHours * 48;
  const soilPrice = soilCost * markup;

  // Road Base
  const roadLooseCY = cy * 1.2;
  const roadMaterialCost = roadLooseCY * 35;
  const roadLaborCost = roadLooseCY * 48;
  const compactorRental = 250;
  const roadCost = roadMaterialCost + roadLaborCost + compactorRental;
  const roadPrice = roadCost * markup;

  // Concrete
  const concreteOrderedCY = cy * 1.2;
  const concreteMaterialCost = concreteOrderedCY * 225;
  const concreteFlatworkCost = Math.max(1500, sf * 1.75);
  const concreteCost = concreteMaterialCost + concreteFlatworkCost;
  const concretePrice = concreteCost * markup;

  // Totals
  const totalCost = soilCost + roadCost + concreteCost;
  const totalPrice = soilPrice + roadPrice + concretePrice;

  return {
    input: { squareFeet: sf, thickness: thicknessInches },
    soil: { cubicYards: cy, laborHours: soilLaborHours, cost: soilCost, price: soilPrice },
    roadBase: {
      designCY: cy,
      looseCY: roadLooseCY,
      materialCost: roadMaterialCost,
      laborCost: roadLaborCost,
      compactorRental,
      cost: roadCost,
      price: roadPrice
    },
    concrete: {
      orderedCY: concreteOrderedCY,
      materialCost: concreteMaterialCost,
      flatworkCost: concreteFlatworkCost,
      cost: concreteCost,
      price: concretePrice
    },
    totals: { cost: totalCost, price: totalPrice }
  };
}

function runCalc() {
  const sf = parseFloat(document.getElementById('sfInput').value);
  const thickness = parseFloat(document.getElementById('thicknessInput').value);
  const result = calculateBid(sf, thickness);
  document.getElementById('output').textContent = JSON.stringify(result, null, 2);
}
