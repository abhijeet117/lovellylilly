import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const DOT = document.getElementById('cur-dot');
    const RNG = document.getElementById('cur-ring');
    const HAL = document.getElementById('cur-halo');
    
    if (!DOT || !RNG || !HAL) return;

    let mx = 0, my = 0, rx = 0, ry = 0, hx = 0, hy = 0;
    let animationFrameId;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      DOT.style.left = mx + 'px';
      DOT.style.top = my + 'px';
    };

    document.addEventListener('mousemove', onMouseMove);

    const loop = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      hx += (mx - hx) * 0.06;
      hy += (my - hy) * 0.06;
      RNG.style.left = rx + 'px';
      RNG.style.top = ry + 'px';
      HAL.style.left = hx + 'px';
      HAL.style.top = hy + 'px';
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    const addHoverClass = () => document.body.classList.add('is-hovering');
    const removeHoverClass = () => document.body.classList.remove('is-hovering');

    const attachHoverSelectors = () => {
      document.querySelectorAll('a, button, .bc, .pc, .how-step, input, label, .oauth-btn').forEach(el => {
        el.addEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseleave', removeHoverClass);
      });
    };

    const observer = new MutationObserver(() => {
      // Re-attach hover selectors when DOM mutations occur
      // First detach to avoid duplicate listeners if possible
      // But adding multiple identical listeners doesn't duplicate them in JS, 
      // as long as the functions are the exact same reference.
      attachHoverSelectors();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    attachHoverSelectors();

    const addClicking = () => document.body.classList.add('is-clicking');
    const removeClicking = () => document.body.classList.remove('is-clicking');
    
    document.addEventListener('mousedown', addClicking);
    document.addEventListener('mouseup', removeClicking);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', addClicking);
      document.removeEventListener('mouseup', removeClicking);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cur-dot"></div>
      <div id="cur-ring"></div>
      <div id="cur-halo"></div>
    </>
  );
};

export default CustomCursor;
