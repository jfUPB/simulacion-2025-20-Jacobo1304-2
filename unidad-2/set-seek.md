# Unidad 2

## 🔎 Fase: Set + Seek
### Actividad 1
¿Cómo funciona la suma dos vectores en p5.js?
Funciona medante el método .add, que mediante una referncia directa al vector entre parentesis, se lo añade al vector del inicio (position.add(velocity)
¿Por qué esta línea position = position + velocity; no funciona?
Porque en Javascript no existe una sobrecarga directa para vectores con esta librería, asi que tenemos que usar el método de arriba.

### Actividad 2 
Retransformemos el walker:
¿Qué tuviste que hacer para hacer la conversión propuesta?
Como en el ejemplo anterior se usó velocidad, decidi hacerlo con un vector posicion y un vector dirección. Utilizando un .add se le añade a position los valores de la referencia dirección, y se logra muy bien el efecto walker.
Muestra el código que utilizaste para resolver el ejercicio.
```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let direccion;
let position;

function setup() {
  createCanvas(640, 240);
  walker = new Walker();
  background(255);
}
function draw() {
  walker.step();
  walker.show();
}
class Walker {
  constructor() {
    direccion = createVector(0, 0);
    position = createVector(width / 2, height / 2);
  }
  show() {
    stroke(0);
    point(position);
  }
  step() {
    const choice = floor(random(4));
    if (choice == 0) {
      direccion.x = 1;
      direccion.y = 0;
      position.add(direccion);
    } else if (choice == 1) {
      direccion.x = -1;
      direccion.y = 0;
      position.add(direccion);
    } else if (choice == 2) {
      direccion.x = 0;
      direccion.y = 1;
      position.add(direccion);
    } else {
      direccion.x = 0;
      direccion.y = -1;
      position.add(direccion);
    }
  }
}
```
### Actividad 3
```js
let position;

function setup() {
    createCanvas(400, 400);
    position = createVector(6,9);
    console.log(position.toString());
    playingVector(position);
    console.log(position.toString());
    noLoop();
}

function playingVector(v){
    v.x = 20;
    v.y = 30;
}

function draw() {
    background(220);
    console.log("Only once");
}
```
¿Qué resultado esperas obtener en el programa anterior?
Un draw que solo salga una vez, y la modificación de un vector, en donde por consola se muestran los valores iniciales y luego son cambiados.
¿Qué resultado obtuviste?
Lo mismo de arriba, se logra ver en consola como cambian los valores al mantener una referencia directa y modificar el original. Mientras que cuando se crea una copia, y se modifica la misma, no genera cambios en el vector original.
Recuerda los conceptos de paso por valor y paso por referencia en programación. Muestra ejemplos de este concepto en javascript.
Un buen ejemplo de paso por referencia es el siguiente.

¿Qué tipo de paso se está realizando en el código?
En este código se realiza un paso por referencia, en donde la función recibe como parametro la referencia del objeto en meoria, y modifica el objeto desde ahi.
¿Qué aprendiste?
Aprendi que javascript es un lenguaje un poco mañoso, que no siempre te avisa de los errores que puedes cometer. También los conceptos de paso por valor y por referencia. Y el metodo copy del vector

### Actividad 4:
¿Para qué sirve el método mag()? Nota que hay otro método llamado magSq(). ¿Cuál es la diferencia entre ambos? ¿Cuál es más eficiente?
Un metodo nos da la magnitud con raiz cuadrada, y el otro devuelve la magnitud pura, el mas eficiente es magSq porque se ahorra la operación de la raiz cuadrada.
¿Para qué sirve el método normalize()?
Normalize nos ayuda a escalar los componentes del vector para que su magnitud sea 1. Tiene un método estático que genera una copia de este objeto que estamos normalizando.
Te encuentras con un periodista en la calle y te pregunta ¿Para qué sirve el método dot()? ¿Qué le responderías en un frase?
Para determinar si dos vectores son perpendiculares entre si señor periodista.
El método dot() tiene una versión estática y una de instancia. ¿Cuál es la diferencia entre ambas?
La versión estática del método dot, crea una copia del objeto, y almacena el escalar resultante en una nueva variable normalmente.

Ahora el mismo periodista curioso de antes te pregunta si le puedes dar una intuición geométrica acerca del producto cruz. Entonces te pregunta ¿Cuál es la interpretación geométrica del producto cruz de dos vectores? Tu 
respuesta debe incluir qué pasa con la orientación y la magnitud del vector resultante.
La orientación es un vector perpendicular al plano formado por ambos vectores, y su magnitud será el área del paralelogramo formado por los 2 vectores iniciales.
¿Para que te puede servir el método dist()?
Pra conocer la distancia entre 2 puntos, o un punto y el origen, y asi poner condiciones o hacer que el programa reacciones a ello.
¿Para qué sirven los métodos normalize() y limit()?
Limit nos sirve para hacer que la magnitud no sobre pase de un punto en especifico, y serviría para controlar esa parte. Normalize, como se dijo anteriormente hace la magnitud 1. Esto podría mantener la magnitud igual cuando se necesite.
