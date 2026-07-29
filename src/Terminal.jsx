import { useReducer, useRef, useEffect, useState } from "react"
import { updateAtPath,removeAtPath,toChildrenPath } from "./engine/pathUtils"
import { resolvePath } from "./engine/resolvePath"
import { initialState,terminalReducer } from "./engine/terminalReducer"
import { executeCommand } from './engine/executeCommand';
// chemin por le premier niveau mais surout modifiable pour les prochain niveau grace au useState 
const filesystemInitial={
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
  const introText = "Tu es à ton travail devant ton ordinateur d'ou d'un coup la porte du bureau se ferme. Tu sens que tu n'a pas beaucoup d'oxygene. Tu regarde la porte et il a un code que tu ne connais pas .  " 
  const objectiveIntro ="Tu dois trouver rapidement le code pour cela tu navigue entre les différents dossier et fichier mais le temps est compter .   "

  // POUR LES COURS 
  const course1 = [
    { cmd:"pwd", description:"affiche à quel endroit tu es actuellement dans l'arborescence. ",example:"pwd"},
    {cmd:"ls", description:"liste les fichiers et dossiers présents à l'endroit où tu es.",example:"ls"},
    {cmd:"cd[dossier]",description:"Permet de te déplacer dans un dossier",example:"cd dossier"},
    {cmd:"cd ..",description:"Te fait remonter d'un niveau si tu as par exemple home/log/system est que tu es dans system et que tu veux aller dans log tu vas faire",example:"cd .."},
    {cmd:"cat",description:"Affiche le contenu d'un fichier",example:"cat fichier.txt"}
  ]

  // POUR LE NIVEAU 2 
  const filesystemLevel2={
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

  const level2Intro="La porte s'ouvre et tu te sens mieux mais d'ou d'un coup tu entent une alrme . Tu as peur car tu sais que ca va prévenir le hacker . Tu essaie de l'arreter. Tu regarder sur l'ordinateur et tu ne trouve pas le fichier dans le dossier securité il est vide .";

  const level2Objective="Tu dois trouver le fichier et le deplacer dans le dossier securite "


  const course2=[
    ...course1,
    {cmd:"mv",description:"deplace un fichier d'un dossier a un autre. Par example tu as home/log/system et tu va deplacer le fichier fichier.txt de system au dossier log",example:"mv fichier.txt ../system/fichier.txt"}
  ]
    // tableau d'objet pour les niveaux 
    const levels=[
      {
        id:1,
        filesystem:filesystemInitial,
        introText:introText,
        objectiveIntro:objectiveIntro,
        checkWin:(commandLine)=> commandLine.trim()==="7291",
        useCodeInput:true,
        course:course1

      },{
        id:2,
        filesystem:filesystemLevel2,
        introText:level2Intro,
        objectiveIntro:level2Objective,
        useCodeInput:false,
        checkWin: (filesystem) => filesystem.children.home.children.securite?.children["code_alarme.txt"] !== undefined,
        course:course2,
        
      }
    ]


  // Quand c'est bon 
  function checkWin(commandLine) {
    return commandLine.trim() === "7291";
  }

  



export default function Terminal() {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const [codeInput,setCodeInput] = useState("");
  // pour afficher le texte d'intro 
  const [showIntro,setShowIntro] = useState(true);
  // POUR AFFICHER UN MESSAGE ERREUR 
  const [codeError,setCodeError] = useState(false)
  
  // useState pour savoir a quel niveau on est c'est la position dans le tableau 
  const [currentLevelIndex,setCurrentLevelIndex] = useState(0)
  const currentLevel = levels[currentLevelIndex];
  // pour le chemin 
  const [filesystem,setFilesystem] = useState(currentLevel.filesystem);
  

  // pour garder le focus sur input
  useEffect(() => {
    inputRef.current?.focus();
  }, [state.history]);

  // // scroll automatique 
   useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.history]);

  
  // fonction pour la saisie du texte 
  function handleKeyDown(e){
    if(e.key !== "Enter") return;
    // recupere la valeur saisie 
    const commandLine = e.target.value;
    // 3. On envoie cette phrase à ton "cerveau" (executeCommand). 
    // Il va nous renvoyer un objet "result" qui peut contenir plusieurs choses : 
    // du texte (output), un nouveau chemin (newPath), ou une nouvelle arborescence (newFilesystem)
    const result = executeCommand(commandLine,state,filesystem);
    
    // le dispatch pour ajouter une ligneà l'historique
    dispatch({
      type:"ADD_LINE",
      payload:{
        prompt:"/" + state.currentPath.join("/"),
        command: commandLine,
        output: result.output,
        isError:result.isError,
      }
    });
    // 5. Si la commande était un "cd" valide, executeCommand nous a renvoyé un "newPath".
    // On met donc à jour le chemin actuel dans le state.
    if(result.newPath){
      dispatch({
        type:"NAVIGATE",
        payload:result.newPath,
      })
    }
    // 6. Si la commande était un "mv" valide, executeCommand nous a renvoyé un "newFilesystem".
    // On remplace donc l'ancienne arborescence par la nouvelle.
    if(result.newFilesystem){
      setFilesystem(result.newFilesystem);
    }

    // POUR VALIDER LA VICTOIRE QUAND TU FAIS mv
    if(!currentLevel.useCodeInput && result.newFilesystem){
        if(currentLevel.checkWin(result.newFilesystem)){
          dispatch({
            type:"WIN_LEVEL"
          })
      }
    }
    // on vide le champs
    e.target.value ="";
  
}

      // Fonction pour le code a saisir 
    function handleCodeSubmit(e) {
      if (e.key !== "Enter") return;
      if (currentLevel.checkWin(codeInput)) {
        dispatch({ type: "WIN_LEVEL" });
        setCodeError(false);
      }else{
        setCodeError(true)
      }
    }

    // Fonction pour passer au niveau suivant 
    function handleNextLevel(){
      const nouvelIndex = currentLevelIndex +1;
      setCurrentLevelIndex(nouvelIndex)
      setFilesystem(levels[nouvelIndex].filesystem);
      
      dispatch({
        type:"RESET"
      })
      setShowIntro(true);
    }
    
    
  return (
    <>
    {/* Pour afficher l'intro  */}
      {showIntro ?(
        <>
          <p> {currentLevel.introText} </p>
          <button onClick={()=>setShowIntro(false)}>Commencer</button>
        </>
      ) : (
        <>
        <div style={{ 
          display:"flex",
          flexDirection:"row",
          width:"99vw",
          height:"99vh",
          
        }}>
           {/* POUR L'OBJECTIFS ET LE CODE DE DEVEROUILLAGE */}
          <div style={{
              display:"flex",
              flexDirection:"column",
              width:"50vw",
            }}>
            <div>
              <>
                <h2>Objectifs</h2>
                <p> {currentLevel.objectiveIntro}</p>

                {currentLevel.useCodeInput && (
                  <>
                 <label>Code de déverrouillage : </label>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={handleCodeSubmit}
              />
              </>
              )}


              </>
            </div>
            
              {/* Pour savoir si tuas trouver e bon code */}

            {state.isWon  ? (
              <>
              <p style={{color:"green"}}> Felicitation tu as réussi </p>
              <button onClick={handleNextLevel}>Niveau suivant </button>
              </>
            ) : codeError ? (
              <>
                <p style={{ color:"red"}}> Ce n'est pas le bon code </p>
              </>
            ): null}

            <h1 style={{marginBottom:"5px"}}>Cours</h1>
            <p>Pour pouvoir avancé dans l'histoire il faudra que tu connaisses les bases de linux . Ne t'inquite pas ce cours va t'aider pour avancer dans l'histoire</p>
            {currentLevel.course.map((cour)=>(
              <div key={cour.cmd}>
                <ul>
                  <li>{cour.cmd}  -  {cour.description}</li>
                  <li>
                    <code> {cour.example} </code>
                  </li>
                </ul>
                
              </div>
            ))}
            
          </div>

         {/* POUR LE TERMINAL */}
        <div style={{
          display:"flex",
          flexDirection:"column",
          width:"50vw",
          
        }}>
         
          <div onClick={() => inputRef.current?.focus()} 
            style={{
              background: "#1e1e1e",
              color: "#e0e0e0",
              fontFamily: "monospace",
              fontSize: "14px",
              padding: "1rem",
              borderRadius: "8px",
              height: "400px",
              overflowY: "auto",
              cursor: "text",
              height:"99vh"
            }}
          >
            {/* POUR AFFICHER L'HISTORIQUE  */}
                {state.history.map((line,i) =>(
                  <div key={i}>
                    <p>user@debian: $ {line.prompt} {line.command}</p>
                    {line.output  && 
                      <p style={{ color: line.isError ? "red" : "white"}}> {line.output} </p>
                    }
                  </div>
                ))}

                <div style={{display:"flex"}}>
                    {/* pour voir ou on est  */}
                    <p>user@debian: $ { "/" + state.currentPath.join("/")} </p>

                    {/* pour affiche le texte  */}
                    <input type="text" onKeyDown={handleKeyDown} ref={inputRef} style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#e0e0e0",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      flex: 1,
                    }} />
                </div>
                
            <div ref={bottomRef}></div>
          </div>
        </div>
      </div>

    </>
    )}
  </> 
  )
  
}

