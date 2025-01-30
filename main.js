import { Sphere3D } from "./tools/Sphere.js";

const canva = document.getElementById('cube');
const ctx = canva.getContext('2d');

// Configurar el tamaño del canvas
canva.width = window.innerWidth;
canva.height = window.innerHeight;

// Coordenadas del centro del canvas
const centerX = canva.width / 2;
const centerY = canva.height / 2;

// Radio de las esferas
const radius = 400;
const radius2 = 150;
const radius3 = 50;
const pointsCount = 150; // Número de puntos en la esfera

// Crear las esferas
const sphere = new Sphere3D(centerX, centerY, radius, { color: 'green', quantity: pointsCount, size: 4, light:true, volumLight: 0.3});

const sphere2 = new Sphere3D(centerX, centerY, radius2, { color: 'blue', quantity: pointsCount,light:true, size: 4, colorLight:"#33fff3", volumLight: 0.3});

const sphere3 = new Sphere3D(centerX, centerY, radius3, { color: 'red', quantity: pointsCount,light:true, size: 4, volumLight: 0.2,}, 
    {factorX:0.01, factorY:0.01});

// Función de animación para actualizar todas las esferas
function animate() {
    ctx.clearRect(0, 0, canva.width, canva.height); // Limpiar el canvas

    sphere.updateRotation();
    sphere2.updateRotation(true);
    sphere3.updateRotation();

     // Actualizar las rotaciones de cada esfera
    sphere2.initMouseMovement();
    sphere.initMouseMovement();

    // Dibujar las tres esferas
    sphere.drawSphere(sphere.spherePoints, ctx);
    sphere2.drawSphere(sphere2.spherePoints, ctx);
    sphere3.drawSphere(sphere3.spherePoints, ctx);

    requestAnimationFrame(animate); // Continuar con la animación
}

// Iniciar la animación
animate();
