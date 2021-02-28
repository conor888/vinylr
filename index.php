<?php

if (!isset($_COOKIE["auth_key"])) {
    header("Location: welcome.php", true, 200);
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>vinylr - scrobbler for plex</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div>
    <form action="" method="get" accept-charset="utf-8" id="plexSearch">
        <input type="text" class="text" name="query" id="query" autocomplete="off" spellcheck="false" placeholder="Search..." />
        <input type="submit" class="submit" value="Search" />
    </form>
</div>

<div id="results">

</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="plex.js"></script>
</body>
</html>