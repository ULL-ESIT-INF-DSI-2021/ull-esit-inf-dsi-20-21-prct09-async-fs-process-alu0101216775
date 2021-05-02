import {spawn} from 'child_process';

import * as chalk from 'chalk';
import * as fs from 'fs'

/**
 * Cuenta los diferentes elementos solicitados haciendo uso de un pipe
 * @param filename 
 * @param lines 
 * @param words 
 * @param characters 
 */
export function countWithPipe(filename: string, lines: boolean, words: boolean, characters: boolean) {
    fs.access(filename, (err) => {
        if (err) {
            console.error(chalk.red(`Something went wrong, it was not possible to open file ${filename}. Check that that file exists and have reading permissions.`));
        } else {
            var count;
            if(lines) {
                var output = spawn('echo', ["-n", "Number of lines: "]);
                output.stdout.pipe(process.stdout);
                count = spawn('sh', ['-c',  `wc -l < ${filename}`])
                count.stdout.pipe(process.stdout);
            }
            if(words) {
                var output = spawn('echo', ["-n", "Number of words: "]);
                output.stdout.pipe(process.stdout);
                count = spawn('sh', ['-c',  `wc -w < ${filename}`])
                count.stdout.pipe(process.stdout);
            }
            if(characters) {
                var output = spawn('echo', ["-n", "Number of characters: "]);
                output.stdout.pipe(process.stdout);
                count = spawn('sh', ['-c',  `wc -c < ${filename}`])
                count.stdout.pipe(process.stdout);
            }
        }
    });
}
/**
 * Cuenta los diferentes elementos sin usar pipes
 * @param filename 
 * @param lines 
 * @param words 
 * @param characters 
 */
export function countWithoutPipe(filename: string, lines: boolean, words: boolean, characters: boolean) {
    fs.access(filename, (err) => {
        if (err) {
            console.error(chalk.red(`Something went wrong, it was not possible to open file ${filename}. Check that that file exists and have reading permissions.`));
        } else {
            const count = spawn('wc', [filename]);
            let output: string = "";

            count.stdout.on('data', (element) => {
                output += element;
            });

            count.on('close', () => {
                const countArray = output.split(/\s+/);
                console.log(chalk.green(`Counting elements from ${filename}...\n\n`  
                            + (lines ? `Number of lines: ${parseInt(countArray[1]) + 1}\n` : "") 
                            + (words ? `Number of words: ${countArray[2]}\n` : "")
                            + (characters ? `Number of characters: ${countArray[3]}\n` : "")));
            })
        }
    });
}