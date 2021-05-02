import * as fs from 'fs'
import * as yargs from 'yargs'
import * as chalk from 'chalk'

function watchUserNotes(user: string, path: string) {
    fs.access(path, (err) => {
        if(err) {
            console.error(chalk.red("It was not possible to access to the user directory. Maybe it does not exist."));
        } else {
            let noteModified: boolean = true;
            var fsTimeout: unknown = setTimeout(function() { fsTimeout=null }, 1000);
            if(fs.lstatSync(path).isDirectory()) {
                fs.readdir(path, (err, listOfFiles) => {
                    if(err) {
                        console.error(chalk.red("It was not possible to read to the user directory. Maybe it does not have permissions."));
                    } else {
                        fs.watch(path, (typeOfEvent, filename) => {
                            fs.readdir(path, (err, newListOfFiles) => {
                                if(err) {
                                    console.error(chalk.red("Something changed in the directory. It is not possible to read it now."));
                                } else {
                                    if(typeOfEvent == "rename") {
                                        if(listOfFiles.length < newListOfFiles.length) {
                                            console.log(chalk.green(`New file added! File name is ${filename}`));
                                            noteModified = false;
                                        } else if(listOfFiles.length > newListOfFiles.length) {
                                            console.log(chalk.green(`File removed! File name was ${filename}`));
                                        }
                                        listOfFiles = newListOfFiles;
                                    }
                                    if(typeOfEvent == "change") {
                                        if(!fsTimeout && noteModified) {
                                            console.log(chalk.green(`File modified! File name is ${filename}`));
                                            /**
                                             * Evita que el mensaje aparezca duplicado. La funcion watch es inestable, y a veces detecta como múltiples modificaciones al realizar un cambio sobre el fichero.
                                             * Se espera un segundo entre llamada y llamada para evitar este tipo de errores.
                                             * @see https://stackoverflow.com/questions/12978924/fs-watch-fired-twice-when-i-change-the-watched-file
                                             */
                                            fsTimeout = setTimeout(function() { fsTimeout=null }, 1000);
                                        }
                                    }
                                    noteModified = true;
                                }
                            })
                        })
                    }
                })
            } else {
                console.error(chalk.red("The user path does not contain a directory, but a file."));
            }
        }
    })
}

yargs.command( {
    command: 'watch',
    describe: 'Watch a user note directory',
    builder: {
      user: {
        describe: 'username',
        demandOption: true,
        type: 'string',
      },
      path: {
        describe: 'Path where user notes are stored',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === "string" && typeof argv.path === "string") {
        watchUserNotes(argv.user, argv.path);
      }
    },
  }).parse();