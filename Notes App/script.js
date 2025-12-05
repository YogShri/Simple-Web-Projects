// ======= Data handling =======

let notes = [];

const STORAGE_KEY = "notesAppData";

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  notes = saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ======= DOM references =======

const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const pinnedFilter = document.getElementById("pinnedFilter");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const addNoteBtn = document.getElementById("addNoteBtn");

// ======= Utility =======

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ======= Render =======

function renderNotes() {
  const query = searchInput.value.trim().toLowerCase();
  const pinnedOnly = pinnedFilter.checked;

  let filtered = notes.filter((note) => {
    const textMatch =
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query);
    const pinMatch = pinnedOnly ? note.pinned : true;
    return textMatch && pinMatch;
  });

  // Pinned first
  filtered.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt - a.createdAt);

  notesContainer.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No notes yet. Start by creating a new one!";
    notesContainer.appendChild(empty);
    return;
  }

  filtered.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";

    card.innerHTML = `
      <div class="note-header">
        <h3 class="note-title">${note.title || "Untitled"}</h3>
        ${
          note.pinned
            ? `<span class="pin-badge">📌 Pinned</span>`
            : ""
        }
      </div>
      <p class="note-body">${note.content || ""}</p>
      <div class="note-footer">
        <span class="note-date">${formatDate(note.createdAt)}</span>
        <div class="note-actions">
          <button class="note-btn" data-action="pin" data-id="${note.id}">
            ${note.pinned ? "Unpin" : "Pin"}
          </button>
          <button class="note-btn" data-action="edit" data-id="${note.id}">
            ✏ Edit
          </button>
          <button class="note-btn delete" data-action="delete" data-id="${note.id}">
            🗑 Delete
          </button>
        </div>
      </div>
    `;

    notesContainer.appendChild(card);
  });
}

// ======= Handlers =======

function handleAddNote() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title && !content) {
    alert("Please enter a title or note content.");
    return;
  }

  const newNote = {
    id: Date.now(),
    title,
    content,
    pinned: false,
    createdAt: Date.now(),
  };

  notes.push(newNote);
  saveNotes();

  titleInput.value = "";
  contentInput.value = "";
  renderNotes();
}

function handleNoteAction(e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  if (action === "delete") {
    if (confirm("Delete this note?")) {
      notes = notes.filter((n) => n.id !== id);
      saveNotes();
      renderNotes();
    }
  }

  if (action === "pin") {
    note.pinned = !note.pinned;
    saveNotes();
    renderNotes();
  }

  if (action === "edit") {
    const newTitle = prompt("Update title:", note.title);
    if (newTitle === null) return; // cancelled
    const newContent = prompt("Update note:", note.content);
    if (newContent === null) return;

    note.title = newTitle.trim();
    note.content = newContent.trim();
    saveNotes();
    renderNotes();
  }
}

// ======= Events =======

addNoteBtn.addEventListener("click", handleAddNote);

searchInput.addEventListener("input", renderNotes);
pinnedFilter.addEventListener("change", renderNotes);

notesContainer.addEventListener("click", handleNoteAction);

// ======= Init =======

loadNotes();
renderNotes();
