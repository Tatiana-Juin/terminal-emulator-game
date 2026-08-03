// fonction permettant de trouver le fichier : cela retourne le chemin du fichier 
export function findFile(node,targetName,currentPath){
    // currentPath[currentPath.length -1] permet de regarder le dernier nom du dossier 
    if(node.type ==="file" && currentPath[currentPath.length -1]===targetName){
        return currentPath;
    }
    // si node est un dossier 
    if(node.type ==="dir"){
        const names = Object.keys(node.children);
        // boucle sur chaque enfant 
        for(const name of names){
            // cherche dans cette enfant 
            const child = node.children[name];
            const result = findFile(child,targetName,[...currentPath,name]);
            // si il existe ca retourne le chemin 
            if(result){
                return result
            }
        }
    }
    
    return null;
}