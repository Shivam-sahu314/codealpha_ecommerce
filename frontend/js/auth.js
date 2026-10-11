function updateNavbar() {

    const token = localStorage.getItem("token");

    const nav = document.querySelector("nav");

    if (!nav) {
        return;
    }


    if (token) {

        nav.innerHTML = `
            <a href="index.html">Products</a>

            <a href="cart.html">Cart 🛒</a>

            <a href="orders.html">My Orders</a>

            <a href="#" onclick="logout()">
                Logout
            </a>
        `;

    } else {

        nav.innerHTML = `
            <a href="index.html">Products</a>

            <a href="cart.html">Cart 🛒</a>

            <a href="login.html">Login</a>

            <a href="register.html">Register</a>
        `;
    }
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    alert("Logout successful!");

    window.location.href = "login.html";
}


updateNavbar();