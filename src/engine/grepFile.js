// include => pour chercher un mot 
// fonction pour trouver un mot 
export function grep(node,targetName){
    const names = Object.keys(node.children);
    const matches = []
    for(const name of names){
         const child = node.children[name]
        if(child.type ==="file"){
            if(child.content.includes(targetName)){
                matches.push(name);
            }
        }
    }
    return matches;
   
}