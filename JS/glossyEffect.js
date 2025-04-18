document.querySelectorAll('.glossy-container').forEach(container => {
    container.addEventListener('mouseenter', () => {
      container.classList.remove('shine-out');
      container.classList.add('shine-in');
    });
  
    container.addEventListener('mouseleave', () => {
      container.classList.remove('shine-in');
      container.classList.add('shine-out');
    });
  });