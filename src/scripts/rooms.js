// API endpoint
const API_URL = 'https://waswa.vercel.app/api';

// DOM Elements
const roomsContainer = document.querySelector('.rooms-list .row');
const roomFilter = document.getElementById('room-filter');
const roomSummary = document.querySelector('.room-summary');

// Fetch rooms from API with room type included
async function fetchRooms() {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Ensure we have an array of rooms
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
}

// Fetch room types from API
async function fetchRoomTypes() {
    try {
        const response = await fetch(`${API_URL}/room-types`);
        const roomTypes = await response.json();
        return roomTypes;
    } catch (error) {
        console.error('Error fetching room types:', error);
        return [];
    }
}

// Create room card HTML
function createRoomCard(room) {
    // Handle images - could be a JSON string or direct URL
    let images = [];
    try {
        // First check if it's a JSON string
        if (room.images && room.images.startsWith('[')) {
            images = JSON.parse(room.images);
        } else if (room.images) {
            // If it's a direct URL, use it as the only image
            images = [room.images];
        }
    } catch (e) {
        console.warn('Error parsing images for room:', room.id, e);
        images = [];
    }
    const firstImage = images[0] || '/assets/room-1.jpg'; // Fallback image

    // Get room type details
    const roomType = room.roomType;
    let amenities = [];
    try {
        // Handle escaped JSON string
        if (roomType.amenities) {
            // First try to parse as is
            try {
                amenities = JSON.parse(roomType.amenities);
            } catch (e) {
                // If that fails, try to unescape the string first
                const unescaped = roomType.amenities.replace(/\\"/g, '"');
                amenities = JSON.parse(unescaped);
            }
        }
    } catch (e) {
        console.warn('Error parsing amenities for room type:', roomType.id, e);
        amenities = [];
    }

    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 room-card" data-type="${roomType.name.toLowerCase()}">
            <div class="room-card-inner">
                <div class="room-image">
                    <img 
                        src="${firstImage}" 
                        alt="${room.title}"
                        loading="lazy"
                        onerror="this.onerror=null; this.src='/assets/room-1.jpg';"
                    >
                </div>
                <div class="room-info">
                    <h4>${room.title}</h4>
                    <p class="room-description">${room.description}</p>
                    <div class="room-amenities">
                        ${amenities.slice(0, 3).map(amenity => 
                            `<span class="amenity">${amenity}</span>`
                        ).join('')}
                        ${amenities.length > 3 ? 
                            `<span class="amenity-more">+${amenities.length - 3} more</span>` : 
                            ''}
                    </div>
                    <div class="room-footer">
                        <p class="price"><span>Ksh.${room.price.toLocaleString()}</span> / night</p>
                        <a href="/pages/room-detail.html?id=${room.id}" class="btn-details">More Details</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Update room summary
function updateRoomSummary(rooms) {
    const roomTypes = {};
    
    // Count rooms by type
    rooms.forEach(room => {
        const type = room.roomType.name;
        if (!roomTypes[type]) {
            roomTypes[type] = {
                count: 0,
                price: room.price,
                capacity: room.roomType.capacity
            };
        }
        roomTypes[type].count++;
    });

    // Create summary HTML
    let summaryHTML = '';
    let totalRooms = 0;
    let totalCapacity = 0;

    Object.entries(roomTypes).forEach(([type, data]) => {
        summaryHTML += `
            <div class="summary-item">
                <h4>${type}</h4>
                <p>${data.count} Available</p>
                <p>Max Capacity: ${data.capacity} guests</p>
                <p class="price">Ksh.${data.price.toLocaleString()} per night</p>
            </div>
        `;
        totalRooms += data.count;
        totalCapacity += data.capacity * data.count;
    });

    // Add total rooms
    summaryHTML += `
        <div class="summary-item total">
            <h4>Total Rooms</h4>
            <p>${totalRooms} Available</p>
            <p>Total Capacity: ${totalCapacity} guests</p>
        </div>
    `;

    roomSummary.innerHTML = summaryHTML;
}

// Filter rooms by type
function filterRooms(rooms, type) {
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize room filter options
async function initializeRoomFilter() {
    const filterSelect = document.getElementById('room-filter');
    if (!filterSelect) {
        console.warn('Room filter element not found');
        return;
    }

    try {
        const roomTypes = await fetchRoomTypes();
        
        // Clear existing options except "All Rooms"
        while (filterSelect.options.length > 1) {
            filterSelect.remove(1);
        }

        // Add room type options
        roomTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name.toLowerCase();
            option.textContent = `${type.name} (${type.capacity} guests)`;
            filterSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error initializing room filter:', error);
    }
}

// Initialize the page
async function initializeRoomsPage() {
    try {
        // Show loading state
        roomsContainer.innerHTML = '<div class="loading">Loading rooms...</div>';

        // Fetch and display rooms
        const rooms = await fetchRooms();
        
        // Check if rooms is an array and has items
        if (!Array.isArray(rooms) || rooms.length === 0) {
            roomsContainer.innerHTML = '<div class="no-rooms">No rooms available at the moment.</div>';
            return;
        }

        // Display rooms
        roomsContainer.innerHTML = rooms.map(room => createRoomCard(room)).join('');

        // Update room summary
        updateRoomSummary(rooms);

        // Initialize room filter
        await initializeRoomFilter();

        // Add filter event listener
        roomFilter.addEventListener('change', (e) => {
            filterRooms(rooms, e.target.value);
        });

    } catch (error) {
        console.error('Error initializing rooms page:', error);
        roomsContainer.innerHTML = '<div class="error">Error loading rooms. Please try again later.</div>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRoomsPage); 