/* ============================================================
   KAMPUS – KAMKEY PUSAT | Main JavaScript
   ============================================================ */

'use strict';

// ============================================================
// DOM REFERENSI
// ============================================================
const DOM = {
    loadingScreen: document.getElementById('loading-screen'),
    navbar: document.getElementById('mainNavbar'),
    darkToggle: document.getElementById('darkModeToggle'),
    backToTop: document.getElementById('backToTop'),
    heroSection: document.getElementById('hero'),
    ideForm: document.getElementById('ideForm'),
    formSuccess: document.getElementById('formSuccess'),
    counters: document.querySelectorAll('.counter'),
    progressBars: document.querySelectorAll('.progress-bar'),
    timelineProgress: document.querySelector('.timeline-progress'),
    navLinks: document.querySelectorAll('.nav-link'),
};

// ============================================================
// LOADING SCREEN
// ============================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        DOM.loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';
        // Initialize AOS after loading
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: 'mobile'
        });
        // Trigger animations for visible elements
        setTimeout(() => {
            AOS.refresh();
        }, 400);
    }, 2500);
});

// Prevent scroll during loading
document.body.style.overflow = 'hidden';

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
let lastScroll = 0;

const handleNavbarScroll = () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
        DOM.navbar.classList.add('navbar-scrolled');
    } else {
        DOM.navbar.classList.remove('navbar-scrolled');
    }
    
    lastScroll = currentScroll;
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// ============================================================
// DARK MODE TOGGLE
// ============================================================
const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const icon = DOM.darkToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Refresh AOS on theme change
    setTimeout(() => AOS.refresh(), 100);
};

// Initialize theme
applyTheme(getThemePreference());

DOM.darkToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// ============================================================
// BACK TO TOP
// ============================================================
const handleBackToTop = () => {
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > 500) {
        DOM.backToTop.classList.add('show');
    } else {
        DOM.backToTop.classList.remove('show');
    }
};

window.addEventListener('scroll', handleBackToTop, { passive: true });

DOM.backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================================
// COUNTER ANIMATION
// ============================================================
const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current >= target) {
            counter.textContent = target;
            return;
        }
        counter.textContent = current;
        requestAnimationFrame(updateCounter);
    };
    
    updateCounter();
};

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

DOM.counters.forEach(counter => counterObserver.observe(counter));

// ============================================================
// PROGRESS BAR ANIMATION
// ============================================================
const animateProgressBars = () => {
    DOM.progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            bar.style.width = width + '%';
        }
    });
    
    // Animate timeline progress
    if (DOM.timelineProgress) {
        DOM.timelineProgress.style.width = '100%';
    }
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

// Observe the anggaran section for progress animation
const anggaranSection = document.querySelector('#anggaran .anggaran-card');
if (anggaranSection) {
    progressObserver.observe(anggaranSection);
}

// Also observe timeline
const timelineSection = document.querySelector('.timeline-wrapper');
if (timelineSection) {
    progressObserver.observe(timelineSection);
}

// ============================================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile navbar if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) {
                    toggler.click();
                }
            }
            
            // Update active nav link
            DOM.navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// ============================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// ============================================================
// FORM HANDLING - Kirim ke WhatsApp
// ============================================================
const WA_NUMBER = '6285253015515'; // Nomor WhatsApp tujuan

if (DOM.ideForm) {
    DOM.ideForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value.trim();
        const ide = document.getElementById('ide').value.trim();
        const komentar = document.getElementById('komentar').value.trim();
        
        if (!nama || !ide || !komentar) {
            alert('Mohon lengkapi semua field!');
            return;
        }
        
        // Format pesan untuk WhatsApp
        const pesan = `📋 *IDE KEGIATAN - KAMPUS KAMKEY PUSAT*\n\n👤 *Nama:* ${nama}\n💡 *Ide Kegiatan:* ${ide}\n📝 *Komentar:* ${komentar}\n\n_Dikirim melalui Website KAMPUS_`;
        
        // Encode pesan untuk URL
        const pesanEncoded = encodeURIComponent(pesan);
        const waURL = `https://wa.me/${WA_NUMBER}?text=${pesanEncoded}`;
        
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Mengirim ke WhatsApp...';
        submitBtn.disabled = true;
        
        // Buka WhatsApp dengan pesan yang sudah diisi
        window.open(waURL, '_blank');
        
        // Tampilkan sukses setelah delay
        setTimeout(() => {
            this.style.display = 'none';
            DOM.formSuccess.classList.remove('d-none');
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}

// ============================================================
// PARALLAX EFFECT ON HERO (Tilt-like)
// ============================================================
if (DOM.heroSection) {
    DOM.heroSection.addEventListener('mousemove', (e) => {
        const heroContent = DOM.heroSection.querySelector('.hero-content');
        const rect = DOM.heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const moveX = x * 20;
        const moveY = y * 20;
        
        heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
        heroContent.style.transition = 'transform 0.1s ease-out';
    });
    
    DOM.heroSection.addEventListener('mouseleave', () => {
        const heroContent = DOM.heroSection.querySelector('.hero-content');
        heroContent.style.transform = 'translate(0, 0)';
        heroContent.style.transition = 'transform 0.5s ease-out';
    });
}

// ============================================================
// GALERI LIGHTBOX / MODAL (Simple)
// ============================================================
document.querySelectorAll('.galeri-card').forEach(card => {
    card.addEventListener('click', function() {
        const img = this.querySelector('img');
        const caption = this.querySelector('.galeri-overlay span');
        
        if (!img) return;
        
        const modalHtml = `
            <div class="modal fade" id="galeriModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="background:transparent;border:none;">
                        <div class="modal-body p-0 text-center position-relative">
                            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close" style="z-index:10;font-size:1.5rem;"></button>
                            <img src="${img.src}" alt="${caption ? caption.textContent : 'Galeri'}" class="img-fluid rounded-3" style="max-height:80vh;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                            ${caption ? `<p class="text-white mt-3 mb-0 fw-semibold" style="font-size:1.1rem;">${caption.textContent}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('galeriModal');
        if (existingModal) existingModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('galeriModal'));
        modal.show();
    });
});

// ============================================================
// KEYBOARD NAVIGATION
// ============================================================
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            const modal = bootstrap.Modal.getInstance(openModal);
            if (modal) modal.hide();
        }
    }
});

// ============================================================
// RESIZE HANDLER
// ============================================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        AOS.refresh();
    }, 250);
});

// ============================================================
// CONSOLE BRANDING
// ============================================================
console.log('%c KAMPUS – KAMKEY PUSAT ', 'background:#1a237e;color:#d4a017;font-size:18px;font-weight:bold;padding:10px 20px;border-radius:5px;');
console.log('%c "Bersatu dalam Kebersamaan, Berkarya untuk Masyarakat." ', 'color:#ff6f00;font-size:14px;font-style:italic;padding:5px 10px;');
console.log('%c © 2026 - All Rights Reserved ', 'color:#6c757d;font-size:12px;padding:5px 10px;');

// ============================================================
// INITIALIZATION LOG
// ============================================================
console.log('✅ KAMPUS Website loaded successfully');
console.log(`📱 Viewport: ${window.innerWidth}x${window.innerHeight}`);
console.log(`🌓 Theme: ${document.documentElement.getAttribute('data-theme')}`);

