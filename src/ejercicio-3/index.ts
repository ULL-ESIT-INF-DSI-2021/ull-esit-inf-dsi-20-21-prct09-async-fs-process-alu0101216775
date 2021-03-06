import * as fs from 'fs'
import * as yargs from 'yargs'
import * as chalk from 'chalk'

/**
 * Observa os cambios producidos al directorio de un determinado usuario
 * @param user 
 * @param path 
 */
function watchUserNotes(user: string, path: string) {
    fs.access(path, (err) => {
        if(err) {
            console.error(chalk.red("It was not possible to access to the user directory. Maybe it does not exist."));
        } else {
            let noteModified: boolean = true, noteAdded: boolean = false;
            var fsTimeout: unknown = setTimeout(function() { fsTimeout=null }, 50);
            if(fs.lstatSync(path).isDirectory()) {
                fs.readdir(path, (err, listOfFiles) => {
                    if(err) {
                        console.error(chalk.red("It was not possible to read to the user directory. Maybe it does not have permissions."));
                    } else {
                        fs.watch(path, (typeOfEvent, filename) => {
                            if(!noteAdded) noteModified = true;
                            fs.readdir(path, (err, newListOfFiles) => {
                                if(err) {
                                    console.error(chalk.red("Something changed in the directory. It is not possible to read it now."));
                                } else {
                                    if(typeOfEvent == "rename") {
                                        if(listOfFiles.length < newListOfFiles.length) {
                                            console.log(chalk.green(`New file added! File name is ${filename}`));
                                            noteAdded = true;
                                        } else if(listOfFiles.length > newListOfFiles.length) {
                                            console.log(chalk.green(`File removed! File name was ${filename}`));
                                        }
                                        listOfFiles = newListOfFiles;
                                    } else if(typeOfEvent == "change") {
                                        if(noteAdded) {noteAdded = !noteAdded; noteModified = false;}
                                        if(!fsTimeout && noteModified) {
                                            console.log(chalk.green(`File modified! File name is ${filename}`));
                                            /**
                                             * Evita que el mensaje aparezca duplicado. La funcion watch es inestable, y a veces detecta como m??ltiples modificaciones al realizar un cambio sobre el fichero.
                                             * Se espera un segundo entre llamada y llamada para evitar este tipo de errores.
                                             * @see https://stackoverflow.com/questions/12978924/fs-watch-fired-twice-when-i-change-the-watched-file
                                             */
                                            fsTimeout = setTimeout(function() { fsTimeout=null }, 1000);
                                        }
                                    }
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