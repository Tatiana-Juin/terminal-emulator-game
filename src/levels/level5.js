// import { introText, objectiveIntro } from "./level1";
import { course4 } from "./level4";

export const filesystemLevel5={
    type:"dir",
    children:{
        home:{
            type:"dir",
            children:{
                logs:{
                    type:"dir",
                    children:{
                        "hacker_trace.log":{
                            type:"file",
                            content:"Trace trouvé du hacker 192.0.0.1",
                            locked:true
                        }
                    }
                }
            }
        }
    }
}

export const level5Intro = "Tu as trouvé le code felicitations ! Le systeme redémarre et tu vois un fichier hacker_trace.log qui peut te donner des informations sur le hacker.  Tu ne peux pas lire le fichier, car tu n'y as pas accès. Tu n'a pas les droits de lecture.";

export const level5Objective = "Il va falloir que tu change cela (donne le droit de lecture). Pour cela tu va devoir utiliser chmod et le code 400. Dès que c'est fait, lis le fichier et donne moi l'adresse IP du hacker. ";

export const course5=[
    {cmd:"chmod",description:"Modifier les permissions sur un fichier ",example:"chmod 644 nomFichier.txt (toi 4(lire) + 2(ecriture), groupe = 4 (lecture), autre 4 (lecture)"},
    ...course4
];
export const level5={
    id:5,
    filesystem : filesystemLevel5,
    introText:level5Intro,
    objectiveIntro:level5Objective,
    checkWin:(commandLine) => commandLine.trim()==="192.0.0.1" ,
     useCodeInput:true,
    course:course5,
   

    
}