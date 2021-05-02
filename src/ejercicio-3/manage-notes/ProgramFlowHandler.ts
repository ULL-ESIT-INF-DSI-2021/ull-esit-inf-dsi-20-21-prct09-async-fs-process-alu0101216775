import * as chalk from 'chalk';
import * as fs from 'fs';

import {Note} from './Note'

/**
 * Clase encargada de la lectura/escritura en el sistema de ficheros, gestionando los errores correspondientes
 */
export class ProgramFlowHandler {
    constructor() {}

    /**
     * Añade una nota únicamente si no existe.
     * 1. Comprueba que exista el directorio del usuario. Si no es así, lo crea.
     * 2. Almacena la nota como JSON en el fichero correspondiente
     * @param note 
     */
    addNote(note: Note) {
        if(!this.checkIfFileExist(note.route)) {
            try {
                this.checkUserDirectory(note.user);
                fs.writeFile(note.route, this.noteToJSON(note), () => {
                    console.log(chalk.green("Note Added Successfully!"));
                  });
            } catch {
                console.error(chalk.red("Something went wrong. It was not possible to write the new note."));
            }
        } else {
            console.error(chalk.red("This note already exist. Try modifying it or choosing another title."));
        }  
    }

     /**
      * Modifica una nota, si existe.
      * Permite cambiar el título, cuerpo o color de la nota.
      * En caso de cambiar el título, se modifica también el nombre del fichero, facilitando su gestión.
      * @param note 
      * @param ntitle 
      * @param nbody 
      * @param ncolor 
      */
    modifyNote(note: string, ntitle: string, nbody: string, ncolor: string) {
        if(this.checkIfFileExist(note)) {
            try {
                let noteToModify: Note;
                let readNote: string = fs.readFileSync(note).toString();
                noteToModify = this.JSONtoNote(readNote);
                if(ntitle !== "") {
                    console.log(chalk.green("You have changed the title, so the note will be removed and created with the new title."));
                    this.deleteNote(note);
                    noteToModify.setTitle(ntitle);
                    let filename: string = ntitle.replace(/[&\/\\#,+()$~%.'":*?<>{}!¡¿]/g, '') + '.json';
                    noteToModify.setRoute(`notes/${noteToModify.user}/${filename}`);
                    console.log(chalk.green("Title changed"));
                } 
                if(nbody !== "") {
                    noteToModify.setBody(nbody);
                    console.log(chalk.green("Body changed"));
                }
                if(ncolor !== "") {
                    noteToModify.setColor(ncolor);
                    console.log(chalk.green("Color changed"));
                }
                fs.writeFile(noteToModify.getRoute(), this.noteToJSON(noteToModify), () => {
                    console.log(chalk.green("Note Modified Successfully!"));
                  });
            } catch {
                console.error(chalk.red("Something went wrong. It was not possible to modify the note."));
            }
        } else {
            console.error(chalk.red("This note does not exist. Try another title or create that note."));
        }  
    }

    /**
     * Elimina una nota, si existe.
     * @param note 
     */
    deleteNote(note: string) {
        if(this.checkIfFileExist(note)) {
            try {
                fs.unlinkSync(note);
                console.log(chalk.green("Note Removed Successfully!"));
            } catch {
                console.error(chalk.red("Something went wrong. It was not possible to remove the note."));
            }
        } else {
            console.error(chalk.red("This note does not exist. Try another title or create that note."));
        }  
    }

    /**
     * Muestra todas las notas de un determinado usuario en su color correspondiente.
     * Se usa un método de lectura de directorios síncrono para evitar desorden en los ficheros u omisiones por no haber terminado la lectura.
     * @param user 
     */
    listNotes(user: string) {
        try {
            let userfiles: string[] = [];
            userfiles = fs.readdirSync(`notes/${user}`);
            if(userfiles.length > 0) {
                userfiles.forEach(element => {
                    fs.readFile(`notes/${user}/${element}`, (err, data) => {
                        if(err) throw(err);
                        let noteToRead: Note = this.JSONtoNote(data.toString());
                        console.log(chalk.keyword(noteToRead.color)(noteToRead.title));
                      });
                });
            }
            else {
                console.error(chalk.red("This user does not have any note created."));
            }
        } catch {
            console.error(chalk.red("There was an error reading this user files."));
        }
    }

    /**
     * Lee una nota, si existe.
     * Muestra por consola el título, seguido del cuerpo de la nota. Se utiliza el color almacenado en la propiedad color de la nota.
     * @param note 
     */
    readNote(note: string) {
        if(this.checkIfFileExist(note)) {
            try {
                fs.readFile(note, (_, data) => {
                    let noteToRead: Note = this.JSONtoNote(data.toString());
                    console.log(chalk.keyword(noteToRead.color)(noteToRead.title));
                    console.log(chalk.keyword(noteToRead.color)(noteToRead.body));
                  });
            } catch {
                console.error(chalk.red("Something went wrong. It was not possible to remove the note."));
            }
        } else {
            console.error(chalk.red("This note does not exist. Try another title or create that note."));
        }  
    }

    /**
     * Convierte una nota a formato JSON
     * @param note 
     */
    noteToJSON(note: Note): string {
        return JSON.stringify(note);
    }

    /**
     * Convierte una nota en JSON a objeto de la clase Note
     * @param jsonnote 
     */
    JSONtoNote(jsonnote: string): Note {
        let aux = JSON.parse(jsonnote);
        let note: Note = new Note(aux.title, aux.body, aux.user, aux.color, aux.route);
        return note;
    }

    /**
     * Comprueba si existe un directorio para dicho usuario. Si no es así, lo crea para poder almacenar la nota con writeFile
     * @param username Nombre del usuario que escribio la nota
     */
    checkUserDirectory(username: string) {
        let userDir: string = `src/ejercicio-3/manage-notes/notes/${username}`;
        if (!fs.existsSync(userDir)){
            fs.mkdirSync(userDir);
        }
    }

    /**
     * Retorna si ya existe una nota con el mismo titulo y usuario
     * @param route 
     */
    checkIfFileExist(route: string): boolean {
        if (fs.existsSync(route)) return true;
        return false;
    }
}