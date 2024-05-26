/* eslint-disable prettier/prettier */
const minusToPlusN = (n, f) => {
  Array.from({ length: n * 2 + 1 }, (_, x) => n - x).forEach(f);
};

const getFieldPoints = (radius) => {
  let points = [];
  minusToPlusN(radius - 1, (q) =>
    minusToPlusN(radius - 1, (s) =>
      minusToPlusN(
        radius - 1,
        (r) => q + s + r === 0 && points.push({ q, s, r }),
      ),
    ),
  );
  console.log('getFieldPoints');
  return points;
};

const pickRandomN = (array, n) => {
  console.log('pickRandomN');
  return array
    .map((a) => ({ order: rng(), value: a }))
    .sort((a, b) => a.order - b.order)
    .map((a) => a.value)
    .slice(0, n);
};

const rng = () => {
  console.log('rng');
  return Math.random();
};
const min = (a, b) => {
  console.log('min');
  return Math.min(a, b);
};
const arePointsSame = (a, b) => {
  console.log('arePointsSame');
  return !['q', 's', 'r'].some((v) => a[v] !== b[v]);
};

function getRNGPoints(radius, userPoints) {
  console.log('getRNGPoints');
  console.log('userPoints', userPoints);
  // availablePositions: HexCoordDTO[]
  const availablePositions = getFieldPoints(radius).filter((a) => {
    console.log('availablePositions.filter');
    return userPoints.every((b) => !arePointsSame(a, b));
  });

  const pointsCount = min(
    availablePositions.length,
    userPoints.length === 0 ? 3 : 1 + (rng() > 0.8 ? 1 : 0),
  );
  const selectedValue = userPoints.length === 0 ? 2 : rng() > 0.5 ? 2 : 4;
  console.log('selectedValue', selectedValue);
  return pickRandomN(availablePositions, pointsCount).map((p) => ({
    ...p,
    value: selectedValue,
  }));
}

module.exports = {
  minusToPlusN,
  getFieldPoints,
  pickRandomN,
  rng,
  min,
  arePointsSame,
  getRNGPoints,
};
