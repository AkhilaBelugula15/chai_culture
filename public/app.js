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

  // Try backend products first, otherwise fall back to bundled product data
  const localProducts = [
    { id: 1, title: 'Royal Cardamom Bloom', price: 48, img: 'public/images/royal.png', ingredientImg: 'public/images/bloom.png', desc: 'A fragrant blend with whole cardamom and mellow notes.' },
    { id: 2, title: 'Masala Heritage Fusion', price: 48, img: 'public/images/masala.png', ingredientImg: 'public/images/masala.png', desc: 'Warm spices married with black tea for a classic masala experience.' },
    { id: 3, title: 'Zesty Ginger Elixir', price: 48, img: 'public/images/ginger.png', ingredientImg: 'public/images/ginger.png', desc: 'Bright ginger notes with a citrusy finish — invigorating and bold.' }
  ];

  function renderProducts(products) {
    grid.innerHTML = '';
    products.forEach(p => {
      const node = template.content.cloneNode(true);
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
  }

  fetch('/api/products')
    .then(res => {
      if (!res.ok) throw new Error('network response not ok');
      return res.json();
    })
    .then(products => renderProducts(products))
    .catch(err => {
      console.warn('Backend products not available, using local bundle:', err);
      renderProducts(localProducts);
    });

  // Contact form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      // Attempt to submit to backend; if backend is not available (GitHub Pages), fallback to localStorage
      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(r => {
          if (!r.ok) throw new Error('network response not ok');
          return r.json();
        })
        .then(res => {
          const resultEl = document.getElementById('contact-result');
          resultEl.textContent = res.message || 'Thanks for reaching out! We\'ll get back to you soon.';
          resultEl.classList.add('show');
          resultEl.classList.remove('error');
          form.reset();
          setTimeout(() => { resultEl.classList.remove('show'); }, 5000);
        })
        .catch(err => {
          console.warn('Backend contact endpoint unavailable, saving submission locally.', err);
          const drafts = JSON.parse(localStorage.getItem('contactDrafts') || '[]');
          drafts.push(Object.assign({ _savedAt: new Date().toISOString() }, data));
          localStorage.setItem('contactDrafts', JSON.stringify(drafts));
          const resultEl = document.getElementById('contact-result');
          resultEl.textContent = 'Your message was saved locally (offline). It will be sent when a backend is available.';
          resultEl.classList.add('show');
          resultEl.classList.remove('error');
          form.reset();
          setTimeout(() => { resultEl.classList.remove('show'); }, 5000);
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
        .then(r => {
          if (!r.ok) throw new Error('network response not ok');
          return r.json();
        })
        .then(res => {
          const resultEl = document.getElementById('notify-result');
          resultEl.textContent = res.message || 'Thank you! You\'re on our VIP list. ✨';
          resultEl.classList.add('show');
          resultEl.classList.remove('error');
          notifyForm.reset();
          setTimeout(() => { notifyModal.classList.remove('active'); resultEl.classList.remove('show'); }, 3000);
        })
        .catch(err => {
          console.warn('Notify endpoint unavailable, saving locally.', err);
          const list = JSON.parse(localStorage.getItem('notifyList') || '[]');
          list.push(Object.assign({ _savedAt: new Date().toISOString() }, data));
          localStorage.setItem('notifyList', JSON.stringify(list));
          const resultEl = document.getElementById('notify-result');
          resultEl.textContent = 'Saved locally — we will notify you when we launch.';
          resultEl.classList.add('show');
          resultEl.classList.remove('error');
          notifyForm.reset();
          setTimeout(() => { notifyModal.classList.remove('active'); resultEl.classList.remove('show'); }, 2500);
        });
    });
  }});
