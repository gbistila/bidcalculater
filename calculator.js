function calculateBid() {
  const length = parseFloat(document.getElementById('length').value) || 0;
  const height = parseFloat(document.getElementById('height').value) || 0;
  const fillYards = parseFloat(document.getElementById('fillYards').value) || 0;
  const slabArea = parseFloat(document.getElementById('slabArea').value) || 0;
  const thickness = parseFloat(document.getElementById('thickness').value) || 0;

  const boulderRate = 75;
  const fillRate = 15;
  const laborRate = 48;
  const markup = 1.43;
  const concreteRate = 135;

  const squareFootage = length * height;
  const tons = squareFootage / 8;
  const boulderCost = tons * boulderRate;
  const fillCost = fillYards * fillRate;
  const laborHoursWall = tons + fillYards;
  const laborCostWall = laborHoursWall * laborRate;
  const totalWallCost = boulderCost + fillCost + laborCostWall;
  const totalWallPrice = totalWallCost * markup;

  const thicknessFeet = thickness / 12;
  const concreteYards = (slabArea * thicknessFeet) / 27;
  const concreteCost = concreteYards * concreteRate;
  const laborHoursConcrete = concreteYards * 1.5;
  const laborCostConcrete = laborHoursConcrete * laborRate;
  const totalConcreteCost = concreteCost + laborCostConcrete;
  const totalConcretePrice = totalConcreteCost * markup;

  const totalCost = totalWallCost + totalConcreteCost;
  const totalPrice = totalWallPrice + totalConcretePrice;

  document.getElementById('results').innerHTML = `
    <h3>📊 Bid Summary</h3>
    <p><strong>Retaining Wall:</strong></p>
    <p>Square Footage: ${squareFootage.toFixed(2)} ft²</p>
    <p>Tons of Boulders: ${tons.toFixed(2)} tons</p>
    <p>Boulder Cost: $${boulderCost.toFixed(2)}</p>
    <p>Fill Dirt Cost: $${fillCost.toFixed(2)}</p>
    <p>Labor Hours: ${laborHoursWall.toFixed(2)} hrs</p>
    <p>Labor Cost: $${laborCostWall.toFixed(2)}</p>
    <p>Total Wall Cost: $${totalWallCost.toFixed(2)}</p>
    <p>Total Wall Price: $${totalWallPrice.toFixed(2)}</p>

    <hr />

    <p><strong>Concrete:</strong></p>
    <p>Concrete Yards: ${concreteYards.toFixed(2)} yd³</p>
    <p>Concrete Cost: $${concreteCost.toFixed(2)}</p>
    <p>Labor Hours: ${laborHoursConcrete.toFixed(2)} hrs</p>
    <p>Labor Cost: $${laborCostConcrete.toFixed(2)}</p>
    <p>Total Concrete Cost: $${totalConcreteCost.toFixed(2)}</p>
    <p>Total Concrete Price: $${totalConcretePrice.toFixed(2)}</p>

    <hr />

    <p><strong>Grand Total Cost:</strong> $${totalCost.toFixed(2)}</p>
    <p><strong>Grand Total Price:</strong> $${totalPrice.toFixed(2)}</p>

    <hr />

    <p><strong>📝 Operational Handoff</strong></p>
    <ul>
      <li><strong>Retaining Wall:</strong> ${laborHoursWall.toFixed(2)} labor hours, material: boulders (${tons.toFixed(2)} tons)</li>
      <li><strong>Fill Dirt:</strong> ${fillYards.toFixed(2)} yards</li>
      <li><strong>Concrete:</strong> ${laborHoursConcrete.toFixed(2)} labor hours, material: concrete (${concreteYards.toFixed(2)} yd³)</li>
      <li><strong>Equipment Needed:</strong> Excavator, skid steer, compactor, concrete mixer</li>
      <li><strong>Site Prep:</strong> Verify access, locate utilities, confirm disposal site</li>
      <li><strong>Crew Notes:</strong> Wall crew handles boulders and fill; concrete crew handles slab prep and pour</li>
    </ul>
  `;
}
