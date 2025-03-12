/**
 * ======================================
 * ANIMATION DE TRISTESSE - STYLE VICE VERSA
 * Cette animation s'inspire du film Vice Versa (Inside Out) avec un style
 * 2D mignon et poétique, mettant en valeur l'émotion de tristesse
 * à travers des éléments visuels doux et touchants.
 * ======================================
 */

// Variables globales pour l'animation
let memoryOrbs = [];       // Orbes de souvenirs
let raindrops = [];        // Gouttes de pluie
let cloudPuffs = [];       // Nuages
let teardrops = [];        // Larmes
let sadnessCharacter = {}; // Personnage de Tristesse
let backgroundElements = []; // Éléments décoratifs d'arrière-plan
let blueGradients = [];    // Dégradés bleus pour l'ambiance

// Palette de couleurs inspirée de Vice Versa
const COLORS = {
  sadnessBlue: '#3182bd',      // Bleu principal de Tristesse
  sadnessLightBlue: '#9ecae1', // Bleu clair pour les variantes
  sadnessDarkBlue: '#08519c',  // Bleu foncé pour les contours et ombres
  memoryBlue: '#a6bddb',       // Bleu des souvenirs tristes
  neutralMemory: '#e7e1ef',    // Couleur des souvenirs neutres
  tearBlue: '#bdd7e7',         // Bleu clair des larmes
  cloudSoft: '#f7fbff',        // Blanc doux pour les nuages
  rainBlue: '#6baed6',         // Bleu des gouttes de pluie
  outlineBlue: '#2171b5',      // Bleu pour les contours
  backgroundDark: '#253494',   // Bleu foncé pour le fond
  backgroundLight: '#4292c6'    // Bleu moyen pour le fond
};

/**
 * Fonction utilitaire pour garantir que les valeurs de rayon sont toujours positives
 * Cette fonction est cruciale pour éviter les erreurs "negative radius" dans Canvas
 */
function safeRadius(value) {
  return Math.max(0.1, value);
}

/**
 * Fonction utilitaire pour calculer une valeur de pulse sécurisée
 * Évite les valeurs négatives qui peuvent causer des erreurs avec arc()
 */
function safePulse(baseValue, sinValue, amount) {
  return Math.max(0.1, baseValue + Math.sin(sinValue) * amount);
}

/**
 * Fonction pour réinitialiser l'histoire de tristesse
 */
function resetTristesseStory() {
  try {
    // Vider tous les tableaux d'éléments
    memoryOrbs = [];
    raindrops = [];
    cloudPuffs = [];
    teardrops = [];
    backgroundElements = [];
    blueGradients = [];
    
    // Réinitialiser le personnage
    sadnessCharacter = {};
    
    // Effacer tous les éléments DOM précédents
    const container = document.getElementById('tristesse');
    if (container) {
      // Rechercher et supprimer les éléments spécifiques à l'ancienne animation
      const elements = container.querySelectorAll('.memory-orb, .raindrop, .cloud, .teardrop, .sadness-character');
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    }
  } catch (error) {
    console.error("Erreur dans resetTristesseStory:", error);
  }
}

/**
 * Fonction pour créer une orbe de souvenir dans le style Vice Versa
 */
function createMemoryOrb(canvas, x, y, isBlue = false, size = 60) {
  const orb = {
    x: x,
    y: y,
    size: size,
    originalSize: size,
    color: isBlue ? COLORS.memoryBlue : COLORS.neutralMemory,
    glowColor: isBlue ? COLORS.sadnessBlue : '#fff',
    opacity: 0,
    targetOpacity: 0.9,
    glowSize: size * 1.2,
    pulseFactor: Math.random() * 0.5 + 0.5,
    pulseSpeed: 0.001 + Math.random() * 0.002,
    pulsePhase: Math.random() * Math.PI * 2,
    floatAmplitude: 5 + Math.random() * 10,
    floatSpeed: 0.0015 + Math.random() * 0.0015,
    floatPhase: Math.random() * Math.PI * 2,
    rotateSpeed: (Math.random() - 0.5) * 0.001,
    rotation: Math.random() * Math.PI * 0.2,
    memory: Math.floor(Math.random() * 4), // Choix parmi 4 souvenirs différents
    isFading: false,
    delay: Math.random() * 1000,
    // Animation de "prise de conscience"
    beingTouched: false,
    touchProgress: 0,
    touchColor: COLORS.sadnessBlue,
    // Contenu visuel de l'orbe (petit dessin simpliste)
    content: Math.floor(Math.random() * 4) // 0-3 pour différents contenus
  };
  
  return orb;
}

/**
 * Fonction pour créer une nuage décoratif
 */
function createCloud(canvas, x, y, width = 200, height = 100) {
  const puffCount = 5 + Math.floor(Math.random() * 4);
  const puffs = [];
  
  // Créer plusieurs cercles pour former un nuage
  for (let i = 0; i < puffCount; i++) {
    const puffSize = 30 + Math.random() * 40;
    const puffX = (i / (puffCount - 1)) * width - width/2;
    const offsetY = (Math.random() - 0.5) * 30;
    
    puffs.push({
      x: puffX,
      y: offsetY,
      size: puffSize,
      // Animation subtile
      pulseAmount: 0.1 + Math.random() * 0.1,
      pulseSpeed: 0.001 + Math.random() * 0.001,
      pulsePhase: Math.random() * Math.PI * 2
    });
  }
  
  const cloud = {
    x: x,
    y: y,
    width: width,
    height: height,
    puffs: puffs,
    speed: 0.2 + Math.random() * 0.3,
    color: COLORS.cloudSoft,
    outline: COLORS.sadnessLightBlue,
    opacity: 0.9,
    // Pour les nuages qui pleurent
    isRaining: Math.random() > 0.5,
    rainInterval: Math.random() * 100 + 50,
    rainTimer: 0,
    rainIntensity: Math.random() * 0.5 + 0.1
  };
  
  return cloud;
}

/**
 * Fonction pour créer une goutte de pluie mignonne
 */
function createRaindrop(canvas, x, y, withFace = false) {
  return {
    x: x,
    y: y,
    baseX: x,
    speedY: 2 + Math.random() * 3,
    size: 10 + Math.random() * 15,
    color: COLORS.rainBlue,
    opacity: 0.8,
    withFace: withFace && Math.random() > 0.7, // Seulement certaines gouttes ont un visage
    wiggleAmount: 1 + Math.random() * 2,
    wiggleSpeed: 0.05 + Math.random() * 0.05,
    wigglePhase: Math.random() * Math.PI * 2,
    // Animation de splash
    splashed: false,
    splashSize: 0,
    splashOpacity: 0,
    splashPhase: 0,
    // Expressions de visage pour les gouttes mignonnes
    face: {
      expression: Math.floor(Math.random() * 3), // 0: neutre, 1: triste, 2: inquiet
      blinkTimer: Math.random() * 100,
      isBlinking: false
    }
  };
}

/**
 * Fonction pour créer une larme pour notre personnage
 */
function createTeardrop(x, y) {
  return {
    x: x,
    y: y,
    baseX: x,
    speedY: 0.5 + Math.random() * 1.5,
    size: 8 + Math.random() * 10,
    color: COLORS.tearBlue,
    opacity: 0.9,
    wiggleAmount: 1 + Math.random() * 1.5,
    wiggleSpeed: 0.03 + Math.random() * 0.03,
    wigglePhase: Math.random() * Math.PI * 2,
    // Pour les traînées
    trail: [],
    // Animation de splash
    splashed: false,
    splashSize: 0,
    splashOpacity: 0,
    splashPhase: 0
  };
}

/**
 * Création d'un élément décoratif d'arrière-plan (formes abstraites)
 */
function createBackgroundElement(canvas) {
  const type = Math.floor(Math.random() * 3); // 0: cercle, 1: ligne, 2: vague
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  
  return {
    type: type,
    x: x,
    y: y,
    size: 50 + Math.random() * 150,
    color: COLORS.sadnessLightBlue,
    opacity: 0.05 + Math.random() * 0.1,
    speed: 0.1 + Math.random() * 0.3,
    angle: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.001,
    rotation: 0,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.001 + Math.random() * 0.002,
    pulseAmount: 0.1 + Math.random() * 0.2
  };
}

/**
 * Création d'un dégradé bleu animé pour l'arrière-plan
 */
function createBlueGradient(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 200 + Math.random() * 300,
    colors: [
      COLORS.backgroundDark,
      COLORS.backgroundLight,
      COLORS.sadnessBlue
    ],
    opacity: 0.1 + Math.random() * 0.2,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.0005 + Math.random() * 0.001,
    pulseAmount: 0.1 + Math.random() * 0.2,
    driftSpeed: {
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2
    }
  };
}

/**
 * Initialisation de l'animation de tristesse
 */
function initTristesseCanvas() {
  try {
    const canvas = document.getElementById('tristesse-canvas');
    if (!canvas) {
      console.error("Canvas tristesse non trouvé");
      updateLoadingProgress();
      return;
    }
    
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('tristesse');
    
    // Redimensionnement du canvas
    function resizeCanvas() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Création du personnage de Tristesse (inspiré du personnage de Vice Versa)
    sadnessCharacter = {
      x: canvas.width * 0.7,
      y: canvas.height * 0.5,
      targetX: canvas.width * 0.7,
      targetY: canvas.height * 0.5,
      width: 120,
      height: 180,
      color: COLORS.sadnessBlue,
      outlineColor: COLORS.outlineBlue,
      moveSpeed: 0.05,
      // Animation de respiration
      breathCycle: 0,
      breathSpeed: 0.02,
      breathAmount: 0.02,
      // Animation de balancement
      swayCycle: 0,
      swaySpeed: 0.015,
      swayAmount: 0.05,
      // Expression faciale
      face: {
        eyeDistance: 30,
        eyeSize: 8,
        eyeHeight: 20,
        mouthWidth: 20,
        mouthHeight: 5,
        // Lunettes comme dans Vice Versa
        hasGlasses: true,
        glassesSize: 14,
        glassesColor: COLORS.outlineBlue,
        // Animation des yeux
        blinkTimer: 0,
        blinkInterval: Math.random() * 100 + 100,
        isBlinking: false,
        // Expressivité
        sadnessLevel: 0, // 0 à 3
        tearTimer: 0,
        tearInterval: 60,
        // Animations spéciales
        headTilt: 0,
        shoulderDroop: 0
      },
      // Cheveux courts comme dans Vice Versa
      hair: {
        length: 30,
        segments: 5,
        color: COLORS.sadnessDarkBlue
      },
      // Vêtements simples
      clothes: {
        color: COLORS.sadnessDarkBlue,
        neckline: 40,
        sleeves: true
      },
      // Aura de mélancolie
      aura: {
        visible: false,
        size: 180,
        opacity: 0,
        color: COLORS.sadnessLightBlue,
        particles: []
      }
    };
    
    // Créer des particules d'aura
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * sadnessCharacter.aura.size;
      
      sadnessCharacter.aura.particles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: 1 + Math.random() * 3,
        opacity: Math.random() * 0.5,
        speed: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2
        },
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02
      });
    }
    
    // Créer des nuages
    for (let i = 0; i < 6; i++) {
      const cloud = createCloud(
        canvas, 
        Math.random() * canvas.width,
        canvas.height * 0.2 + Math.random() * canvas.height * 0.3,
        150 + Math.random() * 150,
        50 + Math.random() * 50
      );
      cloudPuffs.push(cloud);
    }
    
    // Créer des orbes de souvenirs
    const orbPositions = [
      { x: canvas.width * 0.25, y: canvas.height * 0.3, blue: false },
      { x: canvas.width * 0.75, y: canvas.height * 0.35, blue: false },
      { x: canvas.width * 0.15, y: canvas.height * 0.6, blue: false },
      { x: canvas.width * 0.35, y: canvas.height * 0.7, blue: false },
      { x: canvas.width * 0.65, y: canvas.height * 0.65, blue: false },
      { x: canvas.width * 0.85, y: canvas.height * 0.4, blue: false }
    ];
    
    orbPositions.forEach((pos, index) => {
      const orb = createMemoryOrb(canvas, pos.x, pos.y, pos.blue, 50 + Math.random() * 30);
      orb.delay = index * 300; // Apparition progressive
      memoryOrbs.push(orb);
    });
    
    // Créer des éléments d'arrière-plan
    for (let i = 0; i < 12; i++) {
      backgroundElements.push(createBackgroundElement(canvas));
    }
    
    // Créer des dégradés bleus pour l'arrière-plan
    for (let i = 0; i < 5; i++) {
      blueGradients.push(createBlueGradient(canvas));
    }
    
    // Suivi du temps
    let lastTime = 0;
    let elapsedTime = 0;
    
    /**
     * Animation principale
     */
    function animate(time) {
      try {
        // Calcul du delta temps
        const deltaTime = Math.min(50, time - lastTime);
        lastTime = time;
        elapsedTime += deltaTime;
        
        // Mise à jour de la progression de l'histoire
        const phase = updateStoryProgress('tristesse', deltaTime);
        
        // Effacement du canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dessin du fond dégradé bleu
        drawBackground(ctx, canvas, phase, elapsedTime);
        
        // Dessin des éléments d'arrière-plan
        drawBackgroundElements(ctx, phase, elapsedTime);
        
        // Dessin des nuages
        updateAndDrawClouds(ctx, cloudPuffs, phase, deltaTime, canvas);
        
        // Dessin des orbes de souvenirs
        updateAndDrawMemoryOrbs(ctx, memoryOrbs, phase, deltaTime, elapsedTime);
        
        // Mise à jour de la pluie
        updateAndDrawRain(ctx, raindrops, phase, deltaTime, canvas);
        
        // Mise à jour et dessin du personnage de Tristesse
        updateSadnessCharacter(sadnessCharacter, phase, deltaTime, elapsedTime, canvas);
        drawSadnessCharacter(ctx, sadnessCharacter, phase, elapsedTime);
        
        // Mise à jour et dessin des larmes
        updateAndDrawTears(ctx, teardrops, sadnessCharacter, deltaTime, canvas);
        
        // Transition des souvenirs qui deviennent bleus avec les phases
        if (phase >= 1) {
          const numBlueMemories = Math.floor(memoryOrbs.length * (phase / 3));
          for (let i = 0; i < numBlueMemories && i < memoryOrbs.length; i++) {
            if (!memoryOrbs[i].isFading && !memoryOrbs[i].beingTouched) {
              memoryOrbs[i].beingTouched = true;
              memoryOrbs[i].touchProgress = 0;
            }
          }
        }
        
        // Augmenter l'intensité des effets selon la phase
        increaseSadnessIntensity(phase);
        
        requestAnimationFrame(animate);
      } catch (error) {
        console.error("Erreur dans l'animation tristesse:", error);
        requestAnimationFrame(animate);
      }
    }
    
    // Lancement de l'animation
    animate(0);
    updateLoadingProgress();
    
  } catch (error) {
    console.error("Erreur dans initTristesseCanvas:", error);
    updateLoadingProgress();
  }
}

/**
 * Dessine un fond dégradé bleu poétique
 */
function drawBackground(ctx, canvas, phase, time) {
  // Fond dégradé de base (subtil)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, `rgba(40, 70, 110, 1)`);  // Bleu foncé en haut
  gradient.addColorStop(1, `rgba(70, 120, 170, 1)`); // Bleu plus clair en bas
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dessiner les dégradés radials animés
  for (const blueFog of blueGradients) {
    // Mise à jour de la position avec dérive lente
    blueFog.x += blueFog.driftSpeed.x;
    blueFog.y += blueFog.driftSpeed.y;
    
    // Rebondir sur les bords
    if (blueFog.x < 0 || blueFog.x > canvas.width) blueFog.driftSpeed.x *= -1;
    if (blueFog.y < 0 || blueFog.y > canvas.height) blueFog.driftSpeed.y *= -1;
    
    // Animation de pulsation SÉCURISÉE (évite les rayons négatifs)
    blueFog.pulsePhase += blueFog.pulseSpeed * time;
    const pulseScale = Math.max(0.1, 1 + Math.sin(blueFog.pulsePhase) * blueFog.pulseAmount);
    
    // Rayon toujours positif
    const safeRadius = Math.max(0.1, blueFog.radius * pulseScale);
    
    // Dessiner le dégradé
    const gradientRadius = safeRadius; // Utiliser une valeur sécurisée
    const gradient = ctx.createRadialGradient(
      blueFog.x, blueFog.y, 0,
      blueFog.x, blueFog.y, gradientRadius
    );
    
    gradient.addColorStop(0, `rgba(100, 140, 200, ${blueFog.opacity})`);
    gradient.addColorStop(0.5, `rgba(80, 120, 180, ${blueFog.opacity * 0.6})`);
    gradient.addColorStop(1, `rgba(60, 90, 150, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    // Utiliser le même rayon sécurisé pour le arc()
    ctx.arc(blueFog.x, blueFog.y, gradientRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Ajouter de légères particules qui flottent (comme de la poussière/brume)
  const numParticles = 50 + phase * 30; // Plus de particules avec l'intensité
  ctx.fillStyle = 'rgba(150, 180, 220, 0.2)';
  
  for (let i = 0; i < numParticles; i++) {
    const x = (Math.sin(time * 0.0001 * i) * 0.5 + 0.5) * canvas.width;
    const y = (Math.cos(time * 0.00012 * (i+10)) * 0.5 + 0.5) * canvas.height;
    // Taille sécurisée pour éviter les valeurs négatives
    const size = Math.max(0.1, 1 + Math.sin(time * 0.001 + i) * 1.5);
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Dessine les éléments décoratifs d'arrière-plan
 */
function drawBackgroundElements(ctx, phase, time) {
  ctx.save();
  
  for (const element of backgroundElements) {
    // Animation de pulsation
    element.pulsePhase += element.pulseSpeed * time;
    const pulseScale = Math.max(0.1, 1 + Math.sin(element.pulsePhase) * element.pulseAmount);
    
    // Animation de rotation
    element.rotation += element.rotationSpeed * time;
    
    // Mise à jour de la position
    element.x += Math.cos(element.angle) * element.speed * 0.1;
    element.y += Math.sin(element.angle) * element.speed * 0.1;
    
    // Rebondir sur les bords
    if (element.x < 0) element.angle = Math.PI - element.angle;
    if (element.x > ctx.canvas.width) element.angle = Math.PI - element.angle;
    if (element.y < 0) element.angle = -element.angle;
    if (element.y > ctx.canvas.height) element.angle = -element.angle;
    
    // Dessiner l'élément selon son type
    ctx.globalAlpha = element.opacity;
    ctx.fillStyle = element.color;
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 2;
    
    ctx.save();
    ctx.translate(element.x, element.y);
    ctx.rotate(element.rotation);
    ctx.scale(pulseScale, pulseScale);
    
    switch (element.type) {
      case 0: // Cercle
        ctx.beginPath();
        // Rayon sécurisé
        const radius = Math.max(0.1, element.size / 2);
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 1: // Ligne
        ctx.beginPath();
        ctx.moveTo(-element.size / 2, 0);
        ctx.lineTo(element.size / 2, 0);
        ctx.stroke();
        break;
      case 2: // Vague
        ctx.beginPath();
        for (let x = -element.size / 2; x <= element.size / 2; x += 5) {
          const waveHeight = Math.sin(x * 0.1 + time * 0.001) * 15;
          const y = waveHeight;
          
          if (x === -element.size / 2) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }
  
  ctx.restore();
}

/**
 * Met à jour et dessine les nuages
 */
function updateAndDrawClouds(ctx, clouds, phase, deltaTime, canvas) {
  for (const cloud of clouds) {
    // Déplacement horizontal lent
    cloud.x -= cloud.speed * (deltaTime / 16);
    
    // Réapparition à droite quand le nuage sort de l'écran
    if (cloud.x < -cloud.width) {
      cloud.x = canvas.width + cloud.width / 2;
      cloud.y = canvas.height * 0.1 + Math.random() * canvas.height * 0.3;
      cloud.isRaining = phase > 0 && Math.random() > 0.3; // Plus de nuages de pluie dans les phases avancées
    }
    
    // Générer des gouttes de pluie
    if (cloud.isRaining && phase > 0) {
      cloud.rainTimer++;
      
      // Créer de nouvelles gouttes à intervalles
      if (cloud.rainTimer >= cloud.rainInterval / (1 + phase * 0.5)) {
        cloud.rainTimer = 0;
        
        // Position de départ de la goutte
        const dropX = cloud.x + (Math.random() - 0.5) * cloud.width * 0.8;
        const dropY = cloud.y + cloud.height / 2;
        
        // Créer une goutte de pluie
        const withFace = Math.random() < 0.2; // 20% des gouttes ont un visage
        const raindrop = createRaindrop(canvas, dropX, dropY, withFace);
        raindrops.push(raindrop);
      }
    }
    
    // Dessin du nuage
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    
    // Dessiner le contour d'abord
    ctx.fillStyle = cloud.outline;
    for (const puff of cloud.puffs) {
      // Animation de pulsation subtile pour chaque bouffée - SÉCURISÉE
      puff.pulsePhase += puff.pulseSpeed * deltaTime;
      const puffScale = Math.max(0.1, 1 + Math.sin(puff.pulsePhase) * puff.pulseAmount);
      
      ctx.beginPath();
      // Taille sécurisée - Toujours positive
      const puffSize = Math.max(0.1, puff.size * puffScale * 1.05);
      ctx.arc(
        cloud.x + puff.x,
        cloud.y + puff.y,
        puffSize, // Légèrement plus grand pour le contour
        0, Math.PI * 2
      );
      ctx.fill();
    }
    
    // Puis dessiner les bouffées principales
    ctx.fillStyle = cloud.color;
    for (const puff of cloud.puffs) {
      const puffScale = Math.max(0.1, 1 + Math.sin(puff.pulsePhase) * puff.pulseAmount);
      
      ctx.beginPath();
      // Taille sécurisée - Toujours positive
      const puffSize = Math.max(0.1, puff.size * puffScale);
      ctx.arc(
        cloud.x + puff.x,
        cloud.y + puff.y,
        puffSize,
        0, Math.PI * 2
      );
      ctx.fill();
    }
    
    ctx.restore();
  }
}

/**
 * Met à jour et dessine les orbes de souvenirs
 */
function updateAndDrawMemoryOrbs(ctx, orbs, phase, deltaTime, time) {
  orbs.forEach((orb, index) => {
    // Animation d'apparition progressive
    if (time > orb.delay) {
      orb.opacity = Math.min(orb.opacity + 0.01, orb.targetOpacity);
    }
    
    // Animation de flottement vertical
    orb.floatPhase += orb.floatSpeed * deltaTime;
    const floatOffset = Math.sin(orb.floatPhase) * orb.floatAmplitude;
    
    // Animation de pulsation - SÉCURISÉE
    orb.pulsePhase += orb.pulseSpeed * deltaTime;
    const pulseScale = Math.max(0.1, 1 + Math.sin(orb.pulsePhase) * 0.05 * orb.pulseFactor);
    
    // Animation de rotation légère
    orb.rotation += orb.rotateSpeed * deltaTime;
    
    // Animation de prise de conscience (devenir bleu)
    if (orb.beingTouched) {
      orb.touchProgress = Math.min(orb.touchProgress + 0.005 * deltaTime, 1);
      
      // Transition de couleur du neutral au bleu
      orb.color = lerpColor(
        COLORS.neutralMemory,
        COLORS.memoryBlue,
        orb.touchProgress
      );
      
      orb.glowColor = lerpColor(
        '#ffffff',
        COLORS.sadnessBlue,
        orb.touchProgress
      );
      
      // Animation terminée, marquer comme bleu
      if (orb.touchProgress >= 1) {
        orb.beingTouched = false;
      }
    }
    
    // Animation de disparition (fondu)
    if (orb.isFading) {
      orb.opacity = Math.max(0, orb.opacity - 0.01);
    }
    
    // Si le souvenir est devenu complètement bleu et que la phase est avancée, faire disparaître progressivement
    if (!orb.beingTouched && orb.touchProgress >= 1 && phase >= 2.5 && !orb.isFading) {
      if (Math.random() < 0.001 * phase) {
        orb.isFading = true;
      }
    }
    
    // Ne dessiner que si l'orbe est visible
    if (orb.opacity > 0) {
      ctx.save();
      
      // Position avec flottement
      const x = orb.x;
      const y = orb.y + floatOffset;
      
      // Appliquer la rotation
      ctx.translate(x, y);
      ctx.rotate(orb.rotation);
      
      // Dessin du halo lumineux
      // Utiliser une taille sécurisée pour le halo
      const safeGlowSize = Math.max(0.1, orb.glowSize * pulseScale);
      const glowGradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, safeGlowSize
      );
      glowGradient.addColorStop(0, `rgba(${hexToRgb(orb.glowColor)}, ${orb.opacity * 0.5})`);
      glowGradient.addColorStop(1, `rgba(${hexToRgb(orb.glowColor)}, 0)`);
      
      ctx.globalAlpha = orb.opacity * 0.7;
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, safeGlowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Dessin de l'orbe principal
      ctx.globalAlpha = orb.opacity;
      ctx.fillStyle = orb.color;
      ctx.strokeStyle = lerpColor(orb.color, '#ffffff', 0.3);
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Taille sécurisée pour l'orbe
      const safeOrbSize = Math.max(0.1, orb.size * pulseScale);
      ctx.arc(0, 0, safeOrbSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Dessin du contenu du souvenir (stylisé et simple)
      ctx.globalAlpha = orb.opacity * 0.9;
      const contentSize = Math.max(0.1, orb.size * 0.6);
      
      // Différents types de contenu selon les souvenirs
      switch (orb.content) {
        case 0: // Silhouette simple de personne
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          // Tête
          ctx.beginPath();
          // Taille sécurisée pour la tête
          const headSize = Math.max(0.1, contentSize * 0.25);
          ctx.arc(0, -contentSize * 0.3, headSize, 0, Math.PI * 2);
          ctx.fill();
          // Corps
          ctx.beginPath();
          ctx.moveTo(-contentSize * 0.25, 0);
          ctx.lineTo(contentSize * 0.25, 0);
          ctx.lineTo(contentSize * 0.15, contentSize * 0.5);
          ctx.lineTo(-contentSize * 0.15, contentSize * 0.5);
          ctx.closePath();
          ctx.fill();
          break;
        case 1: // Petit arbre stylisé
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          // Tronc
          ctx.fillRect(-contentSize * 0.1, 0, contentSize * 0.2, contentSize * 0.5);
          // Feuillage
          ctx.beginPath();
          ctx.moveTo(-contentSize * 0.4, 0);
          ctx.lineTo(0, -contentSize * 0.6);
          ctx.lineTo(contentSize * 0.4, 0);
          ctx.closePath();
          ctx.fill();
          break;
        case 2: // Petite maison
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          // Base
          ctx.fillRect(-contentSize * 0.35, -contentSize * 0.1, contentSize * 0.7, contentSize * 0.4);
          // Toit
          ctx.beginPath();
          ctx.moveTo(-contentSize * 0.4, -contentSize * 0.1);
          ctx.lineTo(0, -contentSize * 0.5);
          ctx.lineTo(contentSize * 0.4, -contentSize * 0.1);
          ctx.closePath();
          ctx.fill();
          break;
        case 3: // Étoile/Lumière
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          // Étoile simple
          // Utiliser des rayons sécurisés
          const starOuterRadius = Math.max(0.1, contentSize * 0.3);
          const starInnerRadius = Math.max(0.1, contentSize * 0.15);
          drawStar(ctx, 0, 0, 5, starOuterRadius, starInnerRadius);
          ctx.fill();
          break;
      }
      
      ctx.restore();
    }
  });
}

/**
 * Met à jour et dessine les gouttes de pluie
 */
function updateAndDrawRain(ctx, drops, phase, deltaTime, canvas) {
  // Supprimer les anciennes gouttes
  const remainingDrops = [];
  
  for (const drop of raindrops) {
    // Mise à jour de la position
    drop.y += drop.speedY * (deltaTime / 16);
    
    // Animation de wiggle
    drop.wigglePhase += drop.wiggleSpeed * deltaTime;
    const wiggleOffset = Math.sin(drop.wigglePhase) * drop.wiggleAmount;
    drop.x = drop.baseX + wiggleOffset;
    
    // Vérifier si la goutte a atteint le sol
    if (drop.y > canvas.height - 20 && !drop.splashed) {
      drop.splashed = true;
      drop.splashSize = drop.size * 0.5;
      drop.splashOpacity = 0.7;
      drop.splashPhase = 0;
    }
    
    // Animation de splash
    if (drop.splashed) {
      drop.splashPhase += 0.05 * deltaTime;
      drop.splashSize += 0.2 * deltaTime;
      drop.splashOpacity -= 0.02 * deltaTime;
      
      // Si le splash est terminé, ne pas conserver cette goutte
      if (drop.splashOpacity <= 0) {
        continue;
      }
    }
    
    // Conserver la goutte si elle est toujours visible
    if (drop.y < canvas.height + 50) {
      remainingDrops.push(drop);
    }
    
    // Dessin de la goutte
    ctx.save();
    
    if (!drop.splashed) {
      // Dessin de la goutte principale
      ctx.globalAlpha = drop.opacity;
      ctx.fillStyle = drop.color;
      ctx.strokeStyle = COLORS.outlineBlue;
      ctx.lineWidth = 1;
      
      // Forme de goutte
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y - drop.size);
      ctx.bezierCurveTo(
        drop.x - drop.size/2, drop.y - drop.size*0.7,
        drop.x - drop.size/2, drop.y + drop.size*0.3,
        drop.x, drop.y + drop.size/2
      );
      ctx.bezierCurveTo(
        drop.x + drop.size/2, drop.y + drop.size*0.3,
        drop.x + drop.size/2, drop.y - drop.size*0.7,
        drop.x, drop.y - drop.size
      );
      ctx.fill();
      ctx.stroke();
      
      // Petit reflet blanc dans la goutte
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      // Taille sécurisée pour le reflet
      const reflectSize = Math.max(0.1, drop.size * 0.2);
      ctx.arc(
        drop.x - drop.size * 0.2,
        drop.y - drop.size * 0.3,
        reflectSize,
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Si la goutte a un visage, le dessiner (style mignon/kawaii)
      if (drop.withFace) {
        ctx.fillStyle = '#333';
        
        // Yeux
        if (!drop.face.isBlinking) {
          // Taille sécurisée pour les yeux
          const eyeSize = Math.max(0.1, drop.size * 0.15);
          ctx.beginPath();
          ctx.arc(drop.x - drop.size * 0.15, drop.y - drop.size * 0.1, eyeSize, 0, Math.PI * 2);
          ctx.arc(drop.x + drop.size * 0.15, drop.y - drop.size * 0.1, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Yeux fermés (clignement)
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(drop.x - drop.size * 0.25, drop.y - drop.size * 0.1);
          ctx.lineTo(drop.x - drop.size * 0.05, drop.y - drop.size * 0.1);
          ctx.moveTo(drop.x + drop.size * 0.05, drop.y - drop.size * 0.1);
          ctx.lineTo(drop.x + drop.size * 0.25, drop.y - drop.size * 0.1);
          ctx.stroke();
        }
        
        // Différentes expressions
        switch (drop.face.expression) {
          case 0: // Neutre
            ctx.beginPath();
            // Rayon sécurisé pour la bouche
            const mouthSize = Math.max(0.1, drop.size * 0.1);
            ctx.arc(drop.x, drop.y + drop.size * 0.15, mouthSize, 0, Math.PI, false);
            ctx.stroke();
            break;
          case 1: // Triste
            ctx.beginPath();
            // Rayon sécurisé pour la bouche
            const sadMouthSize = Math.max(0.1, drop.size * 0.1);
            ctx.arc(drop.x, drop.y + drop.size * 0.25, sadMouthSize, Math.PI, 0, true);
            ctx.stroke();
            break;
          case 2: // Inquiet
            ctx.beginPath();
            // Rayon sécurisé pour la bouche
            const worriedMouthSize = Math.max(0.1, drop.size * 0.07);
            ctx.arc(drop.x, drop.y + drop.size * 0.2, worriedMouthSize, 0, Math.PI, false);
            ctx.stroke();
            // Sourcils inquiets
            ctx.beginPath();
            ctx.moveTo(drop.x - drop.size * 0.2, drop.y - drop.size * 0.2);
            ctx.lineTo(drop.x - drop.size * 0.1, drop.y - drop.size * 0.25);
            ctx.moveTo(drop.x + drop.size * 0.1, drop.y - drop.size * 0.25);
            ctx.lineTo(drop.x + drop.size * 0.2, drop.y - drop.size * 0.2);
            ctx.stroke();
            break;
        }
        
        // Gestion du clignement
        drop.face.blinkTimer++;
        if (drop.face.blinkTimer > 100 && Math.random() < 0.02) {
          drop.face.isBlinking = true;
          drop.face.blinkTimer = 0;
        } else if (drop.face.blinkTimer > 5 && drop.face.isBlinking) {
          drop.face.isBlinking = false;
        }
      }
    } else {
      // Dessin du splash
      ctx.globalAlpha = drop.splashOpacity;
      ctx.strokeStyle = drop.color;
      ctx.lineWidth = 2;
      
      // Premier cercle de splash
      ctx.beginPath();
      // Taille sécurisée pour le splash
      const splashSize = Math.max(0.1, drop.splashSize);
      ctx.arc(drop.x, canvas.height - 15, splashSize, 0, Math.PI, true);
      ctx.stroke();
      
      // Second cercle plus petit
      ctx.beginPath();
      // Taille sécurisée pour le splash secondaire
      const smallSplashSize = Math.max(0.1, drop.splashSize * 0.6);
      ctx.arc(drop.x - drop.splashSize * 0.5, canvas.height - 15, smallSplashSize, 0, Math.PI, true);
      ctx.stroke();
      
      // Troisième cercle plus petit
      ctx.beginPath();
      ctx.arc(drop.x + drop.splashSize * 0.5, canvas.height - 15, smallSplashSize, 0, Math.PI, true);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  // Remplacer le tableau par les gouttes restantes
  raindrops = remainingDrops;
  
  // Ajouter de nouvelles gouttes en fonction de la phase
  if (phase > 0 && raindrops.length < 50 * phase && Math.random() < 0.1 * phase) {
    const x = Math.random() * canvas.width;
    const y = -30; // au-dessus de l'écran
    
    raindrops.push(createRaindrop(canvas, x, y, Math.random() < 0.2));
  }
}

/**
 * Met à jour le personnage de tristesse
 */
function updateSadnessCharacter(character, phase, deltaTime, time, canvas) {
  // Mise à jour du niveau de tristesse en fonction de la phase
  character.face.sadnessLevel = Math.min(3, phase * 1.2);
  
  // Mise à jour de la position cible en fonction de la phase
  switch (Math.floor(phase)) {
    case 0:
      character.targetX = canvas.width * 0.7;
      character.targetY = canvas.height * 0.5;
      break;
    case 1:
      character.targetX = canvas.width * 0.55;
      character.targetY = canvas.height * 0.55;
      break;
    case 2:
      character.targetX = canvas.width * 0.4;
      character.targetY = canvas.height * 0.6;
      break;
    case 3:
      character.targetX = canvas.width * 0.3;
      character.targetY = canvas.height * 0.65;
      break;
  }
  
  // Animation de déplacement du personnage
  character.x += (character.targetX - character.x) * character.moveSpeed * (deltaTime / 16);
  character.y += (character.targetY - character.y) * character.moveSpeed * (deltaTime / 16);
  
  // Animation de respiration - SÉCURISÉE
  character.breathCycle += character.breathSpeed * deltaTime;
  const breathEffect = Math.sin(character.breathCycle) * character.breathAmount;
  
  // Animation de balancement - SÉCURISÉE
  character.swayCycle += character.swaySpeed * deltaTime;
  const swayEffect = Math.sin(character.swayCycle) * character.swayAmount;
  
  // Animation du headTilt (inclinaison plus prononcée avec la tristesse)
  const targetHeadTilt = -0.05 - character.face.sadnessLevel * 0.03;
  character.face.headTilt += (targetHeadTilt - character.face.headTilt) * 0.02 * deltaTime;
  
  // Animation des épaules tombantes (plus prononcée avec la tristesse)
  const targetShoulderDroop = character.face.sadnessLevel * 0.08;
  character.face.shoulderDroop += (targetShoulderDroop - character.face.shoulderDroop) * 0.02 * deltaTime;
  
  // Gestion du clignement des yeux
  character.face.blinkTimer++;
  if (character.face.blinkTimer >= character.face.blinkInterval) {
    character.face.isBlinking = true;
    character.face.blinkTimer = 0;
    character.face.blinkInterval = Math.random() * 100 + 100;
  } else if (character.face.blinkTimer > 5 && character.face.isBlinking) {
    character.face.isBlinking = false;
  }
  
  // Création de larmes en fonction du niveau de tristesse
  if (character.face.sadnessLevel > 0.5) {
    character.face.tearTimer++;
    const tearFrequency = Math.max(10, character.face.tearInterval - character.face.sadnessLevel * 15);
    
    if (character.face.tearTimer >= tearFrequency) {
      character.face.tearTimer = 0;
      
      // Créer une larme pour chaque œil (avec position relative aux yeux)
      const leftTear = createTeardrop(
        character.x - character.face.eyeDistance / 2,
        character.y - character.face.eyeHeight + 5
      );
      
      const rightTear = createTeardrop(
        character.x + character.face.eyeDistance / 2,
        character.y - character.face.eyeHeight + 5
      );
      
      teardrops.push(leftTear);
      teardrops.push(rightTear);
    }
  }
  
  // Aura de mélancolie qui apparaît progressivement avec la tristesse
  character.aura.visible = character.face.sadnessLevel > 1;
  if (character.aura.visible) {
    character.aura.opacity += (0.3 * (character.face.sadnessLevel - 1) - character.aura.opacity) * 0.05;
    
    // Mise à jour des particules de l'aura
    for (const particle of character.aura.particles) {
      // Mouvement lent
      particle.x += particle.speed.x * deltaTime;
      particle.y += particle.speed.y * deltaTime;
      
      // Effet de pulsation
      particle.pulsePhase += particle.pulseSpeed * deltaTime;
      
      // Distance par rapport au centre
      const dist = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
      
      // Si trop loin du centre, ramener vers le personnage
      if (dist > character.aura.size) {
        const angle = Math.atan2(particle.y, particle.x);
        particle.x = Math.cos(angle) * character.aura.size * 0.8;
        particle.y = Math.sin(angle) * character.aura.size * 0.8;
        
        // Nouvelle direction aléatoire
        particle.speed.x = (Math.random() - 0.5) * 0.2;
        particle.speed.y = (Math.random() - 0.5) * 0.2;
      }
    }
  } else {
    character.aura.opacity = Math.max(0, character.aura.opacity - 0.05);
  }
}

/**
 * Dessine le personnage Tristesse dans le style Vice Versa
 */
function drawSadnessCharacter(ctx, character, phase, time) {
  ctx.save();
  
  // Position de base avec effets de balancement et respiration
  const x = character.x;
  const y = character.y;
  const swayEffect = Math.sin(character.swayCycle) * character.swayAmount;
  const breathEffect = Math.sin(character.breathCycle) * character.breathAmount;
  
  // Dessin de l'aura de mélancolie
  if (character.aura.visible && character.aura.opacity > 0) {
    // Dégradé radial pour l'aura
    // Taille sécurisée pour l'aura
    const auraSize = Math.max(0.1, character.aura.size);
    const auraGradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, auraSize
    );
    
    auraGradient.addColorStop(0, `rgba(100, 150, 200, ${character.aura.opacity * 0.5})`);
    auraGradient.addColorStop(0.7, `rgba(80, 130, 180, ${character.aura.opacity * 0.3})`);
    auraGradient.addColorStop(1, `rgba(70, 110, 160, 0)`);
    
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(x, y, auraSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Dessiner les particules de l'aura
    for (const particle of character.aura.particles) {
      const opacity = 0.2 + Math.sin(particle.pulsePhase) * 0.1;
      
      ctx.fillStyle = `rgba(150, 200, 255, ${opacity * character.aura.opacity})`;
      ctx.beginPath();
      // Taille sécurisée pour les particules
      const particleSize = Math.max(0.1, particle.size * (0.8 + Math.sin(particle.pulsePhase) * 0.2));
      ctx.arc(
        x + particle.x,
        y + particle.y,
        particleSize,
        0, Math.PI * 2
      );
      ctx.fill();
    }
  }
  
  // Appliquer la rotation pour l'inclinaison de la tête
  ctx.translate(x, y);
  ctx.rotate(character.face.headTilt + swayEffect);
  
  // Dessin du corps (forme ovale avec épaules tombantes)
  ctx.fillStyle = character.color;
  ctx.strokeStyle = character.outlineColor;
  ctx.lineWidth = 3;
  
  // Corps (forme arrondie comme dans Vice Versa)
  // Utiliser des tailles sécurisées pour éviter les valeurs négatives
  const bodyWidth = Math.max(0.1, character.width * (1 + breathEffect));
  const bodyHeight = Math.max(0.1, character.height * (1 - breathEffect * 0.5));
  
  // Épaules tombantes en fonction du niveau de tristesse
  const leftShoulderDrop = character.face.shoulderDroop;
  const rightShoulderDrop = character.face.shoulderDroop;
  
  ctx.beginPath();
  ctx.moveTo(-bodyWidth/2, -bodyHeight/3 + leftShoulderDrop * bodyHeight);
  
  // Courbe supérieure gauche (épaule)
  ctx.quadraticCurveTo(
    -bodyWidth/2, -bodyHeight/2,
    0, -bodyHeight/2
  );
  
  // Courbe supérieure droite (épaule)
  ctx.quadraticCurveTo(
    bodyWidth/2, -bodyHeight/2,
    bodyWidth/2, -bodyHeight/3 + rightShoulderDrop * bodyHeight
  );
  
  // Côté droit
  ctx.quadraticCurveTo(
    bodyWidth/2, bodyHeight/5,
    bodyWidth*0.4, bodyHeight/2
  );
  
  // Bas du corps
  ctx.quadraticCurveTo(
    0, bodyHeight/2 + bodyHeight*0.1,
    -bodyWidth*0.4, bodyHeight/2
  );
  
  // Côté gauche
  ctx.quadraticCurveTo(
    -bodyWidth/2, bodyHeight/5,
    -bodyWidth/2, -bodyHeight/3 + leftShoulderDrop * bodyHeight
  );
  
  ctx.fill();
  ctx.stroke();
  
  // Vêtements - col rond simple
  ctx.fillStyle = character.clothes.color;
  ctx.beginPath();
  ctx.moveTo(-bodyWidth*0.3, -bodyHeight/3 + character.clothes.neckline * 0.5);
  ctx.quadraticCurveTo(
    0, -bodyHeight/3 + character.clothes.neckline * 0.3, 
    bodyWidth*0.3, -bodyHeight/3 + character.clothes.neckline * 0.5
  );
  
  ctx.lineTo(bodyWidth*0.3, bodyHeight/2 - 10);
  ctx.lineTo(-bodyWidth*0.3, bodyHeight/2 - 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Manches des vêtements
  if (character.clothes.sleeves) {
    ctx.fillStyle = character.clothes.color;
    
    // Manche gauche
    ctx.beginPath();
    ctx.moveTo(-bodyWidth*0.4, -bodyHeight/3 + leftShoulderDrop * bodyHeight);
    ctx.lineTo(-bodyWidth*0.55, -bodyHeight/6 + leftShoulderDrop * bodyHeight);
    ctx.lineTo(-bodyWidth*0.5, bodyHeight/6 + leftShoulderDrop * bodyHeight);
    ctx.lineTo(-bodyWidth*0.3, 0 + leftShoulderDrop * bodyHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Manche droite
    ctx.beginPath();
    ctx.moveTo(bodyWidth*0.4, -bodyHeight/3 + rightShoulderDrop * bodyHeight);
    ctx.lineTo(bodyWidth*0.55, -bodyHeight/6 + rightShoulderDrop * bodyHeight);
    ctx.lineTo(bodyWidth*0.5, bodyHeight/6 + rightShoulderDrop * bodyHeight);
    ctx.lineTo(bodyWidth*0.3, 0 + rightShoulderDrop * bodyHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  // Tête (cercle simple comme dans Vice Versa)
  ctx.fillStyle = character.color;
  ctx.beginPath();
  // Taille sécurisée pour la tête
  const headSize = Math.max(0.1, bodyWidth*0.4);
  ctx.arc(0, -bodyHeight*0.4, headSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Cheveux courts (style Vice Versa)
  ctx.fillStyle = character.hair.color;
  ctx.beginPath();
  
  // Base des cheveux (dessus de la tête)
  ctx.moveTo(-bodyWidth*0.4, -bodyHeight*0.55);
  ctx.quadraticCurveTo(
    0, -bodyHeight*0.65,
    bodyWidth*0.4, -bodyHeight*0.55
  );
  
  // Côté droit des cheveux
  ctx.lineTo(bodyWidth*0.38, -bodyHeight*0.4);
  ctx.quadraticCurveTo(
    bodyWidth*0.4, -bodyHeight*0.35,
    bodyWidth*0.38, -bodyHeight*0.32
  );
  
  // Balayage sur le front
  ctx.quadraticCurveTo(
    bodyWidth*0.2, -bodyHeight*0.35,
    0, -bodyHeight*0.35
  );
  
  ctx.quadraticCurveTo(
    -bodyWidth*0.2, -bodyHeight*0.35,
    -bodyWidth*0.38, -bodyHeight*0.32
  );
  
  // Côté gauche des cheveux
  ctx.quadraticCurveTo(
    -bodyWidth*0.4, -bodyHeight*0.35,
    -bodyWidth*0.38, -bodyHeight*0.4
  );
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Visage
  const faceY = -bodyHeight*0.4;
  
  // Yeux
  const eyeY = faceY - character.face.eyeHeight * 0.1;
  
  if (!character.face.isBlinking) {
    // Yeux ouverts
    ctx.fillStyle = 'white';
    ctx.strokeStyle = character.outlineColor;
    ctx.lineWidth = 2;
    
    // Œil gauche
    ctx.beginPath();
    // Taille sécurisée pour les yeux
    const eyeSize = Math.max(0.1, character.face.eyeSize);
    ctx.arc(
      -character.face.eyeDistance/2,
      eyeY,
      eyeSize,
      0, Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();
    
    // Œil droit
    ctx.beginPath();
    ctx.arc(
      character.face.eyeDistance/2,
      eyeY,
      eyeSize,
      0, Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();
    
    // Pupilles (regard baissé avec la tristesse)
    const sadnessGaze = Math.min(1, character.face.sadnessLevel) * 3;
    
    ctx.fillStyle = '#333';
    ctx.beginPath();
    // Taille sécurisée pour les pupilles
    const pupilSize = Math.max(0.1, character.face.eyeSize * 0.5);
    ctx.arc(
      -character.face.eyeDistance/2,
      eyeY + sadnessGaze,
      pupilSize,
      0, Math.PI * 2
    );
    ctx.arc(
      character.face.eyeDistance/2,
      eyeY + sadnessGaze,
      pupilSize,
      0, Math.PI * 2
    );
    ctx.fill();
    
    // Reflets des yeux
    ctx.fillStyle = 'white';
    ctx.beginPath();
    // Taille sécurisée pour les reflets
    const reflectSize = Math.max(0.1, character.face.eyeSize * 0.2);
    ctx.arc(
      -character.face.eyeDistance/2 - character.face.eyeSize * 0.2,
      eyeY - character.face.eyeSize * 0.2,
      reflectSize,
      0, Math.PI * 2
    );
    ctx.arc(
      character.face.eyeDistance/2 - character.face.eyeSize * 0.2,
      eyeY - character.face.eyeSize * 0.2,
      reflectSize,
      0, Math.PI * 2
    );
    ctx.fill();
  } else {
    // Yeux fermés
    ctx.strokeStyle = character.outlineColor;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(-character.face.eyeDistance/2 - character.face.eyeSize, eyeY);
    ctx.quadraticCurveTo(
      -character.face.eyeDistance/2,
      eyeY + character.face.eyeSize * 0.5,
      -character.face.eyeDistance/2 + character.face.eyeSize,
      eyeY
    );
    
    ctx.moveTo(character.face.eyeDistance/2 - character.face.eyeSize, eyeY);
    ctx.quadraticCurveTo(
      character.face.eyeDistance/2,
      eyeY + character.face.eyeSize * 0.5,
      character.face.eyeDistance/2 + character.face.eyeSize,
      eyeY
    );
    
    ctx.stroke();
  }
  
  // Lunettes comme dans Vice Versa
  if (character.face.hasGlasses) {
    ctx.strokeStyle = character.face.glassesColor;
    ctx.lineWidth = 2;
    
    // Monture gauche
    ctx.beginPath();
    // Taille sécurisée pour les lunettes
    const glassesSize = Math.max(0.1, character.face.glassesSize);
    ctx.arc(
      -character.face.eyeDistance/2,
      eyeY,
      glassesSize,
      0, Math.PI * 2
    );
    ctx.stroke();
    
    // Monture droite
    ctx.beginPath();
    ctx.arc(
      character.face.eyeDistance/2,
      eyeY,
      glassesSize,
      0, Math.PI * 2
    );
    ctx.stroke();
    
    // Pont des lunettes
    ctx.beginPath();
    ctx.moveTo(
      -character.face.eyeDistance/2 + character.face.glassesSize * Math.cos(0),
      eyeY + character.face.glassesSize * Math.sin(0)
    );
    ctx.lineTo(
      character.face.eyeDistance/2 - character.face.glassesSize * Math.cos(0),
      eyeY + character.face.glassesSize * Math.sin(0)
    );
    ctx.stroke();
    
    // Branches des lunettes
    ctx.beginPath();
    ctx.moveTo(
      -character.face.eyeDistance/2 - character.face.glassesSize * Math.cos(Math.PI * 0.1),
      eyeY + character.face.glassesSize * Math.sin(Math.PI * 0.1)
    );
    ctx.lineTo(
      -character.face.eyeDistance - character.face.glassesSize,
      eyeY + character.face.glassesSize * 0.5
    );
    
    ctx.moveTo(
      character.face.eyeDistance/2 + character.face.glassesSize * Math.cos(Math.PI * 0.9),
      eyeY + character.face.glassesSize * Math.sin(Math.PI * 0.9)
    );
    ctx.lineTo(
      character.face.eyeDistance + character.face.glassesSize,
      eyeY + character.face.glassesSize * 0.5
    );
    
    ctx.stroke();
  }
  
  // Bouche - expression triste qui s'accentue avec le niveau de tristesse
  const mouthY = faceY + character.face.eyeDistance * 0.8;
  const mouthCurve = 0.2 + character.face.sadnessLevel * 0.15;
  
  ctx.strokeStyle = character.outlineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  if (character.face.sadnessLevel < 0.5) {
    // Bouche neutre
    ctx.moveTo(-character.face.mouthWidth / 2, mouthY);
    ctx.lineTo(character.face.mouthWidth / 2, mouthY);
  } else {
    // Bouche triste
    ctx.moveTo(-character.face.mouthWidth / 2, mouthY);
    ctx.quadraticCurveTo(
      0, 
      mouthY + character.face.mouthHeight * mouthCurve,
      character.face.mouthWidth / 2, 
      mouthY
    );
  }
  
  ctx.stroke();
  
  // Si très triste, ajouter une lèvre inférieure tremblante
  if (character.face.sadnessLevel > 2) {
    ctx.beginPath();
    
    // Lèvre tremblante
    const tremble = Math.sin(time * 0.01) * 1;
    
    ctx.moveTo(-character.face.mouthWidth / 4, mouthY + character.face.mouthHeight * 0.5);
    ctx.quadraticCurveTo(
      0, 
      mouthY + character.face.mouthHeight * 0.7 + tremble,
      character.face.mouthWidth / 4, 
      mouthY + character.face.mouthHeight * 0.5
    );
    
    ctx.stroke();
  }
  
  // Sourcils tristes (plus inclinés avec la tristesse)
  const eyebrowAngle = Math.PI * 0.1 + character.face.sadnessLevel * 0.05;
  const eyebrowY = eyeY - character.face.eyeSize * 2;
  
  ctx.strokeStyle = character.outlineColor;
  ctx.lineWidth = 2;
  
  // Sourcil gauche
  ctx.save();
  ctx.translate(-character.face.eyeDistance/2, eyebrowY);
  ctx.rotate(-eyebrowAngle);
  ctx.beginPath();
  ctx.moveTo(-character.face.eyeSize * 1.2, 0);
  ctx.lineTo(character.face.eyeSize * 1.2, 0);
  ctx.stroke();
  ctx.restore();
  
  // Sourcil droit
  ctx.save();
  ctx.translate(character.face.eyeDistance/2, eyebrowY);
  ctx.rotate(eyebrowAngle);
  ctx.beginPath();
  ctx.moveTo(-character.face.eyeSize * 1.2, 0);
  ctx.lineTo(character.face.eyeSize * 1.2, 0);
  ctx.stroke();
  ctx.restore();
  
  ctx.restore();
}

/**
 * Met à jour et dessine les larmes du personnage
 */
function updateAndDrawTears(ctx, tears, character, deltaTime, canvas) {
  // Tableau pour les larmes à conserver
  const remainingTears = [];
  
  for (const tear of tears) {
    // Mise à jour de la position
    tear.y += tear.speedY * (deltaTime / 16);
    
    // Animation de wiggle
    tear.wigglePhase += tear.wiggleSpeed * deltaTime;
    const wiggleOffset = Math.sin(tear.wigglePhase) * tear.wiggleAmount;
    tear.x = tear.baseX + wiggleOffset;
    
    // Vérifier si la larme a atteint le sol ou les vêtements
    const hitY = character.y + 20;
    if (tear.y > hitY && !tear.splashed) {
      tear.splashed = true;
      tear.splashSize = tear.size * 0.5;
      tear.splashOpacity = 0.8;
      tear.splashPhase = 0;
    }
    
    // Animation de splash
    if (tear.splashed) {
      tear.splashPhase += 0.05 * deltaTime;
      tear.splashSize += 0.2 * deltaTime;
      tear.splashOpacity -= 0.02 * deltaTime;
      
      // Si le splash est terminé, ne pas conserver cette larme
      if (tear.splashOpacity <= 0) {
        continue;
      }
    }
    
    // Conserver la larme si elle est toujours visible
    if (tear.y < canvas.height && tear.splashOpacity > 0) {
      remainingTears.push(tear);
    }
    
    // Dessin de la larme
    ctx.save();
    
    if (!tear.splashed) {
      // Dessin de la larme
      ctx.globalAlpha = tear.opacity;
      ctx.fillStyle = tear.color;
      ctx.strokeStyle = lerpColor(tear.color, '#4a89dc', 0.5);
      ctx.lineWidth = 1;
      
      // Forme de goutte
      ctx.beginPath();
      ctx.moveTo(tear.x, tear.y - tear.size);
      ctx.bezierCurveTo(
        tear.x - tear.size/2, tear.y - tear.size*0.7,
        tear.x - tear.size/2, tear.y + tear.size*0.3,
        tear.x, tear.y + tear.size/2
      );
      ctx.bezierCurveTo(
        tear.x + tear.size/2, tear.y + tear.size*0.3,
        tear.x + tear.size/2, tear.y - tear.size*0.7,
        tear.x, tear.y - tear.size
      );
      ctx.fill();
      ctx.stroke();
      
      // Petit reflet blanc dans la larme
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      // Taille sécurisée pour le reflet
      const reflectSize = Math.max(0.1, tear.size * 0.2);
      ctx.arc(
        tear.x - tear.size * 0.2,
        tear.y - tear.size * 0.3,
        reflectSize,
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Ajouter occasionnellement à la traînée
      if (Math.random() < 0.1 && tear.speedY > 1) {
        tear.trail.push({
          x: tear.x,
          y: tear.y,
          size: tear.size * 0.6,
          opacity: 0.3
        });
      }
      
      // Dessiner la traînée
      for (let i = 0; i < tear.trail.length; i++) {
        const trailDrop = tear.trail[i];
        
        ctx.globalAlpha = trailDrop.opacity;
        ctx.fillStyle = tear.color;
        
        ctx.beginPath();
        // Taille sécurisée pour la traînée
        const safeTrailSize = Math.max(0.1, trailDrop.size);
        ctx.arc(trailDrop.x, trailDrop.y, safeTrailSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Faire disparaître la traînée
        trailDrop.size *= 0.95;
        trailDrop.opacity -= 0.02;
        
        // Supprimer les gouttes de traînée invisibles
        if (trailDrop.opacity <= 0 || trailDrop.size <= 0.5) {
          tear.trail.splice(i, 1);
          i--;
        }
      }
    } else {
      // Dessin du splash
      ctx.globalAlpha = tear.splashOpacity;
      ctx.strokeStyle = tear.color;
      ctx.lineWidth = 1.5;
      
      // Premier cercle de splash
      ctx.beginPath();
      // Taille sécurisée pour le splash
      const splashSize = Math.max(0.1, tear.splashSize);
      ctx.arc(tear.x, hitY, splashSize, 0, Math.PI, true);
      ctx.stroke();
      
      // Second cercle plus petit
      ctx.beginPath();
      // Taille sécurisée pour le petit splash
      const smallSplashSize = Math.max(0.1, tear.splashSize * 0.5);
      ctx.arc(tear.x - tear.splashSize * 0.4, hitY, smallSplashSize, 0, Math.PI, true);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  // Remplacer le tableau par les larmes restantes
  teardrops = remainingTears;
}

/**
 * Augmenter l'intensité de la tristesse en fonction de la phase
 */
function increaseSadnessIntensity(phase) {
  // Augmentation du nombre de souvenirs qui deviennent bleus
  const blueMemoryCount = Math.min(memoryOrbs.length, Math.floor(phase * memoryOrbs.length / 3));
  
  for (let i = 0; i < blueMemoryCount; i++) {
    if (!memoryOrbs[i].beingTouched && memoryOrbs[i].touchProgress < 0.5) {
      memoryOrbs[i].beingTouched = true;
    }
  }
  
  // Plus de nuages de pluie avec l'avancement des phases
  for (let i = 0; i < cloudPuffs.length; i++) {
    if (phase >= 1 && i < phase * 2) {
      cloudPuffs[i].isRaining = true;
    }
  }
}

/**
 * Fonctions utilitaires
 */

// Interpolation entre deux couleurs
function lerpColor(color1, color2, t) {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Conversion hex to rgb
function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// Dessin d'une étoile
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  // Valider que les rayons sont positifs
  outerRadius = Math.max(0.1, outerRadius);
  innerRadius = Math.max(0.1, innerRadius);
  
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}