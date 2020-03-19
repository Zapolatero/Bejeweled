<?php
include "connexion.php";
header("Access-Control-Allow-Origin: *");
//requete pour demander les scores
if (isset($_GET["scores"])){
    $sql="select * from scores";
    $result = mysqli_query($con,$sql);
    $scores = mysqli_fetch_all($result);
    echo "<scores>";
    foreach ($scores as $score){
        echo "<score>"."<name>".$score[2]."</name><mont>".$score[1]."</mont>"."</score>";
    }
    echo "</scores>";
}

if (isset($_GET["score"]) && isset($_GET["idScore"]) && isset($_GET["name"])){
    $score = $_GET["score"]; //score du joueur
    $id = $_GET["idScore"]; // id du score a remplacer
    $name = $_GET["name"]; // nom du joueur
    echo $score.$id.$name;

    $sql="update scores set score = ".$score.", name = '".$name."' where id = ".$id;
    $result = mysqli_query($con,$sql);
}