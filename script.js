document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmarkForm');
    const bookmarksDiv = document.getElementById('bookmarks');

    // Funkcja do dodawania nowej zakładki
    function addBookmarkToLocalStorage(title, note) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const newBookmark = { title, note };
        bookmarks.push(newBookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    function renderBookmarks() {
        bookmarksDiv.innerHTML = '';
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        bookmarks.forEach((bookmark, index) => {
            const bookmarkItem = createBookmarkElement(bookmark.title, bookmark.note, index);
            bookmarksDiv.appendChild(bookmarkItem);
        });
    }

    function createBookmarkElement(title, note, index) {
        // Tworzenie elementu zakładki
        const bookmarkItem = document.createElement('div');
        bookmarkItem.classList.add('bookmark-item');
        bookmarkItem.innerHTML = `
            <h3>${title}</h3>
            <p>${note}</p>
            <button class="edit-button">Edytuj</button>
            <button class="delete-button">Usuń</button>
            <form class="edit-form">
                <label for="editTitle">Nowy tytuł:</label>
                <input type="text" id="editTitle" name="editTitle" value="${title}" required><br>
                <label for="editNote">Nowa notatka:</label>
                <textarea id="editNote" name="editNote" rows="4" cols="50" required>${note}</textarea><br>
                <button type="submit">Zapisz</button>
                <button type="button" class="cancel-edit">Anuluj</button>
            </form>
        `;

        // Obsługa edycji zakładki
        const editButton = bookmarkItem.querySelector('.edit-button');
        const editForm = bookmarkItem.querySelector('.edit-form');
        const cancelEditButton = bookmarkItem.querySelector('.cancel-edit');

        editButton.addEventListener('click', function() {
            bookmarkItem.classList.add('editing');
            editForm.style.display = 'block';
        });

        cancelEditButton.addEventListener('click', function() {
            bookmarkItem.classList.remove('editing');
            editForm.style.display = 'none';
        });

        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newTitle = editForm.editTitle.value.trim();
            const newNote = editForm.editNote.value.trim();
            if (newTitle === '' || newNote === '') {
                alert('Proszę wypełnić wszystkie pola.');
                return;
            }
            bookmarks[index].title = newTitle;
            bookmarks[index].note = newNote;
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            bookmarkItem.querySelector('h3').textContent = newTitle;
            bookmarkItem.querySelector('p').textContent = newNote;
            bookmarkItem.classList.remove('editing');
            editForm.style.display = 'none';
        });

        // Obsługa usuwania zakładki
        const deleteButton = bookmarkItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
            bookmarks.splice(index, 1);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
        });

        return bookmarkItem;
    }

    // Inicjalne renderowanie zakładek z localStorage
    renderBookmarks();

    // Obsługa formularza dodawania zakładki
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = form.title.value.trim();
        const note = form.note.value.trim();

        if (title === '' || note === '') {
            alert('Proszę wypełnić wszystkie pola.');
            return;
        }

        addBookmarkToLocalStorage(title, note);
        renderBookmarks();

        // Resetowanie formularza
        form.reset();
    });
});
