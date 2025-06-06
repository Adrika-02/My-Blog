let currentPage = 1;
const postsPerPage = 3;

function displayPosts(filter = "all", keyword = "") {
  const filtered = posts.filter(post => {
    const matchesCategory = filter === "all" || post.category === filter;
    const matchesSearch = post.title.toLowerCase().includes(keyword) ||
                          post.description.toLowerCase().includes(keyword);
    return matchesCategory && matchesSearch;
  });

  const start = (currentPage - 1) * postsPerPage;
  const paginated = filtered.slice(start, start + postsPerPage);
  container.innerHTML = '';

  if (paginated.length === 0) {
    container.innerHTML = `<p class="text-muted">No posts found.</p>`;
    document.getElementById('paginationControls').innerHTML = '';
    return;
  }

  paginated.forEach((post, index) => {
    blogContainer.innerHTML += `
        <div class="col-md-4" data-aos="zoom-in">
            <div class="card h-100">
            <img src="${post.image}" class="card-img-top" alt="${post.title}">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.description.substring(0, 80)}...</p>
                <button class="btn btn-read hvr-pulse-grow" onclick="openModal(${index + start})">Read More</button>
            </div>
            </div>
        </div>`;
  });

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / postsPerPage);
  const pagination = document.getElementById('paginationControls');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <button class="page-link" onclick="goToPage(${i})">${i}</button>
      </li>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  displayPosts(categoryFilter.value, searchInput.value.trim().toLowerCase());
}

function submitPost(event) {
  event.preventDefault();
  const newPost = {
    title: document.getElementById('newTitle').value,
    category: document.getElementById('newCategory').value,
    image: document.getElementById('newImage').value,
    description: document.getElementById('newDescription').value
  };

  posts.unshift(newPost);
  currentPage = 1;
  displayPosts();

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });

  event.target.reset();
  bootstrap.Modal.getInstance(document.getElementById('createPostModal')).hide();
}

const addPostForm = document.getElementById("addPostForm");
  const postList = document.getElementById("postContainer"); // Your card container

  addPostForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("postTitle").value;
    const image = document.getElementById("postImage").value;
    const category = document.getElementById("postCategory").value || "General";
    const description = document.getElementById("postDescription").value;


    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${image}" class="card-img-top" alt="${title}">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}</p>
          <span class="badge bg-secondary">${category}</span>
          <br><br>
          <button class="btn btn-primary" onclick="openModal('${title}', '${description}', '${image}')">Read More</button>
        </div>
      </div>
    `;


    postList.prepend(card);


    addPostForm.reset();


    const modal = bootstrap.Modal.getInstance(document.getElementById("addPostModal"));
    modal.hide();
  });


  function openModal(title, content, image) {
    const modalHTML = `
      <div class="modal fade" id="readMoreModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <img src="${image}" class="img-fluid mb-3" />
              <p>${content}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const existingModal = document.getElementById("readMoreModal");
    if (existingModal) existingModal.remove();


    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = new bootstrap.Modal(document.getElementById("readMoreModal"));
    modal.show();
  }