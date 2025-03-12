/**
 * Système audio pour l'animation cubiste de "Demain, dès l'aube..."
 * Version avec musique de fond et sons de clic uniquement
 */

// Variables globales audio
let audioContext = null;
let masterGain = null;
let backgroundMusic = null;
let isMuted = false;
let audioInitialized = false;

// Initialiser le système audio
function initAudio() {
  try {
    // Récupérer l'élément audio de fond
    backgroundMusic = document.getElementById('background-music');
    
    if (!backgroundMusic) {
      console.error("Élément audio 'background-music' introuvable");
      return false;
    }
    
    console.log("Élément audio trouvé:", backgroundMusic);
    console.log("Source audio:", backgroundMusic.src);
    
    // Initialiser le volume
    backgroundMusic.volume = 0.5; // Volume initial à 50%
    
    // Créer le contexte audio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Créer un nœud de gain principal
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.7; // Volume initial
    masterGain.connect(audioContext.destination);
    
    // Ajouter des écouteurs d'événements pour l'audio
    backgroundMusic.addEventListener('play', () => {
      console.log("L'audio a commencé à jouer");
    });
    
    backgroundMusic.addEventListener('error', (e) => {
      console.error("Erreur de lecture audio:", e);
    });
    
    audioInitialized = true;
    return true;
  } catch (e) {
    console.error("Initialisation audio échouée:", e);
    return false;
  }
}

// Démarrer la musique de fond
function startBackgroundMusic() {
  if (!backgroundMusic) {
    console.error("backgroundMusic n'est pas initialisé");
    return;
  }
  
  console.log("Tentative de lecture de la musique de fond...");
  
  // Charger la source si non chargée
  if (!backgroundMusic.src || backgroundMusic.src === '') {
    backgroundMusic.src = 'audio/vice_versa.mp3';
    console.log("Source audio définie:", backgroundMusic.src);
  }
  
  // Essayer de jouer l'audio
  const playPromise = backgroundMusic.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Lecture audio démarrée avec succès");
      })
      .catch(error => {
        console.warn("Lecture automatique empêchée, nécessite une interaction utilisateur:", error);
        
        // Créer un bouton de lecture audio visible si l'autoplay échoue
        createAudioStartButton();
      });
  }
}

// Créer un bouton de lecture audio temporaire
function createAudioStartButton() {
  // Vérifier si le bouton existe déjà
  if (document.getElementById('audio-start-button')) return;
  
  const button = document.createElement('button');
  button.id = 'audio-start-button';
  button.textContent = '▶️ Activer la musique';
  button.style.position = 'fixed';
  button.style.bottom = '80px';
  button.style.left = '50%';
  button.style.transform = 'translateX(-50%)';
  button.style.padding = '10px 20px';
  button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  button.style.color = 'white';
  button.style.border = '1px solid white';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '1000';
  
  button.onclick = function() {
    if (backgroundMusic) {
      backgroundMusic.play()
        .then(() => {
          console.log("Lecture audio démarrée par l'utilisateur");
          this.remove(); // Supprimer le bouton après le clic
        })
        .catch(err => {
          console.error("Échec de la lecture même après l'interaction:", err);
        });
    }
  };
  
  document.body.appendChild(button);
}

// Collection de sons de clic
const clickSounds = {
  // Sons légers
  light: [
    { freq: 600, duration: 0.1, type: 'sine', volume: 0.15 },
    { freq: 700, duration: 0.08, type: 'sine', volume: 0.12 },
    { freq: 550, duration: 0.12, type: 'sine', volume: 0.18 }
  ],
  // Sons médiums
  medium: [
    { freq: 400, duration: 0.15, type: 'triangle', volume: 0.25 },
    { freq: 450, duration: 0.12, type: 'sine', volume: 0.2 },
    { freq: 350, duration: 0.18, type: 'triangle', volume: 0.22 }
  ],
  // Sons forts
  strong: [
    { freq: 300, duration: 0.2, type: 'square', volume: 0.2 },
    { freq: 250, duration: 0.25, type: 'triangle', volume: 0.25 },
    { freq: 280, duration: 0.22, type: 'square', volume: 0.18 }
  ]
};

// Jouer un son simple
function playTone(freq, duration, type = 'sine', volume = 0.3) {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.value = freq;
  
  gainNode.gain.value = 0;
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.05);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(masterGain);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

// Fonction vide pour compatibilité avec le code existant
function playAmbientSound() {
  // Cette fonction ne fait plus rien car les sons d'ambiance ont été supprimés
  // Maintenue pour la compatibilité avec le reste du code
  return [];
}

// Mettre à jour le volume
function updateVolume() {
  if (masterGain) {
    if (isMuted) {
      masterGain.gain.value = 0;
      if (document.getElementById('mute-button')) {
        document.getElementById('mute-button').textContent = '🔇';
      }
    } else {
      const volume = document.getElementById('volume-slider') ? 
                     document.getElementById('volume-slider').value / 100 : 0.7;
      masterGain.gain.value = volume;
      if (document.getElementById('mute-button')) {
        document.getElementById('mute-button').textContent = '🔊';
      }
    }
  }
  
  // Gérer aussi le volume de la musique de fond
  if (backgroundMusic) {
    if (isMuted) {
      backgroundMusic.volume = 0;
    } else {
      const volume = document.getElementById('volume-slider') ? 
                     document.getElementById('volume-slider').value / 100 : 0.5;
      backgroundMusic.volume = volume;
    }
  }
}

// Jouer un son de clic amélioré
function playClickSound(intensity = 'medium') {
  if (!audioContext || isMuted) return;
  
  // Sélectionner une collection de sons selon l'intensité
  const soundCollection = clickSounds[intensity] || clickSounds.medium;
  
  // Choisir un son aléatoire dans la collection
  const sound = soundCollection[Math.floor(Math.random() * soundCollection.length)];
  
  // Jouer le son
  playTone(sound.freq, sound.duration, sound.type, sound.volume);
}

// Jouer un son de transition
function playTransitionSound() {
  if (!audioContext || isMuted) return;
  
  // Un accord plus complexe avec une montée
  const freqs = [220, 277.18, 329.63]; // La3, Do#4, Mi4
  
  freqs.forEach((freq, i) => {
    const transOsc = audioContext.createOscillator();
    const transGain = audioContext.createGain();
    
    transOsc.type = 'sine';
    transOsc.frequency.value = freq;
    
    transGain.gain.value = 0;
    transGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1 + i * 0.1);
    transGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    
    transOsc.connect(transGain);
    transGain.connect(masterGain);
    
    transOsc.start();
    transOsc.stop(audioContext.currentTime + 1);
  });
}

// Basculer l'état de sourdine
function toggleMute() {
  isMuted = !isMuted;
  updateVolume();
}

// Fonction vide pour compatibilité
function stopAllSounds() {
  // Ne fait plus rien car il n'y a plus de sons d'ambiance à arrêter
}

// Gérer les événements audio avec les contrôles d'interface
function setupAudioControls() {
  const volumeSlider = document.getElementById('volume-slider');
  const muteButton = document.getElementById('mute-button');
  
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
      updateVolume();
    });
  }
  
  if (muteButton) {
    muteButton.addEventListener('click', function() {
      toggleMute();
    });
  }
}

// Jouer une séquence de notes de bienvenue
function playWelcomeTones() {
  if (!audioContext || isMuted) return;
  
  playTone(220, 0.5, 'sine', 0.3);
  setTimeout(() => {
    playTone(330, 0.5, 'sine', 0.3);
  }, 500);
  setTimeout(() => {
    playTone(440, 0.8, 'sine', 0.3);
  }, 1000);
}

// Jouer un effet sonore pour une interaction spécifique
function playInteractionSound(type) {
  if (!audioContext || isMuted) return;
  
  switch(type) {
    case 'hover':
      // Son subtil pour le survol
      playClickSound('light');
      break;
      
    case 'click':
      // Son de clic standard
      playClickSound('medium');
      break;
      
    case 'strong-click':
      // Son de clic plus fort
      playClickSound('strong');
      break;
  }
}