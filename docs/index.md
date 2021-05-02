# Desarrollo de Sistemas Informáticos 
## Práctica 9: Sistema de ficheros y creación de procesos en Node.js Tarea
### Autor: Adrián González Hernández
### Email: alu0101216775@ull.edu.es
### Fecha de entrega: 1/05/2021

* * *
<h2 align="center">Estado de sonarcloud</h2>

<p align="center">
    <a href="https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101216775">
        <img alt="SonarCloud Quality Gate" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101216775&metric=security_rating">
    </a>
    <a href="https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101216775">
        <img alt="SonarCloud Quality Gate" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101216775&metric=sqale_rating">
    </a>
</p>

## Introducción
Esta práctica tiene la finalidad de familiarizarse con el entorno de desarrollo de Node, la librería de ficheros fs y la API de procesos, especialmente spawn.
## Objetivos
* Familiarizarse con el entorno de desarrollo Node
* Mejorar el desarrollo con Typescript
* Controlar procesos con la API
* Usar el sistema de ficheros
* Usar el paquete yargs
* Generar documentación con typedoc
* Generar informe en Github Pages

* * *

## Ejercicio 1

El primer ejercicio solicitaba realizar una traza del siguiente código:

```typescript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

Para ello, se ha desarrollado una pequeña webapp haciendo uso de javascript y un documento HTML, mostrando las diferentes iteraciones hasta completar la traza.
Puede acceder a dicha traza [aquí](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101216775/traza), o consultar los ficheros individualmente en __docs/traza__ en el repositorio de github.

* * *

## Ejercicio 2

Este ejercicio pide crear un programa capaz de contar las líneas, palabras o caracteres de un fichero de texto, usando fs.

El directorio del ejercicio contiene lo siguiente:

* countFunctions.ts: Allí se encuentran las funciones para contar los elementos, tanto haciendo uso del pipe como sin él.
* initializeYargs.ts: Función encargada de controlar los parámetros recibidos y llamar a las funciones correspondientes.
* index.ts: Programa principal. Únicamente hace una llamada a initializeYargs
* text-examples: Directorio que contiene algunos archivos de prueba.

A continuación, se explicará un poco más en detalle cada una de las dos funciones de conteo de elementos:

### Función countWithoutPipe

Esta función, como su nombre indica, cuenta los elementos sin hacer uso del Pipe. Para ello, hace uso del comando spawn:

```typescript
const count = spawn('wc', [filename]);
```

A través de la propiedad stdout, se leen los datos obtenidos de spawn, y se va almacenando su contenido en una variable output:

```typescript
count.stdout.on('data', (element) => {
    output += element;
});
```

Finalmente, en el close, se crea un array donde se almacenan los elementos de output ya contados y separados, y se muestran los solicitados por el usuario:

```typescript
count.on('close', () => {
    const countArray = output.split(/\s+/);
    console.log(chalk.green(`Counting elements from ${filename}...\n\n`  
                + (lines ? `Number of lines: ${parseInt(countArray[1]) + 1}\n` : "") 
                + (words ? `Number of words: ${countArray[2]}\n` : "")
                + (characters ? `Number of characters: ${countArray[3]}\n` : "")));
})
```

### Función countWithPipe

Esta función tiene prácticamente el mismo comportamiento, pero con algunas variaciones para hacer uso del pipe. 
En lugar de usar un único spawn, se genera uno para cada elemento que se desee contar, usando el argumento correspondiente del comando wc.

Además, para indicar el tipo que se va a imprimir(por ejemplo, "Numero de lineas"), se genera otro proceso hijo con un comando echo.
Esto se hace para evitar que las líneas de salida se desordenen al tener el programa principal a la vez que el programa hijo haciendo uso de la consola de salida.

Por ejemplo, esto se haría para imprimir el número de líneas:

```typescript
if(lines) {
    var output = spawn('echo', ["-n", "Number of lines: "]);
    output.stdout.pipe(process.stdout);
    count = spawn('sh', ['-c',  `wc -l < ${filename}`])
    count.stdout.pipe(process.stdout);
}
```

Al pedir varios elementos, se obtiene la siguiente salida con el fichero ex4.txt:

_Number of lines: 6_
_Number of words: 21_
_Number of characters: 125_

Si se usara un console.log en lugar del primer echo, la salida sería la siguiente:

_Number of lines:_
_Number of words:_
_Number of characters:_
_6_
_21_
_125_

* * *

## Ejercicio 3

Este ejercicio se basa en la práctica anterior. Trata de observar los cambios producidos al directorio de un usuario que esta usando la aplicaciçon de notas. Para ello, se debe usar la función watch.

Para resolver este ejercicio, se ha creado la función _watchUserNotes_ encargada de vigilar el directorio que recibe por parámetro.

Lo que hace esta función es:

* Comprobar que exista la ruta
* Declarar dos variables booleanas
* Comprobar que esa ruta sea un directorio
* Leer el directorio, y lanzar error si no lo consigue
* Entrar en modo de escucha con la función watch

Una vez dentro del modo de escucha, se lee nuevamente el directorio. Si se detecta algún evento, se entra al condicional del tipo de evento correspondiente.

1. Si es de tipo rename, se comprueba la cantidad de ficheros leidos. Según el tipo de cambio, se indicará si se ha eliminado o añadido un fichero
2. Si es de tipo change, se comprueban las variables que se habían declarado previamente y se van cambiando en el flujo del programa. Si se detecta que efectivamente se ha modificado la nota, y no se ha añadido alguna o ha habido algún otro tipo de cambio, se muestra el mensaje correspondiente. Además, debido a la inestabilidad de la función watch, se hace uso de un setTimeout de 1 segundo antes de la siguiente llamda. Esto evita que el programa mande el mensaje de modificación dos veces ante un solo cambio, algo bastante habitual con esta función.

Esto se va repitiendo hasta que se cierra el programa.

* * *

## Ejercicio 4

Este ejercicio pide crear un wrapper para algunos comandos de unix de gestión de ficheros, haciendo uso de yargs y fs.

Se han implementado los siguientes comandos:

### ls

El comando ls de este programa funciona de forma muy similar al de las distribuciones linux. Si recibe un parametro --path mediante yargs, muestra los ficheros de dicha ruta. Si no es así, muestra los del directorio actual del usuario.

Para ello hace uso de la función readdirSync.

### mkdir

Este comando es muy sencillo. Comprueba si existe el directorio con existsSync, y si no es así, lo crea con mkdirSync.

### cat

Comprueba primero que la ruta exista, y que además no sea un directorio. De ser así, usa la función readFile de fs para mostrar su contenido.
En caso de tratarse de un directorio, el comando avisa de esto, y de que usará ls en su lugar, mostrando los archivos del directorio.

### rm

Para este comando se ha hecho uso de spawn, creando un proceso hijo encargado de eliminar el fichero/directorio con rm -rf.
Esto sólo se hará si el fichero/directorio existe.

### copy/move

El comando copy incluye también move. Lo que hace este comando es comprobar si existe la ruta de origen src. Una vez hecho esto, pueden pasar varias cosas según los parámetros recibidos mediante yargs.

* Si solo recibe los parámetros obligatorios, sólo se hará la copia si no existe nada en la carpeta de destino. En caso contrario, avisará de que el directorio ya existe, y de cómo hacer para sobreescribirlo.
* Si recibe el parámetro overwrite, hará la copia independientemente de si la carpeta destino existe o no, sobreescribiendola si fuera necesario.
* Si recibe el parámetro move, eliminará la carpeta de origen una vez se haya terminado la copia, y únicamente si esta se realiza correctamente.

* * *

## Controles de calidad con Sonar Cloud

La web Sonar Cloud permite hacer un seguimiento a la calidad del código, teniendo en cuenta diversos factores. Para esta práctica, se ha hecho especial hincapié a la calidad, la mantenibilidad y la seguridad, aunque SonarCloud incluye muchos más parámetros.

Se han añadido esas insignias a la documentación del código.

* * *

## Configuración de Github Pages

El último paso consiste en implementar GitHub Pages desde el repositorio. Para hacerlo, se debe acceder a la sección “settings” en el repositorio en GitHub. Una vez allí, en la zona “GitHub Pages” se debe hacer lo siguiente:

1. Habilitar GitHub pages en el repositorio
2. Seleccionar la rama de trabajo (en este caso, master) y la carpeta raíz (en este caso, /docs, ya que allí se encuentra el archivo index.md) y marcar save
3. Elegir un tema para la página. Una vez hecho, solo queda esperar unos segundos y acceder a la página que aparece para ver la web.

* * *

## Conclusiones

Pese a que Javascript y Typescript son lenguajes más bien orientados a la interactividad web, estos usos en el backend son cada vez más frecuentes, y a medida que sigan apareciendo herramientas y entornos como estos, probablemente acabarán tomando todo el terreno de otros lenguajes y sistemas como PHP. Además, la posibilidad de usar comandos del sistema desde Node facilita enormemente trabajar con ficheros, así como el uso de todo tipo de funcionalidades avanzadas mucho más complejas de programar de forma manual.
