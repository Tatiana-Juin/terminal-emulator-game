// FONCTION POUR LES CHEMIN 
export function resolvePath(fs,currentPath,target){
  // On decide d'ou on part racine si absolu , currentPath si absolu 
  let pathSegments = target.startsWith("/") ? [] : [...currentPath];
  // decoupe le reste du chemin en segment individuels 
  const targetSegments = target.split("/").filter(Boolean);

 for(const segment of targetSegments){
    if(segment ===".."){
      // on enelve un 
      pathSegments=pathSegments.slice(0,-1)
    }
    else if(segment==="."){
      // on ignore
    }else{
      pathSegments=[...pathSegments,segment]
    }
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