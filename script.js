document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmarkForm');
    const bookmarksDiv = document.getElementById('bookmarks');
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    // Funkcja do renderowania zakładek
    function renderBookmarks() {
        bookmarksDiv.innerHTML = '';
        bookmarks.forEach(function(bookmark, index) {
            const bookmarkItem = document.createElement('div');
            bookmarkItem.classList.add('bookmark-item');
            bookmarkItem.setAttribute('data-index', index);
            bookmarkItem.innerHTML = `
                <h3>${bookmark.title}</h3>
                <p>${bookmark.note}</p>
                <button class="edit-button">Edytuj</button>
                <button class="delete-button">Usuń</button>
                <form class="edit-form">
                    <label for="editTitle">Nowy tytuł:</label>
                    <input type="text" id="editTitle" name="editTitle" value="${bookmark.title}" required><br>
                    <label for="editNote">Nowa notatka:</label>
                    <textarea id="editNote" name="editNote" rows="4" cols="50" required>${bookmark.note}</textarea><br>
                    <button type="submit">Zapisz</button>
                    <button type="button" class="cancel-edit">Anuluj</button>
                </form>
            `;
            bookmarksDiv.appendChild(bookmarkItem);

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
                bookmark.title = newTitle;
                bookmark.note = newNote;
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                renderBookmarks();
            });

            // Obsługa usuwania zakładki
            const deleteButton = bookmarkItem.querySelector('.delete-button');
            deleteButton.addEventListener('click', function() {
                const index = bookmarkItem.getAttribute('data-index');
                bookmarks.splice(index, 1);
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                renderBookmarks();
            });
        });
    }

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

        const newBookmark = {
            title: title,
            note: note
        };

        bookmarks.push(newBookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();

        // Resetowanie formularza
        form.reset();
    });
});
