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

  export const level2Intro="La porte s'ouvre et tu te sens mieux mais d'ou d'un coup tu entent une alarme . Tu as peur car tu sais que ca va prévenir le hacker . Tu essaie de l'arreter. Tu regarder sur l'ordinateur et tu ne trouve pas le fichier dans le dossier securité il est vide .";

  export const level2Objective="Tu dois trouver le fichier et le deplacer dans le dossier securite "


  export const course2=[
    ...course1,
    {cmd:"mv",description:"deplace un fichier d'un dossier a un autre. Par example tu as home/log/system et tu va deplacer le fichier fichier.txt de system au dossier log",example:"mv fichier.txt ../system/fichier.txt"}
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