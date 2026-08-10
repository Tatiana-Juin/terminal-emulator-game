import '../styles/layout.css';
import '../styles/intro.css';
import '../styles/terminal.css';
import '../styles/panel.css';
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
      setCodeInput("");
    }
    
    
  return (
    <>
    {(state.isWon && currentLevelIndex + 1 >= levels.length) ?( 
      <div className='intro-container'>
        {/* ecran de fin  */}
          <p className='intro-text'> Félicitations le virus du hacker est neutraliser et son enprise sur le batiment est terminé . Tu es enfin libre est le hacker n'a plus ancune emprise sur le batiment .La police arrive est l'arrête.  </p>
      </div>
      // INTRO
      ):showIntro ?(
        <div className='intro-container'>
          <p className='intro-text'> {currentLevel.introText} </p>
          <button className='intro-button' onClick={()=>setShowIntro(false)}>Commencer</button>
        </div>
      ) : (
        <>
      <div className='app-container'>
           {/* POUR L'OBJECTIFS ET LE CODE DE DEVEROUILLAGE */}
          <div className='left-panel'>
            <div className='objectives-section'>
              <>
                <h2>Objectifs</h2>
                <p> {currentLevel.objectiveIntro}</p>

                {currentLevel.useCodeInput && (
                <div className='unlock-code-container'>
                 <label>Solution : </label>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={handleCodeSubmit}
              />
              </div>
              )}

              </>
            </div>
            
              {/* Pour savoir si tuas trouver e bon code */}

            {state.isWon  ? (
              <>
              <p className='success-message'> Felicitation tu as réussi </p>

              {currentLevelIndex +1 >= levels.length ?(
                <p>Tu as terminer le jeu.</p>
              ) :(
                <button className='next-btn' onClick={handleNextLevel}>Niveau suivant </button>
              )}
              
              </>
            ) : codeError ? (
              <>
                <p className='error-message'> Ce n'est pas le bon code </p>
              </>
            ): null}

            <h1 className='course-title'>Cours</h1>
            <p className='course-intro'>Pour pouvoir avancé dans l'histoire il faudra que tu connaisses les bases de linux . Ne t'inquite pas ce cours va t'aider pour avancer dans l'histoire</p>
            {currentLevel.course.map((cour)=>(
              <div className='course-card' key={cour.cmd}>
                <ul>
                  <li> <strong>{cour.cmd}</strong>  -  {cour.description}</li>
                  <li>
                    <code> {cour.example} </code>
                  </li>
                </ul>
                
              </div>
            ))}
            
          </div>

         {/* POUR LE TERMINAL */}
        <div className='right-panel'>
         
          <div className='terminal-container' onClick={() => inputRef.current?.focus()} >
            {/* POUR AFFICHER L'HISTORIQUE  */}
                {state.history.map((line,i) =>(
                  <div className='terminal-line' key={i}>
                    <div>
                        <span className='terminal-prompt'>user@debian: $ {line.prompt} </span>
                        <span className='terminal-command'>{line.command}</span>
                    </div>
                    
                    {line.output  && ( 
                       <p className={`terminal-output ${line.isError ? "error" : ""}`}>
                        {line.output}
                      </p>
                    )}
                  </div>
                ))}

                <div className='terminal-input-row'>
                    {/* pour voir ou on est  */}
                    <span className='terminal-prompt'>user@debian: $ { "/" + state.currentPath.join("/")} </span>

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

