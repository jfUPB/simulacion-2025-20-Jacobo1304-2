# Unidad 1

## 🤔 Fase: Reflect
### Describe la diferencia fundamental entre la aleatoriedad generada por random() y la apariencia de aleatoriedad del Ruido Perlin (noise()). ¿En qué tipo de situación usarías cada una?
La aleatoriedad generada por random es una aleatoriedad pura, que puede sacar cualquier valor entre un rango especificado. La aleatoriedad generada por el noise es una aleatoriedad controlada, cuyo objetivo es mostrar algo más orgánico y controlado con valores aleatorios, pero no hace cambios abruptos, se mantiene en valores cercanos a medida que pasa el tiempo y se le pasa un parámetro tipo t.
### Explica con tus palabras qué es una distribución de probabilidad. ¿Qué diferencia visual produce una caminata aleatoria con una distribución uniforme versus una con una distribución normal?
La distribución de probabilidad se basa en tener resultados en base a una media, y una desviación estandar entre valores de esa media, haciendo que los valores se decanten más hacia un sitio, muy diferente a la uniforme en donde todos los valores tienen la misma probabilidad de salir. En una caminata aleatoria con distribución uniforme no se debería poder ver un patrón muy claro, pues en realidad todos los resultados pueden salir uniformemente. En una distribución normal, los valores saldrán a lo largo de una media, con una desviación estandar de ese valor, que genera esa clásica forma de campana. En el caso de la caminata, la distribución normal marcaría una clara tendencia de dirección, según la media que se coloque.
### ¿Cuál es el papel de la aleatoriedad en el arte generativo? Menciona al menos dos funciones distintas que cumple
1. Obras únicas poco replicables.
2. Diseños impredecibles y resultados bacanos a veces inesperados.
### Piensa en tu obra final (Actividad 08). Describe uno de los conceptos de aleatoriedad que usaste y explica por qué fue una elección adecuada para lograr el efecto que buscabas.
Uno de los conceptos de aleatoriedad que use fue un Lévy flight, en donde cualquiera de los 4 vectores con una probabilidad de 1/400 se dividía en 3 más en la funcion de branching(), siendo un suceso que no pasa siempre, pero le da dinamismo y un evento de sorpresa al programa. Aqui está el pedazo del código:
```js
  // Posibilidad de ramificar (a gusto del que juegue)
    if (random() < 1 / 400) {
      this.branch();
    }
  }
  show() {
    stroke(255);
    point(this.pos.x, this.pos.y);
  }
  branch() {
    let currentAngle = this.dir.heading();
    let angle1 = currentAngle + radians(45);
    let angle2 = currentAngle - radians(45);

    walkers.push(new Walker(this.pos.x, this.pos.y, angle1));
    walkers.push(new Walker(this.pos.x, this.pos.y, angle2));
  }
}
```
### ¿Qué es un “paseo” o “caminata” (walk) en el contexto de la simulación? ¿Qué característica particular tiene una caminata de tipo “Lévy flight”?
Paseo o caminata es una simulación en donde una particula se va moviendo por la pantalla describiendo un camino. Para la que la particula camina se suelen usan valores aleatorios, y se van marcando puntos donde va pasando la particula para registrar como ha caminado. Su dirección puede variar con valores aleatorios uniformes o decantarse hacía algun lado con probabilidades desiguales. El hecho innegable es que un sabio una vez dijo: "Caminante no hay camino, se hace camino al andar..." En el levy flight, simplemente se añade una funcion extra al código en donde con una probabilidad baja, el caminante hace un salto grande para cambiar de posicion, y asi evitar el "oversampling"  (Camino que se sobreEscribe), algo que suele pasar si se deja puramente a la particula andar con los pasos aleatorios.
### Parte 2
### ¿Cuál fue el concepto más abstracto o difícil de “visualizar” para ti en esta unidad? ¿Qué hiciste para finalmente comprenderlo?
Definitivamente el noise, al final para comprenderlo leí la documentación y entendí que era una función interna del programa, y que se le pasaba un parametro de tiempo, que se iba aumentando, para lograr esa variación con respecto al tiempo.
### Describe un momento durante el desarrollo de tu obra final (Actividad 08) en el que un “error” o un resultado inesperado te llevó a una idea creativa interesante.
En el momento de estar modificando valores de ruido para la generación de mis vectores, logré ver que si era de -PI hasta PI el mapeo de esos valores. Se logran bastantes curvas que dan un resultado interesante.
### Al combinar diferentes técnicas de aleatoriedad, ¿Cuál fue el mayor desafío? ¿La interacción entre los sistemas, el control de los parámetros, el rendimiento?
El desafío fue en realidad sabe como y en donde implementar cada técnica, y ademas de eso el control del rendimiento. Pues con el levyflight y mi sistema de ramificación no controlaba la eliminacion de ramas y despues de un rato petaba.
### Si tuvieras que empezar la Actividad 08 de nuevo, ¿Qué harías de manera diferente basándote en lo que sabes ahora?
Controlar el rendimiento, aplicar el noise de manera correcta. Y simplemente evitar cambios tan bruscos.

### Actividad 10:
Se analizo el trabajo de Nicolas Isaza, basado en una abeja que recoge polen. 
### Dirígete a la entrada de la Actividad 08: creación de obra generativa de tu compañero. Lee su concepto, interactúa con su sketch y analiza su código.

### Basándote en la rúbrica para la actividad 08 evalúa el trabajo del compañero y escribe un comentario de retroalimentación constructiva. Esto lo harás en tu bitácora de aprendizaje.
El código hace propiamente uso de randoms como el noise, el walker, y random. Se pudo haber hecho un poco más interactiva como algo para controlar la abeja pero en general está muy bien, inclusive los colores se gestionan de forma aleatoria. También le recomendé al compañero usar Levy flight a veces para dar dinamismo y sorpresa. Pero el uso de las nubes y el movimiento de la abeja se ve muy bien, además de los diseños utilizados.
### Conversa con tu compañero sobre su obra y tu feedback. Escucha sus reflexiones y comparte tus propias ideas.
Conversamos 👍.

### Actividad 11: feedback
### Continuar: ¿Qué actividad, ejemplo o explicación de esta unidad te resultó más reveladora o útil para tu aprendizaje? ¿Qué deberíamos mantener sí o sí?
Claramente se tendría que mantener el libro de The nature of code, y lo que se podría ir cambiando semestre a semestre claramente es el ejemplo del estudiante para analizar la aleatoriedad.
### Dejar de hacer: ¿Hubo alguna actividad o concepto que te pareció redundante, confuso o menos útil? ¿Hay algo que eliminarías o cambiarías por completo?
Ninguna me pareció menos útil o redundante, la que menos me gustó fue la distrubución normal, pues no se por que después de procesos estocásticos me acabó cayendo mal ese tema, pero eso ya es personal, si fue util ver como se usaba.
### Empezar a hacer: ¿Qué te faltó en esta unidad? ¿Quizás más ejemplos de artistas, más desafíos técnicos, más teoría? ¿Qué idea tienes para hacerla mejor?
Los ejemplos de artistas siempre son bacanos, tal vez integrar videitos, o aleatoriedad en juegos / experiencias interactivas conocidas sería bacano.
### Balance Teoría-Práctica: ¿Cómo sentiste el equilibrio entre analizar los ejemplos del texto guía y ponerte a programar tus propios sketches? Explica tu respuesta.
Es un buen equilibrio, aunque a veces uno está perdido en el diseño y no sabe que hacer con la aleatoriedad, al final llegan ideas, y dandole play al p5 y viendo lo que va apareciendo el cerebro empieza a trabajar y a desarrollar ideas.
### Comentario Adicional: ¿Hay algo más que quieras compartir sobre tu experiencia en esta unidad?
Me gustó el resultado final de la actividad 8, se arman figuras interesantes de la aleatoriedad.
