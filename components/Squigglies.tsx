const SIZE = 500;
const AMOUNT = 14;
export function Squigglies() {
  return (
    <div className="squigglies">
      <svg width="100%" height="100%">
        {Array.from({ length: 100 }).map((_, i) => {
          const x = Math.random() * SIZE - SIZE / 2;
          const y = (i * SIZE) / AMOUNT;
          return (
            <path
              key={i}
              d={getCatmullRom(getRandomPoints(x, y))}
              fill="none"
              strokeWidth={1}
            />
          );
        })}
      </svg>
    </div>
  );
}

function getRandomPoints(offsetX: number, offsetY: number) {
  const numberOfPoints = Math.floor(Math.random() * 3) + 4;
  const spread = SIZE;
  let points = [];

  for (let i = numberOfPoints; --i; i > 0) {
    // only half-movements half the time
    points.push(Math.floor(Math.random() * spread) + offsetX);
    points.push(Math.floor(Math.random() * spread) + offsetY);
  }
  return points;
}

function getCatmullRom(points: number[], tension = 1) {
  if (tension == null) tension = 1;

  var size = points.length;
  var last = size - 4;

  var path = "M" + [points[0], points[1]];

  for (var i = 0; i < size - 2; i += 2) {
    var x0 = i ? points[i - 2] : points[0];
    var y0 = i ? points[i - 1] : points[1];

    var x1 = points[i + 0];
    var y1 = points[i + 1];

    var x2 = points[i + 2];
    var y2 = points[i + 3];

    var x3 = i !== last ? points[i + 4] : x2;
    var y3 = i !== last ? points[i + 5] : y2;

    var cp1x = x1 + ((x2 - x0) / 6) * tension;
    var cp1y = y1 + ((y2 - y0) / 6) * tension;

    var cp2x = x2 - ((x3 - x1) / 6) * tension;
    var cp2y = y2 - ((y3 - y1) / 6) * tension;

    path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
  }

  return path;
}
