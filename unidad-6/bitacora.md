# Evidencias de la unidad 6

### Actividad 1
<img width="1181" height="884" alt="image" src="https://github.com/user-attachments/assets/4e1371ac-6ae2-4843-b4f5-d62b3e6cbb92" />

#### Random angle per vector
Esta obra me gusta mucho por su manejo del color, y porque a pesar de que hay algunas curvas claramente visibles, la obra está llena de un aparente caos, y de cosas que no se me ocurren intuitivamente de donde salieron.

<img width="982" height="985" alt="image" src="https://github.com/user-attachments/assets/f5cc4850-a95a-44b5-b721-4d2a8e071347" />

#### Detail from Loxodography 0.26, 2019
De esta obra, contrario a la anterior, me gusta su consistencia,y que a pesar de que usa valores random logra una apariencia tan parecida a unas grietas.
#### Qué me inspira de su trabajo?
En lo personal siento que es un muy buen referente para tomar ideas, sus trabajos son muy brutales y orgánicos, y las ideas que se le ocurren con esos algoritmos, además de que lo documenta, son muy útiles como inspiración en obras. Me quedo con el manejo de colores que usa. Y su mezcla de técnicas en las obras.
### Actividad 2

<img width="917" height="352" alt="image" src="https://github.com/user-attachments/assets/c8a3e949-38e4-4c4e-b361-58f15865fb77" />

#### ¿Qué es una fuerza de dirección (steering force)?
Una steering force es un vector resultante de restar un vector de deseo y un vector velocidad, para que un vehiculo logre variar su dirección basado en decisiones, y se repita constantemente basandose en su propio estado.
#### ¿Qué diferencia tiene este tipo de fuerza con las que ya hemos estudiado en el contexto de la simulación de agentes?
A diferencia de aplicar una gravedad al objeto que queremos que se caiga, o una fuerza de atraccion entre 2 objetos. Con la steering force podemos hacer que nuestros vehiculos tomen decisiones y hagan acciones con base en ellas. Estas acciones se ven manifestadas con la herramienta de steering, que en este caso ayuda al vehiculo a moverse por el canvas dependiendo las decisiones que tome con respecto a si mismo y un objetivo en la vida.
#### ¿Qué relación tiene la steering force con Craig Reynolds y su trabajo en simulación de comportamiento animal?
Tiene relación pues se pueden personalizar los vehiculos, y con la steering force hacer que varién su movimiento según las decisiones, y asi se pueden replicar comportamientos como andar en manada, el miedo, la atracción, la cacería entre otros.

### Actividad 3
# Resumen Flowfields y Vehicles
**1. ¿Cómo se controla la resolución del campo de flujo (tamaño de las celdas)?**  
Se define en el constructor de `FlowField` con `this.resolution = r`. Al dividir el ancho y alto por `resolution` se obtienen las filas y columnas (`cols` y `rows`).  
- `resolution` grande → celdas grandes, campo más grueso.  
- `resolution` pequeño → celdas pequeñas, campo más detallado.  

---

**2. ¿Cómo se controlan la velocidad máxima (maxspeed) y la fuerza máxima (maxforce)?**  
En el constructor de `Vehicle` se reciben como parámetros:  
```js
this.maxspeed = ms;
this.maxforce = mf;
```
**maxspeed:** limita la magnitud de la velocidad (qué tan rápido se mueve el agente).

**maxforce:** limita la fuerza de dirección o aceleración (qué tan rápido puede girar o cambiar de rumbo).

**3. ¿Cómo determina el agente qué vector del campo seguir según su posición?**  
```js
let column = constrain(floor(position.x / this.resolution), 0, this.cols - 1);
let row    = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
return this.field[column][row].copy();
```
- La posición (x, y) del vehículo se divide por la resolución.

- Se aplica floor() para convertir a índices de la cuadrícula.

- Con esos índices se accede al vector correspondiente en this.field[column][row].

** 4. Una vez que tiene el vector del campo, ¿cómo lo usa para calcular la fuerza de dirección (steering)? **
En el método follow(flow)
```js
let desired = flow.lookup(this.position);
desired.mult(this.maxspeed);                  // velocidad deseada
let steer = p5.Vector.sub(desired, this.velocity); // diferencia
steer.limit(this.maxforce);                   // limitar fuerza máxima
this.applyForce(steer);
```

- El vector del campo se multiplica por maxspeed → velocidad deseada.

- Se calcula la diferencia con la velocidad actual → fuerza de dirección (steering).

- Esa fuerza se limita con maxforce.

- Se aplica la fuerza resultante a la aceleración del vehículo.

# Parámetros y Variables Clave en Flowfields y Vehicles

## FlowField
- **resolution** → tamaño de cada celda del campo de flujo.  
- **cols** → número de columnas (`width / resolution`).  
- **rows** → número de filas (`height / resolution`).  
- **lookup(pos)** → función que devuelve el vector de flujo correspondiente a la posición `pos`.

## Vehicle
- **position** → posición actual del vehículo.  
- **velocity** → velocidad actual (vector).  
- **acceleration** → acumulación de fuerzas (se reinicia cada frame).  
- **maxspeed** → velocidad máxima que puede alcanzar el vehículo.  
- **maxforce** → fuerza máxima de giro o cambio de dirección.  
- **applyForce(force)** → suma la fuerza a la aceleración.  
- **update()** → actualiza posición y velocidad del vehículo.  
- **follow(flow)** → consulta el campo de flujo y ajusta el movimiento del vehículo.

## Steering (dirección)
- **desired** → vector deseado (dirección del flujo en la posición).  
- **steer** → vector de corrección (`desired - velocity`), limitado por `maxforce`.

## Experimento (modificaciones)
Con 1 de resolución y cambio en el patrón de flujo para usar una onda de seno:

<img width="867" height="325" alt="image" src="https://github.com/user-attachments/assets/bf44b434-d744-46b5-8665-8d129ae7f2ae" />

#### Nota: La aplicación se petó pero se ve muy cool.

Ahora con 2 de resolución se ve asi:
<img width="884" height="320" alt="image" src="https://github.com/user-attachments/assets/2b7db9d9-6f16-4737-b29c-78e64b95f28d" />

Bastante brutal en mi opinion pero el proceso sigue muy lento.

### Este es el código:

```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Flow Field Following
class FlowField {
  constructor(r) {
    this.resolution = r;
    //{!2} Determine the number of columns and rows.
    this.cols = width / this.resolution;
    this.rows = height / this.resolution;
    //{!4} A flow field is a two-dimensional array of vectors. The example includes as separate function to create that array
    this.field = new Array(this.cols);
    for (let i = 0; i < this.cols; i++) {
      this.field[i] = new Array(this.rows);
    }
    this.init();
  }
  // The init() function fills the 2D array with vectors
 init() {
  let xScale = 0.2; // frecuencia en x
  let yScale = 0.2; // frecuencia en y
  for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
      let x = i * this.resolution;
      let y = j * this.resolution;
      let angle = sin(x * xScale) * TWO_PI * 0.5 + cos(y * yScale) * TWO_PI * 0.5;
      this.field[i][j] = p5.Vector.fromAngle(angle);
    }
  }
}
  // Draw every vector
  show() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let w = width / this.cols;
        let h = height / this.rows;
        let v = this.field[i][j].copy();
        v.setMag(w * 0.5);
        let x = i * w + w / 2;
        let y = j * h + h / 2;
        strokeWeight(1);
        line(x, y, x + v.x, y + v.y);
      }
    }
  }

  //{.code-wide} A function to return a p5.Vector based on a position
  lookup(position) {
    let column = constrain(floor(position.x / this.resolution), 0, this.cols - 1);
    let row = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
    return this.field[column][row].copy();
  }
}
```

Con 32 de resolucion ya se veia bastante mas separado el flowfield, pero tuve que forzar seguridad en el codigo porque me arrojaba un error del array.

<img width="876" height="326" alt="image" src="https://github.com/user-attachments/assets/260cc813-0ed4-4311-913e-5cf802f99ef9" />


Para arreglar el error relacionado al arreglo de filas y columnas utilice esto:
```
 this.cols = Math.ceil(width / this.resolution);
    this.rows = Math.ceil(height / this.resolution);
```
Asi la division por resolucion daba un entero.
### Actividad 4
### Explica las reglas: para cada una de las tres reglas, explica con tus propias palabras:
### Separación (Separation): evitar el hacinamiento con vecinos cercanos.

 - ¿Cuál es el objetivo de la regla?
 - ¿Cómo calcula el agente la fuerza de dirección correspondiente? (describe la lógica general, ej: “Calcula un vector apuntando lejos de los vecinos demasiado cercanos”).
 
### Alineación (Alignment): dirigirse en la misma dirección promedio que los vecinos cercanos.
 - ¿Cuál es el objetivo de la regla?
 - ¿Cómo calcula el agente la fuerza de dirección correspondiente? (describe la lógica general, ej: “Calcula un vector apuntando lejos de los vecinos demasiado cercanos”).
 
### Cohesión (Cohesion): moverse hacia la posición promedio de los vecinos cercanos.
- ¿Cuál es el objetivo de la regla?
- ¿Cómo calcula el agente la fuerza de dirección correspondiente? (describe la lógica general, ej: “Calcula un vector apuntando lejos de los vecinos demasiado cercanos”).

### Identifica parámetros clave: localiza en el código las variables que controlan:
El radio (o distancia) de percepción (perceptionRadius o similar) que define quiénes son los “vecinos”. A veces también hay un ángulo de percepción.
Los pesos o multiplicadores que determinan la influencia relativa de cada una de las tres reglas al combinarlas.
La velocidad máxima (maxspeed) y la fuerza máxima (maxforce) de los agentes (similar a Flow Fields).

### Experimenta con modificaciones: realiza al menos una de las siguientes modificaciones en el código, ejecuta y describe el efecto observado en el comportamiento colectivo del enjambre:
Cambia drásticamente el peso de una de las reglas (ej: pon la cohesión a cero, o la separación muy alta).
Modifica significativamente el radio de percepción (hazlo muy pequeño o muy grande).
Introduce un objetivo (target) que todos los boids intenten seguir (usando una fuerza de seek) además de las reglas de flocking, y ajusta su influencia.

## Apply: Actividad 5





