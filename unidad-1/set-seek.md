# Unidad 1

## 🔎 Fase: Set + Seek

### Actividad 01:
Piensa y describe en una sola frase y en tus propias palabras cómo la aleatoriedad influye en el arte generativo.
### Respuesta:
La aleatoriedad ayuda con la originalidad y generación de patrones unicos, poco replicables de una sesión a otra.

### Actividad 02:
Luego de ver el trabajo de Sofía piensa y escribe en TUS PROPIAS palabras:

Cuál es el papel de la aleatoriedad en su obra.
Ayuda a la generación de los colores y el posicionamiento de las lineas (direccion hacia donde se mueve cuando suena), desde lo que pude visualizar.
Según tu perfil profesional, cómo se aplica el concepto de aleatoriedad en el tipo de proyectos que desarrollas. Ilustra tu respuesta con ejemplos concretos.
La aleatoriedad en los videojuegos se aplica mucho en el genero roguelite, y también puede ser usada como mecánica en general  en el entorno de los videojuegos, darle a un jugador la premisa de que algo puede pasar o tal vez no pueden generar decisiones interesantes y demás. También me interesaría ver como juntor aleatoriedad con audio, pues también me interesa esa parte, para hacer visuales reactivas a los sonidos, con un componente aleatorio. 

### Actividad 03:
<img width="512" height="594" alt="image" src="https://github.com/user-attachments/assets/eb57197f-ce06-422b-b25b-a727986541fa" />

Con esta modificacion quería pintar algunos puntos rojos y después todo de colores si es posible, pero no funciono por algun error de código.
Despues de ayudarme con chatGPT logré entender que era lo que no estaba pasando, y despues de corregirlo logré obtener este pequeño pájaro de colores 
<img width="1711" height="629" alt="image" src="https://github.com/user-attachments/assets/dee92fdf-a28f-4d8a-98e3-1e7fcd7200a5" />

Y luego como un efecto adicional un brillo con un circulo mas grande que resplandezca en cada particula. 
<img width="1718" height="711" alt="image" src="https://github.com/user-attachments/assets/35e46fbc-4caa-4569-87bd-96d6c3d781d8" />

### Actividad 4
Se analizaron ejemplos como estos con probabilidad uniforme:

<img width="1733" height="657" alt="image" src="https://github.com/user-attachments/assets/4d2ca085-9b3a-4752-a53e-a70f127e46c9" />
En tus propias palabras cuál es la diferencia entre una distribución uniforme y una no uniforme de números aleatorios.
Una distribución uniforme daría efectos "realistas" en donde normalmente pase lo que se espera, y en el caso de estos rectangulos por ejemplo se llene como se llenaría un tanque de agua:
<img width="1100" height="870" alt="image" src="https://github.com/user-attachments/assets/84f1ce73-a6be-4f15-ac9d-275d9e6f0f0d" />
En cambio con una no uniforme se pueden condicionar la generación de numeros para que los valores se muevan alrededor de algo deseado, seguiría siendo aleatorio, pero se controlarían para que se controlen a través de una media y asi poder llegar a generaciones intereseantes o jugar con ello.

Modifica el código de la caminata aleatoria para que utilice una distribución no uniforme, favoreciendo el movimiento hacia la derecha.
<img width="1598" height="614" alt="image" src="https://github.com/user-attachments/assets/a4cf3eea-b93f-4e9d-ad3a-d1c1fbbdf7be" />
Aqui se le agrega un random extra con probabilidad 50% 50%, si es 0, se va para la derecha, y si es 1 se va para la izquierda, entonces favorece la derecha pues la derecha ya tenía una probabilidad de salir.

### Actividad 5 : Distribución normal.
En este ejercicio se cambiaron los circulos por una cantidad fija de rectangulos transparentes que se van pintando de color rojo poco a poco segun una distribución normal:
<img width="645" height="411" alt="{3202A01C-2B94-440F-AE47-26BF582C28C6}" src="https://github.com/user-attachments/assets/eeb79959-91b9-4472-9e85-f1d77d40bb4a" />

El código para ello es el siguiente:
``` js
let rectCount = 100;
let rectWidth;
let opacities = [];

function setup() {
  createCanvas(640, 240);
  rectWidth = width / rectCount;

  // Inicializar opacidades en 0
  for (let i = 0; i < rectCount; i++) {
    opacities[i] = 0;
  }

  noStroke();
  frameRate(60);
}

function draw() {
  // Distribución normal centrada en la mitad del canvas
  let x = randomGaussian(width / 2, width / 10); // desvío: width/8 ≈ 80
  let index = floor(map(x, 0, width, 0, rectCount));

  // Asegurarse de que el índice esté en el rango válido
  index = constrain(index, 0, rectCount - 1);

  // Aumentar la opacidad del rectángulo seleccionado
  opacities[index] = min(opacities[index] + 1, 255);

  // Dibujar todos los rectángulos
  for (let i = 0; i < rectCount; i++) {
    fill(255, 0, 0, opacities[i]); // rojo con opacidad variable
    rect(i * rectWidth, 0, rectWidth, height);
  }
}
```

### Actividad 6
A continuación una variación del walker con un easter egg personalizable, que sale 1 de cada 500 veces, apareciendo un texto y dando un salto más grande.
<img width="880" height="334" alt="{69996CF4-A03D-4AEB-8B3C-6397ACC8961B}" src="https://github.com/user-attachments/assets/2bb75a4d-3616-4a72-81e3-fbf133f292c5" />
Al principio traté de usar una imagen para el easter egg y esperaba que apareciera por 1 segundo como una eventualidad, pero decidi hacerlo con texto. Y al final si funcionó.
Código:
```
let walker;
let showEasterEgg = false;
let easterEggStartTime = 0;
let soundEffect;



function setup() {
  createCanvas(640, 240);
  walker = new Walker();
  background(0);
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(255, 0, 0);
}

function draw() {
  // Fondo translúcido para efecto de rastro
  fill(0, 10);
  noStroke();
  rect(0, 0, width, height);

  walker.step();
  walker.show();

  // Mostrar el texto "Easter egg" si está activado
  if (showEasterEgg) {
    fill(255, 0, 0, 200); // rojo brillante
    text("Easter egg", width / 2, height / 2);

    // Verificamos si ha pasado 1 segundo
    if (millis() - easterEggStartTime > 1000) {
      showEasterEgg = false;
    }
  }
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    let r = random(200, 255);
    let g = random(200, 255);
    let b = random(200, 255);
    fill(r, g, b, 100);
    noStroke();
    ellipse(this.x, this.y, 8, 8);
  }

  step() {
    // Movimiento normal
    let stepSize = 1;

    // Probabilidad de 1 en 100 para un salto tipo Levy
    if (floor(random(500)) === 1) {
      stepSize = random(50, 100); // Salto grande
      showEasterEgg = true;
      easterEggStartTime = millis(); // Iniciar temporizador
    }

    // Movimiento aleatorio
    this.x += random(-stepSize, stepSize);
    this.y += random(-stepSize, stepSize);

    // Limitar dentro del canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
}
```
### Actividad 7
El campo de flujo con ruido perlin: 
Aprovechando la suavidad que puede dar el ruido perlin, y evitar campos bruscos, me interesó hacer algo como una masa moviendose o un campo fluctuando en partes individuales, me decidí por la segundo y me puse manos a la obra, esperando tener algo que parezca organico cambiando valores suavemente. Con ayuda de chatgpt trabajamos y logramos lo siguiente...
#### Resultado
<img width="911" height="369" alt="{7E0714B5-10B9-4916-8219-29C1ED958C56}" src="https://github.com/user-attachments/assets/853fb6fd-265d-4f8d-9472-8ceeffff53f7" />
El siguiente es un codigo con lineas en una cuadricula, que van variando su rotación en z en base a un ruido perlin. Y junto a un fondo transparente que da el efecto de desvanecimiento o una "cola" logra un efecto muy bacano de un campo que va fluctuando con la rotación de esas lineas.
Aqui el código:
```
let cols, rows;
let spacing = 20;
let zoff = 0;

function setup() {
  createCanvas(640, 240);
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  background(0);
  stroke(255, 100); // líneas blancas semitransparentes
}

function draw() {
  background(0, 20); // fondo semitransparente para dejar rastros suaves
  let xoff = 0;

  for (let x = 0; x < cols; x++) {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      // Obtener ángulo desde ruido Perlin
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);

      // Coordenadas del punto
      let px = x * spacing;
      let py = y * spacing;

      push();
      translate(px, py);
      rotate(v.heading());
      strokeWeight(1);
      line(0, 0, spacing, 0); // dibujar una línea pequeña en la dirección del vector
      pop();

      yoff += 0.1;
    }
    xoff += 0.1;
  }

  zoff += 0.01; // animar suavemente el ruido en el tiempo
}
```

