export const initCardTilt = (selector) => {
    document.querySelectorAll(selector).forEach(card => {
      // Avoid attaching multiple event listeners directly.
      if (card.dataset.tiltAttached) return;
      card.dataset.tiltAttached = "true";
  
      card.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / r.width * 2;
        const dy = (e.clientY - cy) / r.height * 2;
        card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 5}deg) translateY(-4px) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0) scale(1)';
      });
    });
  };
