/**
 * Programa principal. Inicializa un flujo de trabajo, y llama a la función encargada de procesar los argumentos de la línea de comandos.
 */

import {ProgramFlowHandler} from './ProgramFlowHandler'
import {InitializeYargsCommands} from './initializeYargs'

let workflow: ProgramFlowHandler = new ProgramFlowHandler();
InitializeYargsCommands(workflow);