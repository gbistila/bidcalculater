function calculateBid(sf, thicknessInches) {
  const markup = 1.43;

  // Convert to cubic yards
  const cy = (sf * thicknessInches) / 324;

  // --- Soil Removal ---
  const soilLaborHours = cy * 0.6;
  const soilLaborRate = 48;
  const soilCost = soilLaborHours * soilLaborRate;
  const soilPrice = soilCost * markup;

  // --- Road Base ---
  const roadCompactionFactor = 1.2;
  const roadLooseCY = cy * roadCompactionFactor;
  const roadMaterialRate = 35;
  const roadLaborRate = 48;
  const roadLaborHours = roadLooseCY * 1.0;
  const roadMaterialCost = roadLooseCY * roadMaterialRate;
  const roadLaborCost = roadLaborHours * roadLaborRate;
  const compactorRental = 250;
  const roadCost = roadMaterialCost + roadLaborCost + compactorRental;
  const roadPrice = roadCost * markup;

  // --- Concrete ---
  const concreteWasteFactor = 1.2;
  const concreteOrderedCY = cy * concreteWasteFactor;
  const concreteMaterialRate = 225;
  const concreteFlatworkRate = 1.75;
  const concreteFlatworkMax = 1500;
  const concreteMaterialCost = concreteOrderedCY * concreteMaterialRate;
  const concreteFlatworkCost = Math.max(concreteFlatworkMax, sf * concreteFlatworkRate);
  const concreteCost = concreteMaterialCost + concreteFlatworkCost;
  const concretePrice = concreteCost * markup;

  // --- Totals ---
  const totalCost = soilCost + roadCost + concreteCost;
  const totalPrice = soilPrice + roadPrice + concretePrice;

  return {
    input: { squareFeet: sf, thickness: thicknessInches },
    soil: {
      cubicYards: cy,
      laborHours: soilLaborHours,
      cost: soilCost,
      price: soilPrice
    },
    roadBase: {
      designCY: cy,
      looseCY: roadLooseCY,
      materialCost: roadMaterialCost,
      laborHours: roadLaborHours,
      laborCost: roadLaborCost,
      compactorRental,
      cost: roadCost,
      price: roadPrice
    },
    concrete: {
      designCY: cy,
      orderedCY: concreteOrderedCY,
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
