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
export const level3Intro="Tu as déplacé le fichier et l'alarme s'arrête, mais le hacker tente une contre-attaque. Tout d'un coup, tu voie plein de paquets qui apparaissent à l'ecran. Tu essaies de comprendre ce qui se passe. Il est entrain de préparer sa prochaine attaque. Mais tu ne sais pas ce que c'est. En regardant de plus près, tu t'aperçois qu'il veut couper le courrant .   "

export const level3Objective = "Trouve le fichier en utilisant grep où il y a le mot COUPURE et entre son nom et son extension.   ";

export const course3=[
     
    { cmd: "grep", description: "cherche un mot dans le contenu des fichiers du dossier actuel.", example: "grep COUPURE" },
    ...course2
]

export const level3={
    id:3,
    filesystem:filesystemLevel3,
    introText:level3Intro,
    objectiveIntro:level3Objective,
    checkWin:(commandLine) =>commandLine.trim().toLowerCase()==="paquet7.txt",
    useCodeInput:true,
    course:course3
}
