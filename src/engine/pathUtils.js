export function updateAtPath(obj,path,newValue){
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

export function removeAtPath(obj,path){
  // si la cles existe on se place au dessus et on la supprime 
  if(path.length ===1){
    const copy = {...obj};
    delete copy[path[0]];
    return copy
  }
  // first premier element /home 
  // rest => ["temps","code_alarme.txt"]=> tout le reste du tableau 
  const [first, ...rest] = path;
  return{
    ...obj,
    [first] : removeAtPath(obj[first],rest)
  }
}

// fonction qui  permet d'ajouter children entre chaque segment(dossier fichier) comme dans l'arborescence du premier niveau c'est pour cela qu'on a un bug car on a directement acces a l'objet alors que on a besoin de children 
export function toChildrenPath(pathSegments){
  const result= [];
  for(const segment of pathSegments){
    result.push("children");
    result.push(segment)
  }
  return result;
}