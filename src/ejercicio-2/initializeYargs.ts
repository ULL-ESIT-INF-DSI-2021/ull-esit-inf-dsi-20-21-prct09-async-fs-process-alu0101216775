import {spawn} from 'child_process'

import * as yargs from 'yargs';
import * as chalk from 'chalk';

import {countWithPipe, countWithoutPipe} from './countFunctions'

export function InitializeYargsCommands(): void {
    yargs.command({
        command: 'count',
        describe: 'Counts elements in a file',
        builder: {
            filename: {
                describe: 'Working file',
                demandOption: true,
                type: 'string',
            },
            lines: {
                describe: 'If true, count lines',
                demandOption: false,
                type: 'boolean',
            },
            words: {
                describe: 'If true, count words',
                demandOption: false,
                type: 'boolean',
            },
            characters: {
                describe: 'If true, count characters',
                demandOption: false,
                type: 'boolean',
            },
            usePipe: {
                describe: 'If true, it uses pipe method',
                demandOption: false,
                type: 'boolean',
            },
        },
        handler(argv) {
            if(typeof argv.filename === 'string') {
                console.log("in");
                let lines: boolean = false, words: boolean = false, characters: boolean = false, usePipe: boolean = false, filename: string = argv.filename;
                if(argv.lines == true) lines = true;
                if(argv.words == true) words = true;
                if(argv.characters == true) characters = true;
                if(argv.usePipe == true) usePipe = true;

                if(!lines && !words && !characters) {
                    console.error(chalk.red('You have to specify at least one of the following options to count: words, characters, lines'));
                }
                else if(usePipe) {
                    countWithPipe(filename, lines, words, characters);
                }
                else {
                    countWithoutPipe(filename, lines, words, characters);
                }
            }
        },
    }).parse();
}