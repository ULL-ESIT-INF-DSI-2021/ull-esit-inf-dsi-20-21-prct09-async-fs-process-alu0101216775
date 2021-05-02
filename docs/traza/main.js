document.getElementById('next').addEventListener('click', nextStep);
document.getElementById('prev').addEventListener('click', prevStep);
let count = 0;

function nextStep() {
    if (count < 24) count++;
    print();
}

function prevStep() {
    if(count > 0) count--;
    print();
}

function print() {
    let counter = document.getElementById('counter');
    let info = document.getElementById('info');
    let llamadas = document.getElementById('llamadas');
    let eventos = document.getElementById('eventos');
    let manejadores = document.getElementById('manejadores');
    let output = document.getElementById('output');

    if(count === 0) counter.innerHTML = `---------------Estado inicial----------------`;
    else counter.innerHTML = `---------------Paso ${count}----------------`;

    info.innerHTML = "";
    llamadas.innerHTML = "";
    eventos.innerHTML = "";
    manejadores.innerHTML = "";
    output.innerHTML = "";

    switch(count) {
        case 0: info.innerHTML = "Todo se encuentra vacío";
                break;

        case 1: info.innerHTML = "Al iniciarse el proceso, main pasa a la pila de llamadas";
                llamadas.innerHTML = "main";
                break;

        case 2: info.innerHTML = "Se comienza la ejecución de main. Se encuentra una llamada a access, por lo que se añade a la pila de llamadas.";
                llamadas.innerHTML = "main <br> access";
                break;

        case 3: info.innerHTML = "Access es un evento, por lo que se quita de la pila de llamadas y se añade a eventos.";
                llamadas.innerHTML = "main";
                eventos.innerHTML = "access";
                break;

        case 4: info.innerHTML = "Main termina de ejecutarse y sale.";
                eventos.innerHTML = "access";
                break;

        case 5: info.innerHTML = "Access va a la cola de manejadores.";
                manejadores.innerHTML = "Manejador access";
                break;

        case 6: info.innerHTML = "El manejador de access va a la pila de llamadas.";
                llamadas.innerHTML = "Manejador access";
                break;
        
        case 7: info.innerHTML = "Se ejecuta el manejador. Si no hay errores, se añade a la pila el console.log.";
                llamadas.innerHTML = "console.log(`Starting to watch file ${filename}`)<br>Manejador access";
                break;

        case 8: info.innerHTML = "Se llama al console.log. Va al output";
                llamadas.innerHTML = "Manejador access";
                output.innerHTML = "Starting to watch file helloworld.txt";
                break;

        case 9: info.innerHTML = "Se introduce watch en la pila de llamadas";
                llamadas.innerHTML = "watch(process.argv[2])<br>Manejador access";
                output.innerHTML = "Starting to watch file helloworld.txt";
                break;

        case 10: info.innerHTML = "Se ejecuta watch desde la pila de llamadas, y sale.";
                llamadas.innerHTML = "Manejador access";
                output.innerHTML = "Starting to watch file helloworld.txt";
                break;

        case 11: info.innerHTML = "Se introduce watcher.on en la pila de llamadas.";
                llamadas.innerHTML = "watcher.on('change', ()...) <br>Manejador access";
                output.innerHTML = "Starting to watch file helloworld.txt";
                break;

        case 12: info.innerHTML = "Watcher es un evento, por lo que pasa al registro.";
                llamadas.innerHTML = "Manejador access";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt";
                break;

        case 13: info.innerHTML = "El console.log siguiente pasa a la pila de llamadas.";
                llamadas.innerHTML = "console.log(`File ${filename} is no longer watched`)<br>Manejador access";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt";
                break;

        case 14: info.innerHTML = "El console.log se ejecuta y va al output.";
                llamadas.innerHTML = "Manejador access";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched";
                break;

        case 15: info.innerHTML = "Termina el manejador de access. El programa queda en espera de los eventos.";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched";
                break;

        case 16: info.innerHTML = "Editamos el fichero helloworld.txt de forma externa. Watch.on lo detecta, y manda su manejador a la cola.";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                manejadores.innerHTML = "manejador de watcher.on";
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched";
                break;

        case 17: info.innerHTML = "El manejador pasa a la pila de llamadas.";
                llamadas.innerHTML = "manejador de watcher.on";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched";
                break;

        case 18: info.innerHTML = "El console.log del manejador pasa a la pila de llamadas.";
                llamadas.innerHTML = "console.log(`File ${filename} has been modified somehow`)<br>manejador de watcher.on";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched";
                break;

        case 19: info.innerHTML = "El console.log del manejador se ejecuta. Pasa al output. El manejador termina.";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched<br>File helloworld.txt has been modified somehow";
                break;

        case 20: info.innerHTML = "Se edita el fichero de nuevo. Se manda el manejador de watcher a la cola.";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                manejadores.innerHTML = "manejador de watcher.on";
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched<br>File helloworld.txt has been modified somehow";
                break;

        case 21: info.innerHTML = "El manejador pasa a la pila de llamadas.";
                llamadas.innerHTML = "manejador de watcher.on";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched<br>File helloworld.txt has been modified somehow";
                break;

        case 22: info.innerHTML = "El console.log del manejador pasa a la pila de llamadas.";
                llamadas.innerHTML = "console.log(`File ${filename} has been modified somehow`)<br>manejador de watcher.on";        
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched<br>File helloworld.txt has been modified somehow";
                break;

        case 23: info.innerHTML = "El console.log del manejador se ejecuta. Pasa al output. El manejador termina.";
                eventos.innerHTML = "watcher.on('change', ()...)"; 
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched<br>File helloworld.txt has been modified somehow<br>File helloworld.txt has been modified somehow";
                break;

        case 24: info.innerHTML = "Se cierra el programa. Se vacía el registro de eventos.";
                output.innerHTML = "Starting to watch file helloworld.txt<br>File helloworld.txt is no longer watched<br>File helloworld.txt has been modified somehow<br>File helloworld.txt has been modified somehow";
                break;            
    }
}