
import { course5 } from "./level5";

export const filesystemLevel6={
    type:"dir",
    children:{
        home:{
            type:"dir",
            children:{
                system_hacker:{
                    type:"dir",
                    children:{
                        logs:{
                            type:"dir",
                            children:{
                                "log_01.txt":{
                                    type:"file",
                                    content:"Journal system standart . Rien à signaler. "
                                },
                                "log_02.txt":{
                                    type:"file",
                                    content:"Alerte : VIRUS ACTIF détecté."
                                }
                            }
                        },
                        "virus.exe":{
                            type:"file",
                            content:"Fichier executable malveillant",
                            locked:true,
                        }
                    }
                },
                corbeille:{
                    type:"dir",
                    children:{}
                }
            }
        }
    }
}

export const level6Intro="Grâce à l'IP , tu accédes au système du hacker. C'est le moment de le neutraliser définitivement, mais il a piégé son propore terrain pour ralentir toute intrusion.";

export const level6Objective="Localise le virus,désactive sa protection avec chmod (400), puis neutralise-le en le deplaçant vers la corbeille.";

export const course6=[
    ...course5
];

export const level6={
    id:6,
    filesystem:filesystemLevel6,
    introText:level6Intro,
    objectiveIntro:level6Objective,
    checkWin : (filesystem) => filesystem.children.home.children.corbeille?.children["virus.exe"]!== undefined,
    useCodeInput:false,
    course:course6
}
