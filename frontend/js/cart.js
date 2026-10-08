const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// DISPLAY CART
// ===============================

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        cartTotal.innerText = "Total: ₹0";

        return;
    }


    cart.forEach((product, index) => {

        total += product.price * product.quantity;


        cartItems.innerHTML += `

            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <h3>${product.name}</h3>

                <p>
                    Price: ₹${product.price}
                </p>

                <div>

                    <button onclick="decreaseQuantity(${index})">
                        -
                    </button>

                    <span style="margin: 0 15px;">
                        ${product.quantity}
                    </span>

                    <button onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>

                <br>

                <p>
                    Subtotal:
                    ₹${product.price * product.quantity}
                </p>

                <button onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>

        `;
    });


    cartTotal.innerText = `Total: ₹${total}`;
}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();
}


// ===============================
// DECREASE QUANTITY
// ===============================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    saveCart();
}


// ===============================
// REMOVE PRODUCT
// ===============================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();
}


// ===============================
// SAVE CART
// ===============================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// ===============================
// PLACE ORDER
// ===============================

async function placeOrder() {

    // Check login
    const token = localStorage.getItem("token");


    if (!token) {

        alert("Please login first!");

        window.location.href = "login.html";

        return;
    }


    // Check cart
    if (cart.length === 0) {

        alert("Cart is empty!");

        return;
    }


    // Prepare products
    const products = cart.map(product => {

        return {

            product: product._id,

            quantity: product.quantity

        };

    });


    try {

        const response = await fetch(
            "http://localhost:3000/api/orders",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify({
                    products
                })

            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        alert(
            `Order placed successfully!\nOrder ID: ${data.order._id}`
        );


        // Cart clear
        localStorage.removeItem("cart");

        cart = [];


        displayCart();


    } catch (error) {

        console.log(error);

        alert("Something went wrong");

    }
}


displayCart();