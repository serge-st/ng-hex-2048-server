import { Layout, Point, Hex } from "./hex-grid.js";

// const layout = new Layout(Layout.flat, new Point(50, 50), new Point(300, 300));

const baseLayout = new Layout(Layout.flat, new Point(500, 500), new Point(500, 500));
const canvas = document.getElementById('hexCanvas');
canvas.width = 1000;
canvas.height = 1000 * baseLayout.orientation.f2;
const yPoint = 1000 * baseLayout.orientation.f2 / 2

const layout = new Layout(Layout.flat, new Point(500, 500), new Point(500, yPoint));
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
    const corners = layout.polygonCorners(hex);
    console.log('corners', corners);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    console.log('corners[0]', corners[0]);
    for (let i = 1; i < corners.length; i++) {
        ctx.lineTo(corners[i].x, corners[i].y);
        console.log(`corners[${i}]`, corners[i]);
    }
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "tomato";
    ctx.stroke();
}

hexes.forEach((hex, i) => drawHex(ctx, layout, hex, colors[i]));
