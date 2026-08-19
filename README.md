# Jeu pour apprendre les ligne de commande 

Un jeu web pédagogique pour apprendre les bases du terminal linux à travers une histoire interactive.

 ## Concept 
 Un hacker c'est infiltré dans ton systeme . A travers 6 niveaux , apprends à naviguer, manipulé ddes fichier , rechercher du contenu et gérer des permissions - en utilisant des vraies commande Linux dans un terminal simulé . 

 ## Stack technique 
 - **React** (Vite)
 - **JavaScript (ES6+)** - aucune librairie externe pour le moteur de jeu 
 - **CSS pur** pour le design

## Ce que le joueur apprends 
 | Niveau | Commandes | Concept |
 |--------|-----------|---------|
 | 1 | `pwd`,`ls`,`cd`,`cat` | Navigation et lecture de fichiers |
 | 2 | `mv` | Manipulation de fichiers |
 | 3 | `grep` | Recherche de contenu |
 | 4 | `find` | Recherche de fichiers |
 | 5 6 | `chmod` | Changer les permissions |

## Défis techniques rencontrés 
- **Ssytème de fichier virtuel récursif**: navigation, création et suppression imutable dans une structure arborescente profondément imbriqué.
- **Parsing de chemin**: gestion de chemin absolus, relatifs, et des segments spéciaux (`.`,`..`) mélangé dans un même chemin.
- **Recherche récursive**: (`find`) vs. recherche locale (`grep`): deux algorithmes distincts pour deux besoins différents.

## Installation 
````
git clone https://github.com/Tatiana-Juin/terminal-emulator-game

npm install 

npm run dev
````



