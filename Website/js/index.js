  function toggleBox(element) {
    // Alleen op mobiel actief
    if (window.innerWidth <= 970) {
      element.classList.toggle("active");
    }
  }