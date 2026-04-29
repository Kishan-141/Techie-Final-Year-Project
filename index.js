document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }
    });

    const animatedSections = document.querySelectorAll('.animate-on-scroll');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    document.querySelectorAll('.navbar-nav a.nav-link:not([data-bs-toggle]), .hero-section a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    const filterButtons = document.querySelectorAll('.portfolio-filters .btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease'; 
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const buyButtons = document.querySelectorAll('.btn-buy');
    const planNameDisplay = document.getElementById('selectedPlanName');
    const paymentForm = document.getElementById('fakePaymentForm');

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.getAttribute('data-plan');
            if(planNameDisplay) {
                planNameDisplay.textContent = planName;
            }
        });
    });

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            alert('✅ Payment Processed Successfully! Welcome to Techie.');
            
            const modalElement = document.getElementById('checkoutModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            
            paymentForm.reset();
        });
    }

    const portfolioModal = document.getElementById('portfolioModal');
    if (portfolioModal) {
        portfolioModal.addEventListener('show.bs.modal', function (event) {
            const triggerLink = event.relatedTarget;
            
            const imgSrc = triggerLink.getAttribute('data-img');
            const title = triggerLink.getAttribute('data-title');
            const category = triggerLink.getAttribute('data-category');

            const modalImage = portfolioModal.querySelector('#modalImg');
            const modalTitle = portfolioModal.querySelector('#modalTitle');
            const modalCategory = portfolioModal.querySelector('#modalCategory');

            if(modalImage) modalImage.src = imgSrc;
            if(modalTitle) modalTitle.textContent = title;
            if(modalCategory) modalCategory.textContent = category;
        });
    }

    const teamModal = document.getElementById('teamModal');
    if (teamModal) {
        teamModal.addEventListener('show.bs.modal', function (event) {
            const triggerCard = event.relatedTarget;
            
            const imgSrc = triggerCard.getAttribute('data-img');
            const name = triggerCard.getAttribute('data-name');
            const role = triggerCard.getAttribute('data-role');
            const bio = triggerCard.getAttribute('data-bio');
            const expertise = triggerCard.getAttribute('data-expertise');

            const modalImage = teamModal.querySelector('#teamModalImg');
            const modalName = teamModal.querySelector('#teamModalName');
            const modalRole = teamModal.querySelector('#teamModalRole');
            const modalBio = teamModal.querySelector('#teamModalBio');
            const modalExpertise = teamModal.querySelector('#teamModalExpertise');

            if(modalImage) modalImage.src = imgSrc;
            if(modalName) modalName.textContent = name;
            if(modalRole) modalRole.textContent = role;
            if(modalBio) modalBio.textContent = bio;
            if(modalExpertise) modalExpertise.textContent = expertise;
        });
    }

    const counters = document.querySelectorAll('.counter-value');
    const countsSection = document.querySelector('.counts-section');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    if (countsSection) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(countsSection);
            }
        }, {
            root: null,
            threshold: 0.5,
        });
        counterObserver.observe(countsSection);
    }

    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
