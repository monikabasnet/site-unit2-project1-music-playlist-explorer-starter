// ===== MODAL FUNCTIONALITY =====

// Step 1: Get references to HTML elements
const modalOverlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('closeBtn');

// Step 2: Close modal when X button is clicked
closeBtn.addEventListener('click', function() {
    modalOverlay.setAttribute('hidden', '');
});

// Step 3: Close modal when clicking outside the modal box
modalOverlay.addEventListener('click', function(event) {
    // event.target = the element that was actually clicked
    // If user clicked the dark overlay (not the white modal box), close it
    if (event.target === modalOverlay) {
        modalOverlay.setAttribute('hidden', '');
    }
});

// Step 4: Open modal when a playlist card is clicked
// NOTE: This function will be called AFTER cards are created
function attachModalListeners() {
    const playlistCards = document.querySelectorAll('.playlist-card');

    playlistCards.forEach(function(card) {
        card.addEventListener('click', function() {
            // Show the modal by removing 'hidden' attribute
            modalOverlay.removeAttribute('hidden');

            // Later, we'll update the modal content with the clicked card's data here
            // For now, it just shows the modal with placeholder content
        });
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
    playlistsArray.forEach(function(playlist) {
        // Create card element
        const card = document.createElement('div');
        card.classList.add('playlist-card');

        // Set the card's HTML content using playlist data
        card.innerHTML = `
            <img src="${playlist.coverImage}" alt="Playlist cover" class="card-cover">
            <div class="card-info">
                <h3 class="card-title">${playlist.name}</h3>
                <p class="card-author">${playlist.author}</p>
                <div class="card-likes">
                    <span class="heart-icon">♡</span>
                    <span class="like-count">${playlist.likeCount}</span>
                </div>
            </div>
        `;

        // Add the card to the container
        container.appendChild(card);
    });
}


// ===== FETCH DATA AND CREATE CARDS =====
fetch('../data/data.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(playlists) {
        // Call our function with the playlists data
        createPlaylistCards(playlists);

        // IMPORTANT: Attach modal listeners AFTER cards are created
        attachModalListeners();
    })
    .catch(function(error) {
        console.error('Error loading playlists:', error);
        document.querySelector('.playlist-cards').innerHTML = '<p>Error loading playlists</p>';
    });


// ===== EXPLANATION OF KEY CONCEPTS =====

/*
1. document.getElementById('id')
   - Gets ONE element by its ID
   - Example: document.getElementById('modalOverlay')

2. document.querySelectorAll('.class')
   - Gets ALL elements with that class (returns a list/array)
   - Example: document.querySelectorAll('.playlist-card')

3. element.addEventListener('click', function() { ... })
   - "Listen" for a user action (like a click)
   - When it happens, run the function

4. element.setAttribute('hidden', '')
   - Adds the 'hidden' attribute → hides the modal

5. element.removeAttribute('hidden')
   - Removes the 'hidden' attribute → shows the modal

6. event.target
   - Tells you EXACTLY which element was clicked
   - Useful for "click outside to close" functionality

7. forEach loop
   - Runs code for EACH item in a list
   - Example: for each playlist card, add a click listener

8. fetch(url)
   - Loads data from a file or API
   - Returns a Promise (handles async operations)
   - Use .then() to handle the data when it arrives
*/
