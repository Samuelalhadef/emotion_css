/**
 * Code principal pour l'animation cubiste de "Demain, dès l'aube..."
 * Initialise l'application et gère les événements.
 */

// Variables globales
let currentSceneIndex = 0;
let isTransitioning = false;
let autoAdvanceTimer = null;
let mouseX = 0;
let mouseY = 0;
let lastInteraction = 0;
let hasShownFinalMessage = false; // Flag pour suivre si le message final a été affiché

// Initialisation complète au chargement
window.addEventListener('load', function() {
  // Éléments DOM
  const elements = {
    intro: document.getElementById('intro'),
    startButton: document.getElementById('start-button'),
    poemContainer: document.getElementById('poem-container'),
    sceneTitle: document.getElementById('scene-title'),
    controls: document.getElementById('controls'),
    progressContainer: document.getElementById('progress-container'),
    progressBar: document.getElementById('progress-bar'),
    audioControls: document.getElementById('audio-controls'),
    volumeSlider: document.getElementById('volume-slider'),
    muteButton: document.getElementById('mute-button'),
    clickHint: document.getElementById('click-hint'),
    magicCircle: document.getElementById('magic-circle'),
    loadingScreen: document.getElementById('loading'),
    backgroundMusic: document.getElementById('background-music')
  };

  // Vérifier que l'élément audio est bien chargé
  if (elements.backgroundMusic) {
    console.log("Audio trouvé:", elements.backgroundMusic);
    console.log("Source audio:", elements.backgroundMusic.src);
    
    // Précharger l'audio
    elements.backgroundMusic.load();
  } else {
    console.error("Élément audio 'background-music' non trouvé");
  }

  // Masquer l'écran de chargement au démarrage
  if (elements.loadingScreen) {
    elements.loadingScreen.style.opacity = '0';
    setTimeout(() => { 
      elements.loadingScreen.style.display = 'none'; 
    }, 1000);
  }

  // Redimensionner les canvas
  resizeCanvases();
  
  // Configurer les écouteurs d'événements
  setupEventListeners();

  // Configurer les éléments d'interface
  function setupEventListeners() {
    // Écouteur pour le bouton de démarrage
    if (elements.startButton) {
      elements.startButton.addEventListener('click', startExperience);
      
      // Ajouter un écouteur pour jouer l'audio lors du clic (contourne la restriction d'autoplay)
      elements.startButton.addEventListener('click', function() {
        if (elements.backgroundMusic) {
          // Essayer de jouer la musique maintenant que l'utilisateur a interagi
          elements.backgroundMusic.play().catch(err => {
            console.warn("Impossible de lire l'audio même après interaction:", err);
          });
        }
        // Jouer un son de clic fort pour le démarrage
        playInteractionSound('strong-click');
      });
    }
    
    // Écouteur pour le redimensionnement de la fenêtre
    window.addEventListener('resize', resizeCanvases);
    
    // Écouteur pour les clics dans le document
    document.addEventListener('click', handleDocumentClick);
    
    // Écouteur pour le mouvement de la souris
    document.addEventListener('mousemove', handleMouseMove);
    
    // Écouteur pour le mouvement tactile
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Configuration des contrôles audio
    setupAudioControls();
    
    // Écouteur pour déboguer les événements audio
    if (elements.backgroundMusic) {
      elements.backgroundMusic.addEventListener('play', () => {
        console.log("L'audio a commencé à jouer!");
      });
      
      elements.backgroundMusic.addEventListener('pause', () => {
        console.log("L'audio a été mis en pause");
      });
      
      elements.backgroundMusic.addEventListener('error', (e) => {
        console.error("Erreur de lecture audio:", e);
      });
    }
    
    // Événement pour détecter quand l'audio est chargé
    document.addEventListener('click', tryPlayAudio);
    document.addEventListener('keydown', tryPlayAudio);
    document.addEventListener('touchstart', tryPlayAudio);
  }
  
  // Essayer de jouer l'audio après interaction
  function tryPlayAudio() {
    if (elements.backgroundMusic && elements.backgroundMusic.paused) {
      elements.backgroundMusic.play().then(() => {
        console.log("Audio démarré après interaction utilisateur");
        // Supprimer les écouteurs une fois l'audio démarré
        document.removeEventListener('click', tryPlayAudio);
        document.removeEventListener('keydown', tryPlayAudio);
        document.removeEventListener('touchstart', tryPlayAudio);
      }).catch(err => {
        console.warn("Échec de lecture audio après interaction:", err);
      });
    }
  }

  // Démarrer l'expérience
  function startExperience() {
    // Masquer l'introduction avec animation
    if (elements.intro) {
      elements.intro.style.opacity = '0';
      setTimeout(() => {
        elements.intro.style.display = 'none';
      }, 1500);
    }
    
    // Initialiser l'audio
    initAudio();
    
    // Démarrer la musique de fond (après interaction utilisateur)
    startBackgroundMusic();
    
    // Créer les éléments d'interface
    createPoemLines();
    createNavigationDots();
    
    // Afficher les contrôles
    setTimeout(() => {
      if (elements.controls) {
        elements.controls.style.opacity = '1';
      }
      if (elements.progressContainer) {
        elements.progressContainer.style.opacity = '1';
      }
      if (elements.audioControls) {
        elements.audioControls.style.opacity = '1';
      }
      if (elements.clickHint) {
        elements.clickHint.style.opacity = '1';
        setTimeout(() => {
          elements.clickHint.style.opacity = '0';
        }, 8000);
      }
    }, 1000);
    
    // Initialiser la première scène
    drawBackground();
    generateShapes();
    createParticles();
    fadeInCurrentScene();
    
    // Démarrer l'animation
    animate(0);
    
    // Configurer l'avancement automatique
    updateScene();
    
    // Jouer un son pour signaler le début
    playWelcomeTones();
    
    // Réinitialiser le flag de message final
    hasShownFinalMessage = false;
  }

  // Créer les lignes du poème
  function createPoemLines() {
    if (!elements.poemContainer) return;
    
    elements.poemContainer.innerHTML = '';
    
    sceneData.forEach(scene => {
      scene.lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'poem-line';
        lineDiv.textContent = line;
        elements.poemContainer.appendChild(lineDiv);
      });
    });
  }

  // Créer la navigation entre les scènes
  function createNavigationDots() {
    if (!elements.controls) return;
    
    elements.controls.innerHTML = '';
    
    sceneData.forEach((scene, index) => {
      const dot = document.createElement('div');
      dot.className = 'control-dot';
      if (index === currentSceneIndex) {
        dot.classList.add('active');
      }
      
      dot.addEventListener('click', () => {
        goToScene(index);
        // Son plus fort pour les transitions de scène
        playInteractionSound('strong-click');
        
        // Tenter de jouer l'audio lors de l'interaction
        if (elements.backgroundMusic && elements.backgroundMusic.paused) {
          elements.backgroundMusic.play().catch(err => {
            console.warn("Impossible de démarrer l'audio lors du clic sur le point:", err);
          });
        }
      });
      
      // Ajouter un effet sonore au survol
      dot.addEventListener('mouseenter', () => {
        playInteractionSound('hover');
      });
      
      elements.controls.appendChild(dot);
    });
  }

  // Passer à une scène spécifique
  function goToScene(index) {
    if (isTransitioning || index === currentSceneIndex) return;
    
    // Si on est à la dernière scène et qu'on va à la première, c'est un cycle complet,
    // donc on montre le message final d'abord
    if (currentSceneIndex === sceneData.length - 1 && index === 0 && !hasShownFinalMessage) {
      isTransitioning = true;
      
      // Masquer la scène actuelle
      fadeOutCurrentScene(() => {
        // Afficher le message final
        showFinalMessage(() => {
          // Après le message final, passer à la première scène
          currentSceneIndex = index;
          updateScene();
          fadeInCurrentScene();
          isTransitioning = false;
          
          // Marquer le message comme affiché
          hasShownFinalMessage = true;
        });
      });
      return;
    }
    
    isTransitioning = true;
    
    // Masquer la scène actuelle
    fadeOutCurrentScene(() => {
      // Changer l'index de scène
      currentSceneIndex = index;
      
      // Mettre à jour la scène
      updateScene();
      
      // Afficher la nouvelle scène
      fadeInCurrentScene();
      
      // Terminer la transition
      setTimeout(() => {
        isTransitioning = false;
      }, 2000);
      
      // Jouer le son de transition
      playTransitionSound();
    });
  }

  // Masquer la scène actuelle
  function fadeOutCurrentScene(callback) {
    // Plus de sons d'ambiance à arrêter, mais on garde la fonction par compatibilité
    stopAllSounds();
    
    // Masquer les lignes du poème
    const poemLines = document.querySelectorAll('.poem-line');
    poemLines.forEach(line => {
      line.classList.remove('visible');
    });
    
    // Masquer le titre de la scène
    if (elements.sceneTitle) {
      elements.sceneTitle.style.opacity = '0';
    }
    
    // Attendre que les animations se terminent
    setTimeout(callback, 1000);
  }

  // Afficher la nouvelle scène
  function fadeInCurrentScene() {
    // Mettre à jour le titre de la scène
    if (elements.sceneTitle) {
      elements.sceneTitle.textContent = sceneData[currentSceneIndex].title;
      elements.sceneTitle.style.opacity = '1';
    }
    
    // Afficher les lignes du poème correspondantes
    const poemLines = document.querySelectorAll('.poem-line');
    const startIndex = currentSceneIndex * 2;
    
    setTimeout(() => {
      if (poemLines[startIndex]) {
        poemLines[startIndex].classList.add('visible');
      }
      
      setTimeout(() => {
        if (poemLines[startIndex + 1]) {
          poemLines[startIndex + 1].classList.add('visible');
        }
      }, 1000);
    }, 500);
    
    // On ne joue plus de sons d'ambiance pour chaque scène
    // La fonction est gardée mais ne fait plus rien
    playAmbientSound();
  }

  // Mettre à jour tous les éléments de la scène
  function updateScene() {
    // Mettre à jour les contrôles de navigation
    const dots = document.querySelectorAll('.control-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSceneIndex);
    });
    
    // Dessiner le nouvel arrière-plan
    drawBackground();
    
    // Générer de nouvelles formes
    generateShapes();
    
    // Créer de nouvelles particules
    createParticles();
    
    // Réinitialiser la barre de progression
    if (elements.progressBar) {
      elements.progressBar.style.width = '0%';
    }
    
    // Effacer le timer d'avancement automatique
    if (autoAdvanceTimer) {
      clearInterval(autoAdvanceTimer);
    }
    
    // Configurer le nouvel avancement automatique
    autoAdvanceTimer = setInterval(() => {
      if (!isTransitioning && elements.progressBar) {
        const currentWidth = parseFloat(elements.progressBar.style.width || '0');
        if (currentWidth < 100) {
          elements.progressBar.style.width = (currentWidth + 0.1) + '%';
        } else {
          // Si on est à la dernière scène et qu'on doit passer à la première,
          // vérifions si on a déjà montré le message final
          if (currentSceneIndex === sceneData.length - 1 && !hasShownFinalMessage) {
            // Montrer le message final avant de recommencer
            goToScene(0); // Ça va déclencher le message final grâce à notre condition
          } else {
            // Passer à la scène suivante normalement
            goToScene((currentSceneIndex + 1) % sceneData.length);
          }
        }
      }
    }, 50); // ~20 secondes par scène
  }
  
  // Afficher le message final
  function showFinalMessage(callback) {
    // Créer l'élément de message final s'il n'existe pas déjà
    let finalMessage = document.getElementById('final-message');
    if (!finalMessage) {
      finalMessage = document.createElement('div');
      finalMessage.id = 'final-message';
      finalMessage.className = 'final-message';
      document.body.appendChild(finalMessage);
    }
    
    // Configurer le contenu et le style
    finalMessage.innerHTML = `
      <div class="final-message-content">
        <h2>Pour mon ami Olivier</h2>
        <p>Une expérience poétique et interactive</p>
        <div class="final-credit">Developed by MouseQuetaire</div>
        <button id="continue-button">Continuer</button>
      </div>
    `;
    
    // Ajouter un écouteur au bouton de continuation
    const continueButton = document.getElementById('continue-button');
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        // Jouer un son
        playInteractionSound('strong-click');
        
        // Masquer le message
        finalMessage.style.opacity = '0';
        
        // Attendre la fin de l'animation avant de continuer
        setTimeout(() => {
          finalMessage.style.display = 'none';
          if (callback) callback();
        }, 1000);
      });
    }
    
    // Afficher le message avec une animation
    finalMessage.style.display = 'flex';
    setTimeout(() => {
      finalMessage.style.opacity = '1';
    }, 100);
    
    // Jouer un son de célébration
    if (typeof playInteractionSound === 'function') {
      setTimeout(() => {
        playInteractionSound('success');
      }, 500);
    }
  }

  // Gestionnaire d'événement pour le clic dans le document
  function handleDocumentClick(e) {
    // Ignorer les clics sur les contrôles
    if (e.target.closest('.control-dot') || 
        e.target.closest('#start-button') ||
        e.target.closest('#audio-controls') ||
        e.target.closest('#continue-button')) {
      return;
    }
    
    // Créer un effet ripple
    createRippleEffect(e.clientX, e.clientY);
    
    // Jouer un son de clic standard
    playInteractionSound('click');
    
    // Masquer l'indice après le premier clic
    if (elements.clickHint && elements.clickHint.style.opacity !== '0') {
      elements.clickHint.style.opacity = '0';
    }
    
    // Tenter de jouer l'audio lors du clic
    if (elements.backgroundMusic && elements.backgroundMusic.paused) {
      elements.backgroundMusic.play().catch(() => {
        // Erreur normale, géré silencieusement
      });
    }
  }

  // Gestionnaire d'événement pour le mouvement de la souris
  function handleMouseMove(e) {
    // Mettre à jour la position de la souris
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastInteraction = performance.now();
    
    // Déplacer le cercle magique
    if (elements.magicCircle) {
      elements.magicCircle.style.left = mouseX + 'px';
      elements.magicCircle.style.top = mouseY + 'px';
      elements.magicCircle.style.opacity = '1';
      
      setTimeout(() => {
        elements.magicCircle.style.opacity = '0';
      }, 2000);
    }
  }

  // Gestionnaire d'événement pour le mouvement tactile
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      lastInteraction = performance.now();
      
      // Déplacer le cercle magique
      if (elements.magicCircle) {
        elements.magicCircle.style.left = mouseX + 'px';
        elements.magicCircle.style.top = mouseY + 'px';
        elements.magicCircle.style.opacity = '1';
        
        setTimeout(() => {
          elements.magicCircle.style.opacity = '0';
        }, 2000);
      }
    }
  }
});