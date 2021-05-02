import {fileSystemWorkflowHandler} from './fileSystemWorkflowHandler'
import {InitializeYargsCommands} from './initializeYargs'

let workflow: fileSystemWorkflowHandler = new fileSystemWorkflowHandler;
InitializeYargsCommands(workflow);