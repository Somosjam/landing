(function () {
	'use strict';

	var nav = document.querySelector('[data-jam-nav]');
	var toggle = document.querySelector('[data-jam-menu-toggle]');
	var mobileMenu = document.querySelector('[data-jam-mobile-menu]');
	var mobileLinks = document.querySelectorAll('[data-jam-mobile-link]');
	var backToTop = document.querySelector('.jam-back-to-top');
	var recaptchaForm = document.querySelector('[data-recaptcha-form]');
	var staticForm = document.querySelector('[data-static-form]');

	function setScrolledState() {
		if (!nav) {
			return;
		}
		nav.classList.toggle('is-scrolled', window.scrollY > 60);
	}

	function closeMenu() {
		if (!toggle || !mobileMenu) {
			return;
		}
		toggle.setAttribute('aria-expanded', 'false');
		toggle.classList.remove('is-open');
		mobileMenu.hidden = true;
	}

	function toggleMenu() {
		if (!toggle || !mobileMenu) {
			return;
		}
		var isOpen = toggle.getAttribute('aria-expanded') === 'true';
		toggle.setAttribute('aria-expanded', String(!isOpen));
		toggle.classList.toggle('is-open', !isOpen);
		mobileMenu.hidden = isOpen;
	}

	function initFadeUp() {
		var items = document.querySelectorAll('.fade-up');
		if (!items.length || !('IntersectionObserver' in window)) {
			items.forEach(function (item) {
				item.classList.add('in-view');
			});
			return;
		}

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('in-view');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.16 }
		);

		items.forEach(function (item) {
			observer.observe(item);
		});
	}

	function animateCount(element) {
		var target = parseInt(element.getAttribute('data-count-up'), 10);
		if (!Number.isFinite(target)) {
			return;
		}

		var start = 0;
		var duration = 1200;
		var startTime = null;

		function tick(timestamp) {
			if (!startTime) {
				startTime = timestamp;
			}
			var progress = Math.min((timestamp - startTime) / duration, 1);
			var eased = 1 - Math.pow(1 - progress, 3);
			element.textContent = String(Math.round(start + (target - start) * eased));

			if (progress < 1) {
				window.requestAnimationFrame(tick);
			}
		}

		window.requestAnimationFrame(tick);
	}

	function initCounters() {
		var counters = document.querySelectorAll('[data-count-up]');
		if (!counters.length || !('IntersectionObserver' in window)) {
			counters.forEach(animateCount);
			return;
		}

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						animateCount(entry.target);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.6 }
		);

		counters.forEach(function (counter) {
			observer.observe(counter);
		});
	}

	function initRecaptchaForm() {
		if (!recaptchaForm || typeof window.grecaptcha === 'undefined' || typeof window.jamRecaptcha === 'undefined') {
			return;
		}

		recaptchaForm.addEventListener('submit', function (event) {
			var tokenInput = recaptchaForm.querySelector('[data-recaptcha-token]');
			var submitButton = recaptchaForm.querySelector('button[type="submit"]');

			if (!tokenInput || tokenInput.value) {
				return;
			}

			event.preventDefault();

			if (submitButton) {
				submitButton.disabled = true;
				submitButton.textContent = 'Enviando...';
			}

			window.grecaptcha.ready(function () {
				window.grecaptcha
					.execute(window.jamRecaptcha.siteKey, { action: window.jamRecaptcha.action })
					.then(function (token) {
						tokenInput.value = token;
						recaptchaForm.submit();
					})
					.catch(function () {
						if (submitButton) {
							submitButton.disabled = false;
							submitButton.textContent = 'Enviar formulario \u2192';
						}
					});
			});
		});
	}

	function initStaticForm() {
		if (!staticForm) {
			return;
		}

		staticForm.addEventListener('submit', function (event) {
			var existingNotice = staticForm.querySelector('.jam-form-notice');

			event.preventDefault();

			if (!existingNotice) {
				existingNotice = document.createElement('p');
				existingNotice.className = 'jam-form-notice jam-form-notice-success';
				staticForm.prepend(existingNotice);
			}

			existingNotice.textContent = 'Vista estática: formulario recibido para previsualización.';
			staticForm.reset();
		});
	}

	if (toggle) {
		toggle.addEventListener('click', toggleMenu);
	}

	mobileLinks.forEach(function (link) {
		link.addEventListener('click', closeMenu);
	});

	if (backToTop) {
		backToTop.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	setScrolledState();
	window.addEventListener('scroll', setScrolledState, { passive: true });
	document.addEventListener('DOMContentLoaded', function () {
		initFadeUp();
		initCounters();
		initRecaptchaForm();
		initStaticForm();
	});
})();
