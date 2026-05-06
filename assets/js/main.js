document.addEventListener('DOMContentLoaded', () => {
  // --- NAV SCROLL EFFECT ---
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(255,255,255,0.95)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
    } else {
      nav.style.background = 'rgba(255,255,255,0.85)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
    }
  });

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        entry.target.classList.remove('active');
      } else {
        entry.target.classList.add('active');
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // --- FAQ TOGGLE ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          // simple slide up logic could go here
          otherItem.querySelector('.faq-a').style.display = 'none';
        }
      });
      
      // Toggle current item
      item.classList.toggle('open');
      const answer = item.querySelector('.faq-a');
      if (item.classList.contains('open')) {
        answer.style.display = 'block';
      } else {
        answer.style.display = 'none';
      }
    });
  });

  // --- MODAL LOGIC FOR SUCCESS CASES ---
  const modalOverlay = document.getElementById('caso-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  
  const casoCards = document.querySelectorAll('.caso-card');
  
  casoCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-full-desc');
      const result = card.querySelector('.caso-result').innerText;
      
      modalBody.innerHTML = `
        <span class="caso-sector">${card.querySelector('.caso-sector').innerText}</span>
        <h3>${title}</h3>
        <p class="caso-result" style="font-size: 32px;">${result}</p>
        <p>${desc}</p>
      `;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent scrolling
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

});
