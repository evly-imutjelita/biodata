/**
 * SCRIPT.JS - DUO BIODATA SAHABAT (EVINA & ILMY)
 * SMKN 1 BANYUSARI
 * Menangani:
 * 1. Animasi Partikel Grey & Soft Purple
 * 2. Efek Ketik Dinamis
 * 3. 3D Tilt Kartu Interaktif
 * 4. Ganti Foto Langsung dari File (Laptop / HP) & Simpan di LocalStorage
 * 5. Lightbox Modal Galeri Foto
 * 6. Scroll Reveal Animation
 */

// URL Default Foto Awal
const DEFAULT_PHOTOS = {
  evina: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  ilmy: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80'
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Ikon Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Muat Foto yang Tersimpan di LocalStorage (jika ada)
  loadSavedPhotos();

  // 3. Inisialisasi Canvas Partikel Grey & Soft Purple
  initParticleCanvas();

  // 4. Efek Mengetik (Typing Effect Duo)
  initTypingEffect();

  // 5. Animasi Masuk saat Scroll (Intersection Observer)
  initScrollReveal();

  // 6. Efek Interaktif 3D Tilt pada Kartu
  initCardTilt();
});

/* ========================================================
   FOTO MANAGEMENT (GANTI DARI FILE & SIMPAN DI BROWSER)
   ======================================================== */

// Memicu dialog pemilih file untuk profil Evina / Ilmy
function triggerUpload(person) {
  const inputId = person === 'evina' ? 'inputPhotoEvina' : 'inputPhotoIlmy';
  const input = document.getElementById(inputId);
  if (input) {
    input.click();
  }
}

// Menangani file yang dipilih untuk avatar profil
function handlePhotoUpload(event, person) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  // Validasi tipe file harus gambar
  if (!file.type.startsWith('image/')) {
    alert('Mohon pilih file gambar (JPG, PNG, WebP, dll).');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    
    // Update foto di Hero dan di Card
    if (person === 'evina') {
      const heroImg = document.getElementById('avatarEvina');
      const cardImg = document.getElementById('cardAvatarEvina');
      if (heroImg) heroImg.src = dataUrl;
      if (cardImg) cardImg.src = dataUrl;
      localStorage.setItem('duo_photo_evina', dataUrl);
      showToast('Foto Evina berhasil diganti & tersimpan! 🎉');
    } else if (person === 'ilmy') {
      const heroImg = document.getElementById('avatarIlmy');
      const cardImg = document.getElementById('cardAvatarIlmy');
      if (heroImg) heroImg.src = dataUrl;
      if (cardImg) cardImg.src = dataUrl;
      localStorage.setItem('duo_photo_ilmy', dataUrl);
      showToast('Foto Ilmy berhasil diganti & tersimpan! 🎉');
    }
  };

  reader.readAsDataURL(file);
  // Reset input agar bisa memilih file yang sama jika diperlukan
  event.target.value = '';
}

// Memicu pemilih file untuk galeri momen (index 0 - 3)
function triggerGalleryUpload(index) {
  const input = document.getElementById('inputPhotoGallery' + index);
  if (input) {
    input.click();
  }
}

// Menangani upload foto galeri
function handleGalleryUpload(event, index) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Mohon pilih file gambar.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const galleryImg = document.getElementById('galleryImg' + index);
    if (galleryImg) {
      galleryImg.src = dataUrl;
    }
    localStorage.setItem('duo_gallery_' + index, dataUrl);
    showToast(`Foto Galeri ${index + 1} berhasil diperbarui! ✨`);
  };

  reader.readAsDataURL(file);
  event.target.value = '';
}

// Memuat foto dari LocalStorage saat halaman dibuka
function loadSavedPhotos() {
  try {
    const savedEvina = localStorage.getItem('duo_photo_evina');
    if (savedEvina) {
      const hEvina = document.getElementById('avatarEvina');
      const cEvina = document.getElementById('cardAvatarEvina');
      if (hEvina) hEvina.src = savedEvina;
      if (cEvina) cEvina.src = savedEvina;
    }

    const savedIlmy = localStorage.getItem('duo_photo_ilmy');
    if (savedIlmy) {
      const hIlmy = document.getElementById('avatarIlmy');
      const cIlmy = document.getElementById('cardAvatarIlmy');
      if (hIlmy) hIlmy.src = savedIlmy;
      if (cIlmy) cIlmy.src = savedIlmy;
    }

    // Galeri foto 0 - 3
    for (let i = 0; i < 4; i++) {
      const savedGal = localStorage.getItem('duo_gallery_' + i);
      if (savedGal) {
        const gImg = document.getElementById('galleryImg' + i);
        if (gImg) gImg.src = savedGal;
      }
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

// Mengembalikan foto ke default awal
function resetAllPhotos() {
  if (!confirm('Apakah Anda yakin ingin mengembalikan semua foto ke foto contoh awal?')) return;

  try {
    localStorage.removeItem('duo_photo_evina');
    localStorage.removeItem('duo_photo_ilmy');
    for (let i = 0; i < 4; i++) {
      localStorage.removeItem('duo_gallery_' + i);
    }

    // Pulihkan DOM
    const hEvina = document.getElementById('avatarEvina');
    const cEvina = document.getElementById('cardAvatarEvina');
    if (hEvina) hEvina.src = DEFAULT_PHOTOS.evina;
    if (cEvina) cEvina.src = DEFAULT_PHOTOS.evina;

    const hIlmy = document.getElementById('avatarIlmy');
    const cIlmy = document.getElementById('cardAvatarIlmy');
    if (hIlmy) hIlmy.src = DEFAULT_PHOTOS.ilmy;
    if (cIlmy) cIlmy.src = DEFAULT_PHOTOS.ilmy;

    for (let i = 0; i < 4; i++) {
      const gImg = document.getElementById('galleryImg' + i);
      if (gImg) gImg.src = DEFAULT_PHOTOS.gallery[i];
    }

    showToast('Semua foto dikembalikan ke tampilan awal.');
  } catch (err) {
    console.error(err);
  }
}

// Menampilkan Toast Notifikasi
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast) return;

  if (toastMsg && message) {
    toastMsg.textContent = message;
  }

  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
}

/* ========================================================
   LIGHTBOX MODAL FOTO GALERI
   ======================================================== */
function openGalleryModal(index) {
  const galleryImg = document.getElementById('galleryImg' + index);
  if (!galleryImg) return;

  const captions = [
    'Momen Ceria Bersama Sahabat',
    'Belajar & Bercanda di SMKN 1 Banyusari',
    'Hangout & Berburu Kuliner Seru',
    'Petualangan & Liburan Singkat'
  ];

  openPhotoModal(galleryImg.src, captions[index] || 'Momen Bersama');
}

function openPhotoModal(imgSrc, caption) {
  const modal = document.getElementById('photoModal');
  const modalBox = document.getElementById('photoModalBox');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');

  if (!modal || !modalImg) return;

  modalImg.src = imgSrc;
  modalCaption.textContent = caption || 'Momen Bersama';

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modalBox.classList.remove('scale-95');
    modalBox.classList.add('scale-100');
  }, 10);
}

function closePhotoModal() {
  const modal = document.getElementById('photoModal');
  const modalBox = document.getElementById('photoModalBox');
  if (!modal) return;

  modal.classList.add('opacity-0');
  modalBox.classList.add('scale-95');
  modalBox.classList.remove('scale-100');

  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 300);
}

// Tutup modal jika klik di luar box modal
window.addEventListener('click', (e) => {
  const modal = document.getElementById('photoModal');
  if (e.target === modal) {
    closePhotoModal();
  }
});

// Tutup modal dengan tombol Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePhotoModal();
  }
});

/* ========================================================
   PARTICLE CANVAS (Grey & Soft Purple Interactive Dust)
   ======================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 32 : 65;

  const colors = [
    'rgba(184, 146, 255, 0.45)', // soft purple
    'rgba(196, 181, 253, 0.35)', // lavender
    'rgba(148, 163, 184, 0.30)', // slate/grey
    'rgba(224, 216, 255, 0.40)'  // light soft purple
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(184, 146, 255, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const maxDist = window.innerWidth < 768 ? 85 : 120;
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(184, 146, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ========================================================
   TYPING EFFECT (Efek Mengetik Otomatis untuk Dua Sahabat)
   ======================================================== */
function initTypingEffect() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const words = [
    'Duo Sahabat SMKN 1 BANYUSARI',
    'Evina (Scorpio) & Ilmy (Sagitarius)',
    'Memasak, Olahraga, & Belanja',
    'Dua Karakter Saling Melengkapi',
    'Best Friends Forever ✨'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ========================================================
   SCROLL REVEAL (Kemunculan Elemen saat Scroll)
   ======================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ========================================================
   CARD 3D TILT EFFECT (Halus dan responsif di desktop)
   ======================================================== */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.012, 1.012, 1.012)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}
