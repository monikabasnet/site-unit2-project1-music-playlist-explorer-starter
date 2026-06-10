{## Music Playlist Explorer — Planning Spec

### Data Schema

Playlist:
    - coverImage (string) — URL to the playlist cover image
    - name (string) — Name of the playlist/album
    - author (string) — Artist or creator of the playlist
    - likeCount (number) — Number of likes the playlist has received
    - songs (array) — Array of Song objects in the playlist

Song:
    - title (string) — Title of the song
    - artist (string) — Name of the artist who performed the song
    - duration (string) — Length of the song in MM:SS format

### UI and Interaction Rules
What are the main sections of the homepage?
Ans: Display Playlists that Dynamically render a view or "tile" of each playlist on the homepage using JavaScript.Playlists should be shown in grid view.
Playlist tiles should be reasonably sized (at least 6 playlists visible on a laptop at full screen; text and images should be legible).Fetch data from a JSON file and use it to create interactive playlist tiles.

What happens when a user clicks a playlist card?
ANs:Create a modal pop-up view that displays detailed information about a playlist when a user clicks on a playlist tile. The modal should show the playlist's:Cover image, Playlist name,Author
List of songs, including each song's title, artist, and duration. The modal itself should be centered on the screen, not occupy the entire screen, have a shadow to show that it is a pop-up, appear floating on the screen, and darken or shade the background surrounding it.

What happens when a user clicks outside the modal?
Ans: if it is the like icon it changes the count if not then it does nothing.

What happens when a user clicks the like icon?
ANs:If previously unliked: the like count increases by 1 and there is visual feedback (e.g., the heart changes color). If previously liked: the like count decreases by 1 and there is visual feedback showing the playlist has been unliked


What does the shuffle button do?
Ans:Enable users to shuffle the songs within a playlist using a shuffle button in the playlist's detail modal. When clicked, the playlist's songs should display in a different order.

### Function Specs

#### createPlaylistCards()
- **Parameters:** playlistsArray (array) - array of playlist objects from data.json
- **Returns:** void (nothing - just creates and appends cards to the DOM)
- **Appends to:** .playlist-cards container (the main grid container)
- **Uses these playlist fields:** coverImage, name, author, likeCount
- **Description:** Iterates through the playlists array and creates a card element for each playlist, displaying its cover image, name, author, and like count, then appends each card to the playlist-cards container. 

### Featured Page

#### Layout and Structure
- **Layout Style**: Stacked (Hero image at top, songs below)
- **Visual Style**: Spotlight (Dark background, dramatic lighting to highlight the featured playlist)
- **Navigation**: Top navigation bar with "Featured" and "All Playlists" links
- **Sections**:
  1. Navigation bar (dark with accent colors)
  2. Large hero cover image (centered, 400x400px on desktop)
  3. Playlist info (name, author) centered below image
  4. Action buttons row (Like, Shuffle, New Featured)
  5. Song list section with all songs displayed

#### Function Spec: `selectRandomPlaylist()`
- **Parameters**: playlistsArray (array) - array of all playlist objects
- **Returns**: playlist object - a randomly selected playlist from the array
- **When it runs**: On page load/refresh, or when "New Featured" button is clicked
- **How it works**: Uses Math.random() to generate a random index and returns the playlist at that index

#### Function Spec: `displayFeaturedPlaylist(playlist)`
- **Parameters**: playlist (object) - the playlist object to display
- **Returns**: void (updates DOM elements)
- **DOM elements updated**: 
  - Cover image src and alt
  - Playlist name
  - Author name
  - Like count
  - Song list (dynamically creates li elements for each song)
- **Description**: Takes a playlist object and populates all Featured page elements with that playlist's data

#### Function Spec: `loadNewFeatured()`
- **Parameters**: none
- **Returns**: void
- **Description**: Calls selectRandomPlaylist() to get a new random playlist, then calls displayFeaturedPlaylist() with that playlist. Triggered by "New Featured" button click.

#### Navigation
- Top nav bar present on both pages
- Active page visually highlighted
- Links use relative paths:
  - Featured page → All Playlists: `./index.html`
  - All Playlists → Featured: `./featured.html`
- No browser back/forward buttons needed

#### Interactive Features on Featured Page
1. **Like button**: Toggles like status for the featured playlist, updates count and visual state
2. **Shuffle button**: Randomizes the order of songs displayed in the song list
3. **New Featured button**: Selects and displays a different random playlist without page reload

### AI Feature Spec (Milestone 8)
[Leave blank — fill in before Milestone 8]

### Decisions Log
[One entry per milestone where you make spec-informed decisions]