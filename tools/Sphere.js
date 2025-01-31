class Sphere3D {
    constructor(x, y, rad, points = {}, factors = {}) {
        this.rad = rad;
        this.x = x;
        this.y = y;
        this.points = {
            color: points.color || "green",
            quantity: points.quantity || 200,
            light: points.light || false,
            size: points.size || 3,
            colorLight: points.colorLight || false,
            volumLight: points.volumLight ?? 0.5,
            reverse: points.reverse||false
        };
        this.factors = {
            factorX: factors.factorX ?? 0.001,
            factorY: factors.factorY ?? 0.001,
            factorZ: factors.factorZ ?? 0.001
        };

        this.scale = 200;
        this.color = this.points.color;
        this.quantity = this.points.quantity;
        this.size = this.points.size;
        this.rotateAngleX = 0;
        this.rotateAngleY = 0;
        this.rotateAngleZ = 0;
        this.spherePoints = this.generateSpherePoints();
        this.volumLight = this.points.volumLight;
        this.usingMouse = false;
        this.sensitivity = 0.002;
        this.lastMouseMove = Date.now();
        this.reverse = this.points.reverse
    }

    generateSpherePoints() {
        let points = [];
        const minDistanceSq = (this.size * 2) ** 2;
        const spatialHash = new Map();
        const cellSize = this.size * 2;

        for (let i = 0; i < this.quantity; i++) {
            let newPoint, isOverlapping;
            do {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                newPoint = [
                    this.rad * Math.sin(phi) * Math.cos(theta),
                    this.rad * Math.sin(phi) * Math.sin(theta),
                    this.rad * Math.cos(phi)
                ];
                const cellKey = this.getCellKey(newPoint, cellSize);
                isOverlapping = spatialHash.get(cellKey)?.some(existingPoint => {
                    const dx = newPoint[0] - existingPoint[0];
                    const dy = newPoint[1] - existingPoint[1];
                    const dz = newPoint[2] - existingPoint[2];
                    return dx * dx + dy * dy + dz * dz < minDistanceSq;
                });
            } while (isOverlapping);

            const cellKey = this.getCellKey(newPoint, cellSize);
            spatialHash.set(cellKey, [...(spatialHash.get(cellKey) || []), newPoint]);
            points.push(newPoint);
        }
        return points;
    }

    getCellKey(point, cellSize) {
        return `${Math.floor(point[0] / cellSize)},${Math.floor(point[1] / cellSize)},${Math.floor(point[2] / cellSize)}`;
    }

    rotate(point, angleX, angleY, angleZ) {
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        const cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);

        let [x, y, z] = point;
        let tempY = cosX * y - sinX * z;
        z = sinX * y + cosX * z;
        y = tempY;

        let tempX = cosY * x + sinY * z;
        z = -sinY * x + cosY * z;
        x = tempX;

        tempX = cosZ * x - sinZ * y;
        y = sinZ * x + cosZ * y;
        x = tempX;

        return [x, y, z];
    }

    project(point) {
        return [
            this.x + point[0] * this.scale / (point[2] + this.scale),
            this.y + point[1] * this.scale / (point[2] + this.scale)
        ];
    }

    drawSphere(ctx) {
        this.spherePoints.forEach(point => {
            const rotatedPoint = this.rotate(point, this.rotateAngleX, this.rotateAngleY, this.rotateAngleZ);
            const [x, y] = this.project(rotatedPoint);

            if (this.points.light) {
                const gradient = ctx.createRadialGradient(x, y, this.size, x, y, this.size + 10);
                const [r, g, b] = this.hexToRgb(this.points.colorLight || this.color);
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.volumLight})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, this.size + 10, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    updateRotation() {
        if (!this.usingMouse) {
            if (!this.reverse) {
                this.rotateAngleX += this.factors.factorX;
                this.rotateAngleY += this.factors.factorY;
                this.rotateAngleZ += this.factors.factorZ;
            }else{
                this.rotateAngleX -= this.factors.factorX;
                this.rotateAngleY -= this.factors.factorY;
                this.rotateAngleZ -= this.factors.factorZ;
            }
        }
    }

    autoRotate() {
        const loop = () => {
            this.updateRotation();
            requestAnimationFrame(loop);
        };
        loop();
    }

    initMouseMovement() {
        window.addEventListener('mousemove', (e) => {
            this.usingMouse = true;  // El mouse está en uso
            this.lastMouseMove = Date.now(); // Actualizamos el tiempo del último movimiento
            this.rotateAngleY += (this.reverse? -e.movementX:e.movementX) * this.sensitivity; // Movimiento horizontal
            this.rotateAngleX += (this.reverse? -e.movementY:e.movementY) * this.sensitivity; // Movimiento vertical
        },{once:true});

         // Si el mouse sale de la ventana (mouseleave), ponemos usingMouse en false
        window.addEventListener('mouseout', () => {
            this.usingMouse = false;
        });
    
        // Cada 500ms comprobamos si ha pasado más de 2 segundos desde el último movimiento
        setInterval(() => {
            if (Date.now() - this.lastMouseMove > 2000) {
                this.usingMouse = false; // Si ha pasado más de 2 segundos sin movimiento, desactivamos
            }
        }, 500);
    }

    hexToRgb(hex) {
        const colors = {
            "red": [255, 0, 0], "green": [0, 255, 0], "blue": [0, 0, 255],
            "yellow": [255, 255, 0], "cyan": [0, 255, 255], "magenta": [255, 0, 255],
            "black": [0, 0, 0], "white": [255, 255, 255], "gray": [128, 128, 128],
        };
        if (colors[hex.toLowerCase()]) return colors[hex.toLowerCase()];
        if (/^#[0-9A-F]{6}$/i.test(hex)) return [
            parseInt(hex.substring(1, 3), 16),
            parseInt(hex.substring(3, 5), 16),
            parseInt(hex.substring(5, 7), 16)
        ];
        return [0, 0, 0];
    }
    
}

export { Sphere3D };
