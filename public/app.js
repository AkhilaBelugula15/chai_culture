document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('product-grid');
  const template = document.getElementById('product-template');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const notifyModal = document.getElementById('notify-modal');
  const notifyBtn = document.getElementById('notify-btn');
  const modalCloses = document.querySelectorAll('.modal-close');

  // Close any modal when clicking the X button
  modalCloses.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal').classList.remove('active');
    });
  });

  // Notify Me button click
  if (notifyBtn) {
    notifyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      notifyModal.classList.add('active');
    });
  }

  // Close modal when clicking outside the content
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        m.classList.remove('active');
      }
    });
  });

  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      products.forEach(p => {
        const node = template.content.cloneNode(true);
        
        // Extract first word or create label from title
        const label = p.title.split(' ')[0];
        const subtitle = p.title.substring(label.length).trim();
        
        node.querySelector('.card-label').textContent = label;
        node.querySelector('.card-subtitle').textContent = subtitle;
        
        const img = node.querySelector('.card-preview');
        img.src = p.img;
        img.alt = p.title;
        
        node.querySelector('.product-title').textContent = p.title;
        node.querySelector('.price').textContent = `$${p.price}`;
        node.querySelector('.desc').textContent = p.desc;
        
        // Set ingredient image
        const ingredientImg = node.querySelector('.ingredient-img');
        if (p.ingredientImg) {
          ingredientImg.src = p.ingredientImg;
          ingredientImg.alt = p.title + ' ingredients';
        }
        
        const addBtn = node.querySelector('.btn-add-to-cart');
        const wishlistBtn = node.querySelector('.btn-wishlist');
        
        addBtn.addEventListener('click', () => {
          addBtn.textContent = '✓ Added!';
          addBtn.style.background = 'var(--gold)';
          setTimeout(() => {
            addBtn.textContent = 'Add to Cart';
            addBtn.style.background = 'var(--brown)';
          }, 2000);
        });
        
        wishlistBtn.addEventListener('click', (e) => {
          wishlistBtn.textContent = wishlistBtn.textContent === '♡' ? '♥' : '♡';
          wishlistBtn.style.color = wishlistBtn.textContent === '♥' ? '#fff' : 'var(--gold-dark)';
          wishlistBtn.style.background = wishlistBtn.textContent === '♥' ? 'var(--gold)' : 'linear-gradient(135deg, rgba(201,168,74,0.15) 0%, rgba(246,239,230,0.3) 100%)';
        });
        
        grid.appendChild(node);
      });
    })
    .catch(err => {
      grid.innerHTML = '<p>Unable to load products.</p>';
      console.error(err);
    });

  // Contact form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(r => r.json())
        .then(res => {
          const resultEl = document.getElementById('contact-result');
          resultEl.textContent = res.message || 'Thanks for reaching out! We\'ll get back to you soon.';
          resultEl.classList.add('show');
          resultEl.classList.remove('error');
          form.reset();
          setTimeout(() => {
            resultEl.classList.remove('show');
          }, 5000);
        })
        .catch(err => { 
          const resultEl = document.getElementById('contact-result');
          resultEl.textContent = 'Error sending message. Please try again.'; 
          resultEl.classList.add('show', 'error');
          console.error(err); 
        });
    });
  }

  // Notify Me form submission
  const notifyForm = document.getElementById('notify-form');
  if (notifyForm) {
    notifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(notifyForm));
      fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(r => r.json())
        .then(res => {
          const resultEl = document.getElementById('notify-result');
          resultEl.textContent = res.message || 'Thank you! You\'re on our VIP list. ✨';
          resultEl.classList.add('show');
          resultEl.classList.remove('error');
          notifyForm.reset();
          setTimeout(() => {
            notifyModal.classList.remove('active');
            resultEl.classList.remove('show');
          }, 3000);
        })
        .catch(err => {
          const resultEl = document.getElementById('notify-result');
          resultEl.textContent = 'Error. Please try again.';
          resultEl.classList.add('show', 'error');
          console.error(err);
        });
    });
  }});