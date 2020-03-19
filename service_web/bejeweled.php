<?php
include "connexion.php";
//requete pour demander les scores
if (isset($_GET["scores"])){
    $sql="select * from scores";
    $result = mysqli_query($con,$sql);
    $scores = mysqli_fetch_all($result);
    print_r($scores);
    echo "<scores>";
    foreach ($scores as $score){
        echo "<score>"."<name>".$score[2]."</name><mont>".$score[1]."</mont>"."</score>";
    }
    echo "</scores>";
}