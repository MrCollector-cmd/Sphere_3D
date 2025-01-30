class Sphere3D {
    constructor(x, y, rad, 
        points = { color: "green", quantity: 200, light: false, size: 3, colorLight: false, volumLight: 0.5}, 
        factors = {factorX: 0.001, factorY: 0.001, factorZ: 0.001}) {
        this.rad = rad;
        this.x = x;
        this.y = y;
        this.points = points;
        this.factors = factors;
        this.scale = 200;
        this.color = this.points.color??"green"
        this.quantity = this.points.quantity??200
        this.size = this.points.size??3
        this.rotateAngleX = 0;
        this.rotateAngleY = 0;
        this.rotateAngleZ = 0;
        this.spherePoints = this.generateSpherePoints();
        this.volumLight = this.points.volumLight ?? 0.5;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lerpFactor = 0.1; 
    }

    generateSpherePoints() {
        let points = [];
        const minDistance = this.size * 2;
    
        for (let i = 0; i < this.quantity; i++) {
            let newPoint;
            let isOverlapping;
    
            do {
                let theta = Math.random() * Math.PI * 2;
                let phi = Math.random() * Math.PI;
    
                let x = this.rad * Math.sin(phi) * Math.cos(theta);
                let y = this.rad * Math.sin(phi) * Math.sin(theta);
                let z = this.rad * Math.cos(phi);
    
                newPoint = [x, y, z];
    
                isOverlapping = points.some(existingPoint => {
                    let distance = Math.sqrt(
                        Math.pow(newPoint[0] - existingPoint[0], 2) +
                        Math.pow(newPoint[1] - existingPoint[1], 2) +
                        Math.pow(newPoint[2] - existingPoint[2], 2)
                    );
                    return distance < minDistance;
                });
    
            } while (isOverlapping);
    
            points.push(newPoint);
        }
    
        return points;
    }

    rotateX(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [x, y, z] = point;
        return [x, cos * y - sin * z, sin * y + cos * z];
    }

    rotateY(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [x, y, z] = point;
        return [cos * x + sin * z, y, -sin * x + cos * z];
    }

    rotateZ(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [x, y, z] = point;
        return [cos * x - sin * y, sin * x + cos * y, z];
    }

    project(point) {
        const [x, y, z] = point;
        return [this.x + x * this.scale / (z + this.scale), this.y + y * this.scale / (z + this.scale)];
    }

    drawSphere(points, ctx) {
        points.forEach(point => {
            let rotatedPoint = this.rotateX(point, this.rotateAngleZ);
            rotatedPoint = this.rotateY(rotatedPoint, this.rotateAngleX);
            rotatedPoint = this.rotateZ(rotatedPoint, this.rotateAngleY);

            let [x, y] = this.project(rotatedPoint);

            if (this.points.light) {
                ctx.save();
                const gradient = ctx.createRadialGradient(x, y, this.size, x, y, this.size + 10);
                let rgbColor;
                if (!this.points.colorLight) {
                    rgbColor = this.hexToRgb(this.color);
                } else {
                    rgbColor = this.hexToRgb(this.points.colorLight);
                }

                const [r, g, b] = rgbColor;
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.volumLight})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, this.size + 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(x, y, this.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            } else {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(x, y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    updateRotation(negative = false) {
        if (negative) {
            this.rotateAngleX -= this.factors.factorX ?? 0.001;
            this.rotateAngleY -= this.factors.factorY ?? 0.001;
            this.rotateAngleZ -= this.factors.factorZ ?? 0.001;
        } else {
            this.rotateAngleX += this.factors.factorX ?? 0.001;
            this.rotateAngleY += this.factors.factorY ?? 0.001;
            this.rotateAngleZ += this.factors.factorZ ?? 0.001;
        }
    }

    hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        const colorNames = {
            "red": [255, 0, 0],
            "green": [0, 255, 0],
            "blue": [0, 0, 255],
            "yellow": [255, 255, 0],
            "cyan": [0, 255, 255],
            "magenta": [255, 0, 255],
            "black": [0, 0, 0],
            "white": [255, 255, 255],
            "gray": [128, 128, 128],
            "orange": [255, 165, 0],
            "pink": [255, 192, 203],
            "purple": [128, 0, 128],
            "brown": [165, 42, 42],
            "lime": [0, 255, 0],
            "indigo": [75, 0, 130],
            "violet": [238, 130, 238],
        };
    
        if (colorNames[hex.toLowerCase()]) {
            return colorNames[hex.toLowerCase()];
        }
    
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            hex = hex.replace(/^#/, '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            return [r, g, b];
        }
    
        console.error(`Error: Color inválido: ${hex}`);
        return [0, 0, 0];
    }

    initMouseMovement() {
        window.addEventListener('mousemove', (e) => {
            // Calculamos la posición del mouse
            const deltaX = e.clientX;
            const deltaY = e.clientY;

            // Interpolamos suavemente la posición con el factor Lerp
            this.mouseX += (deltaX - this.mouseX) * this.lerpFactor;
            this.mouseY += (deltaY - this.mouseY) * this.lerpFactor;

            // Calculamos las rotaciones basadas en la posición del mouse
            this.rotateAngleX = (this.mouseY - window.innerHeight / 2) * 0.001; // Aumentar el efecto con un factor
            this.rotateAngleY = (this.mouseX - window.innerWidth / 2) * 0.001; // Aumentar el efecto con un factor
            this.rotateAngleZ = (this.mouseX + this.mouseY) * 0.001; // Aumentar el efecto de la rotación Z
        });
    }
}

export { Sphere3D };
