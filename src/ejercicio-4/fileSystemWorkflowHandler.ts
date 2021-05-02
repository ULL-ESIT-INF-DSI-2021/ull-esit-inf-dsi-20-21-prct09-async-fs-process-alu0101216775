import {spawn} from 'child_process';

import * as chalk from 'chalk';
import * as fs from 'fs'

export class fileSystemWorkflowHandler {
    constructor() {};
    ls(path: string) {
        try {
            let files: string[] = [];
            files = fs.readdirSync(path);
            if(files.length > 0) {
                files.forEach(element => {
                    console.log(chalk.green(element));
                });
            }
            else {
                console.error(chalk.red("This directory does not have any file."));
            }
        } catch {
            console.error(chalk.red(`The directory ${path} does not exist or it could not be open.`));
        }
    }
    
    mkdir(path: string) {
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
            console.log(chalk.green("Directory created successfully!"));
        }
        else {
            console.error(chalk.red("The directory already exists!"));
        }
    }

    cat(path: string) {
        if (fs.existsSync(path)){
            if(fs.lstatSync(path).isDirectory()) {
                console.error(chalk.red("The path contains a directory, not a file. ls will be executed instead."));
                this.ls(path);
            }
            else {
                try {
                    fs.readFile(path, (_, data) => {
                        console.log(chalk.green(data.toString()));
                      });
                } catch {
                    console.error(chalk.red("Something went wrong. It was not possible to read the file."));
                }
            }
        }
        else {
            console.error(chalk.red("The path does not exist or it is empty"));
        }
    }

    rm(path: string) {
        if (fs.existsSync(path)){
            const rm = spawn('rm', ['-rf', path]);
            rm.on('close', (err) => {
                if (err) {
                  console.error(chalk.red("Something went wrong. It was not possible to remove the file."));
                } else {
                    console.log(chalk.green("File removed successfully!"));
                }
              });
        }
        else {
            console.error(chalk.red("The path does not exist."));
        }
    }

    async copy(src: string, dst: string, overwrite: boolean, move: boolean) {
        if (fs.existsSync(src)) {
            if(overwrite) {
                await fs.copyFile(src, dst, (err) => {
                    if(err) {
                        console.error(chalk.red("Something went wrong. It was not possible to copy source path."));
                    }
                    else {
                        console.log(chalk.green("File copied successfully!"));
                        if(move) this.rm(src);
                    }             
                });
            }
            else {
                if (!fs.existsSync(src)) {
                    await fs.copyFile(src, dst, fs.constants.COPYFILE_EXCL, (err) => {
                        if(err) {
                            console.error(chalk.red("Something went wrong. It was not possible to copy source path."));
                        }
                        else {
                            console.log(chalk.green("File copied successfully!"));
                            if(move) this.rm(src);
                        }
                    });
                }
                else {
                    console.error(chalk.red("Destination path already exists! If you want to overwirte it, you must specify --overwrite option."));
                }
            }
        } else {
            console.error(chalk.red("The source path does not exist."));
        }
    }
}
