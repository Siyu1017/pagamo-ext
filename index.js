function canvasClarifier(canvas, ctx, width, height) {
    const originalSize = {
        width: (width ? width : canvas.offsetWidth),
        height: (height ? height : canvas.offsetHeight)
    }
    var ratio = window.devicePixelRatio || 1;
    canvas.width = originalSize.width * ratio;
    canvas.height = originalSize.height * ratio;
    ctx.scale(ratio, ratio);
    ctxScale = ratio;
    if (originalSize.width != canvas.offsetWidth || originalSize.height != canvas.offsetHeight) {
        canvas.style.width = originalSize.width + 'px';
        canvas.style.height = originalSize.height + 'px';
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvasClarifier(canvas, ctx);

const hexagonSize = 80;
const borderRadius = 10;
const gradientColors = ['#FF69B4', '#33CC33'];


// Draw the hexagon with border radius using curves
function drawHexagon(ctx, x, y, size, borderRadius, gradientColors) {
    var position = { x, y };
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const x = size * Math.cos(angle) + position.x;
        const y = size * Math.sin(angle) + position.y;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            const controlX = (size - borderRadius) * Math.cos(angle - 0.1) + position.x;
            const controlY = (size - borderRadius) * Math.sin(angle - 0.1) + position.y;
            ctx.quadraticCurveTo(controlX, controlY, x, y);
        }
    }

    const gradient = ctx.createLinearGradient(position.x - size, position.y - size, position.x + size, position.y + size);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);

    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#fff'
    ctx.strokeRect(position.x - size, position.y - size, size, size);
}

drawHexagon(ctx, canvas.width / 2, canvas.height / 2, hexagonSize, borderRadius, gradientColors);

// Add a border
ctx.strokeStyle = '#000'; // black border
ctx.lineWidth = 2;
ctx.stroke();