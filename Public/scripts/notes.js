document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("add-btn");

    addButton.addEventListener("click", async () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("desc").value;
        const RoomCode = window.localStorage.getItem("RoomCode");

        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, RoomCode }),
            });

            if (response.ok) {
                alert("Note added successfully");
            } else {
                alert("Failed to add note");
            }
        } catch (error) {
            console.error("Error adding note:", error);
            alert("Failed to add note");
        }

        window.location.href = "/html/notes.html"
    });

    displayNotes(); 
    //removeNote();
});

async function displayNotes() {
    try {
        const response = await fetch("/api/getnotes");

        if (!response.ok) {
            throw new Error("Failed To Get Notes");
        }

        const notes = await response.json(); 
        console.log(notes);

        const RoomCode = window.localStorage.getItem("RoomCode");

        const notesElement = document.getElementById("notes-container");
        notesElement.innerHTML = "";
        
        notes.forEach(note => {
            if(note.room_number == parseInt(RoomCode)){
            const notesItem = document.createElement('div');
            notesItem.id = `Note-${note._id}`;
            notesItem.innerHTML = `
                <div class="row" style="margin-top: 5%;">
                    <div class="col-sm-12">
                        <div class="card">
                            <div class="card-body" style="border: 2px solid #01858D;">
                                <h5 class="card-title">${note.note}</h5>
                                <p class="card-text">${note.description}</p>
                                <a class="btn btn-primary" onClick="removeNote('${note._id}')" style="background-color: red; border: red;">Remove</a>
                                <a class="btn btn-primary edit-btn" data-note-id="${note._id}" style="background-color: #01858D; border: #01858D;">Edit</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            notesElement.appendChild(notesItem);
        }
        });

        // Attach event listeners to edit buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const noteId = button.getAttribute('data-note-id');
                editNoteModal(noteId);
            });
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
}

async function editNoteModal(noteId) {
    try {
        const response = await fetch(`/api/notes/${noteId}`);
        const note = await response.json();
        // Populate modal fields with note data for editing
        document.getElementById('edit-note-title').value = note.note;
        document.getElementById('edit-note-description').value = note.description;
        // Show modal for editing
        $('#editNoteModal').modal('show');
        // Attach event listener to edit save button
        document.getElementById('edit-note-save-btn').addEventListener('click', async () => {
            const newTitle = document.getElementById('edit-note-title').value;
            const newDescription = document.getElementById('edit-note-description').value;
            // Send updated note data to server
            const updateResponse = await fetch(`/api/notes/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription
                })
            });
            if (updateResponse.ok) {
                // Refresh notes list after update
                displayNotes();
                // Hide modal after successful update
                $('#editNoteModal').modal('hide');
            } else {
                alert('Failed to update note. Please try again later.');
            }
        });
    } catch (error) {
        console.error('Error fetching note:', error);
        alert('Failed to fetch note for editing. Please try again later.');
    }
}

const removeNote = async (NoteId) => {
    try {
        const response = await fetch(`/api/notes/${NoteId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete this note");
        }

        const deletenote = document.getElementById(`Note-${NoteId}`);
        deletenote.remove();
        alert("Note removed successfully");
    } catch (error) {
        console.error("Error removing note:", error.message);
        alert("Failed to remove note. Please try again later.");
    }
};

const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
});