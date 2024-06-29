document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookmarkForm');
    const bookmarksDiv = document.getElementById('bookmarks');

    function addBookmark(title, note) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        bookmarks.push({ title, note });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();
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
        const bookmarkItem = document.createElement('div');
        bookmarkItem.classList.add('bookmark-item');
        bookmarkItem.innerHTML = `
            <h3>${title}</h3>
            <p>${note}</p>
            <button class="edit-button">Edytuj</button>
            <button class="delete-button">Usuń</button>
            <div class="edit-form">
                <label for="editTitle">Nowy tytuł:</label>
                <input type="text" id="editTitle" name="editTitle" value="${title}">
                <label for="editNote">Nowa notatka:</label>
                <textarea id="editNote" name="editNote" rows="4" cols="50">${note}</textarea>
                <button class="save-button">Zapisz</button>
            </div>
        `;
        
        const editButton = bookmarkItem.querySelector('.edit-button');
        const deleteButton = bookmarkItem.querySelector('.delete-button');
        const editForm = bookmarkItem.querySelector('.edit-form');
        const saveButton = bookmarkItem.querySelector('.save-button');
        const editTitleInput = bookmarkItem.querySelector('#editTitle');
        const editNoteTextarea = bookmarkItem.querySelector('#editNote');

        editButton.addEventListener('click', function() {
            editForm.style.display = 'block';
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';
        });

        saveButton.addEventListener('click', function() {
            const newTitle = editTitleInput.value.trim();
            const newNote = editNoteTextarea.value.trim();
            if (newTitle === '' || newNote === '') {
                alert('Proszę wypełnić wszystkie pola.');
                return;
            }
            const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            bookmarks[index].title = newTitle;
            bookmarks[index].note = newNote;
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
        });

        deleteButton.addEventListener('click', function() {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            bookmarks.splice(index, 1);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
        });

        return bookmarkItem;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = form.title.value.trim();
        const note = form.note.value.trim();
        if (title === '' || note === '') {
            alert('Proszę wypełnić wszystkie pola.');
            return;
        }
        addBookmark(title, note);
        form.reset();
    });

    renderBookmarks();
});
