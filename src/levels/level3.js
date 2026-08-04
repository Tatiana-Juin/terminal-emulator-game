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
                                "alert.txt":{
                                    type:"file",
                                    content:"plusieurs paquet suspect detecter . Il sont dans le dossier network. Il a la nouvelle attque du hacker "
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
export const level3Intro="L'alarme s'arrete mais le le hacker tente une contre attaque . Il a un plein de paquet qui apparaissent . Dans le dossier logs un fichier alert.txt previens le joueur de la prochaine attaque qui est une COUPURE de courrant   "

export const level3Objective = "utilise grep et trouve dans quel fichier il a le mot COUPURE pour savoir s'il compte faire autre chose .  ";

export const course3=[
     
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
