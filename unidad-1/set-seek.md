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
  frameRate(60); // más lento si quieres ver cómo se construye
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

