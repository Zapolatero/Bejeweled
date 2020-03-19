var jeu = new Jeu();
function jouer(image){
    jeu.jouer(image);

}

function afficherScores() {
    console.log("scoress");

    jeu.afficherScores();
}

function recommencer() {
    jeu = new Jeu();
}