const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());

// Serve static files from public and root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Store for contact submissions
const contactsFile = path.join(__dirname, 'contacts.json');
let contacts = [];

// Load existing contacts
if (fs.existsSync(contactsFile)) {
  try {
    const data = fs.readFileSync(contactsFile, 'utf8');
    contacts = JSON.parse(data);
  } catch (err) {
    console.error('Error reading contacts file:', err);
  }
}

const products = [
  { id: 1, title: 'Royal Cardamom Bloom', price: 48, img: '/public/images/royal-cardamom.svg', modalImg: '/images/royal.png', ingredientImg: '/images/bloom.png', desc: 'A fragrant, regal blend of green cardamom and delicate black tea.' },
  { id: 2, title: 'Masala Heritage Fusion', price: 48, img: '/public/images/masala-heritage.svg', modalImg: '/images/heritage.png', ingredientImg: '/images/masala.png', desc: 'Spiced to tradition — cinnamon, cloves, pepper, and ginger.' },
  { id: 3, title: 'Zesty Ginger Elixir', price: 48, img: '/public/images/zesty-ginger.svg', modalImg: '/images/zestyyyy.png', ingredientImg: '/images/ginger.png', desc: 'A bright, restorative infusion with lively ginger and citrus notes.' }
];

// Validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ ok: false, message: 'Name is required.' });
  }
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Valid email is required.' });
  }
  if (!subject || subject.trim().length === 0) {
    return res.status(400).json({ ok: false, message: 'Subject is required.' });
  }
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ ok: false, message: 'Message is required.' });
  }

  const contact = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    submittedAt: new Date().toISOString()
  };

  // Save to contacts array and file
  contacts.push(contact);
  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

  console.log('New contact submission:', contact);
  
  res.status(200).json({ 
    ok: true, 
    message: 'Thank you! Your message has been received. We\'ll get back to you within 24 hours.',
    contact: { id: contact.id }
  });
});

// Admin endpoint to view all contacts (optional)
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.post('/api/notify', (req, res) => {
  const { email, preference } = req.body;

  // Validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'Valid email is required.' });
  }
  if (!preference || preference.trim().length === 0) {
    return res.status(400).json({ ok: false, message: 'Please select a preference.' });
  }

  const notification = {
    id: Date.now(),
    email: email.trim(),
    preference: preference.trim(),
    subscribedAt: new Date().toISOString()
  };

  console.log('New notification subscription:', notification);
  
  res.status(200).json({ 
    ok: true, 
    message: 'You\'re in! Exclusive previews coming soon. ✨'
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Chai Culture app running on http://localhost:${port}`));
