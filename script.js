let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortField = '';
let sortOrder = 'asc';

async function fetchProducts() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        renderTable();
        updatePagination();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderTable() {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsToShow.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td>${product.description}</td>
            <td>${product.category.name}</td>
            <td>
                <div class="image-container">
                    ${product.images.map(img => `<img src="${img}" alt="Product image" class="product-image">`).join('')}
                </div>
            </td>
            <td>${new Date(product.creationAt).toLocaleDateString()}</td>
            <td>${new Date(product.updatedAt).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable();
    updatePagination();
}

function sortProducts(field, order) {
    sortField = field;
    sortOrder = order;
    filteredProducts.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (field === 'price') {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        } else {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (order === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    currentPage = 1;
    renderTable();
    updatePagination();
}

function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    renderTable();
    updatePagination();
}

function changePage(direction) {
    currentPage += direction;
    renderTable();
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Initialize the dashboard
fetchProducts();