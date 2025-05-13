// Navbar Component
const Navbar = () => {
    return `
    <nav class="navbar">
        <div class="container">
            <a class="logo" href="/pages/index.html">
                <img src="/assets/reso.png" alt="Mutengene Resort Logo" style="height:40px;vertical-align:middle;margin-right:10px;">
                Mutengene Resort
            </a>
            <input type="checkbox" id="check">
            <label for="check">
                <i class="fas fa-bars" id="open"></i>
                <i class="fas fa-times" id="close"></i>
            </label>
            <ul class="nav-list">
                <li class="nav-item"><a href="/pages/rooms.html" class="nav-link">Rooms</a></li>
                <li class="nav-item"><a href="/pages/restaurant.html" class="nav-link">Restaurant</a></li>
                <li class="nav-item"><a href="/pages/spa.html" class="nav-link">Spa</a></li>
                <li class="nav-item"><a href="/pages/about.html" class="nav-link">About</a></li>
                <li class="nav-item"><a href="/pages/contact.html" class="nav-link">Contact</a></li>
                <li class="nav-item"><a href="/pages/rooms.html" class="nav-link book-btn">Book</a></li>
            </ul>
        </div>
    </nav>
    `;
};

export default Navbar; 