# Unidad 3


## 🤔 Fase: Reflect

### Actividad 11
#### Parte 1: recuperación de conocimiento (Retrieval Practice)

#### Escribe la ecuación vectorial de la segunda ley de Newton y explica cada uno de sus componentes.
F = M*A en donde F es fuerza, M es masa y A es aceleración. También se puede entender como que la aceleración puede considerarse como la suma de fuerzas dividida la masa.
#### ¿Por qué es necesario multiplicar la aceleración por cero en cada frame del método update()?
Es para resetearla, y que no se acumule de maneras raras, si estamos modelando fuerzas y queremos lo s efectos que estamos buscando, hay que setear a 0 para volver a aplicarle una fuerza el siguiente frame, de no ser asi, habría un comportamiento erratico y poco predecible.
#### Explica la diferencia entre paso por valor y paso por referencia cuando aplicamos fuerzas a un objeto.
Cuando aplicamos fuerzas a un objeto estamos usando una función que recibe un parametro force, ese parámetro es una referencia directa al valor que se está usando, y si se llega a modificar desde la función en la que lo llamamos se afectaría el original, por eso usamos metodos como el Vector.Copy, que nos permite pasarle el * VALOR * de la referencia a un objeto nuevo, y con ese si podemos jugar, pues solo pasamos el valor y no estamos referenciando directamente el original.
#### ¿Cuál es la diferencia conceptual entre modelar fuerzas (como fricción, gravedad) y simplemente definir algoritmos de aceleración?
La diferencia principal que veo es que las fuerzas se pueden acumular, al aplicar algoritmos de aceleración tenemos ese unico algoritmo y ya, pero al modelar las fuerzas podemos usar el principio de la sumatoria de fuerzas para usar varias y ver esos comportamientos acumuulados.

#### Parte 2: reflexión sobre tu proceso (Metacognición)

¿Qué fue lo más desafiante en la Actividad 10 (problema de los n-cuerpos)? ¿El concepto creativo, la implementación de las fuerzas o la integración de la interactividad?
Definitivamente el guiño a Daniel Kalder, todo el marco de movimiento ya lo teníamos pero encontrar algo que hiciera referencia al escultor dinámico fue retador, al final decidí irme por lo simple y mantener los colores y formas, a la vez de suavizar el movimiento.
¿Las fuerzas que modelaste produjeron el comportamiento que esperabas? Describe un momento “sorpresa” (esperado o inesperado) durante el desarrollo.
En su mayoría si, pues me basé mucho en el ejemplo del sol, pero claramente no todo es perfecto y surgen cosas inesperadas, en este caso fue con el Levy Flight, en donde en mi cabeza con una probabilidad baja las hojas (bodies) iban a cambiar con una probabilidad baja a color morado, y se iban a quedar asi, lasitmosamente como eso se llama en el draw cada frame, solo dura 1 frame ese cambio, y al final se quedó viendo como un efecto morado raro, como si cada hoja estuviera buggeada en la matrix.
¿Cómo ha cambiado tu forma de pensar sobre la “física” en el arte generativo después de esta unidad?

Si tuvieras una semana más, ¿Qué otras fuerzas te gustaría modelar o cómo mejorarías tu simulación del problema de los n-cuerpos?

### Actividad 12
Intercambia la URL de tu bitácora con un compañero.
Analiza su Actividad 10 (problema de los n-cuerpos). Ejecuta su simulación, lee su concepto y revisa su código.
En tu propia bitácora, escribe una retroalimentación constructiva para tu compañero, evaluando:
Claridad del Concepto: ¿La obra visual refleja la inspiración en las esculturas cinéticas de Calder y el problema de los n-cuerpos?
Implementación de Fuerzas: ¿Se aplican correctamente las leyes de Newton? ¿Las fuerzas se acumulan apropiadamente?
Creatividad en el Modelado: ¿El modelado de fuerzas es interesante y genera comportamientos únicos?
Calidad de la Interactividad: ¿La interacción permite explorar diferentes aspectos del sistema de fuerzas?
Conversa con tu compañero sobre las obras que cada uno creó. En tu bitácora, comenta:
¿Qué fue lo que más te llamó la atención del trabajo de tu compañero?
¿Qué aprendiste de su enfoque para modelar fuerzas?
¿Qué técnica o idea de su implementación te gustaría aplicar en tus futuros proyectos?

### Actividad 13
Continuar: ¿Qué actividad o concepto de esta unidad te resultó más “revelador” para entender las fuerzas en el arte generativo?
Dejar de hacer: ¿Hubo alguna actividad que te pareció redundante o menos efectiva para comprender el modelado de fuerzas?
Progresión conceptual: ¿El paso de manipular aceleración directamente (unidad 2) a modelar fuerzas (unidad 3) te pareció una progresión natural y efectiva? ¿Por qué?
Conexión arte-física: ¿Cómo te ha ayudado esta unidad a ver la conexión entre conceptos físicos y expresión artística? ¿Te sientes más cómodo “jugando” con las leyes de la física en tus creaciones?
Comentario adicional: ¿Algo más que quieras compartir sobre tu experiencia explorando fuerzas en el arte generativo?
