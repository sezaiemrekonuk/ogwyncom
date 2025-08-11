document.addEventListener('DOMContentLoaded', () => {

    // --- Dinamik Header (Tüm sayfalarda çalışır) ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobil Menü (Tüm sayfalarda çalışır) ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('is-active');
            hamburger.innerHTML = isActive ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            lucide.createIcons();
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }
    
    // --- HİZMETLER KARUSELİ (Sadece index.html'de çalışır) ---
    const hizmetlerCarousel = document.querySelector('.hizmetler-carousel');
    if (hizmetlerCarousel) {
        const cards = hizmetlerCarousel.querySelectorAll('.service-card');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const totalCards = cards.length;
        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
                let newIndex = index - currentIndex;
                
                if (newIndex < -Math.floor(totalCards / 2)) { newIndex += totalCards; }
                if (newIndex > Math.floor(totalCards / 2)) { newIndex -= totalCards; }

                switch (newIndex) {
                    case 0: card.classList.add('active'); break;
                    case 1: card.classList.add('next'); break;
                    case -1: card.classList.add('prev'); break;
                    case 2: card.classList.add('far-next'); break;
                    case -2: card.classList.add('far-prev'); break;
                    default: card.classList.add('hidden'); break;
                }
            });
        }

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            });
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            });
        }
        updateCarousel();
    }

    // --- Scroll Animasyonları (Statik sayfalarda çalışır) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up, .scale-in').forEach(el => observer.observe(el));


    // === SOHBET UYGULAMASI MANTIĞI BU DOSYADAN TAŞINMIŞTIR ===


    // Lucide ikonlarını oluştur
    lucide.createIcons();
});