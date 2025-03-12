
let audioContext, analyser, source;
let audioData = new Uint8Array(1024);
let energyHistory = [];
let isPlaying = false;
let currentAudio = null;
let isChorus = false;
let lastFrameTime = 0;
let beatCount = 0;
let bigBeatCount = 0;
let audioLoaded = false;
let audioAttempted = false;

// Palettes de couleurs joyeuses
const colorPalettes = {
  // Pour les moments normaux - couleurs vives et variées
  normal: [
    { hue: 45, sat: 100, light: 60 },   // Jaune vif
    { hue: 120, sat: 80, light: 60 },   // Vert émeraude
    { hue: 200, sat: 90, light: 65 },   // Bleu ciel
    { hue: 280, sat: 90, light: 70 },   // Violet clair
    { hue: 330, sat: 90, light: 65 },   // Rose
    { hue: 170, sat: 100, light: 65 },  // Turquoise
    { hue: 30, sat: 100, light: 60 }    // Orange
  ],
  // Pour le refrain - couleurs encore plus éclatantes
  chorus: [
    { hue: 0, sat: 100, light: 65 },    // Rouge vif
    { hue: 30, sat: 100, light: 65 },   // Orange
    { hue: 60, sat: 100, light: 65 },   // Jaune doré
    { hue: 300, sat: 100, light: 70 },  // Magenta
    { hue: 195, sat: 100, light: 70 },  // Cyan
    { hue: 270, sat: 100, light: 70 },  // Violet électrique
    { hue: 160, sat: 100, light: 70 }   // Vert fluo
  ]
};

const beatDetector = {
  threshold: 0.13,        // Plus sensible
  decay: 0.96,           // Légèrement plus rapide
  lastBeatTime: 0,
  beatHoldTime: 80,      // Réduction pour plus de réactivité
  energy: 0,
  previousEnergy: 0
};

const chorusDetector = {
  windowSize: 80,        // Plus petit pour réagir plus vite
  energyThreshold: 0.55, // Plus sensible
  sustainedTime: 25,     // Plus réactif
  sustainedCount: 0,
  isInChorus: false
};

// Points importants pour I'm Still Standing
const specialMoments = [
  // Refrains
  { time: 47, type: 'chorus-start', duration: 25 },
  { time: 91, type: 'chorus-start', duration: 25 },
  { time: 135, type: 'chorus-start', duration: 35 },
];

// Créer les visualiseurs latéraux
function createSideVisualizers() {
  const leftVisualizer = document.getElementById('leftVisualizer');
  const rightVisualizer = document.getElementById('rightVisualizer');
  
  // Vider d'abord au cas où
  leftVisualizer.innerHTML = '';
  rightVisualizer.innerHTML = '';
  
  // Nombre de segments
  const numSegments = 40;
  
  for (let i = 0; i < numSegments; i++) {
    const segmentLeft = document.createElement('div');
    segmentLeft.className = 'visualizer-segment';
    leftVisualizer.appendChild(segmentLeft);
    
    const segmentRight = document.createElement('div');
    segmentRight.className = 'visualizer-segment';
    rightVisualizer.appendChild(segmentRight);
  }
}

// Mettre à jour les visualiseurs latéraux
function updateSideVisualizers(audioData) {
  const leftVisualizer = document.getElementById('leftVisualizer');
  const rightVisualizer = document.getElementById('rightVisualizer');
  
  const leftSegments = leftVisualizer.querySelectorAll('.visualizer-segment');
  const rightSegments = rightVisualizer.querySelectorAll('.visualizer-segment');
  
  const segmentCount = leftSegments.length;
  
  if (segmentCount === 0) return; // Protection
  
  // Utilise les basses pour la gauche et les aigus pour la droite
  for (let i = 0; i < segmentCount; i++) {
    // Basses pour la gauche (premières fréquences)
    const bassIndex = Math.floor(i * 10 / segmentCount);
    const bassValue = audioData[bassIndex] / 255;
    const bassWidth = Math.max(30, 200 * bassValue); // Au moins 30px et jusqu'à 200px
    leftSegments[i].style.width = `${bassWidth}%`;
    
    // Effet de couleur basé sur l'intensité
    const bassHue = 45 + bassValue * 20;
    leftSegments[i].style.backgroundColor = `hsl(${bassHue}, 100%, ${60 + bassValue * 20}%)`;
    
    // Aigus pour la droite (fréquences plus élevées)
    const trebleIndex = Math.floor(200 + i * 300 / segmentCount);
    const trebleValue = audioData[trebleIndex] / 255;
    const trebleWidth = Math.max(30, 200 * trebleValue);
    rightSegments[i].style.width = `${trebleWidth}%`;
    
    // Effet de couleur pour les aigus
    const trebleHue = 200 + trebleValue * 60;
    rightSegments[i].style.backgroundColor = `hsl(${trebleHue}, 90%, ${65 + trebleValue * 20}%)`;
  }
}

// Créer une explosion de particules
function createExplosion(x, y, intensity) {
  const container = document.getElementById('explosionContainer');
  const numParticles = Math.floor(30 + intensity * 100); // Plus de particules!
  
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'explosion-particle';
    
    // Taille et opacité basées sur l'intensité
    const size = 2 + Math.random() * 8 * intensity;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position initiale
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Couleur aléatoire vive
    const hue = Math.random() * 360;
    particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
    particle.style.boxShadow = `0 0 ${size}px hsl(${hue}, 100%, 60%)`;
    
    container.appendChild(particle);
    
    // Animation de l'explosion
    const angle = Math.random() * Math.PI * 2;
    const speed = 20 + Math.random() * 50 * intensity;
    const distance = 50 + Math.random() * 200 * intensity;
    const duration = 0.5 + Math.random() * 1.5;
    
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance;
    
    // Animation simple sans GSAP pour éviter les dépendances
    setTimeout(() => {
      particle.style.transition = `all ${duration * 0.3}s ease-out`;
      particle.style.left = `${targetX}px`;
      particle.style.top = `${targetY}px`;
      particle.style.opacity = '0.8';
      particle.style.transform = 'translate(-50%, -50%) scale(1)';
      
      setTimeout(() => {
        particle.style.transition = `all ${duration * 0.7}s ease-in`;
        particle.style.opacity = '0';
        particle.style.transform = 'translate(-50%, -50%) scale(0)';
        
        setTimeout(() => {
          if (container.contains(particle)) {
            container.removeChild(particle);
          }
        }, duration * 700);
      }, duration * 300);
    }, 10);
  }
}

// Créer un effet d'onde
function createWaveEffect(intensity) {
  const wave = document.getElementById('waveEffect');
  // Couleur basée sur l'intensité
  const hue = Math.random() * 60 + 20; // Autour du jaune/orange
  wave.style.border = `2px solid hsla(${hue}, 100%, 60%, ${0.7 * intensity})`;
  wave.style.backgroundColor = `hsla(${hue}, 100%, 60%, ${0.2 * intensity})`;
  
  // Animation de l'onde
  wave.style.transition = 'all 1.5s ease-out';
  wave.style.opacity = 0.7 * intensity;
  wave.style.transform = 'translate(-50%, -50%) scale(0)';
  
  setTimeout(() => {
    wave.style.opacity = '0';
    wave.style.transform = 'translate(-50%, -50%) scale(10)';
  }, 10);
}

// Effet de beat amélioré
function beatEffect(intensity) {
  const flash = document.getElementById('lightFlash');
  flash.style.opacity = 0.3 * intensity;
  
  setTimeout(() => {
    flash.style.opacity = 0;
  }, 150);
  
  // Affichage du compteur de beat
  const beatCounter = document.getElementById('beatCounter');
  beatCounter.innerText = `BEAT ${beatCount}`;
  beatCounter.classList.add('active');
  
  setTimeout(() => {
    beatCounter.classList.remove('active');
  }, 300);
  
  // Pour les beats forts, créer un effet d'onde
  if (intensity > 0.5) {
    createWaveEffect(intensity);
    
    // Et une explosion de particules au centre
    createExplosion(window.innerWidth / 2, window.innerHeight / 2, intensity);
  }
  
  // Pour les beats très forts, créer plusieurs explosions
  if (intensity > 0.8) {
    bigBeatCount++;
    
    // Explosions supplémentaires à des positions aléatoires
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      setTimeout(() => {
        createExplosion(x, y, intensity * 0.7);
      }, i * 100);
    }
  }
}

// Configuration audio simplifiée
async function setupAudio() {
  showLoader();
  
  // Protection contre les tentatives multiples
  if (audioAttempted) {
    hideLoader();
    return;
  }
  
  audioAttempted = true;
  
  try {
    // Créer le contexte audio s'il n'existe pas
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Arrêter l'audio existant si nécessaire
    if (currentAudio) {
      currentAudio.pause();
      if (source) source.disconnect();
    }

    // Créer un élément audio
    currentAudio = new Audio();
    currentAudio.src = 'audio/Im_Still_Standing.mp3';
    currentAudio.loop = false;
    
    // Gérer les erreurs de chargement
    currentAudio.onerror = (e) => {
      console.error("Erreur de chargement audio:", e);
      showError("Impossible de charger le fichier 'EltonJohn-ImStillStanding.mp3'. Vérifiez que le fichier existe.");
      hideLoader();
    };
    
    // Créer l'analyseur
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    
    // S'assurer que le contexte audio est actif (nécessaire pour Chrome)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Timeout de sécurité pour éviter une attente infinie
    const timeoutId = setTimeout(() => {
      if (!audioLoaded) {
        hideLoader();
        
        // Vérifier si on peut jouer sans audio
        tryPlayWithoutAudio();
      }
    }, 5000);
    
    // Attendre que l'audio soit chargé
    currentAudio.addEventListener('canplaythrough', () => {
      clearTimeout(timeoutId);
      
      if (audioLoaded) return; // Éviter les appels multiples
      audioLoaded = true;
      
      try {
        source = audioContext.createMediaElementSource(currentAudio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Jouer l'audio
        isPlaying = true;
        currentAudio.play().then(() => {
          console.log("Audio démarré avec succès");
          document.getElementById('playBtn').textContent = "Pause";
          hideLoader();
        }).catch(error => {
          console.error("Erreur lors de la lecture:", error);
          showError("Erreur lors de la lecture audio. Interagissez avec la page et réessayez.");
          hideLoader();
          tryPlayWithoutAudio();
        });
      } catch (error) {
        console.error("Erreur lors de la configuration audio:", error);
        showError("Erreur lors de la configuration audio. Essayez de rafraîchir la page.");
        hideLoader();
        tryPlayWithoutAudio();
      }
    });
    
    // Démarrer le chargement
    currentAudio.load();
    
  } catch (error) {
    console.error("Erreur d'initialisation audio:", error);
    showError("Erreur d'initialisation audio. Votre navigateur pourrait ne pas prendre en charge les fonctionnalités audio nécessaires.");
    hideLoader();
    tryPlayWithoutAudio();
  }
}

// Essayer de démarrer l'animation sans audio
function tryPlayWithoutAudio() {
  console.log("Démarrage de l'animation sans audio");
  isPlaying = false;
  audioLoaded = false;
  hideLoader();
  
  // Démarrer l'animation avec des données audio vides
  if (!animationStarted) {
    animationStarted = true;
    requestAnimationFrame(animate);
  }
}

function showLoader() {
  document.getElementById('loader').style.display = 'flex';
  document.getElementById('loader').style.opacity = '1';
}

function hideLoader() {
  document.getElementById('loader').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
  }, 500);
}

function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 7000);
}

function detectBeat(time) {
  // Si pas d'audio ou pas de lecture, simuler
  if (!audioData || !isPlaying) {
    return { 
      isBeat: Math.random() < 0.01, 
      energy: 0.1 + Math.sin(time * 0.001) * 0.05,
      delta: 0
    };
  }
  
  // Analyse des basses fréquences
  const bassRange = audioData.slice(1, 15); // Premier 15 bins (basses fréquences)
  const bassSum = bassRange.reduce((a, b) => a + b, 0);
  const instantEnergy = bassSum / (15 * 255); // Normalisation

  // Algorithme de détection de beat amélioré
  beatDetector.energy = Math.max(instantEnergy, beatDetector.energy * beatDetector.decay);
  const delta = beatDetector.energy - beatDetector.previousEnergy;
  
  let isBeat = false;
  if (delta > beatDetector.threshold && time - beatDetector.lastBeatTime > beatDetector.beatHoldTime) {
    isBeat = true;
    beatCount++;
    beatDetector.lastBeatTime = time;
    
    // Effet de beat amélioré
    beatEffect(instantEnergy * 1.5); // Amplification pour plus d'impact
  }
  
  beatDetector.previousEnergy = beatDetector.energy;
  return { isBeat, energy: instantEnergy, delta };
}

function detectChorus() {
  // Si pas d'audio, retourner false
  if (!audioData || !isPlaying) {
    return false;
  }
  
  // Analyse des fréquences
  const midHighRange = audioData.slice(40, 200);
  const midHighEnergy = midHighRange.reduce((sum, value) => sum + value, 0) / (160 * 255);
  
  // Calcul d'énergie total avec pondération
  const totalEnergy = 
    (audioData.slice(0, 20).reduce((sum, value) => sum + value, 0) / (20 * 255)) * 0.3 + // Basses
    midHighEnergy * 0.7; // Medium-haut
  
  energyHistory.push(totalEnergy);
  if (energyHistory.length > chorusDetector.windowSize) {
    energyHistory.shift();
  }

  // Moyenne mobile pondérée (donne plus d'importance aux valeurs récentes)
  let weightedSum = 0;
  let weightSum = 0;
  for (let i = 0; i < energyHistory.length; i++) {
    const weight = 1 + i / 10; // Plus de poids aux valeurs récentes
    weightedSum += energyHistory[i] * weight;
    weightSum += weight;
  }
  const averageEnergy = weightedSum / weightSum;

  // Détection du refrain basée sur l'énergie soutenue
  const wasInChorus = chorusDetector.isInChorus;
  
  if (averageEnergy > chorusDetector.energyThreshold) {
    chorusDetector.sustainedCount++;
    if (chorusDetector.sustainedCount >= chorusDetector.sustainedTime) {
      chorusDetector.isInChorus = true;
    }
  } else {
    chorusDetector.sustainedCount = Math.max(0, chorusDetector.sustainedCount - 2);
    if (chorusDetector.sustainedCount === 0) {
      chorusDetector.isInChorus = false;
    }
  }
  
  // Mettre à jour l'indicateur visuel de refrain
  if (chorusDetector.isInChorus !== wasInChorus) {
    document.getElementById('chorusIndicator').classList.toggle('active', chorusDetector.isInChorus);
    
    // Si on entre dans un refrain, effet spécial
    if (chorusDetector.isInChorus && !wasInChorus) {
      // Explosion massive
      createExplosion(window.innerWidth / 2, window.innerHeight / 2, 2);
      
      // Plusieurs explosions autour
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 200;
        const x = window.innerWidth / 2 + Math.cos(angle) * distance;
        const y = window.innerHeight / 2 + Math.sin(angle) * distance;
        
        setTimeout(() => {
          createExplosion(x, y, 1.5);
        }, i * 100);
      }
    }
  }

  return chorusDetector.isInChorus;
}

class Particle {
  constructor(x, y) {
    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.baseSize = Math.random() * 3 + 1.5;
    this.size = this.baseSize;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 3 + 1;
    this.oscillationRadius = Math.random() * 150 + 80;
    this.oscillationSpeed = Math.random() * 0.04 + 0.02;
    this.pulsePhase = Math.random() * Math.PI * 2;
    
    // Choisir une couleur aléatoire dans la palette normale
    this.colorIndex = Math.floor(Math.random() * colorPalettes.normal.length);
    this.baseColor = colorPalettes.normal[this.colorIndex];
    
    // Légère variation aléatoire de teinte pour plus de diversité
    this.hueVariation = Math.random() * 20 - 10;
    
    // Ajouter trace et traînée pour plus d'effet visuel
    this.trail = [];
    this.trailLength = Math.floor(Math.random() * 8) + 4;
    
    // Paramètres additionnels pour les mouvements plus complexes
    this.radialPhase = Math.random() * Math.PI * 2;
    this.verticalOscillation = Math.random() * 0.03 + 0.01;
    this.verticalPhase = Math.random() * Math.PI * 2;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
  }

  update(beatInfo, deltaTime, time, isChorus) {
    // Animation plus dynamique sur les beats
    if (beatInfo.isBeat) {
      this.size = this.baseSize * (3 + beatInfo.energy * 8);
      this.speed *= 1.8;
      
      // Changement de direction aléatoire sur les beats forts
      if (beatInfo.energy > 0.7 && Math.random() > 0.7) {
        this.rotationDirection *= -1;
      }
    }

    // Retour progressif à la taille et vitesse normales
    this.size = this.size * 0.9 + this.baseSize * 0.1;
    this.speed = this.speed * 0.9 + (isChorus ? 3 : 2) * 0.1;

    // Facteur d'énergie pour amplifier les mouvements avec le son
    const energyFactor = 1 + beatInfo.energy * 5;
    this.oscillationRadius = this.oscillationRadius * 0.98 + (80 + beatInfo.energy * 150) * 0.02;
    
    // Calcul des nouvelles coordonnées avec mouvements plus complexes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Rayon avec pulsation basé sur l'audio
    const radius = this.oscillationRadius * energyFactor;
    
    // Angle de base
    this.angle += this.oscillationSpeed * energyFactor * this.rotationDirection;
    
    // Mouvement orbital avec distorsion 
    const orbitX = Math.cos(this.angle) * radius;
    const orbitY = Math.sin(this.angle) * radius;
    
    // Mouvement sinusoïdal superposé
    const waveX = Math.cos(time * this.verticalOscillation + this.verticalPhase) * 50 * (isChorus ? 2 : 1);
    const waveY = Math.sin(time * this.verticalOscillation + this.verticalPhase) * 50 * (isChorus ? 2 : 1);
    
    // Position finale
    const newX = centerX + orbitX + waveX;
    const newY = centerY + orbitY + waveY;
    
    // Ajouter la position actuelle à la traînée 
    this.trail.unshift({x: this.x, y: this.y, size: this.size});
    if (this.trail.length > this.trailLength) {
      this.trail.pop();
    }
    
    // Mise à jour des coordonnées actuelles
    this.x = newX;
    this.y = newY;

    // Réinitialiser si la particule sort trop loin de l'écran
    const buffer = 200;
    if (this.x < -buffer || this.x > canvas.width + buffer || 
        this.y < -buffer || this.y > canvas.height + buffer) {
      this.reset(centerX, centerY);
    }
  }

  draw(ctx, beatInfo, isChorus) {
    const energy = beatInfo.energy;
    
    // Dessiner d'abord la traînée (faible opacité)
    this.trail.forEach((point, index) => {
      const alpha = 0.05 + (index / this.trail.length) * 0.15;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size * 0.8, 0, Math.PI * 2);
      
      // Choisir la palette de couleurs selon si on est dans un refrain ou non
      const palette = isChorus ? colorPalettes.chorus : colorPalettes.normal;
      const color = palette[this.colorIndex];
      
      ctx.fillStyle = `hsla(${color.hue + this.hueVariation}, ${color.sat}%, ${color.light}%, ${alpha})`;
      ctx.fill();
    });
    
    // Dessiner la particule principale
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    // Augmenter l'opacité et la luminosité avec l'énergie
    const alpha = 0.5 + energy * 0.5;
    const brightness = 60 + energy * 40;
    
    // Choisir la palette de couleurs pour la particule principale
    const palette = isChorus ? colorPalettes.chorus : colorPalettes.normal;
    const color = palette[this.colorIndex];
    
    ctx.fillStyle = `hsla(${color.hue + this.hueVariation}, ${color.sat}%, ${brightness}%, ${alpha})`;
    ctx.fill();

    // Ajouter un halo plus grand sur les beats
    if (beatInfo.isBeat) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${color.hue + this.hueVariation}, ${color.sat}%, ${brightness}%, ${alpha * 0.4})`;
      ctx.fill();
      
      // Ajouter un second halo encore plus grand pour un effet de pulse
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${color.hue + this.hueVariation}, ${color.sat}%, ${brightness}%, ${alpha * 0.2})`;
      ctx.fill();
    }
  }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const numParticles = 1500; // Réduit pour de meilleures performances
let animationStarted = false;

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  resetParticles();
  createSideVisualizers();
}

function resetParticles() {
  particles = [];
  for(let i = 0; i < numParticles; i++) {
    particles.push(new Particle(canvas.width / 2, canvas.height / 2));
  }
}

function animate(time) {
  animationStarted = true;
  
  // Calcul du temps écoulé entre chaque frame pour des animations cohérentes
  const now = performance.now();
  const deltaTime = Math.min(0.05, (now - (lastFrameTime || now)) / 1000);
  lastFrameTime = now;
  
  if (analyser && isPlaying) {
    try {
      analyser.getByteFrequencyData(audioData);
      const beatInfo = detectBeat(time);
      const isChorus = detectChorus();

      // Mettre à jour les visualiseurs latéraux
      updateSideVisualizers(audioData);

      // Fond plus dynamique qui réagit aux beats
      const fadeAlpha = beatInfo.isBeat ? 0.3 : 0.02;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ajouter un léger effet de glow au centre pendant les beats forts
      if (beatInfo.isBeat && beatInfo.energy > 0.5) {
        const gradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 10,
          canvas.width/2, canvas.height/2, 500
        );
        
        // Choisir une couleur de glow selon si on est dans un refrain
        const glowColor = isChorus ? 
          `hsla(${(time * 0.05) % 360}, 100%, 60%, 0.2)` :
          'hsla(45, 100%, 60%, 0.2)';
          
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Effet spécial refrain
      if (isChorus) {
        // Lignes diagonales mouvantes
        const numLines = 10;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < numLines; i++) {
          const offset = (time * 0.1 + i * 50) % (canvas.width + canvas.height);
          ctx.beginPath();
          ctx.moveTo(0, offset);
          ctx.lineTo(offset, 0);
          ctx.strokeStyle = `hsla(${(time * 0.05 + i * 36) % 360}, 100%, 60%, 0.1)`;
          ctx.stroke();
        }
      }

      // Mise à jour et rendu des particules
      particles.forEach(particle => {
        particle.update(beatInfo, deltaTime, time * 0.001, isChorus);
        particle.draw(ctx, beatInfo, isChorus);
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse audio:", error);
      isPlaying = false;
    }
  } else {
    // Animation par défaut quand il n'y a pas d'audio ou en pause
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dégradé de fond par défaut
    const gradient = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 0,
      canvas.width/2, canvas.height/2, canvas.width/2
    );
    gradient.addColorStop(0, 'rgba(50, 0, 80, 0.01)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animation des particules avec des valeurs par défaut
    const t = time * 0.001;
    const defaultBeatInfo = { 
      isBeat: Math.random() < 0.01, 
      energy: 0.1 + Math.sin(t * 0.5) * 0.05 
    };
    
    particles.forEach(particle => {
      particle.update(defaultBeatInfo, deltaTime, t, false);
      particle.draw(ctx, defaultBeatInfo, false);
    });
  }

  requestAnimationFrame(animate);
}

function playPause() {
  if (!currentAudio || !audioLoaded) {
    setupAudio();
    return;
  }
  
  if (isPlaying) {
    currentAudio.pause();
    document.getElementById('playBtn').textContent = "Reprendre";
    isPlaying = false;
  } else {
    currentAudio.play();
    document.getElementById('playBtn').textContent = "Pause";
    isPlaying = true;
  }
}

// Event listeners
document.getElementById('playBtn').addEventListener('click', playPause);
document.getElementById('resetBtn').addEventListener('click', () => {
  // Réinitialiser les particules
  resetParticles();
  
  // Réinitialiser les compteurs
  beatCount = 0;
  bigBeatCount = 0;
  
  // Si l'audio est en cours, le redémarrer depuis le début
  if (currentAudio && audioLoaded) {
    currentAudio.currentTime = 0;
    if (!isPlaying) {
      playPause();
    }
  }
});

window.addEventListener('resize', init);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  init();
  animate(0);
  
  // Timeout de sécurité pour le chargement initial
  setTimeout(() => {
    hideLoader();
  }, 8000);
});
