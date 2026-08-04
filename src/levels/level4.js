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

export const level4Intro = "Alors que tu a reussi a trouver le fichier  une coupure de courrant survient  les generateur de secourt prenne le relais La porte va se fermer .  ";

export const level4Objective="Tu dois rapidement trouver le code qui est dans le fichier cle_securite.txt . utilise la commande find pour cela . ";

export const course4=[
    { cmd: "find", description: "cherche un fichier par son nom dans toute l'arborescence.", example: "find config_reseau.txt" },
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