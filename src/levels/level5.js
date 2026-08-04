import { introText, objectiveIntro } from "./level1";
import { course4 } from "./level4";

export const filesystemLevel5={
    type:"dir",
    children:{
        home:{
            logs:{
                type:"dir",
                children:{
                    "hacker_trace.log":{
                        type:"file",
                        content:"Trace trouvé du hacker "
                    }
                }
            }
        }
    }
}

export const level5Intro = "Tu as trouver le code felicitations . La porte s'ouvre par contre tu voie un fichier hacker_trace.log qui contient l'ip du hacker . Tu ne pas lire le fichier car tu n'y a pas acces. Tu na pas le droit de lecture.";

export const level5Objective = "Il va falloir que tu change cela. Pour cela tu va devoir utiliser chmod et le code 400 ";

export const course5=[
    {cmd:"chmod",description:"Modifier les permission sur un fichier ",example:"chmod 644 (toi 4(lire) + 2(ecriture), groupe = 4 (lecture), autre 4 (lecture)"},
    ...course4
];
export const level5={
    id:5,
    filesystem : filesystemLevel5,
    introText:level5Intro,
    objectiveIntro:level5Objective,
    course:course5,
}