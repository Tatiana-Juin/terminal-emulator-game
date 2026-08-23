import { course1} from "./level1";
 // POUR LE NIVEAU 2 
  export const filesystemLevel2={
    type:"dir",
    children:{
      home:{
        type:"dir",
        children:{
          temp:{
            type:"dir",
            children:{
              "code_alarme.txt":{
                type:"file",
                content:"Fichier de désactivation d'alarme. Système : non reconnu à cet emplacement. Déplacer vers /home/securite/ pour activation."
              },
              "dechet.txt":{
                type:"file",
                content:"Tu es dans le bon dossier mais c'est pas le bon fichier"
              }
            }
          },
          securite:{
            type:"dir",
            children:{

            }
          }
        }
      }
    }
  }

  export const level2Intro="La porte s'ouvre et tu te sens mieux, mais tout d'un coup tu entends une alarme . Tu as peur, car tu sais que ça va prévenir le hacker . Tu essaies de l'arrêter. Tu n'y arrives pas. Tu vas sur ton ordinateur et tu t'aperçois que le dossier sécurité est vide. ";

  export const level2Objective="Tu dois trouver le fichier et le déplacer dans le dossier securite pour arrêter l'alarme. "


  export const course2=[
    {cmd:"mv",description:"Déplace un fichier d'un dossier à un autre. Par example tu es dans  home/log/system et tu veux  déplacer le fichier fichier.txt de system au dossier log. Tu vas faire : ",example:"mv fichier.txt ../system/fichier.txt"},
    ...course1,
    
  ]
  
  export const level2 = {
  id: 2,
  filesystem: filesystemLevel2,
  introText: level2Intro,
  objectiveIntro: level2Objective,
  useCodeInput: false,
  checkWin: (filesystem) => filesystem.children.home.children.securite?.children["code_alarme.txt"] !== undefined,
  course: course2
}