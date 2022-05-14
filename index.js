const svgContainer = document.getElementById('container');
const margin = { top: 12, right: 30, bottom: 12, left: 30 };

let viewBox = { x: 0, y: 0, w: 1000, h: 600 };
const width = viewBox.w - margin.left - margin.right;
const height = viewBox.h - margin.top - margin.bottom;

document.body.style.background = '#1e1e1e';

const svg = d3.select('#container')
    .append('svg')
    .attr('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`)
    .attr('width', window.innerWidth - margin.left - margin.right)
    .attr('height', window.innerHeight - margin.top - margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('color', '#e6e8ea')
    .attr('font-weight', 'bold')
    .attr('stroke-width', 2);

window.addEventListener('resize', function (event) {
    d3.select('svg').attr('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`)
        .attr('width', window.innerWidth - margin.left - margin.right)
        .attr('height', window.innerHeight - margin.top - margin.bottom)
});

const distance = width / 12;
const l = width / 40;
const lines = Array.from(Array(Math.ceil(width / distance))).map((_, i) => {
    const line = {
        x1: i * distance,
        x2: i * distance,
        y1: 0,
        y2: height
    }
    return line;
});


svg.append('g')
    .selectAll('lines')
    .data(lines).enter()
    .append('line')
    .attr('x1', d => d.x1)
    .attr('x2', d => d.x2)
    .attr('y1', d => d.y1)
    .attr('y2', d => d.y2)
    .attr('stroke', '#b0b8bf')
    .attr('stroke-width', 2);

const detectIntersection = (needle) => {
    const minX = Math.min(needle.x1, needle.x2);
    const maxX = Math.max(needle.x1, needle.x2);

    return !!lines.find(line => minX <= line.x1 && maxX >= line.x1);
}

let intersections = 0;
let needles = 0;

const generateNeedle = () => {
    const x = ((lines.length - 1) * distance) * Math.random();
    const y = height * Math.random();
    const angle = Math.PI * Math.random();

    const needle = {
        x1: x - (l * Math.sin(angle) / 2),
        x2: x + (l * Math.sin(angle) / 2),
        y1: y - (l * Math.cos(angle) / 2),
        y2: y + (l * Math.cos(angle) / 2)
    }

    return needle;
}

const needlesSvg = svg.append('g');

const calculatePi = () => {
    const p = intersections / needles;
    return 2 * l / (p * distance);
}

setInterval(() => {
    const needle = generateNeedle();
    needles += 1;
    if (detectIntersection(needle)) {
        intersections += 1;
    }
    console.log(calculatePi());
    console.log(needles);

    needlesSvg.append('line')
        .attr('x1', needle.x1)
        .attr('x2', needle.x2)
        .attr('y1', needle.y1)
        .attr('y2', needle.y2)
        .attr('stroke', '#8e32c2')
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', 1);
}, 100);
