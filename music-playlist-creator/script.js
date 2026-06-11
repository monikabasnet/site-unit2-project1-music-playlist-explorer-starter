// ===== MODAL FUNCTIONALITY =====

// Step 1: Get references to HTML elements
const modalOverlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('closeBtn');
const modalLikeBtn = document.getElementById('modalLikeBtn');
const modalHeartIcon = document.getElementById('modalHeartIcon');
const modalLikeCountSpan = document.getElementById('modalLikeCount');

// Add Playlist Modal references
const addPlaylistModal = document.getElementById('addPlaylistModal');
const addPlaylistBtn = document.getElementById('addPlaylistBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const addPlaylistForm = document.getElementById('addPlaylistForm');
const addSongBtn = document.getElementById('addSongBtn');
const songsContainer = document.getElementById('songsContainer');

// Edit Playlist Modal references
const editPlaylistModal = document.getElementById('editPlaylistModal');
const closeEditFormBtn = document.getElementById('closeEditFormBtn');
const cancelEditFormBtn = document.getElementById('cancelEditFormBtn');
const editPlaylistForm = document.getElementById('editPlaylistForm');
const addEditSongBtn = document.getElementById('addEditSongBtn');
const editSongsContainer = document.getElementById('editSongsContainer');
let editingPlaylistIndex = null;

// Step 2: Close modal when X button is clicked
closeBtn.addEventListener('click', function() {
    modalOverlay.setAttribute('hidden', '');
});

// Step 2.1: Modal like button functionality
modalLikeBtn.addEventListener('click', function() {
    if (!currentPlaylist) return;

    // Find the playlist index
    const playlistIndex = playlistsData.indexOf(currentPlaylist);
    if (playlistIndex === -1) return;

    // Toggle the like state
    if (currentPlaylist.isLiked) {
        // Unlike
        currentPlaylist.likeCount--;
        currentPlaylist.isLiked = false;
        modalHeartIcon.textContent = '♡';
    } else {
        // Like
        currentPlaylist.likeCount++;
        currentPlaylist.isLiked = true;
        modalHeartIcon.textContent = '♥';
    }

    // Update the modal display
    modalLikeCountSpan.textContent = currentPlaylist.likeCount;

    // Update the card in the background
    const card = document.querySelector(`.playlist-card[data-index="${playlistIndex}"]`);
    if (card) {
        const cardHeart = card.querySelector('.heart-icon.like-btn');
        const cardLikeCount = card.querySelector('.like-count');

        if (currentPlaylist.isLiked) {
            cardHeart.textContent = '♥';
            cardHeart.style.color = '#ff6b6b';
        } else {
            cardHeart.textContent = '♡';
            cardHeart.style.color = '';
        }

        cardLikeCount.textContent = currentPlaylist.likeCount;
    }
});

// Step 2.5: Shuffle functionality
const shuffleBtn = document.getElementById('shuffleBtn');

shuffleBtn.addEventListener('click', function() {
    if (!currentPlaylist) return;

    // Create a copy of the songs array and shuffle it
    const shuffledSongs = [...currentPlaylist.songs];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
    }

    // Display the shuffled songs
    displaySongsInModal(shuffledSongs);
});

// Step 2.6: AI Description functionality
const descriptionBtn = document.getElementById('descriptionBtn');
const aiDescriptionSection = document.getElementById('aiDescription');
const descriptionText = document.getElementById('descriptionText');

descriptionBtn.addEventListener('click', async function() {
    if (!currentPlaylist) return;

    // Disable button and show loading state
    descriptionBtn.disabled = true;
    descriptionBtn.textContent = 'Generating...';

    try {
        const description = await getPlaylistDescription(currentPlaylist);

        // Show the description section
        aiDescriptionSection.style.display = 'block';
        descriptionText.textContent = description;
    } catch (error) {
        console.error('Error getting description:', error);
        aiDescriptionSection.style.display = 'block';
        descriptionText.textContent = 'Description unavailable. Please try again later.';
    } finally {
        // Re-enable button
        descriptionBtn.disabled = false;
        descriptionBtn.textContent = 'Get Description';
    }
});

// AI API function with fallback models
// async function getPlaylistDescription(playlist) {
//     // Check if API key exists
//     if (typeof API_KEY === 'undefined' || !API_KEY || API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
//         console.error('API_KEY is not set! Please add your OpenRouter API key to secret.js');
//         throw new Error('API key not configured');
//     }

//     console.log('Generating description for:', playlist.name);

//     // List of free models to try in order
//     const freeModels = [
//         'meta-llama/llama-3.3-70b-instruct:free',
//         // 'meta-llama/llama-3.2-3b-instruct:free',
//         // 'meta-llama/llama-3.2-1b-instruct:free',
//         // 'meta-llama/llama-3.1-8b-instruct:free',
//         // 'google/gemma-2-9b-it:free',
//         // 'google/gemma-2-27b-it:free',
//         // 'google/gemma-7b-it:free',
//         // 'qwen/qwen-2-7b-instruct:free',
//         // 'qwen/qwen-2.5-7b-instruct:free',
//         // 'mistralai/mistral-7b-instruct:free',
//         // 'mistralai/mistral-7b-instruct-v0.3:free',
//         // 'microsoft/phi-3-mini-128k-instruct:free',
//         // 'microsoft/phi-3-medium-128k-instruct:free',
//         // 'huggingfaceh4/zephyr-7b-beta:free',
//         // 'openchat/openchat-7b:free',
//         // 'nousresearch/hermes-3-llama-3.1-405b:free'
//     ];

//     // Build the song list for the prompt
//     const songList = playlist.songs.map(song => `- ${song.title} by ${song.artist}`).join('\n');

//     const prompt = `You are a music curator. Write a 2-3 sentence description for this playlist:

// Playlist: ${playlist.name} by ${playlist.author}
// Songs:
// ${songList}

// Capture the mood and vibe. Don't list songs individually. Be conversational and engaging.`;

//     // Try each model until one works
//     for (let i = 0; i < freeModels.length; i++) {
//         const model = freeModels[i];
//         console.log(`🔄 Trying model ${i + 1}/${freeModels.length}: ${model}`);

//         try {
//             const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${API_KEY}`,
//                     'HTTP-Referer': window.location.href,
//                     'X-Title': 'Music Playlist Explorer'
//                 },
//                 body: JSON.stringify({
//                     model: "meta-llama/llama-3.3-70b-instruct:free",
//                     messages: [
//                         {
//                             role: 'user',
//                             content: prompt
//                         }
//                     ]
//                 })
//             });

//             console.log(`Response status for ${model}:`, response.status);

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log(`✅ Success with ${model}!`);
//                 console.log('API Response:', data);
//                 return data.choices[0].message.content;
//             } else {
//                 const errorData = await response.json().catch(() => ({}));
//                 console.warn(`❌ Model ${model} failed:`, errorData);
//                 // Continue to next model
//             }
//         } catch (error) {
//             console.warn(`❌ Model ${model} error:`, error.message);
//             // Continue to next model
//         }
//     }

//     // If all models failed
//     throw new Error('All AI models failed. Please try again later.');
// }

const getPlaylistDescription = async (playlist) => {
    const songList = playlist.songs
      .map((song) => `${song.title} by ${song.artist}`)
      .join(", ");

    const prompt = `You are a music curator. Write a description of 40 words or less for a music playlist called "${playlist.name}" created by ${playlist.author}. The playlist includes: ${songList}.`;
  
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-4-31b-it:free",
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );
  
    if (!response.ok) {
      throw new Error(`OpenRouter request failed: ${response.status}`);
    }
  
    const result = await response.json();
    return result.choices[0].message.content.trim();
  };

// Step 3: Close modal when clicking outside the modal box
modalOverlay.addEventListener('click', function(event) {
    // event.target = the element that was actually clicked
    // If user clicked the dark overlay (not the white modal box), close it
    if (event.target === modalOverlay) {
        modalOverlay.setAttribute('hidden', '');
    }
});

// ===== ADD PLAYLIST FORM FUNCTIONALITY =====

// Open form modal
addPlaylistBtn.addEventListener('click', function() {
    addPlaylistModal.removeAttribute('hidden');
});

// Close form modal
closeFormBtn.addEventListener('click', function() {
    addPlaylistModal.setAttribute('hidden', '');
    addPlaylistForm.reset();
});

cancelFormBtn.addEventListener('click', function() {
    addPlaylistModal.setAttribute('hidden', '');
    addPlaylistForm.reset();
});

// Close form when clicking outside
addPlaylistModal.addEventListener('click', function(event) {
    if (event.target === addPlaylistModal) {
        addPlaylistModal.setAttribute('hidden', '');
        addPlaylistForm.reset();
    }
});

// Add another song field
let songCount = 2;
addSongBtn.addEventListener('click', function() {
    songCount++;
    const songFormGroup = document.createElement('div');
    songFormGroup.className = 'song-form-group';
    songFormGroup.innerHTML = `
        <h4>Song ${songCount}</h4>
        <input type="text" class="song-title-input" placeholder="Song Title" required>
        <input type="text" class="song-artist-input" placeholder="Artist Name" required>
        <input type="text" class="song-duration-input" placeholder="Duration (e.g., 3:45)" required>
    `;
    songsContainer.appendChild(songFormGroup);
});

// Handle form submission
addPlaylistForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const playlistName = document.getElementById('playlistName').value;
    const playlistAuthor = document.getElementById('playlistAuthor').value;
    const playlistCover = document.getElementById('playlistCover').value;

    // Get all songs
    const songGroups = document.querySelectorAll('.song-form-group');
    const songs = [];

    songGroups.forEach(function(group) {
        const title = group.querySelector('.song-title-input').value;
        const artist = group.querySelector('.song-artist-input').value;
        const duration = group.querySelector('.song-duration-input').value;

        songs.push({
            title: title,
            artist: artist,
            duration: duration
        });
    });

    // Create new playlist object
    const newPlaylist = {
        coverImage: playlistCover,
        name: playlistName,
        author: playlistAuthor,
        likeCount: 0,
        songs: songs,
        isLiked: false
    };

    // Add to playlistsData array
    playlistsData.push(newPlaylist);

    // Refresh the display
    refreshPlaylistCards();

    // Close modal and reset form
    addPlaylistModal.setAttribute('hidden', '');
    addPlaylistForm.reset();

    // Reset song count to 2
    songCount = 2;
    // Remove extra song fields
    const allSongGroups = songsContainer.querySelectorAll('.song-form-group');
    while (allSongGroups.length > 2) {
        songsContainer.removeChild(songsContainer.lastChild);
    }
});

// ===== EDIT PLAYLIST FORM FUNCTIONALITY =====

// Close edit form modal
closeEditFormBtn.addEventListener('click', function() {
    editPlaylistModal.setAttribute('hidden', '');
    editPlaylistForm.reset();
    editingPlaylistIndex = null;
});

cancelEditFormBtn.addEventListener('click', function() {
    editPlaylistModal.setAttribute('hidden', '');
    editPlaylistForm.reset();
    editingPlaylistIndex = null;
});

// Close edit form when clicking outside
editPlaylistModal.addEventListener('click', function(event) {
    if (event.target === editPlaylistModal) {
        editPlaylistModal.setAttribute('hidden', '');
        editPlaylistForm.reset();
        editingPlaylistIndex = null;
    }
});

// Add another song field in edit form
addEditSongBtn.addEventListener('click', function() {
    const currentSongCount = editSongsContainer.querySelectorAll('.song-form-group').length;
    const songFormGroup = document.createElement('div');
    songFormGroup.className = 'song-form-group';
    songFormGroup.innerHTML = `
        <h4>Song ${currentSongCount + 1}</h4>
        <input type="text" class="song-title-input" placeholder="Song Title" required>
        <input type="text" class="song-artist-input" placeholder="Artist Name" required>
        <input type="text" class="song-duration-input" placeholder="Duration (e.g., 3:45)" required>
    `;
    editSongsContainer.appendChild(songFormGroup);
});

// Handle edit form submission
editPlaylistForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (editingPlaylistIndex === null) return;

    // Get form values
    const playlistName = document.getElementById('editPlaylistName').value;
    const playlistAuthor = document.getElementById('editPlaylistAuthor').value;
    const playlistCover = document.getElementById('editPlaylistCover').value;

    // Get all songs
    const songGroups = editSongsContainer.querySelectorAll('.song-form-group');
    const songs = [];

    songGroups.forEach(function(group) {
        const title = group.querySelector('.song-title-input').value;
        const artist = group.querySelector('.song-artist-input').value;
        const duration = group.querySelector('.song-duration-input').value;

        songs.push({
            title: title,
            artist: artist,
            duration: duration
        });
    });

    // Update the playlist in playlistsData
    playlistsData[editingPlaylistIndex].name = playlistName;
    playlistsData[editingPlaylistIndex].author = playlistAuthor;
    playlistsData[editingPlaylistIndex].coverImage = playlistCover;
    playlistsData[editingPlaylistIndex].songs = songs;

    // Refresh the display
    refreshPlaylistCards();

    // Close modal and reset
    editPlaylistModal.setAttribute('hidden', '');
    editPlaylistForm.reset();
    editingPlaylistIndex = null;
});

// Step 4: Open modal when a playlist card is clicked
// NOTE: This function will be called AFTER cards are created
let currentPlaylist = null; // Store current playlist for shuffle functionality

function attachModalListeners() {
    const playlistCards = document.querySelectorAll('.playlist-card');

    playlistCards.forEach(function(card) {
        card.addEventListener('click', function(event) {
            // Don't open modal if clicking the like, delete, or edit button
            if (event.target.classList.contains('like-btn') ||
                event.target.classList.contains('delete-btn') ||
                event.target.classList.contains('edit-btn')) {
                return;
            }

            // Get playlist index from card
            const playlistIndex = parseInt(card.dataset.index);
            currentPlaylist = playlistsData[playlistIndex];

            // Populate modal with playlist data
            populateModal(currentPlaylist);

            // Show the modal by removing 'hidden' attribute
            modalOverlay.removeAttribute('hidden');
        });
    });
}

// Populate modal with playlist data
function populateModal(playlist) {
    // Update cover image
    document.getElementById('modalCover').src = playlist.coverImage;
    document.getElementById('modalCover').alt = `${playlist.name} cover`;

    // Update text content
    document.getElementById('modalTitle').textContent = playlist.name;
    document.getElementById('modalAuthor').textContent = playlist.author;
    document.getElementById('modalLikeCount').textContent = playlist.likeCount;

    // Update like button state
    if (playlist.isLiked) {
        modalHeartIcon.textContent = '♥';
    } else {
        modalHeartIcon.textContent = '♡';
    }

    // Hide AI description section when opening new playlist
    document.getElementById('aiDescription').style.display = 'none';

    // Display songs
    displaySongsInModal(playlist.songs);
}

// Display songs in the modal
function displaySongsInModal(songs) {
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; // Clear existing songs

    songs.forEach(function(song) {
        const songItem = document.createElement('li');
        songItem.className = 'song-item';

        songItem.innerHTML = `
            <img class="song-thumbnail" src="${currentPlaylist.coverImage}" alt="Album art">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <span class="song-duration">${song.duration}</span>
        `;

        songList.appendChild(songItem);
    });
}



// ===== CREATE PLAYLIST CARDS =====
function createPlaylistCards(playlistsArray) {
    // Get the container where cards will go
    const container = document.querySelector('.playlist-cards');

    // Check if array is empty
    if (playlistsArray.length === 0) {
        container.innerHTML = '<p>No playlists found</p>';
        return;
    }

    // Loop through EACH playlist and create a card
    playlistsArray.forEach(function(playlist, index) {
        // Track if this playlist is liked (initially false)
        playlist.isLiked = false;

        // Create card element
        const card = document.createElement('div');
        card.classList.add('playlist-card');
        card.dataset.index = index; // Store playlist index for later

        // Set the card's HTML content using playlist data
        card.innerHTML = `
            <button class="delete-btn" title="Delete playlist">×</button>
            <button class="edit-btn" title="Edit playlist">✎</button>
            <img src="${playlist.coverImage}" alt="Playlist cover" class="card-cover">
            <div class="card-info">
                <h3 class="card-title">${playlist.name}</h3>
                <p class="card-author">${playlist.author}</p>
                <div class="card-likes">
                    <span class="heart-icon like-btn">♡</span>
                    <span class="like-count">${playlist.likeCount}</span>
                </div>
            </div>
        `;

        // Add the card to the container
        container.appendChild(card);
    });
}

// ===== LIKE FUNCTIONALITY =====
function attachLikeListeners(playlistsArray) {
    // Get all like buttons (heart icons)
    const likeButtons = document.querySelectorAll('.heart-icon.like-btn');

    likeButtons.forEach(function(likeBtn) {
        likeBtn.addEventListener('click', function(event) {
            // Stop the click from triggering the card's modal
            event.stopPropagation();

            // Find which card this like button belongs to
            const card = likeBtn.closest('.playlist-card');
            const playlistIndex = parseInt(card.dataset.index);
            const playlist = playlistsArray[playlistIndex];

            // Find the like count display
            const likeCountSpan = card.querySelector('.like-count');

            // Toggle the like state
            if (playlist.isLiked) {
                // Unlike: decrement count and change to empty heart
                playlist.likeCount--;
                playlist.isLiked = false;
                likeBtn.textContent = '♡';
                likeBtn.style.color = '';
            } else {
                // Like: increment count and change to filled heart
                playlist.likeCount++;
                playlist.isLiked = true;
                likeBtn.textContent = '♥';
                likeBtn.style.color = '#ff6b6b';
            }

            // Update the displayed like count
            likeCountSpan.textContent = playlist.likeCount;
        });
    });
}

// ===== DELETE FUNCTIONALITY =====
function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function(deleteBtn) {
        deleteBtn.addEventListener('click', function(event) {
            // Stop the click from triggering the card's modal
            event.stopPropagation();

            // Find which card this delete button belongs to
            const card = deleteBtn.closest('.playlist-card');
            const playlistIndex = parseInt(card.dataset.index);

            // Remove from the playlistsData array
            playlistsData.splice(playlistIndex, 1);

            // Remove the card from DOM
            card.remove();

            // Re-render all cards to update indexes
            refreshPlaylistCards();
        });
    });
}

// ===== EDIT FUNCTIONALITY =====
function attachEditListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(function(editBtn) {
        editBtn.addEventListener('click', function(event) {
            // Stop the click from triggering the card's modal
            event.stopPropagation();

            // Find which card this edit button belongs to
            const card = editBtn.closest('.playlist-card');
            const playlistIndex = parseInt(card.dataset.index);
            editingPlaylistIndex = playlistIndex;

            // Get the playlist data
            const playlist = playlistsData[playlistIndex];

            // Populate the edit form
            document.getElementById('editPlaylistName').value = playlist.name;
            document.getElementById('editPlaylistAuthor').value = playlist.author;
            document.getElementById('editPlaylistCover').value = playlist.coverImage;

            // Clear and populate songs
            editSongsContainer.innerHTML = '';
            playlist.songs.forEach(function(song, index) {
                const songFormGroup = document.createElement('div');
                songFormGroup.className = 'song-form-group';
                songFormGroup.innerHTML = `
                    <h4>Song ${index + 1}</h4>
                    <input type="text" class="song-title-input" placeholder="Song Title" value="${song.title}" required>
                    <input type="text" class="song-artist-input" placeholder="Artist Name" value="${song.artist}" required>
                    <input type="text" class="song-duration-input" placeholder="Duration (e.g., 3:45)" value="${song.duration}" required>
                `;
                editSongsContainer.appendChild(songFormGroup);
            });

            // Show the edit modal
            editPlaylistModal.removeAttribute('hidden');
        });
    });
}

// ===== REFRESH CARDS =====
function refreshPlaylistCards() {
    const container = document.querySelector('.playlist-cards');
    container.innerHTML = ''; // Clear container

    // Recreate all cards
    createPlaylistCards(playlistsData);

    // Re-attach all listeners
    attachModalListeners();
    attachLikeListeners(playlistsData);
    attachDeleteListeners();
    attachEditListeners();
}


// ===== FETCH DATA AND CREATE CARDS =====
let playlistsData = []; // Store playlists globally for like functionality

fetch('../data/data.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(playlists) {
        playlistsData = playlists; // Save to global variable

        // Call our function with the playlists data
        createPlaylistCards(playlists);

        // IMPORTANT: Attach listeners AFTER cards are created
        attachModalListeners();
        attachLikeListeners(playlists); // Add like functionality
        attachDeleteListeners(); // Add delete functionality
        attachEditListeners(); // Add edit functionality
    })
    .catch(function(error) {
        console.error('Error loading playlists:', error);
        document.querySelector('.playlist-cards').innerHTML = '<p>Error loading playlists</p>';
    });



