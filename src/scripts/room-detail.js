// API endpoint
const API_URL = 'https://waswa.vercel.app/api';

// Get room ID from URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('id');

// Fetch room details from API
async function fetchRoomDetails(roomId) {
    try {
        const response = await fetch(`${API_URL}/rooms/${roomId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const room = await response.json();
        return room;
    } catch (error) {
        console.error('Error fetching room details:', error);
        return null;
    }
}

// Update page content
document.addEventListener('DOMContentLoaded', async () => {
    if (!roomId) {
        alert('Room ID not provided');
        window.location.href = '/pages/rooms.html';
        return;
    }

    // Show loading state
    document.getElementById('room-title').textContent = 'Loading...';
    document.getElementById('room-price').textContent = 'Loading...';
    document.getElementById('room-description').textContent = 'Loading...';

    // Fetch room details
    const room = await fetchRoomDetails(roomId);
    if (!room) {
        alert('Room not found');
        window.location.href = '/pages/rooms.html';
        return;
    }

    // Handle images
    let images = [];
    try {
        if (room.images && room.images.startsWith('[')) {
            images = JSON.parse(room.images);
        } else if (room.images) {
            images = [room.images];
        }
    } catch (e) {
        console.warn('Error parsing images:', e);
        images = ['/assets/room-1.jpg']; // Fallback image
    }

    // Update title and price
    document.getElementById('room-title').textContent = room.title;
    document.getElementById('room-price').textContent = `Ksh.${room.price.toLocaleString()} per night`;
    document.getElementById('room-description').textContent = room.description;
    document.getElementById('price-per-night').textContent = `Ksh.${room.price.toLocaleString()}`;

    // Update main image
    const mainImage = document.getElementById('main-image');
    mainImage.src = images[0] || '/assets/room-1.jpg';
    mainImage.alt = room.title;

    // Create thumbnails
    const thumbnailList = document.getElementById('thumbnail-list');
    thumbnailList.innerHTML = ''; // Clear existing thumbnails
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${room.title} - Image ${index + 1}`;
        img.addEventListener('click', () => {
            mainImage.src = image;
        });
        thumbnailList.appendChild(img);
    });

    // Handle amenities
    let amenities = [];
    try {
        if (room.roomType && room.roomType.amenities) {
            try {
                amenities = JSON.parse(room.roomType.amenities);
            } catch (e) {
                const unescaped = room.roomType.amenities.replace(/\\"/g, '"');
                amenities = JSON.parse(unescaped);
            }
        }
    } catch (e) {
        console.warn('Error parsing amenities:', e);
        amenities = [];
    }

    // Create amenities list
    const amenitiesList = document.getElementById('amenities-list');
    amenitiesList.innerHTML = ''; // Clear existing amenities
    amenities.forEach(amenity => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${amenity}`;
        amenitiesList.appendChild(li);
    });

    // Set minimum dates for check-in and check-out
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');

    checkInInput.min = today.toISOString().split('T')[0];
    checkOutInput.min = tomorrow.toISOString().split('T')[0];

    // Handle date changes
    checkInInput.addEventListener('change', updateNights);
    checkOutInput.addEventListener('change', updateNights);

    // Handle nights input
    const nightsInput = document.getElementById('nights');
    nightsInput.addEventListener('change', updateTotalPrice);

    // Initial price calculation
    updateTotalPrice();
});

// Update number of nights and total price
function updateNights() {
    const checkIn = new Date(document.getElementById('check-in').value);
    const checkOut = new Date(document.getElementById('check-out').value);
    const nightsInput = document.getElementById('nights');
    const totalNights = document.getElementById('total-nights');

    if (checkIn && checkOut && checkOut > checkIn) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        nightsInput.value = nights;
        totalNights.textContent = nights;
        updateTotalPrice();
    }
}

// Update total price
function updateTotalPrice() {
    const pricePerNight = parseInt(document.getElementById('price-per-night').textContent.replace(/[^0-9]/g, ''));
    const nights = parseInt(document.getElementById('nights').value) || 1;
    const totalPrice = pricePerNight * nights;
    document.getElementById('total-price').textContent = `Ksh.${totalPrice.toLocaleString()}`;
}

// Handle form submission
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        roomId: roomId,
        checkIn: document.getElementById('check-in').value,
        checkOut: document.getElementById('check-out').value,
        guests: document.getElementById('guests').value,
        nights: document.getElementById('nights').value,
        totalPrice: parseInt(document.getElementById('total-price').textContent.replace(/[^0-9]/g, ''))
    };

    // Here you would typically send this data to your server
    console.log('Booking Data:', formData);
    alert('Booking request submitted! We will contact you shortly to confirm your reservation.');
}); 