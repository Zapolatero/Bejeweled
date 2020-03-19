var jeu = new Jeu();
function jouer(image){
    jeu.jouer(image);

}

function afficherScores() {
    console.log("scoress");

    jeu.afficherScores("Meilleurs Scores");
}

function recommencer() {
    jeu = new Jeu();
}