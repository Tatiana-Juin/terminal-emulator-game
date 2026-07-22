import { useReducer, useRef, useEffect, useState } from "react"
// chemin pour le premier niveau 
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

// FONCTION POUR LES CHEMIN 
function resolvePath(fs,currentPath,target){
  let pathSegments;

  if(target.startsWith("/")){
    pathSegments = target.split("/").filter(Boolean);
  }
  else if(target === ".."){
    pathSegments = currentPath.slice(0,-1);
  }
  else if(target ==="."){
    pathSegments = [...currentPath];
  }else{
    pathSegments = [...currentPath,...target.split("/").filter(Boolean)];
  }

  let node = fs;

  for(const segment of pathSegments){

    if(node.type !== "dir" || !node.children[segment]){
      return { error: `chemin introuvable : ${target}` };
    }
     node = node.children[segment];
  }
  return { node, path: pathSegments };


}

// POUR LE REDUCER 
const initialState = {
  currentPath: ["home"],
  history:[],
  isWon:false
}

function terminalReducer(state,action){

  switch(action.type){
    case "ADD_LINE" : 
      return {
        ...state,
        history: [...state.history, action.payload],
      };
      case  "NAVIGATE":
        return{
          ...state,
          currentPath:action.payload,
        }
      case "WIN_LEVEL":
        return{
          ...state,
          isWon:true
        }
      default :
        return state;

  }

}
// console.log(resolvePath(filesystem, ["home"], "document2"));

function executeCommand(commandLine,state,filesystem){
  // split(/\s+/) pour eviter qu'il est des element vide dans le tableau 
  const [cmd,...args] = commandLine.trim().split(/\s+/);
  switch(cmd){
    // si il a rien ou retourne rien 
    case "":{
      return { output: "" };
    }
    // le chemin actuelle 
    case "pwd": {
      return{
        output:"/" + state.currentPath.join("/")
      };
    }
    case "ls":{
      // retourne . si aucun argument est donnée 
      const target = args[0] || ".";
      const result = resolvePath(filesystem,state.currentPath,target);
      // s'il a une erreur retourne erreur et isError qui est a true 
      if(result.error){
        return {
          output:result.error, 
          isError : true
        }
      }
      // si ce n'est pas un dossier 
      if(result.node.type !== "dir"){
        return{
          output: "Il y a une erreur, il faut que ca soit un dossier ",
          isError:true
        }
      }
      // recupere les enfant les fichier enfant ou dossier 
      const children = Object.keys(result.node.children);
      // fait une verification si la taille de l'enfant n'est pas vide alors on les affiche sinon c'est ca affcihe c'est vide 
      return{
        output: children.length ? children.join(" ") : "(dossier vide)"
      };
    }

    case "cd":{
      // recupere le dossier ou on est ou par defaut on est sur home 
      const target = args[0] || "home";
      // resout le chemin - recupere le chemin 
      const result = resolvePath(filesystem,state.currentPath,target);
      // LES ERREURS A GERER      
      if(result.error){
        return{
          output: result.error , 
          isError : true
        };
      }
      if(result.node.type !== "dir"){
        return{
          output: "Erreur ca doit etre un dossier",
          isError:true
        };
      }
          // Ajout d'un  champs newPath pour pouvoir mettre a jour le type navigate du reducer
          return {
            output: "", 
            newPath: result.path 
          };
        
      }
    
      // pour cat
      case "cat":{
        const target = args[0];
        if(!target){
          return{
            output:"Il a une erreur",
            isError:true
          }
        }
        const result = resolvePath(filesystem,state.currentPath,target);
        if(result.error){
          return{
            output: result.error,
            isError:true
          }
        }
        if(result.node.type !=="file"){
          return{
            output:"erreur ca doit etre un fichier",
            isError:true
          }
        }
        return{
          output:result.node.content
        }
      }
      // en cas d'erreur 
      default:
        return{
          output:`commande introuvable : ${cmd}`,
          isError:true
        }
     
    }
  }
  // Quand c'est bon 
  function checkWin(commandLine) {
    return commandLine.trim() === "7291";
  }

  // Intro pour le texte
    const introText = "Tu es à ton travail devant ton ordinateur d'ou d'un coup la porte du bureau se ferme. Tu sens que tu n'a pas beaucoup d'oxygene. Tu regarde la porte et il a un code que tu ne connais pas .  " 
    const objectiveIntro ="Tu dois trouver rapidement le code pour cela tu navigue entre les différents dossier et fichier mais le temps est compter .   "

    // cette fonction fait 2 chose elle retire le fichier de son emplacement et l'ajoute a son nouvelle emplacement 
function updateAtPath(obj,path,newValue){
  if(path.length === 0){
    return newValue;
  }

  const [first,...rest] = path;
  return{
    ...obj,
    // On utilise les crochet pour que cela devienne le nom de la cle donc ca sera first et on aura pas besoin de l'ecrire 
    [first]: updateAtPath(obj[first],rest,newValue)
  };
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
  // pour le chemin 
  const [filesystem,setFilesystem] = useState(filesystemInitial);
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
    const result = executeCommand(commandLine,state,filesystem);
    
    // le dispatch pour ajouter une ligne 
    dispatch({
      type:"ADD_LINE",
      payload:{
        prompt:"/" + state.currentPath.join("/"),
        command: commandLine,
        output: result.output,
        isError:result.isError,
      }
    });
    // POUR L'HISTORIQUE 
    if(result.newPath){
      dispatch({
        type:"NAVIGATE",
        payload:result.newPath,
      })
    }
    e.target.value ="";
  }

      // Fonction pour le code a saisir 
    function handleCodeSubmit(e) {
      if (e.key !== "Enter") return;
      if (checkWin(codeInput)) {
        dispatch({ type: "WIN_LEVEL" });
        setCodeError(false);
      }else{
        setCodeError(true)
      }
    }
    
    
  return (
    <>
    {/* Pour afficher l'intro  */}
      {showIntro ?(
        <>
          <p> {introText} </p>
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
                <p> {objectiveIntro}</p>
                 <label>Code de déverrouillage : </label>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={handleCodeSubmit}
              />
              </>
            </div>
            
              {/* Pour savoir si tuas trouver e bon code */}

            {state.isWon  ? (
              <>
              <p style={{color:"green"}}> Felicitation tu as réussi </p>
              <button>Niveau suivant </button>
              </>
            ) : codeError ? (
              <>
                <p style={{ color:"red"}}> Ce n'est pas le bon code </p>
              </>
            ): null}

            <h1>Cours</h1>
            <p>Pour pouvoir avancé dans l'histoire il faudra que tu connaisses les bases de linux . Ne t'inquite pas ce cours va t'aider pour avancer dans l'histoire</p>
            <ul style={{ listStyle:"none",padding:0}}>
              <li> - pwd — affiche à quel endroit tu es actuellement dans l'arborescence. </li>
              <li> - ls — liste les fichiers et dossiers présents à l'endroit où tu es. </li>
              <li> - cd[dossier] — permet de te déplacer dans un dossier </li>
              <li> - cd .. — te fait remonter d'un niveau. </li>
              <li> - cat [fichier] — Affiche le contenus d'un fichier  </li>
            </ul>
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
