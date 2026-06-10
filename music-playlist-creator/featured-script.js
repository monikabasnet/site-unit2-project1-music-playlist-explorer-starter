// Load playlist data
let playlists = [];
let currentFeaturedPlaylist = null;
let isLiked = false;

// Fetch data from JSON file
async function loadPlaylists() {
    try {
        const response = await fetch('../data/data.json');
        playlists = await response.json();

        if (playlists.length > 0) {
            loadNewFeatured();
        } else {
            document.getElementById('featuredName').textContent = 'No playlists available';
        }
    } catch (error) {
        console.error('Error loading playlists:', error);
        document.getElementById('featuredName').textContent = 'Error loading playlists';
    }
}

// Select a random playlist from the array
function selectRandomPlaylist() {
    const randomIndex = Math.floor(Math.random() * playlists.length);
    return playlists[randomIndex];
}

// Display the featured playlist
function displayFeaturedPlaylist(playlist) {
    currentFeaturedPlaylist = playlist;
    isLiked = false; // Reset like status for new playlist

    // Update cover image
    const coverImg = document.getElementById('featuredCover');
    coverImg.src = playlist.coverImage;
    coverImg.alt = `${playlist.name} cover`;

    // Update playlist info
    document.getElementById('featuredName').textContent = playlist.name;
    document.getElementById('featuredAuthor').textContent = `by ${playlist.author}`;
    document.getElementById('featuredLikeCount').textContent = playlist.likeCount;

    // Reset like button
    const likeBtn = document.getElementById('featuredLikeBtn');
    const heartIcon = likeBtn.querySelector('.heart-icon');
    heartIcon.textContent = '♡';
    likeBtn.classList.remove('liked');

    // Display songs
    displaySongs(playlist.songs);
}

// Display songs in the list
function displaySongs(songs) {
    const songList = document.getElementById('featuredSongList');
    songList.innerHTML = ''; // Clear existing songs

    songs.forEach((song, index) => {
        const songItem = document.createElement('li');
        songItem.className = 'featured-song-item';

        songItem.innerHTML = `
            <span class="song-number">${index + 1}.</span>
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <span class="song-duration">${song.duration}</span>
        `;

        songList.appendChild(songItem);
    });
}

// Load a new random featured playlist
function loadNewFeatured() {
    const randomPlaylist = selectRandomPlaylist();
    displayFeaturedPlaylist(randomPlaylist);
}

// Shuffle the songs in the current playlist
function shuffleSongs() {
    if (!currentFeaturedPlaylist) return;

    // Fisher-Yates shuffle algorithm
    const shuffledSongs = [...currentFeaturedPlaylist.songs];
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
    }

    displaySongs(shuffledSongs);
}

// Toggle like status
function toggleLike() {
    if (!currentFeaturedPlaylist) return;

    const likeBtn = document.getElementById('featuredLikeBtn');
    const heartIcon = likeBtn.querySelector('.heart-icon');
    const likeCountSpan = document.getElementById('featuredLikeCount');

    if (isLiked) {
        // Unlike
        currentFeaturedPlaylist.likeCount--;
        heartIcon.textContent = '♡';
        likeBtn.classList.remove('liked');
    } else {
        // Like
        currentFeaturedPlaylist.likeCount++;
        heartIcon.textContent = '♥';
        likeBtn.classList.add('liked');
    }

    isLiked = !isLiked;
    likeCountSpan.textContent = currentFeaturedPlaylist.likeCount;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPlaylists();

    // Like button
    document.getElementById('featuredLikeBtn').addEventListener('click', toggleLike);

    // Shuffle button
    document.getElementById('featuredShuffleBtn').addEventListener('click', shuffleSongs);

    // New Featured button
    document.getElementById('newFeaturedBtn').addEventListener('click', loadNewFeatured);
});
