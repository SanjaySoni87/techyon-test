document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const sortPrice = document.getElementById("sortPrice");
  const filters = document.querySelectorAll(".filter__categories-item input");
  const totalProducts = document.getElementById("products__total");
  const allFiltered = document.getElementById(
    "filter__categories--all-filtered"
  );
  let products = [];

  const productsPerPage = 5;
  let currentPage = 1;
  let totalPages = 1;

  // Mobile filter display script
  document.getElementById("mob_filter").addEventListener("click", function () {
    var mainContent = document.querySelector(".layout");
    if (mainContent.classList.contains("layout__filter--show")) {
      mainContent.classList.remove("layout__filter--show");
    } else {
      mainContent.classList.add("layout__filter--show");
    }
  });

  document.getElementById("close_btn").addEventListener("click", function () {
    var mainContent = document.querySelector(".layout");
    if (mainContent.classList.contains("layout__filter--show")) {
      mainContent.classList.remove("layout__filter--show");
    }
  });

  // Products related script
  const fetchProducts = async (page) => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      products = await response.json();
      showAllProducts(products);

      totalPages = Math.ceil(products.length / productsPerPage);
      showAllProducts(
        products.slice((page - 1) * productsPerPage, page * productsPerPage)
      );
      showPagination();
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const showAllProducts = (products) => {
    if (products.length === 0) {
      productList.innerHTML =
        '<p class="no-products">No products available</p>';
      return;
    }

    if (products.length > 0) {
      totalProducts.innerHTML = products.length;
    }

    if (products.length > 0) {
      allFiltered.innerHTML = products.length;
    }

    productList.innerHTML = products
      .map(
        (product) => `
            <div class="product">
            <div class="product__wrapper">
            <a class="product__single-detail" href="">
              <img class="product__image" src="${product.image}" alt="${product.title}" />
              <h2 class="product__name">${product.title}</h2>
              <p class="product__price">$${product.price}</p>
              </a>
              <p class="product__wishlist"><i class="fa-regular fa-heart"></i></p>
              </div>
            </div>
          `
      )
      .join("");
  };

  const showPagination = () => {
    const paginationPages = document.querySelector(".pagination__pages");
    paginationPages.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageElement = document.createElement("div");
      pageElement.classList.add("pagination__page");
      if (i === currentPage) {
        pageElement.classList.add("pagination__page--active");
      }
      pageElement.textContent = i;
      pageElement.addEventListener("click", () => {
        currentPage = i;
        fetchProducts(currentPage);
      });
      paginationPages.appendChild(pageElement);
    }
    document.querySelector(".pagination__button--prev").disabled =
      currentPage === 1;
    document.querySelector(".pagination__button--next").disabled =
      currentPage === totalPages;
  };
  document
    .querySelector(".pagination__button--prev")
    .addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchProducts(currentPage);
      }
    });
  document
    .querySelector(".pagination__button--next")
    .addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchProducts(currentPage);
      }
    });
  fetchProducts(currentPage);

  const filterProducts = () => {
    const selectedCategories = Array.from(filters)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    console.log(selectedCategories);
    const filteredProducts =
      selectedCategories.length > 0
        ? products.filter((product) =>
            selectedCategories.includes(product.category)
          )
        : products;

    showAllProducts(filteredProducts);
  };

  const sortProducts = (event) => {
    const sortedProducts = [...products].sort((a, b) => {
      if (event.target.value === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    showAllProducts(sortedProducts);
  };

  sortPrice.addEventListener("change", sortProducts);
  filters.forEach((filter) =>
    filter.addEventListener("change", filterProducts)
  );

  fetchProducts(currentPage);
});
