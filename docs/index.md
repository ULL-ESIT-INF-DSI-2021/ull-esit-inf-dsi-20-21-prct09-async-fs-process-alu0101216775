# Desarrollo de Sistemas Informáticos 
## Práctica 8: Aplicación de procesamiento de notas de texto
### Autor: Adrián González Hernández
### Email: alu0101216775@ull.edu.es
### Fecha de entrega: 25/04/2021

* * *
<h2 align="center">Estado de pruebas y cubrimiento</h2>

<p align="center">
    <a href="https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775/actions/workflows/node.js.yml">
        <img alt="Github Actions CI" src="https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775/actions/workflows/node.js.yml/badge.svg">
    </a>
    <a href="https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775?branch=main">
        <img alt="Coverage" src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775/badge.svg?branch=main">
    </a>
    <a href="https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775">
        <img alt="SonarCloud Quality Gate" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775&metric=alert_status">
    </a>
    <a href="https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775">
        <img alt="SonarCloud Quality Gate" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775&metric=sqale_rating">
    </a>
    <a href="https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775">
        <img alt="SonarCloud Quality Gate" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216775&metric=security_rating">
    </a>
</p>

## Introducción
Esta práctica tiene la finalidad de familiarizarse con el entorno de desarrollo de Node. Se busca crear un sistema de gestión de notas, haciendo uso de los paquetes **yargs** y **chalk**. Se seguirá una metodología TDD, se usarán github actions y se documentará el código con typedoc.

## Objetivos
* Familiarizarse con el entorno de desarrollo Node
* Mejorar el desarrollo con Typescript
* Realizar pruebas con TDD y medir el cubrimiento con Coveralls
* Usar los paquetes yargs y chalk
* Generar documentación con typedoc
* Lanzar github actions
* Generar informe en Github Pages

* * *

## El programa principal index.ts
El archivo index.ts es el encargado de ejecutar el programa. Genera un objeto de gestión del flujo de trabajo, y se lo manda como argumento a la función encargada de procesar los argumentos con yargs. Su código es únicamente el siguiente:

```typescript
import {ProgramFlowHandler} from './ProgramFlowHandler'
import {InitializeYargsCommands} from './initializeYargs'

let workflow: ProgramFlowHandler = new ProgramFlowHandler();
InitializeYargsCommands(workflow);
```

* * *

## La función InitializeYargsCommands

Documentación de typedoc accesible desde [aquí.](typedoc/modules/initializeyargs.html)

Esta función se encuentra en el archivo initializeYargs.ts. Se encarga de procesar los argumentos de entrada haciendo uso del paquete **yargs**.
Para este proyecto se han desarrollado un total de 5 comandos:

* add: Añade una nueva nota, si no existe
* remove: Elimina una de las notas
* Modify: Permite modificar uno o más campos de una nota
* List: Muestra todas las notas de un usuario concreto
* Read: Permite leer una nota

Cada uno de estos comandos recibe una serie de parámetros, que pueden ser obligatorios (título de la nota, usuario...) o no.
Para cada comando, la función se encarga de procesarlos y enviarlos de la forma más adecuada al controlador del sistema de ficheros. Esto se divide así para evitar que una misma función se encargue tanto de procesar argumentos como de la entrada y salida al sistema de archivos.

Un ejemplo de procesamiento de un comando es el siguiente:

```typescript
//Comando LIST: Usado para mostrar todas las notas de un usuario
yargs.command({
command: 'list',
describe: 'List user notes',
builder: {
    user: {
    describe: 'User who owns the notes',
    demandOption: true,
    type: 'string',
    },
},
handler(argv) {
    //Comprueba que el argumento requerido sea del tipo correcto
    if (typeof argv.user === 'string') {
    //Intenta mostrar las notas del usuario desde el gestor del flujo de trabajo
    workflow.listNotes(argv.user);
    }
},
}),
```

Este comando, llamado list, marcado como obligatorio(demandOption: true), gestiona en el handler si el tipo del argumento es el correcto. Si es así, lo manda al workfow, que es un objeto de la clase _ProgramFlowHandler_.

* * *

## Clase ProgramFlowHandler

Documentación de typedoc accesible desde [aquí.](typedoc/modules/programflowhandler.html)

Esta clase se encarga de gestionar las lecturas y escrituras al sistema de archivos, y notificar los errores que detecten estos procedimientos.
Para ello, la clase tiene las siguientes funciones:

* addNote(note: Note): Añade la nota recibida por parámetro al sistema de archivos. Comprueba que no exista, y si es necesario, genera el directorio de usuario para almacenarlo.
* deleteNote(note: string): Elimina la nota de la ruta pasada por parámetro, si ya existe. Gestiona los errores también.
* modifyNote(note: string, ntitle: string, nbody: string, ncolor: string): Modifica una nota, siempre y cuando exista y reciba algún parámetro a modificar.
* listNotes(user: string): Muestra todas las notas de un determinado usuario, haciendo uso de una lectura de directorios sincrona. Antes comprueba que dicho usuario tenga alguna nota.
* readNote(note: string): Lee una nota, mostrándola en su color con chalk. Gestiona los errores si la nota no existe.
* noteToJSON(note: Note): Convierte un archivo de la clase Note a un JSON, haciendo uso de la función JSON.stringlify.
* JSONtoNote(jsonnote: string): Convierte un archivo JSON a un objeto de la clase Note. Usa la función JSON.parse con algunas adaptaciones de formato.
* checkUserDirectory(username: string): Comprueba de forma síncrona que exista el directorio del usuario para almacenar notas. De no ser así, lo genera.
* checkIfFileExist(route: string): Comprueba de forma síncrona si ya existe una nota

Esta clase hace uso principalmente de la libreria fs y de la clase Note.

* * *

## Clase Note

Documentación de typedoc accesible desde [aquí.](typedoc/modules/note.html)

Clase encargada de almacenar de forma temporal las notas, y facilita el paso de parámetros y las lecturas.
Cuenta con 5 atributos, que son los que pueden recibirse desde la línea de comandos más la ruta donde se almacena en el sistema de archivos:

* title
* body
* user
* color
* route

Cuenta con los métodos get y set para cada uno de esos atributos.

* * *

## Principales problemas encontrados

Al incorporar varias funcionalidades nuevas, esta práctica ha generado varios problemas que han presentado dificultades a la hora de resolverse.

1. En un principio, la funcion initializeYargs estaba en la misma clase ProgramFlowHandler. Sin embargo, esto generaba varios problemas de cumplimiento de los principios SOLID. Además, se podían generar errores al acceder a los atributos de la clase desde los handler de yargs.

2. Los test de las funciones asíncronas también generaban muchos errores. Además, aquellos que no retornaban valores o generaban ficheros nuevos, como listNote() eran bastante complejos de testar con únicamente mocha y chai. Por ello, se ha añadido el paquete "sinon" para analizar las salidas de la consola y detectar errores o confirmaciones de forma automática.

* * *

## Integración continua con Github Actions

Para esta práctica se ha configurado una GitHub Action encargada de llevar a cabo la integración continua del código. Para ello, se ha creado la acción de CI en NodeJS en el repositorio de GitHub. Se ha añadido, además, un fichero llamado **node.js.yml** en el directorio **.github/workflows**, encargado de gestionar la acción.

Se ha añadido la insignia correspondiente al README del repositorio y a este informe.

* * *

## Cubrimiento del código con coveralls

El código tiene pruebas mediante TDD realizadas con mocha y chai, y cubrimiento con Istanbul (nyc). Haciendo uso de una Github Action y de la web coveralls, se recopila la información de cubrimiento en formato lcov y se envía a coveralls, pudiendo acceder a información al respecto.

El porcentaje de cubrimiento total es bajo ya que las líneas de control de errores de los bloques catch no son comprobadas para evitar hacer fallar otros test. Sin embargo, el cubrimiento de las funciones es del 100%.

Además, se añade una insignia a la documentación, indicando el porcentaje de código cubierto.

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

El uso de estas herramientas como Sonarcloud y coveralls ayuda bastante a controlar si el código está realmente listo para producción o no. Además, la infraestructura de desarrollo de Node está preparada para facilitar en gran medida el uso de toda clase de herramientas externas que ayudan mucho en estos aspectos.

Pese a que Javascript y Typescript son lenguajes más bien orientados a la interactividad web, estos usos en el backend son cada vez más frecuentes, y a medida que sigan apareciendo herramientas y entornos como estos, probablemente acabarán tomando todo el terreno de otros lenguajes y sistemas como PHP.
