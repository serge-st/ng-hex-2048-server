class Hex {
    q: number;
    r: number;
    s: number;

    constructor(q: number, r: number, s: number) {
        this.q = q;
        this.r = r;
        this.s = s;
    }
}

function cubeAdd(hex1: Hex, hex2: Hex): Hex {
    return new Hex(hex1.q + hex2.q, hex1.r + hex2.r, hex1.s + hex2.s);
}

function getHexesInRange(center: Hex, radius: number): Hex[] {
    const results: Hex[] = [];
    for (let q = -radius; q <= radius; q++) {
        console.log(`q: ${q}, radius: ${radius}`)
        console.log(`let r = Math.max(${-radius}, ${-q - radius}): ${Math.max(-radius, -q - radius)}`)
        console.log(`Math.min(${radius}, ${-q + radius}): ${Math.min(radius, -q + radius)}`)
        console.log(``)
        for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
            console.log(`>>> r: ${r} <= ${Math.min(radius, -q + radius)}`)
            const s = -q - r;
            console.log(`>>> s: ${s} = -${q} - ${r}`)
            results.push(cubeAdd(center, new Hex(q, r, s)));
        }
    }
    return results;
}

const centerHex = new Hex(0, 0, 0);
const range = 1;
const hexesInRange = getHexesInRange(centerHex, range);
// console.log(hexesInRange);
