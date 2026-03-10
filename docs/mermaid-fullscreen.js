// Add fullscreen functionality to mermaid diagrams
function initMermaidFullscreen() {
  // Find all mermaid diagrams
  const mermaidDiagrams = document.querySelectorAll('.mermaid');
  
  mermaidDiagrams.forEach((diagram, index) => {
    // Skip if already processed
    if (diagram.dataset.fullscreenAdded === 'true') {
      return;
    }
    diagram.dataset.fullscreenAdded = 'true';
    
    // Create container if it doesn't exist
    let container = diagram.closest('.quarto-figure, figure, div');
    if (!container || container.classList.contains('mermaid-container')) {
      const newContainer = document.createElement('div');
      newContainer.className = 'mermaid-container';
      diagram.parentNode.insertBefore(newContainer, diagram);
      newContainer.appendChild(diagram);
      container = newContainer;
    } else {
      container.classList.add('mermaid-container');
    }
    
    // Create fullscreen button
    const btn = document.createElement('button');
    btn.className = 'mermaid-fullscreen-btn';
    btn.innerHTML = '🔍 Fullscreen';
    btn.setAttribute('aria-label', 'Open diagram in fullscreen');
    btn.type = 'button';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'mermaid-modal';
    modal.id = `mermaid-modal-${index}`;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'mermaid-modal-content';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'mermaid-modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    
    // Clone the diagram for the modal (including SVG)
    const clonedDiagram = diagram.cloneNode(true);
    clonedDiagram.style.width = '100%';
    clonedDiagram.style.height = 'auto';
    clonedDiagram.style.maxWidth = 'none';
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(clonedDiagram);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    container.style.position = 'relative';
    container.appendChild(btn);
    
    // Open modal
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Re-clone to get latest rendered state
      const freshClone = diagram.cloneNode(true);
      freshClone.style.width = '100%';
      freshClone.style.height = 'auto';
      freshClone.style.maxWidth = 'none';
      modalContent.replaceChild(freshClone, clonedDiagram);
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMermaidFullscreen);
} else {
  initMermaidFullscreen();
}

// Also initialize after a delay to catch dynamically rendered mermaid diagrams
setTimeout(initMermaidFullscreen, 1000);
setTimeout(initMermaidFullscreen, 3000);

