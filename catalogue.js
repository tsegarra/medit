var Artist = /** @class */ (function () {
    function Artist(name, imageUrl) {
        this.name = name;
        this.albums = [];
        this.imageUrl = imageUrl;
    }
    return Artist;
}());
var Song = /** @class */ (function () {
    function Song(title, sectionNames) {
        this.title = title;
        this.sectionNames = sectionNames;
    }
    return Song;
}());
var Album = /** @class */ (function () {
    function Album(name, year, imageUrl) {
        this.name = name;
        this.year = year;
        this.imageUrl = imageUrl;
        this.songs = [];
    }
    return Album;
}());
var SpreadsheetParser = /** @class */ (function () {
    function SpreadsheetParser() {
    }
    SpreadsheetParser.parse = function (rows) {
        console.log(rows);
        var artists = [];
        var artist = undefined;
        var album = undefined;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row[0]) {
                artist = new Artist(row[0], row[4] || '');
                artists.push(artist);
            }
            if (row[1]) {
                var albumString = row[1];
                var albumYear = parseInt(albumString.substring(1, 5));
                var albumName = albumString.slice('[0000] '.length);
                album = new Album(albumName, albumYear, row[5] || '');
                if (artist) {
                    artist.albums.push(album);
                }
            }
            var songTitle = row[2];
            var sectionNames = row[3].split('; ');
            var song = new Song(songTitle, sectionNames);
            if (album) {
                album.songs.push(song);
            }
        }
        return artists;
    };
    SpreadsheetParser.writeTableToDom = function (artists) {
        var tableElement = document.createElement('table');
        artists.forEach(function (artist) {
            var firstArtistCell = true;
            artist.albums.forEach(function (album) {
                var firstAlbumCell = true;
                album.songs.forEach(function (song) {
                    var firstSongCell = true;
                    song.sectionNames.forEach(function (sectionName) {
                        var tr = document.createElement('tr');
                        var td;
                        if (firstArtistCell) {
                            td = document.createElement('td');
                            var p = document.createElement('p');
                            p.classList.add('artist-name');
                            p.textContent = artist.name;
                            td.appendChild(p);
                            td.rowSpan = artist.albums.reduce(function (acc, album) {
                                return acc + album.songs.reduce(function (acc2, song) {
                                    return acc2 + song.sectionNames.length;
                                }, 0);
                            }, 0);
                            if (artist.imageUrl) {
                                var img = document.createElement('img');
                                img.classList.add('image-artist');
                                img.src = artist.imageUrl;
                                td.appendChild(img);
                            }
                            tr.appendChild(td);
                            firstArtistCell = false;
                        }
                        if (firstAlbumCell) {
                            td = document.createElement('td');
                            var p = document.createElement('p');
                            p.classList.add('album-name');
                            p.textContent = album.name;
                            td.appendChild(p);
                            if (album.imageUrl) {
                                var img = document.createElement('img');
                                img.classList.add('image-album');
                                img.src = album.imageUrl;
                                td.appendChild(img);
                            }
                            td.rowSpan = album.songs.reduce(function (acc, song) {
                                return acc + song.sectionNames.length;
                            }, 0);
                            tr.appendChild(td);
                            firstAlbumCell = false;
                        }
                        if (firstSongCell) {
                            td = document.createElement('td');
                            td.textContent = song.title;
                            td.rowSpan = song.sectionNames.length;
                            tr.appendChild(td);
                            firstSongCell = false;
                        }
                        td = document.createElement('td');
                        td.textContent = sectionName;
                        tr.appendChild(td);
                        tableElement.appendChild(tr);
                    });
                });
            });
        });
        var bodyElement = document.getElementsByTagName('body')[0];
        bodyElement.appendChild(tableElement);
    };
    return SpreadsheetParser;
}());
