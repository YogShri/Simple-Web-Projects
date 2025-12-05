
const songs = [
  {
    title: "Badshah O Badshah ",
    artist: "Yogesh Beats",
    file: "Badshah O Badshah.mp3 ",
    cover: "SRK.webp",
  },
  {
    title: "Lo-Fi Dreams",
    artist: "Loft Studio",
    file: "music/song2.mp3",
    cover: "covers/cover2.jpg",
  },
  {
    title: "Morning Vibes",
    artist: "Chillhop",
    file: "music/song3.mp3",
    cover: "covers/cover3.jpg",
  },
];

let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();

// ===== DOM elements =====
const coverImage = document.getElementById("coverImage");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const progressBar = document.getElementById("progressBar");

const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const playlistList = document.getElementById("playlistList");

// ===== Utility functions =====

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function setActiveInPlaylist() {
  const items = playlistList.querySelectorAll("li");
  items.forEach((li, index) => {
    li.classList.toggle("active", index === currentIndex);
  });
}

// ===== Load song =====

function loadSong(index) {
  const song = songs[index];
  if (!song) return;

  currentIndex = index;
  audio.src = song.file;
  coverImage.src = song.cover;
  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;

  audio.addEventListener(
    "loadedmetadata",
    () => {
      durationEl.textContent = formatTime(audio.duration);
    },
    { once: true }
  );

  progressBar.value = 0;
  currentTimeEl.textContent = "00:00";
  setActiveInPlaylist();
}

// ===== Controls =====

function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function playNext() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function playPrev() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

// ===== Progress bar & time update =====

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progressPercent;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener("input", () => {
  if (!audio.duration) return;
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

audio.addEventListener("ended", () => {
  playNext();
});

// ===== Playlist rendering =====

function renderPlaylist() {
  playlistList.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    li.innerHTML = `
      <div>
        <span class="track-name">${song.title}</span>
        <span class="track-artist">• ${song.artist}</span>
      </div>
      <span class="badge">Playing</span>
    `;

    li.addEventListener("click", () => {
      loadSong(index);
      playSong();
    });

    playlistList.appendChild(li);
  });
}

// ===== Event listeners =====

playPauseBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

// Spacebar to play/pause
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
});

// ===== Init =====
renderPlaylist();
loadSong(currentIndex);
