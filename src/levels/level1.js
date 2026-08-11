export const filesystemInitial={
  type:"dir",
  children:{
    home:{
      type:"dir",
      children:{
        // home/logs
        logs:{
          type:"dir",
          children:{
            "erreur.txt":{
              type:"file",
              content:"03:42 — Intrusion détectée sur le réseau. Verrouillage automatique des accès activé.",
            }
          }
        },
        // /home/system
       system:{
          type:"dir",
          children:{
            "config.txt":{
              type:"file",
              content:"Réseau local : actif. Aucune anomalie détectée."
            },
            "deverrouillage.txt":{
              type:"file",
              content:"Code porte principale : 7291. Procédure d'urgence validée."
            }
          }
        }
      
      }
    }
  }
}
// Intro pour le texte
  export const introText = ` Tu es à ton travail devant  ton ordinateur, quand tout d'un coup, la porte du bureau se ferme. Tu te sens mal . Tu veux sortir, mais il y a un code que tu ne connais pas .   ` 
  
  export const objectiveIntro ="Tu dois trouver rapidement le code. Pour cela, tu navigue entre les différents dossiers et fichiers, mais le temps est compté.   "

  // POUR LES COURS 
  export const course1 = [
    { cmd:"pwd", description:"affiche à quel endroit tu es actuellement dans l'arborescence. ",example:"pwd"},
    {cmd:"ls", description:"liste les fichiers et dossiers présents à l'endroit où tu es.",example:"ls"},
    {cmd:"cd[dossier]",description:"Permet de te déplacer dans un dossier",example:"cd dossier"},
    {cmd:"cd ..",description:"Te fait remonter d'un niveau si tu as par exemple home/log/system est que tu es dans system et que tu veux aller dans log tu vas faire",example:"cd .."},
    {cmd:"cat",description:"Affiche le contenu d'un fichier",example:"cat fichier.txt"}
  ]


export const level1 = {
  id: 1,
  filesystem: filesystemInitial,
  introText: introText,
  objectiveIntro: objectiveIntro,
  checkWin: (commandLine) => commandLine.trim() === "7291",
  useCodeInput: true,
  course: course1
}