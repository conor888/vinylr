const pathToAPI = 'api.php'; // replace with your path to the api.php file

function getSearchParameters() {
    let prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr !== "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = decodeURIComponent(tmparr[1]);
    }
    return params;
}

function performSearch() {
    const resultsContainer = $('#results');
    resultsContainer.html('');
    resultsContainer.append('<h3>Searching...</h3>');

    const query = $('#query').val();
    if (!query.length) {
        return false;
    }

    $.ajax({
        type: "GET",
        crossDomain: true,
        url: pathToAPI,
        data: {query: query, type: 'request'},
        dataType: 'json'
    }).done(function(data) {
        resultsContainer.html('');
        if (data.error) {
            resultsContainer.append('<h3>'+data.error+'</h3>');
        } else {
            if (!data.Directory) {
                resultsContainer.append('<h3>No results found.</h3>');
            } else if (!data.Directory["@attributes"]) {
                for (let i = 0; i < data.Directory.length; i++) {
                    parseResult(data.Directory[i]["@attributes"], data.Directory[i]["tracks"]);
                }
            } else {
                parseResult(data.Directory["@attributes"], data.Directory["tracks"]);
            }
        }
    });
}

function parseResult(album, tracks) {
    let html = '<div id="result-'+album.id+'" class="result"><div class="result-left">';
    html += '<img src="'+album.thumb+'" alt="Artwork for \''+album.title+'\'" class="result-img">';
    html += '</div><div class="result-right">';
    html += '<h2>'+album.title+'</h2>';
    html += '<h4 class="artist">'+album.parentTitle+', '+album.year+'</h4>';
    if (tracks.length) {
        html += '<div class="tracks">' + tracks.length + ' tracks</div>';
    } else {
        html += '<div class="tracks">1 track</div>';
    }

    html += '<form action="" method="post" accept-charset="utf-8" id="scrobble-'+album["ratingKey"]+'" class="track-list">';

    if (tracks.length) {
        for (let j = 0; j < tracks.length; j++) {
            html += parseTrack(tracks[j]["@attributes"]);
        }
    } else {
        html += parseTrack(tracks["@attributes"]);
    }
    html += '<span class="button-float"><input type="button" value="Save" class="save" id="save-'+album["ratingKey"]+'" />';
    html += '<input type="submit" value="Scrobble" class="scrobble" id="scrobble-submit-'+album["ratingKey"]+'" /></span></form>';

    html += '</div></div>';

    $('#results').append(html);

    $('#scrobble-'+album["ratingKey"]).submit(function() {
        scrobbleAlbum(album["ratingKey"]);
        return false;
    });

    $('#save-'+album["ratingKey"]).click(function(){
        saveAlbum(album["ratingKey"]);
    });
}

function parseTrack(track) {
    let html = "";
    html += '<input type="checkbox" name="track-'+track["ratingKey"]+'" id="track-'+track["ratingKey"]+'-'+track["duration"]+'" checked />';
    html += '<label for="track-'+track["ratingKey"]+'-'+track["duration"]+'">'+track["index"]+'. '+track["title"]+'</label><br>';

    return html;
}

function scrobbleAlbum(albumKey) {
    let scrobbleButton = $("#scrobble-submit-" + albumKey);
    scrobbleButton.removeClass("success failure");
    scrobbleButton.val(" ");
    scrobbleButton.addClass("loading");

    let tracks = [];
    $('#scrobble-'+albumKey).children('input[type=checkbox]').each(function() {
        if(this.checked) {
            tracks.push(this.id.substring(6));
        }
    })

    $.ajax({
        type: "POST",
        crossDomain: true,
        url: pathToAPI,
        data: {type: 'scrobble', tracks: tracks},
        dataType: 'json'
    }).done(function(data){
        scrobbleButton.removeClass("loading");
        scrobbleButton.val("Scrobble");
        if(data.length === 0) {
            scrobbleButton.addClass("success");
        } else {
            scrobbleButton.addClass("failure");
        }
    });
}

function saveAlbum(albumKey) {
    let saveButton = $("#save-" + albumKey);
    saveButton.removeClass("success failure");
    saveButton.val(" ");
    saveButton.addClass("loading");

    let tracks = [];
    $('#scrobble-'+albumKey).children('input[type=checkbox]').each(function() {
        if(!this.checked) {
            tracks.push(this.id.substring(6));
        }
    })

    $.ajax({
        type: "POST",
        crossDomain: true,
        url: pathToAPI,
        data: {type: 'save', album: albumKey, tracks: tracks},
        dataType: 'json'
    }).done(function(data){
        saveButton.removeClass("loading");
        saveButton.val("Save");
        if(data === "success") {
            saveButton.addClass("success");
        } else {
            saveButton.addClass("failure");
        }
    });
}

$(document).ready(function() {
    const params = getSearchParameters();
    if (params.query) {
        $('#query').val(params.query);
        performSearch();
    }

    $('#plexSearch').submit(function() {
        performSearch();
        return false;
    });
});