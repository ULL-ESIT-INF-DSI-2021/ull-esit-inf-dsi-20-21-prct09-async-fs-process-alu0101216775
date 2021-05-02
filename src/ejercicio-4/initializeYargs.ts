import * as yargs from 'yargs';

import {fileSystemWorkflowHandler} from './fileSystemWorkflowHandler'

/**
 * Procesa los parámetros recibidos
 * @param workflow 
 */
export function InitializeYargsCommands(workflow : fileSystemWorkflowHandler): void {
    yargs.command({
        command: 'ls',
        describe: 'Print all elements in a directory',
        builder: {
            route: {
                describe: 'Route to print. If it is not set, shows current directory',
                demandOption: false,
                type: 'string',
            },
        },
        handler(argv) {
            let route: string = ".";
            if(typeof argv.route === 'string') {
                route = argv.route;
            }
            workflow.ls(route);
        },
    }),
    yargs.command({
        command: 'mkdir',
        describe: 'Creates a new directory',
        builder: {
            route: {
                describe: 'Route where new directory should be created',
                demandOption: true,
                type: 'string',
            },
        },
        handler(argv) {
            if(typeof argv.route === 'string') {
                let route: string = argv.route;
                workflow.mkdir(route);
            }
        },
    }),
    yargs.command({
        command: 'cat',
        describe: 'Reads a file',
        builder: {
            route: {
                describe: 'Route to read',
                demandOption: true,
                type: 'string',
            },
        },
        handler(argv) {
            if(typeof argv.route === 'string') {
                let route: string = argv.route;
                workflow.cat(route);
            }
        },
    }),
    yargs.command({
        command: 'rm',
        describe: 'Removes a file or directory',
        builder: {
            route: {
                describe: 'Path to remove',
                demandOption: true,
                type: 'string',
            },
        },
        handler(argv) {
            if(typeof argv.route === 'string') {
                let route: string = argv.route;
                workflow.rm(route);
            }
        },
    }),
    yargs.command({
        command: 'copy',
        describe: 'Copies/moves a file or directory',
        builder: {
            src: {
                describe: 'Source Path',
                demandOption: true,
                type: 'string',
            },
            dst: {
                describe: 'Destination Path',
                demandOption: true,
                type: 'string',
            },
            move: {
                describe: 'If set, deletes src after making the copy',
                demandOption: false,
                type: 'boolean',
            },
            overwrite: {
                describe: 'If set, forces the copy even if dst already exists',
                demandOption: false,
                type: 'boolean',
            },
        },
        handler(argv) {
            if(typeof argv.src === 'string' && typeof argv.dst === 'string') {
                let src: string = argv.src, dst: string = argv.dst, move: boolean = false, overwrite: boolean = false;
                if(argv.overwrite == true) overwrite = true;
                if(argv.move == true) move = true;
                workflow.copy(src, dst, overwrite, move);
            }
        },
    }).parse();
}