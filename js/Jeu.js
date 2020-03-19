class Jeu{



    constructor(){
        this.remplirTableau();
        this.gemmeTiree = null;
        this.trouves = [];
        this.score = 0;
        this.niveau = 1;
        this.essais = 5;
        document.getElementById("message").innerHTML = "";
        document.getElementById("essais").value = this.essais;
        document.getElementById("niveau").value =this.niveau;
        this.timer;
        this.start_countdown();
    }

    arreterChrono(){
        clearInterval(this.timer);
    }

    afficherScores(message){
        console.log("scores");

        var xmlhttp=new XMLHttpRequest();
        var noms = [];
        var meilleursScores = [];
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                console.log(xmlhttp.responseText);
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
                var scores = xmlDoc.getElementsByTagName("score");
                for (let i = 0; i < scores.length ; i++) {
                    noms.push(scores[i].childNodes[0].childNodes[0].nodeValue);
                    meilleursScores.push(scores[i].childNodes[1].childNodes[0].nodeValue);
                }
                document.getElementById("titre").innerHTML = message;

                var affichage = document.getElementById("affichage-scores");
                for (let i = 0; i < meilleursScores.length; i++) {
                    affichage.innerHTML += "<p>"+meilleursScores[i]+" - "+noms[i]+"</p>";
                }
                var modal = document.getElementById("myModal");
                var span = document.getElementsByClassName("close")[0];
                modal.style.display = "block";
                span.onclick = function() {
                    modal.style.display = "none";
                };
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            }
        };
        xmlhttp.open("GET","http://localhost/bejeweled/bejeweled.php?scores=1",true);
        xmlhttp.send();
    }

    majScore(){
        console.log("score", this.score);
        switch (this.trouves.length) {
            case 3:
                this.score += this.niveau*100;
                break;
            case 4:
                this.score += this.niveau*300;
                break;
            case 5:
                this.score += this.niveau*1000;
                break;
            default:
                this.score += this.niveau * this.trouves.length * 200;
                break;
        }
        document.getElementById("score").value = this.score;
    }

    gameOver(){
        var images = document.getElementsByTagName("img");
        for (let i = 0; i < images.length ; i++) {
            images[i].onclick = null;
            images[i].style.opacity = 0.5;
            jeu.arreterChrono();
            stop();
        }
        document.getElementById("message").innerHTML = "Game over !";
        console.log(document.getElementById("message").innerHTML)
        //this.enregistrerScores();
    }

    start_countdown(){

        var decrem = 1;
        this.timer = setInterval(function(jeu){
            document.getElementById("pbar").value -= decrem;
            if (parseInt(document.getElementById("pbar").value) == 0){
                jeu.gameOver();
            }
            if (parseInt(document.getElementById("pbar").value) >=95){
                jeu.incrementLevel();
                document.getElementById("pbar").value = 50;
                document.getElementById("niveau").value = jeu.niveau;
                decrem+=2;
            }

        },1000, this);
    }

    incrementLevel(){
        this.niveau++;
    }

    incrementerBar(){
        document.getElementById("pbar").value+=10;
    }

    verifier(){
        for (let i = 0; i < document.getElementsByTagName("img").length; i++) {
            this.possibilite(document.getElementsByTagName("img")[i]);
            this.possibiliteVert(document.getElementsByTagName("img")[i])
        }
    }

    imageAleatoire(){
        return "assets/gem"+(Math.floor(Math.random() * 6) +1)+".png";
    }

    //rempli le tableau avec des images et affecte a chaque image un id permettant de retrouver sa position
    remplirTableau() {
        document.getElementById("tableau").innerHTML = "";
        console.log("rempli");
        var html = "";
        var nbImages = 1;
        for (let i = 0; i < 8; i++) {
            html+="<tr>";
            for (let j = 0; j < 8; j++) {
                html+="<td  ><img onclick='jouer(this)' id='"+nbImages+"' height='50' width='50' src='assets/gem"+(Math.floor(Math.random() * 6) +1)+".png'></img></td>";
                nbImages++;
            }
            html+="</tr>"
        }

        document.getElementById("tableau").innerHTML = html;
       var images = document.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            if (this.possibilite(images[i]) || this.possibiliteVert(images[i])){
                this.remplirTableau();
            }
        }
    }

    jouer(image){
        if (this.gemmeTiree == null){
            this.gemmeTiree = image;
        }else{
            if (image != this.gemmeTiree ){
                console.log("image : ",image.id , "image tiree : ",this.gemmeTiree.id);
                console.log(parseInt(image.id) == (parseInt(this.gemmeTiree.id)-1), parseInt(image.id) , (parseInt(this.gemmeTiree.id))-1,(parseInt(image.id)+1) , parseInt(this.gemmeTiree.id),  (parseInt(image.id)+1) == parseInt(this.gemmeTiree.id))
                if (parseInt(image.id) == (parseInt(this.gemmeTiree.id)-1) || (parseInt(image.id)) == parseInt(this.gemmeTiree.id)+1 || parseInt(image.id) == (parseInt(this.gemmeTiree.id)-8) || (parseInt(image.id)) == parseInt(this.gemmeTiree.id)+8){
                    var temp = image.src;
                    image.src = this.gemmeTiree.src;
                    this.gemmeTiree.src = temp;
                    if (this.possibiliteVert(image) || this.possibilite(image) || (this.possibiliteVert(image) && this.possibilite(image))){
                        this.verifier();
                    }else{
                        var temp = image.src;
                        image.src = this.gemmeTiree.src;
                        this.gemmeTiree.src = temp;
                        this.gemmeTiree = null;
                        this.essais--;
                        document.getElementById("essais").value = this.essais;
                        if (this.essais == 0){
                            this.gameOver();
                        }
                    }
                    this.gemmeTiree =null;
                }
            }
        }
    }

    possibiliteVert(image){
        this.trouves = [];
        this.trouves.push(image);
        if(parseInt(image.id)==64 || parseInt(image.id)+8>64){
            console.log("condition vert 1");
            //toutes les images identiques du haut
            var imageHaut = document.getElementById(parseInt(image.id)-8);
            var id = imageHaut.id;
            console.log(id);
            console.log(document.getElementById(id));
            console.log(document.getElementById(id).src == image.src && parseInt(id) > 0)
            while( id > 0 && document.getElementById(id).src == image.src){
                this.trouves.push(document.getElementById(id));
                id = parseInt(id);
                id -= 8;
                console.log("prochain id", id);
            }
            if (this.trouves.length >= 3){
                this.incrementerBar();
                this.remplacerVerticale();
                return true;
            }else{
                this.trouves = [];
                return false;
            }
        }else if(parseInt(image.id)==1 || parseInt(image.id)-8<1){
            console.log("condition vert 2");
            //toutes les images du bas
            var imageBas = document.getElementById(parseInt(image.id)+8);
            var id = imageBas.id;
            console.log(id);
            console.log(document.getElementById(id));
            while ( id>=1 && id <=64 && document.getElementById(id).src == image.src){
                console.log(document.getElementById(id).id , id);
                this.trouves.push(document.getElementById(id));
                id = parseInt(id);
                id+=8;
                console.log("prochain id", id);
            }
            if (this.trouves.length >= 3){
                this.incrementerBar();
                this.remplacerVerticale();
                return true;
            }else{
                this.trouves = [];
                return false;
            }
        }else{
            console.log("condition vert 3")
            //images en haut et en bas
            var imageHaut = document.getElementById(parseInt(image.id)-8);
            var id = parseInt(imageHaut.id);
            console.log(id);
            console.log(document.getElementById(id));
            console.log(document.getElementById(id).src == image.src && parseInt(id) > 0)
            console.log("null ", id);
            while( id > 0 && (document.getElementById(id).src == image.src)){
                this.trouves.push(document.getElementById(id));
                id = parseInt(id);
                id -= 8;
                console.log("prochain id", id);
            }

            var imageBas = document.getElementById(parseInt(image.id)+8);
            var id = imageBas.id;
            console.log(id);
            console.log(document.getElementById(id));
            while (id <=64 && document.getElementById(id).src == image.src){
                console.log(document.getElementById(id).id , id);
                this.trouves.push(document.getElementById(id));
                id = parseInt(id);
                id+=8;
                console.log("prochain id", id);
            }
            if (this.trouves.length >= 3){
                this.incrementerBar();
                this.remplacerVerticale();
                return true;
            }else{
                this.trouves = [];
                return false;
            }
        }
    }

    possibilite(image){


        //TODO: gros probleme quand on joue en glissant vers la droite ou la gauche, comme les images sont pas encore changées, la premiere image est reconnue comme etant toujours a la meme place donc comme etant remplacée
        this.trouves = [];
        this.trouves.push(image);
        console.log("condition 1",(parseInt(image.id) == 1 || (parseInt(image.id)-1)%8 !=0));
        if(parseInt(image.id) == 1 || (parseInt(image.id)-1)%8 ==0){
            var imageGauche = document.getElementById(parseInt(image.id)+1);
            var id = parseInt(imageGauche.id);
            while ( (parseInt(id)-1)%8 !=0 && document.getElementById(id).src == image.src){
                console.log(document.getElementById(id).id , id);
                this.trouves.push(document.getElementById(id));
                id++;
                console.log("prochain id", id);
            }
            console.log(this.trouves);
            console.log(this.trouves.length);
            if (this.trouves.length >= 3){
                this.incrementerBar();
                this.remplacer();
                return true;
            }else{
                this.trouves = [];
                return false;
            }
        }
        else if (parseInt(image.id) == 64 || parseInt(image.id)%8 == 0){
            console.log("condition 2",(parseInt(image.id) == 64 || parseInt(image.id)%8 != 0));
            var imageDroite = document.getElementById(parseInt(image.id)-1);
            id = parseInt(imageDroite.id);
            while ( (parseInt(id))%8 != 0 && document.getElementById(id).src == image.src){
                console.log(document.getElementById(id).id , id);
                this.trouves.push(document.getElementById(id));
                id--;
                console.log("prochain id", id);
            }
            console.log(this.trouves);
            console.log(this.trouves.length);
            if (this.trouves.length >= 3){
                this.incrementerBar();
                this.remplacer();
                return true;
            }else{
                this.trouves = [];
                return false;
            }
        }else{
            console.log("condition 3");
            var imageGauche = document.getElementById(parseInt(image.id)+1);
            var imageDroite = document.getElementById(parseInt(image.id)-1);
            var id = parseInt(imageGauche.id);
            while ( (parseInt(id)-1)%8 !=0 && document.getElementById(id).src == image.src){
                console.log("test");
                console.log(document.getElementById(id).id , id);
                this.trouves.push(document.getElementById(id));
                id++;
                console.log("prochain id", id);
            }
            id = parseInt(imageDroite.id);
            while ( (parseInt(id))%8 !=0 && document.getElementById(id).src == image.src){
                console.log("test");
                console.log(document.getElementById(id).id , id);
                this.trouves.push(document.getElementById(id));
                id--;
                console.log("prochain id", id);
            }
            console.log(this.trouves);
            console.log(this.trouves.length);
            if (this.trouves.length>=3){
                this.incrementerBar();
                this.remplacer();
                return true;
            }else{
                return false;
            }
        }

    }

    remplacer() {
        this.majScore();
        console.log(this.trouves);
        for (let i = 0; i <this.trouves.length ; i++) {
            if(this.trouves[i].id <= 8){
                console.log("image aleatoire");
                this.trouves[i].src=this.imageAleatoire();
            }else{
                this.trouves[i].src = document.getElementById(parseInt(this.trouves[i].id)-8).src;
                var imageDessus = this.trouves[i];
                while (imageDessus.id>8){
                    console.log(imageDessus.id);
                    imageDessus.src = document.getElementById(parseInt(imageDessus.id)-8).src;
                    imageDessus = document.getElementById(parseInt(imageDessus.id)-8);
                }
                imageDessus.src = this.imageAleatoire();
            }
        }
        this.trouves = [];
    }
    remplacerVerticale(){
        this.majScore();
        //recupere l'image la plus en bas grace a son id et itère de celle la jusqu'en haut pour les remplacer.
        var max = 0;
        for (let i = 0; i < this.trouves.length ; i++) {
            if (parseInt(this.trouves[i].id )> max){
                max = parseInt(this.trouves[i].id);
            }
        }
        var id = max;
        while(id > 0){
            console.log(id, id-(8*this.trouves.length), this.trouves.length)
            if (id-(8*this.trouves.length)>0){
                console.log(id, " a remplacer par ", document.getElementById(id-(8*this.trouves.length)).id);
                document.getElementById(id).src =  document.getElementById(id-(8*this.trouves.length)).src;
            }else{
                document.getElementById(id).src = this.imageAleatoire();
            }
            id-=8;
        }

         this.trouves = []
    }

    enregistrerScores(scores) {
        var xmlhttp=new XMLHttpRequest();
        var noms = [];
        var meilleursScores = [];
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                console.log(xmlhttp.responseText);
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
                var scores = xmlDoc.getElementsByTagName("score");
                for (let i = 0; i < scores.length ; i++) {
                    meilleursScores.push(scores[i].childNodes[1].childNodes[0].nodeValue);
                }
                var score = parseInt(document.getElementById("score").value);
                for (let i = 0; i < meilleursScores.length; i++) {
                    if (parseInt(meilleursScores[i])<score){
                        var nom = prompt("entrez votre nom en 3 lettres","");
                        var xmlhttp2=new XMLHttpRequest();
                        xmlhttp2.onreadystatechange=function(){
                            if (xmlhttp2.readyState==4 && xmlhttp2.status==200) {

                            }
                        };
                        xmlhttp2.open("GET","http://localhost/bejeweled/bejeweled.php?idScore="+i+"&score="+score+"&name="+nom.toUpperCase(),true);
                        xmlhttp2.send();
                        afficherScores();
                        break;
                    }
                }
            }
        };
        xmlhttp.open("GET","http://localhost/bejeweled/bejeweled.php?scores=1",true);
        xmlhttp.send();
    }
}