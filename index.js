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
        button.addEventListener('click', function () {
            const planName = this.getAttribute('data-plan');
            if (planNameDisplay) {
                planNameDisplay.textContent = planName;
            }
        });
    });

    window.currentPaymentMethod = 'card';
    window.selectedUPIApp = 'Google Pay';

    window.selectPaymentMethod = function (method) {
        currentPaymentMethod = method;
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
        document.getElementById(method + 'Option').classList.add('selected');

        document.querySelectorAll('.form-section').forEach(form => form.classList.remove('active'));
        document.getElementById(method + 'Form').classList.add('active');
    };

    window.formatCardNumber = function (input) {
        let value = input.value.replace(/\s/g, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        input.value = formatted;

        if (value.length === 0) {
            document.getElementById('cardNumberDisplay').textContent = '•••• •••• •••• ••••';
        } else {
            let masked = value.slice(0, -4).replace(/\d/g, '•') + value.slice(-4);
            let maskedFormatted = masked.match(/.{1,4}/g)?.join(' ') || masked;
            document.getElementById('cardNumberDisplay').textContent = maskedFormatted;
        }
    };

    window.updateCardholderDisplay = function () {
        const name = document.getElementById('cardHolder').value || 'YOUR NAME';
        document.getElementById('cardHolderDisplay').textContent = name.toUpperCase();
    };

    window.formatExpiry = function (input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
        input.value = value;
        document.getElementById('cardExpiryDisplay').textContent = value || 'MM/YY';
    };

    window.selectUPI = function (element) {
        document.querySelectorAll('.upi-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        selectedUPIApp = element.querySelector('.upi-name').textContent;
    };

    window.processPayment = function () {
        let isValid = false;

        if (currentPaymentMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            if (!cardNumber || cardNumber.length !== 16) return showToastMsg('Enter a valid 16-digit card number', 'error');
            if (!document.getElementById('cardHolder').value) return showToastMsg('Enter cardholder name', 'error');
            if (!document.getElementById('cardExpiry').value) return showToastMsg('Enter expiry date', 'error');
            if (!document.getElementById('cardCVV').value) return showToastMsg('Enter CVV', 'error');
            isValid = true;
        }
        else if (currentPaymentMethod === 'upi') {
            const upiId = document.getElementById('upiId').value;
            if (!upiId || !upiId.includes('@')) return showToastMsg('Enter a valid UPI ID', 'error');
            isValid = true;
        }
        else if (currentPaymentMethod === 'wallet') {
            const email = document.getElementById('walletEmail').value;
            if (!email || !email.includes('@')) return showToastMsg('Enter a valid email', 'error');
            if (!document.getElementById('walletPassword').value) return showToastMsg('Enter password', 'error');
            isValid = true;
        }

        if (isValid) {
            document.getElementById('loadingModal').classList.add('active');

            const modalElement = document.getElementById('checkoutModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            setTimeout(() => {
                document.getElementById('loadingModal').classList.remove('active');
                document.getElementById('successModal').classList.add('active');
                document.getElementById('orderId').textContent = '#ORD' + Math.floor(Math.random() * 1000000);
            }, 2500);
        }
    };

    window.closeSuccessModal = function () {
        document.getElementById('successModal').classList.remove('active');
        showToastMsg('Thank you for your purchase!', 'success');

        document.getElementById('cardNumber').value = '';
        document.getElementById('cardHolder').value = '';
        document.getElementById('cardExpiry').value = '';
        document.getElementById('cardCVV').value = '';
        document.getElementById('cardNumberDisplay').textContent = '•••• •••• •••• ••••';
        document.getElementById('cardHolderDisplay').textContent = 'YOUR NAME';
        document.getElementById('cardExpiryDisplay').textContent = 'MM/YY';
    };

    window.showToastMsg = function (message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast-msg ' + type;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };
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

            if (modalImage) modalImage.src = imgSrc;
            if (modalTitle) modalTitle.textContent = title;
            if (modalCategory) modalCategory.textContent = category;
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

            if (modalImage) modalImage.src = imgSrc;
            if (modalName) modalName.textContent = name;
            if (modalRole) modalRole.textContent = role;
            if (modalBio) modalBio.textContent = bio;
            if (modalExpertise) modalExpertise.textContent = expertise;
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
