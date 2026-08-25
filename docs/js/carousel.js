async function loadProjects() {
  const response = await fetch('./projects.json');
  if (!response.ok) throw new Error('Failed to load projects');
  return response.json();
}

function createCarousel(project) {
  const images = project.images.length ? project.images : [`projects/${project.slug}/cover.png`];

  const card = document.createElement('article');
  card.className = 'project-card';
  card.id = project.slug;

  card.innerHTML = `
    <h2>${project.name}</h2>
    <p class="category">${project.category}</p>
    <div class="carousel" data-index="0" data-count="${images.length}">
      <div class="carousel-viewport">
        <div class="carousel-track">
          ${images.map((src, index) => `
            <div class="carousel-slide">
              <img src="${src}" alt="${project.name} screenshot ${index + 1}" loading="lazy" />
            </div>
          `).join('')}
        </div>
      </div>
      <button class="carousel-btn prev" type="button" aria-label="Previous image">‹</button>
      <button class="carousel-btn next" type="button" aria-label="Next image">›</button>
      <div class="carousel-dots">
        ${images.map((_, index) => `<button class="dot${index === 0 ? ' active' : ''}" type="button" data-index="${index}" aria-label="Go to image ${index + 1}"></button>`).join('')}
      </div>
      <p class="counter">1 / ${images.length}</p>
    </div>
    <p class="description">${project.description}</p>
    <div class="card-actions">
      <a class="btn btn-primary" href="${project.url}" target="_blank" rel="noopener noreferrer">View Live Project</a>
    </div>
  `;

  initCarousel(card.querySelector('.carousel'));
  return card;
}

function initCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const dots = [...root.querySelectorAll('.dot')];
  const counter = root.querySelector('.counter');
  const total = Number(root.dataset.count);
  let index = 0;

  const update = (nextIndex) => {
    index = (nextIndex + total) % total;
    root.dataset.index = String(index);
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    counter.textContent = `${index + 1} / ${total}`;
  };

  root.querySelector('.prev').addEventListener('click', () => update(index - 1));
  root.querySelector('.next').addEventListener('click', () => update(index + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => update(Number(dot.dataset.index)));
  });
}

async function init() {
  const grid = document.getElementById('projects-grid');
  try {
    const projects = await loadProjects();
    projects.forEach((project) => grid.appendChild(createCarousel(project)));

    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (error) {
    grid.innerHTML = `<p>Unable to load portfolio gallery. ${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', init);
