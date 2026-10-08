const API_URL = "http://localhost:3000/api/products";

async function getProducts() {
    try {
        const response = await fetch(API_URL);

        const products = await response.json();

        console.log(products);

        displayProducts(products);

    } catch (error) {
        console.log("Error:", error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <strong>₹${product.price}</strong>

            <br><br>

            <button onclick="viewProduct('${product._id}')">
                View Details
            </button>
        `;

        productList.appendChild(card);
    });
}

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

getProducts();