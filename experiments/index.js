import { Layout, Point, Hex } from "./hex-grid.js";

// const layout = new Layout(Layout.flat, new Point(50, 50), new Point(300, 300));

const baseLayout = new Layout(Layout.flat, new Point(500, 500), new Point(500, 500));
const canvas = document.getElementById('hexCanvas');
canvas.width = 1000;
console.log('canvas.width', canvas.width);
canvas.height = 1000 * baseLayout.orientation.f2;
console.log('canvas.height', canvas.height);

const xOriginOffset = canvas.width / 2; // where is the middle hex drawn on the x-axis
const yOriginOffset = canvas.width  * baseLayout.orientation.f2 / 2 // where is the middle hex drawn on the y-axis

const layout = new Layout(Layout.flat, new Point(500, 500), new Point(xOriginOffset, yOriginOffset));
console.log(JSON.stringify(layout, null, 2));
const hexes = [
    new Hex(0, 0, 0),
    // new Hex(0, -1, 1),
    // new Hex(1, -1, 0),
    // new Hex(1, 0, -1),
    // new Hex(0, 1, -1),
    // new Hex(-1, 1, 0),
    // new Hex(-1, 0, 1),
];

const colors = [
    'tomato',
    'lime',
    'lightgreen',
    'lightyellow',
    'lightgray',
    'lightcoral',
    'lightcyan',
]

const ctx = canvas.getContext('2d');

function drawHex(ctx, layout, hex, color) {
    // HEX TO PIXEL:
    // Calculated using q and r coordinates.
    // x coordinate:
    //      x = f0 * q + f1 * r
    // y coordinate:
    //      y = f2 * q + f3 * r
    console.log('Hex coord', { q: hex.q, r: hex.r });
    console.log('Orientation', { f0: layout.orientation.f0, f1: layout.orientation.f1, f2: layout.orientation.f2, f3: layout.orientation.f3 });

    const x = layout.orientation.f0 * hex.q + layout.orientation.f1 * hex.r;
    console.log('x', x);
    const y = layout.orientation.f2 * hex.q + layout.orientation.f3 * hex.r;
    console.log('y', y);
    console.log(`x and y origin offsets:`, { x: xOriginOffset, y: yOriginOffset });

    console.log(`final coordinates`, { x: x + xOriginOffset, y: y + yOriginOffset });

    

    const corners = layout.polygonCorners(hex);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    console.log('rightmost corner', 'corners[0]', corners[0]);
    for (let i = 1; i < corners.length; i++) {
        console.log('other corners are drawn clockwise from the rightmost corner')
        ctx.lineTo(corners[i].x, corners[i].y);
        console.log(`corners[${i}]`, corners[i]);
    }
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "tomato";
    ctx.stroke();

    // Draw dot at the center
    const center = layout.hexToPixel(hex);
    console.log('center', center);
    ctx.beginPath();
    ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI, false); // Draw a circle with radius 5
    ctx.fillStyle = 'black';
    ctx.fill();
}

hexes.forEach((hex, i) => drawHex(ctx, layout, hex, colors[i]));
