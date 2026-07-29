import { resolvePath } from "./resolvePath";
import { updateAtPath,removeAtPath,toChildrenPath } from "./pathUtils";
export function executeCommand(commandLine,state,filesystem){
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
      case "mv":{
        const targetSource = args[0];
        const targetDestination = args[1];
        //  vérifie que l'utilisateur a bien tapé une source ET une destination après mv
        if(!targetSource || !targetDestination){
          return{
            output:"usage : mv <source> <destination>",
            isError:true
          };
        }
        // pour récuperer le fichier voir s'il existe 
        const resultSource = resolvePath(filesystem,state.currentPath,targetSource);
        if(resultSource.error){
          return{
            output: resultSource.error,
            isError:true
          }
        }
        if(resultSource.node.type !=="file"){
          return{
            output:"erreur ca doit etre un fichier",
            isError:true
          }
        }
        // ==========================================
        // lOGIQUE DE VERIFICATION
        // ==========================================

        // 3a. Récupérer le nom exact du fichier d'origine
        // Ex: si targetSource est "temp/code_alarme.txt", sourceFileName devient "code_alarme.txt"
        const sourceSegments = targetSource.split("/").filter(Boolean);
        const sourceFileName = sourceSegments[sourceSegments.length - 1];

        // 3b. Récupérer le nom de destination proposé par le joueur
        // Ex: si targetDestination est "../securite", destFileName devient "securite"
        const destSegments = targetDestination.split("/").filter(Boolean);
        const destFileName = destSegments[destSegments.length - 1];

        // 3c. L'interdiction stricte : on compare les deux noms
        if (destFileName !== sourceFileName) {
          return {
            output: `Erreur : Vous devez spécifier le nom complet du fichier à l'arrivée (ex: .../${sourceFileName})`,
            isError: true
          };
        }
        // ==========================================

        // 4. Isoler le chemin du dossier de destination en enlevant le nom du fichier à la fin
        // Ex: "../securite/code_alarme.txt" devient "../securite"
        const destFolderPath = (targetDestination.startsWith("/") ? "/" : "") + destSegments.slice(0, -1).join("/");
        
        // 5. Vérifier que ce dossier de destination existe bien
        const resultDestFolder = resolvePath(filesystem, state.currentPath, destFolderPath);
        if (resultDestFolder.error) {
          return {
            output: resultDestFolder.error,
            isError: true
          }
        }
        if (resultDestFolder.node.type !== "dir") {
          return {
            output: "erreur: la destination doit être un dossier",
            isError: true
          }
        }

        // 6. Procéder au déplacement (suppression puis ajout)
        const filesystemAfterRemove = removeAtPath(filesystem, toChildrenPath(resultSource.path));
        const filesystemAfterAdd = updateAtPath(
          filesystemAfterRemove,
          toChildrenPath([...resultDestFolder.path, destFileName]),
          resultSource.node
        );

        return {
          output: "",
          newFilesystem: filesystemAfterAdd
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