export function createPinTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Pin Shape
    ctx.beginPath();
    ctx.moveTo(64, 120);
    ctx.bezierCurveTo(64, 120, 20, 70, 20, 44);
    ctx.arc(64, 44, 44, Math.PI, 0); // Top arch
    ctx.bezierCurveTo(108, 70, 64, 120, 64, 120);
    ctx.fillStyle = '#ef4444'; // Red-500
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#991b1b'; // Dark Red Border
    ctx.stroke();
    
    // White Center
    ctx.beginPath();
    ctx.arc(64, 44, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}
