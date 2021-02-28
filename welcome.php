<?php

if (!isset($_COOKIE["client_id"])) {
    setcookie("client_id", uniqid(), time() + (86400 * 3650), "/vinyl");
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
<div id="welcome-wrapper">
    <div class="logo-large"></div>
    <div class="logo-title">
        <h1>Vinylr for Plex</h1>
        <h2>Scrobble offline music plays to Plex</h2>
    </div>
    <button id="login-button">Login with Plex</button>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="cookie.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        $('#login-button').click(function(){
            $.ajax({
                type: "POST",
                crossDomain: true,
                url: "https://plex.tv/api/v2/pins",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Accept", "application/json")
                },
                data: {strong: true, "X-Plex-Product": 'Vinylr for Plex', "X-Plex-Client-Identifier": getCookie("client_id")},
            }).done(function(data){
                setCookie("access_id", data.id, 0.1);
                setCookie("access_code", data.code, 0.1);

                window.location.href = "https://app.plex.tv/auth#?clientID=" + getCookie("client_id") + "&code=" + data.code +
                                        "&forwardUrl=" + encodeURIComponent("https://conorahern.me/vinyl/verify.html") +
                                        "&context%5Bdevice%5D%5Bproduct%5D=" + encodeURIComponent("Vinylr for Plex");
            });
        });
    });
</script>

</body>
</html>
