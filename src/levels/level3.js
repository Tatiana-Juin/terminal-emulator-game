import { course2 } from "./level2";

export const filesystemLevel3={
    type:"dir",
    children:{
        home:{
            type:"dir",
            children:{
                network:{
                    type:"dir",
                    children:{
                        log:{
                            type:"dir",
                            children:{
                                "reseaux.txt":{
                                    type:"file",
                                    content:"plusieurs paquet suspect detecter . Il sont dans le dossier network. "
                                }
                            }
                        },
                        "paquet1.txt":{
                            type:"file",
                            content:"Paquet reseaux standart aucune anomalie."
                        },
                        "paquet2.txt":{
                            type:"file",
                            content:"Paquet reseaux standart aucune anomalie."
                        },
                        "paquet3.txt":{
                            type:"file",
                            content:"Paquet reseaux standart aucune anomalie."
                        },
                        "paquet4.txt":{
                            type:"file",
                            content:"Paquet reseaux standart aucune anomalie."
                        },
                        "paquet5.txt":{
                            type:"file",
                            content:"Paquet reseaux standart aucune anomalie."
                        },
                        "paquet6.txt":{
                            type:"file",
                            content:"Paquet reseaux standart aucune anomalie."
                        },
                        "paquet7.txt":{
                            type:"file",
                            content:"Commande recu : COUPURE DE COURRANT "
                        },
                        "paquet8.txt":{
                            type:"file",
                            content:"Paquet reseaux standart aucune anomalie. "
                        },
                    },
                  
                }
            }
        }
    }
}
export const level3Intro="L'alarme c'est arreter mais un flux de données apparait - une interception du haker qui a vue ce que tu as fait . "

export const level3Objective = "trouve la commande qui viens d'envoyer ";

export const course3=[
     { cmd: "find", description: "cherche un fichier par son nom dans toute l'arborescence.", example: "find config_reseau.txt" },
    { cmd: "grep", description: "cherche un mot dans le contenu des fichiers du dossier actuel.", example: "grep COUPURE" },
    ...course2
]

export const level3={
    id:3,
    filesystem:filesystemLevel3,
    introText:level3Intro,
    objectiveIntro:level3Objective,
    useCodeInput:false,
    course:course3
}