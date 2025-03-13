// Funktion zum Speichern der Listings im LocalStorage
function saveListing(listing) {
    let listings = JSON.parse(localStorage.getItem('listings')) || [];
    listings.push(listing);
    localStorage.setItem('listings', JSON.stringify(listings));
}

// Funktion zum Anzeigen der Bildvorschau
function displayImagePreview(files) {
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = ''; // Leere die Vorschau

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

// Funktion zum Anzeigen der Listings auf der Kaufseite
function displayListings() {
    const pcList = document.getElementById('pc-list');
    if (pcList) {
        let listings = JSON.parse(localStorage.getItem('listings')) || [];
        pcList.innerHTML = listings.map((listing, index) => `
            <div class="pc-item" onclick="window.location.href='detail.html?id=${index}'">
                <h3>${listing.name}</h3>
                <p><strong>Kategorie:</strong> ${listing.category}</p>
                <p><strong>Preis:</strong> €${listing.price}</p>
                ${listing.images ? `<img src="${listing.images[0]}" alt="${listing.name}" style="max-width: 100%; height: auto;">` : ''}
            </div>
        `).join('');
    }
}

// Funktion zum Anzeigen der Listing-Details
function displayListingDetails() {
    const listingDetails = document.getElementById('listing-details');
    if (listingDetails) {
        // Hole die ID aus der URL
        const urlParams = new URLSearchParams(window.location.search);
        const listingId = urlParams.get('id');

        // Hole die Listings aus dem LocalStorage
        const listings = JSON.parse(localStorage.getItem('listings')) || [];
        const listing = listings[listingId];

        if (listing) {
            listingDetails.innerHTML = `
                <h2>${listing.name}</h2>
                <p><strong>Kategorie:</strong> ${listing.category}</p>
                <p><strong>Preis:</strong> €${listing.price}</p>
                <p><strong>Beschreibung:</strong> ${listing.description}</p>
                ${listing.images ? listing.images.map(image => `
                    <img src="${image}" alt="${listing.name}" style="max-width: 100%; height: auto; margin-bottom: 10px;">
                `).join('') : ''}
            `;
        } else {
            listingDetails.innerHTML = `<p>Listing nicht gefunden.</p>`;
        }
    }
}

// Event-Listener für das Bild-Upload-Feld
const imageInput = document.getElementById('images');
if (imageInput) {
    imageInput.addEventListener('change', function (event) {
        const files = event.target.files;
        if (files.length > 0) {
            displayImagePreview(files);
        }
    });
}

// Event-Listener für das Verkaufsformular
const sellForm = document.getElementById('sell-form');
if (sellForm) {
    sellForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const listing = {
            category: document.getElementById('category').value,
            name: document.getElementById('listing-name').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            images: []
        };

        // Bilder verarbeiten
        const imageInput = document.getElementById('images');
        if (imageInput.files.length > 0) {
            for (let file of imageInput.files) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    listing.images.push(e.target.result);
                    if (listing.images.length === imageInput.files.length) {
                        saveListing(listing);
                        alert('Dein Listing wurde erfolgreich veröffentlicht!');
                        window.location.href = 'buy.html'; // Weiterleitung zur Kaufseite
                    }
                };
                reader.readAsDataURL(file);
            }
        } else {
            saveListing(listing);
            alert('Dein Listing wurde erfolgreich veröffentlicht!');
            window.location.href = 'buy.html'; // Weiterleitung zur Kaufseite
        }
    });
}

// Listings auf der Kaufseite anzeigen
document.addEventListener('DOMContentLoaded', function () {
    displayListings();
    displayListingDetails();
});
// Filterfunktion
document.querySelector('.filters button').addEventListener('click', function () {
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    const listings = JSON.parse(localStorage.getItem('listings')) || [];
    const filteredListings = listings.filter(listing => listing.price >= minPrice && listing.price <= maxPrice);

    displayListings(filteredListings);
});

// Warenkorb-Funktion
function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const shipping = 0; // Beispielwert
    const tax = subtotal * 0.19; // Beispielwert (19% MwSt)

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
}

// Warenkorb-Items anzeigen
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
        </div>
    `).join('');
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function () {
    updateCart();
    displayCartItems();
});