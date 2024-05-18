import Big from 'big.js'

const n1 = 0.1
const n2 = 0.2
console.log(`standard JS: ${n1} + ${n2} = ${n1 + n2}`)

const b1 = Big(n1)
console.log(`Big.js: ${b1} + ${n2} = ${b1.plus(n2)}`)
console.log('')

const coordToPixelJS = {
    f0: 3.0 / 2.0,
    f1: 0.0,
    f2: Math.sqrt(3.0) / 2.0,
    f3: Math.sqrt(3.0),
}
console.log(`standard JS coordToPixel: ${JSON.stringify(coordToPixelJS)}`)

const coordToPixelBig = {
    f0: Big(3.0).div(2),
    f1: Big(0.0),
    f2: Big(3.0).sqrt().div(2.0),
    f3: Big(3.0).sqrt(),
}

console.log(`Big.js coordToPixel: ${JSON.stringify(coordToPixelBig)}`)
console.log('')


const gridWidth = 100

const offsetJS = {
    x: gridWidth / 2,
    y: gridWidth * coordToPixelJS.f2 / 2
};

console.log(`standard JS offset: ${JSON.stringify(offsetJS)}`)

const offsetBig = {
    x: Big(gridWidth).div(2),
    y: Big(gridWidth).times(coordToPixelBig.f2).div(2)
};

console.log(`Big.js offset: ${JSON.stringify(offsetBig)}`)
console.log('')
