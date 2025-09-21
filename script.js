// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Search Modal
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.getElementById('closeSearch');

    searchBtn.addEventListener('click', function() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeSearch.addEventListener('click', function() {
        searchModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close search modal when clicking outside
    searchModal.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Search form submission
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            // Simulate search (replace with actual search logic)
            alert(`검색어: "${searchTerm}"`);
            searchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            searchInput.value = '';
        }
    });

    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    let currentHeroSlide = 0;

    function showHeroSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    function prevHeroSlide() {
        currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    heroNext.addEventListener('click', nextHeroSlide);
    heroPrev.addEventListener('click', prevHeroSlide);

    // Auto-advance hero slider
    setInterval(nextHeroSlide, 5000);

    // News Carousel
    const newsSlider = document.getElementById('newsSlider');
    const newsPrev = document.getElementById('newsPrev');
    const newsNext = document.getElementById('newsNext');
    const newsCards = document.querySelectorAll('.news-card');

    let currentNewsIndex = 0;
    const cardsToShow = getCardsToShow();

    function getCardsToShow() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }

    function updateNewsCarousel() {
        const cardWidth = newsCards[0].offsetWidth + 30; // Card width + gap
        const translateX = -(currentNewsIndex * cardWidth);
        newsSlider.style.transform = `translateX(${translateX}px)`;

        // Update navigation buttons
        newsPrev.style.opacity = currentNewsIndex === 0 ? '0.5' : '1';
        newsPrev.style.pointerEvents = currentNewsIndex === 0 ? 'none' : 'auto';

        const maxIndex = Math.max(0, newsCards.length - cardsToShow);
        newsNext.style.opacity = currentNewsIndex >= maxIndex ? '0.5' : '1';
        newsNext.style.pointerEvents = currentNewsIndex >= maxIndex ? 'none' : 'auto';
    }

    function nextNews() {
        const maxIndex = Math.max(0, newsCards.length - cardsToShow);
        if (currentNewsIndex < maxIndex) {
            currentNewsIndex++;
            updateNewsCarousel();
        }
    }

    function prevNews() {
        if (currentNewsIndex > 0) {
            currentNewsIndex--;
            updateNewsCarousel();
        }
    }

    newsNext.addEventListener('click', nextNews);
    newsPrev.addEventListener('click', prevNews);

    // Update carousel on window resize
    window.addEventListener('resize', function() {
        const newCardsToShow = getCardsToShow();
        if (newCardsToShow !== cardsToShow) {
            currentNewsIndex = 0;
            updateNewsCarousel();
        }
    });

    // Initialize news carousel
    updateNewsCarousel();

    // News Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Here you would typically filter the news content
            const tabType = this.getAttribute('data-tab');
            console.log('Filter news by:', tabType);

            // Reset carousel position when changing tabs
            currentNewsIndex = 0;
            updateNewsCarousel();
        });
    });

    // Touch/Swipe support for mobile
    let startX = 0;
    let endX = 0;

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
    }

    function handleTouchMove(e) {
        endX = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        const diffX = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left - next slide
                nextNews();
            } else {
                // Swipe right - previous slide
                prevNews();
            }
        }
    }

    // Add touch events to news carousel
    newsSlider.addEventListener('touchstart', handleTouchStart, { passive: true });
    newsSlider.addEventListener('touchmove', handleTouchMove, { passive: true });
    newsSlider.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.news-card, .quick-menu-item, .announcement-item').forEach(el => {
        observer.observe(el);
    });

    // Lazy loading for images
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Form validation (if needed)
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Video player enhancement
    const videoContainer = document.querySelector('.video-wrapper');
    if (videoContainer) {
        const iframe = videoContainer.querySelector('iframe');

        // Add click to play functionality
        videoContainer.addEventListener('click', function() {
            if (iframe.src.indexOf('autoplay=1') === -1) {
                iframe.src += '&autoplay=1';
            }
        });
    }

    // Quick menu item click handlers
    document.querySelectorAll('.quick-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            console.log('Quick menu clicked:', title);

            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect CSS
    const style = document.createElement('style');
    style.textContent = `
        .quick-menu-item {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(74, 144, 226, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .header {
            transition: transform 0.3s ease;
        }

        .error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
    `;
    document.head.appendChild(style);

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Debounced resize handler
    const debouncedResize = debounce(() => {
        updateNewsCarousel();
    }, 250);

    window.addEventListener('resize', debouncedResize);

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close search modal
            if (searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            // Close mobile menu
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }

        // Arrow key navigation for carousel
        if (e.key === 'ArrowLeft') {
            prevNews();
        } else if (e.key === 'ArrowRight') {
            nextNews();
        }
    });

    // Initialize tooltips (if needed)
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);

                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            });

            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    initTooltips();

    // Console log for debugging
    console.log('Seoul Education Research Information Institute website initialized successfully!');
});

// FAQ Toggle Function
function toggleFaq(button) {
    const faqAnswer = button.nextElementSibling;
    const faqIcon = button.querySelector('.faq-icon');
    const isOpen = button.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== button) {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('open');
            const icon = q.querySelector('.faq-icon');
            icon.src = 'images/plus_icon.png';
            icon.alt = '펼치기';
        }
    });

    // Toggle current FAQ item
    if (isOpen) {
        button.classList.remove('active');
        faqAnswer.classList.remove('open');
        faqIcon.src = 'images/plus_icon.png';
        faqIcon.alt = '펼치기';
    } else {
        button.classList.add('active');
        faqAnswer.classList.add('open');
        faqIcon.src = 'images/minus_icon.png';
        faqIcon.alt = '접기';
    }
}

// External API integrations (placeholder functions)
function loadNewsData() {
    // Placeholder for loading news from API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    date: '2024.09.21',
                    title: 'OECD교육 2030 중등학교 교육과정 개정방향을 탐색하다',
                    description: '2022 개정 교육과정에서 추구하는 인재상과 핵심역량을 실현하기 위한 중등학교 교육과정 운영 방안을 모색합니다.',
                    category: 'education'
                },
                // Add more news items as needed
            ]);
        }, 1000);
    });
}

function loadAnnouncementData() {
    // Placeholder for loading announcements from API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    category: '신청',
                    title: '서울특별시교육청교육정책포럼',
                    description: '교육정책 연구 및 포럼 참여 신청을 받고 있습니다.',
                    contact: 'TEL 02-1234-5678'
                }
            ]);
        }, 800);
    });
}

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}