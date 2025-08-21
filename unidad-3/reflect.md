# Unidad 3



## 🤔🤨🤨🤨🤨🤨🤨 Fase: Reflect
### Actividad 11
### Parte 1: recuperación de conocimiento (Retrieval Practice)

#### Escribe la ecuación vectorial de la segunda ley de Newton y explica cada uno de sus componentes.
Si no estoy mal es F = m*A en donde F es la fuerza, m la masa del objeto y A la aceleración que se tenga.
#### ¿Por qué es necesario multiplicar la aceleración por cero en cada frame del método update()?
Por que si no, frame a frame se acumularían y no aplicaríamos la fuerza pura como la queremos. Hay que "Resetearla" cada frame para poder aplicarla correctamente y generar el modelo que queremos.
#### Explica la diferencia entre paso por valor y paso por referencia cuando aplicamos fuerzas a un objeto.
Cuando le aplicamos las fuerzas a un objeto, normalmente estamos pasandole un parámetro force a la función applyforce, y eso es una referencia de la clase p5.Vector, que es afectada directamente si se llega a modificar en un método que la agarró como parámetro. Para evitar esto, podemos usar cosas como el copy. Que copia el VALOR de lo que se desee y lo guarda en otra variable, para poder manipular el valor a gusto sin afectar el objeto que se está referenciando.
#### ¿Cuál es la diferencia conceptual entre modelar fuerzas (como fricción, gravedad) y simplemente definir algoritmos de aceleración?
La diferencia más grande que veo es que las fuerzas se pueden acumular para poder sumarse las unas a las otras, y asi hacer una sumatoria de diferentes fuerzas que puedan actuar según las condiciones que queramos, cuando hacemos algoritmos de aceleración simplemente sería para sumarlo como en el motion 101.

### Parte 2: reflexión sobre tu proceso (Metacognición)

#### ¿Qué fue lo más desafiante en la Actividad 10 (problema de los n-cuerpos)? ¿El concepto creativo, la implementación de las fuerzas o la integración de la interactividad?
Definitivamente el concepto, la implementación de las fuerzas ya había visto como hacerla, pero el concepto y hacer que la obra haga ilusión a kalder fue duro. Cosas como hacer las hojas y jugar con sus formas fue desafiante, y requerí ayuda de la IA.
#### ¿Las fuerzas que modelaste produjeron el comportamiento que esperabas? Describe un momento “sorpresa” (esperado o inesperado) durante el desarrollo.
En el levy flight, a pesar de que yo dije que las hojas tenían que cambiar a color morado, yo pensé que cuando cambiaban a morado se quedaban asi, pero como eso se actualiza cada frame vuelven inmediatamente al amarillo azul o rojo, lo cual ocasionó un destello, decidí dejarlo asi pero definitivamente fue una sorpresa.
#### ¿Cómo ha cambiado tu forma de pensar sobre la “física” en el arte generativo después de esta unidad?
Me parece super impresionante como con tan pocas lineas de código, y esas fórmulas simplificadas se pueden lograr cosas tan organicas y que realmente funcionen, yo tenía al movimiento como algo un poco más complejo, pero en realidad modelar esto basado en física roza lo sencillo, y el libro de shiffman me parece que lo explica muy bien.
#### Si tuvieras una semana más, ¿Qué otras fuerzas te gustaría modelar o cómo mejorarías tu simulación del problema de los n-cuerpos?
Definitivamente haría todo más fluido, jugar un poco más con las formas de las hojas, pues si bien si varían con el noise, no varían tanto como me gustaría.

### Actividad 12


### Actividad 13
### Continuar: ¿Qué actividad o concepto de esta unidad te resultó más “revelador” para entender las fuerzas en el arte generativo?
Los primeros ejemplos faciles me revelaron el secreto, el metodo apply force con el viento y demás me resultó super útil para ver como se aplicaba. Y pues ya con el motion 101 en la cabeza fue cuestión de unir el rompecabezas.
### Dejar de hacer: ¿Hubo alguna actividad que te pareció redundante o menos efectiva para comprender el modelado de fuerzas?
Nada, todo good.
### Progresión conceptual: ¿El paso de manipular aceleración directamente (unidad 2) a modelar fuerzas (unidad 3) te pareció una progresión natural y efectiva? ¿Por qué?
Si, precisamente porque están relacionadas, me parece que el motion 101 y los algoritmos de aceleración son un buen abrebocas al modelado de fuerzas, no se me hizo dificil una vez entendida la aceleración.
### Conexión arte-física: ¿Cómo te ha ayudado esta unidad a ver la conexión entre conceptos físicos y expresión artística? ¿Te sientes más cómodo “jugando” con las leyes de la física en tus creaciones?
Poco a poco, aunque con la limetante de kalder pues me toco forzarme a mi mismo a hacer el guiño, entonces fue un reto un poco mayor a si hubiera sido libre.
### Comentario adicional: ¿Algo más que quieras compartir sobre tu experiencia explorando fuerzas en el arte generativo?
No, todo muy bien por ahora, seguimos avanzando.
