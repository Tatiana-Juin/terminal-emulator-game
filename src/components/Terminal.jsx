import { useReducer, useRef, useEffect, useState } from "react"
import { updateAtPath,removeAtPath,toChildrenPath } from "../engine/pathUtils"
import { resolvePath } from "../engine/resolvePath"
import { initialState,terminalReducer } from "../engine/terminalReducer"
import { executeCommand } from '../engine/executeCommand';
import { levels } from "../levels";


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
    
    // le dispatch pour ajouter une ligne à l'historique
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

