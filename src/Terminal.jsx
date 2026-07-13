import { useReducer,useRef,useEffect } from "react"

const filesystem={
  type:"dir",
  children:{
    home:{
      type:"dir",
      children:{
        // home/document1
        document1:{
          type:"dir",
          children:{
            "indicePossible.txt":{
              type:"file",
              content:"Tu t'est tromper de dossier",
            }
          }
        },
        // /home/document2
       document2:{
          type:"dir",
          children:{
            "indice.txt":{
              type:"file",
              content:"bravo tu as trouver le code LINUX 15454"
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
      default :
        return state;

  }

}
// console.log(resolvePath(filesystem, ["home"], "document2"));

function executeCommand(commandLine,state){
  // split(/\s+/) pour eviter qu'il est des element vide dans le tableau 
  const [cmd,...args] = commandLine.trim().split(/\s+/);
  switch(cmd){
    // si il a rien ou retourne rien 
    case "":{
      return { output: "" };
    }
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
  }
}

export default function Terminal() {
  return (
    <div>
      terminal
    </div>

  )
}
