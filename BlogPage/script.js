// ==================== Time Capsule Landing Page ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sophisticated scroll-based reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation delays for visual flow
                const delay = index * 50;
                entry.target.style.animationDelay = `${delay}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.feature-item, .moment-card, .post-card').forEach(el => {
        observer.observe(el);
    });

    // Subtle parallax effect on hero section
    window.addEventListener('scroll', function() {
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            const scrollY = window.scrollY;
            const maxScroll = window.innerHeight;
            const parallaxAmount = Math.min(scrollY * 0.3, maxScroll * 0.2);
            heroBg.style.transform = `translate(${parallaxAmount * 0.1}px, ${parallaxAmount}px)`;
        }
    }, false);

    // Button hover ripple effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'ripple-expand 0.6s ease-out';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-expand {
            from {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            to {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Enhanced scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 40px;
        height: 40px;
        background: rgba(212, 165, 116, 0.1);
        border: 2px solid rgba(212, 165, 116, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        opacity: 0;
        transition: opacity 300ms ease-out;
        pointer-events: none;
        z-index: 100;
    `;
    scrollIndicator.innerHTML = '↓';
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', function() {
        if (window.scrollY > window.innerHeight * 0.3) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
});
