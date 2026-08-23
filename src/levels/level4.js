import { introText, objectiveIntro } from "./level1";
import { course3 } from "./level3";

export const filesystemLevel4={
    type:"dir",
    children:{
        home:{
            type:"dir",
            children:{
                bureau:{
                    type:"dir",
                    children:{
                        "note.txt":{type:"file",content:"La clé a été archivée hier, mais je ne sais plus dans quel sous-dossier..."}
                    }
                },
                archives:{
                    type:"dir",
                    children:{
                        dossier_alpha:{
                            type:"dir",
                            children:{
                                "log_vieux.txt":{type:"file",content: "Rien d'intéressant ici."}
                            }
                        },
                        dossier_beta:{
                            type:"dir",
                            children:{
                                "sauvegarde.bak":{type:"file",content: "Fichier corrompu."}
                            }
                        },
                        dossier_gamma:{
                            type:"dir",
                            children:{
                                sous_dossier_1:{type:"dir",children:{}},
                                sous_dossier_2:{
                                    type:"dir",
                                    children:{
                                        "cle_securite.txt":{type:"file",content: "BRAVO ! Le code de redémarrage est : 7894"}
                                    }
                                },
                                sous_dossier_3:{type:"dir",children:{}}
                            }
                        },
                        dossier_delta:{
                            type:"dir",
                            children:{
                                "vide.txt":{
                                    type:"file",
                                    content:"Rien ici"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const level4Intro = "Alors que tu as réussi à trouver le fichier, une coupure de courant survient. Le hackeur a été plus rapide. Le générateur de secours prend le relais, mais il ne tiendra que quelques minutes.    ";

export const level4Objective="Tu dois rapidement trouver le code qui est dans le fichier cle_securite.txt . Utilise la commande find pour cela. Grâce à cela, tu va pouvoir redémarrer le système. ";

export const course4=[
    { cmd: "find", description: "Cherche un fichier par son nom dans toute l'arborescence.", example: "find config_reseau.txt" },
    ...course3
];

export const level4={
    id:4,
    filesystem:filesystemLevel4,
    introText:level4Intro,
    objectiveIntro:level4Objective,
    checkWin:(commandLine) => commandLine.trim()==="7894",
    useCodeInput:true,
    course:course4
}