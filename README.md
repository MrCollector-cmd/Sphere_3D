<<<<<<< HEAD
# Sphere_3D
Herramienta para la creacion de interfaces graficas animadas con esferas 3D
=======
# Points Sphere 3D
Para la creación y personalización de esferas con puntos de 3 dimensiones.

## Información de uso

Para empezar, necesitamos inicializar un canvas y tiene 3 formas de uso.

A la hora de inicializamos el objeto con la clase **Sphere3D** y le pasamos con máxima importancia los siguientes parámetros

-> **x**, **y** : son la posición en el canvas donde quieren que aparezca la esfera.

-> **radius** : es el radio de la esfera que quieren crear

```javascript
    // Mínima cantidad de datos para la creación de la esfera
    const sphere = new Sphere3D(x,y,radius)
```
### Modos de animado y dibujo

Para empezar, existe la opción de dibujar la esfera usando el siguiente método con los siguientes parámetros.

-> **sphere.spherePoints** : este es un array que se inicializa cuando se crea el objeto y tiene las posiciones de todos los puntos.

-> **context** : es el contexto del canvas que están utilizando.

```javascript
    // Método de dibujo
    sphere.drawSphere(sphere.spherePoints,context)
```

Para animar la esfera es necesario tener un **loop** que ayude a actualizar los datos en pantalla, para esta demostración vamos a hacer una función **loop** algo rudimentaria.

```javascript
    function loop(){
        // Código para actualización//
        ctx.clearRect(0, 0, canva.width, canva.height); // Limpiar el canvas

        /////////////////////////////
        requestAnimationFrame(loop)
    }
    // Inicializamos el loop
    loop()
```
Ahora, existen 2 formas de Animación, **Auto** y **Follow**...

Para utilizar la manera de animación **Auto** solo hay que agregar un método antes del método de dibujo para actualizar los parámetros de posición de la esfera 

```javascript
    function loop(){
        // Código para actualización//
        ctx.clearRect(0, 0, canva.width, canva.height); // Limpiar el canvas
        
        // Método de actualización de movimiento
        sphere.updateRotation();
        // sphere.updateRotation(true); cuando se le coloca "true" de parametro, la actualizaciones hacen que la esfera rote para el lado contrario

        // Método de dibujo
        sphere.drawSphere(sphere.spherePoints,context)

        /////////////////////////////
        requestAnimationFrame(loop)
    }
    // Inicializamos el loop
    loop()
```

Ahora para agregar la manera de animación **Follow** solo hay que agregar un método que se encarga de seguir el movimiento del mouse

```javascript
    function loop(){
        // Código para actualización//
        ctx.clearRect(0, 0, canva.width, canva.height); // Limpiar el canvas
        
        // Método de actualización de movimiento siguiendo el puntero del mouse
        sphere.initMouseMovement();

        // Método de dibujo
        sphere.drawSphere(sphere.spherePoints,context)

        /////////////////////////////
        requestAnimationFrame(loop)
    }
    // Inicializamos el loop
    loop()
```
Estas 2 animaciones se pueden usar **juntas o por separado**.

#### Formas de modificación

Se puede modificar tanto la vista de los puntos como la rotación de la esfera de la siguiente manera.

```javascript
    const points = { 
        color: 'green', // Color de los puntos (opcional)
        quantity: 300, // cantidad de puntos que rodean la esfera (opcional)
        size: 4, // Dimensiones de los puntos (opcional)
        light:true, // Iluminación de los puntos (opcional)
        volumLight: 0.4 // Cantidad de iluminación de los puntos (opcional)
        colorLight: "#33fff3", //Color de la luz (opcional)
    }
    const factors = {
        factorX: 0.001, // Velocidad de rotación eje (opcional)
        factorY: 0.001, // Velocidad de rotación eje Y (opcional)
        factorZ: 0.001, // Velocidad de rotación eje Z (opcional)
    }
    const sphere = new Sphere3D(x,y,radius,points,factors)
```
>>>>>>> 6c97901 (firstVersion)
