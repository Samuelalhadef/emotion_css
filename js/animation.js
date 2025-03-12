/**
 * Fonctions d'animation et de dessin pour l'animation cubiste de "Demain, dès l'aube..."
 * Version modifiée pour permettre l'interactivité
 */

// Variables globales pour l'animation
let animationFrame = null;
let particles = [];
let shapes = [];
let interactiveParticles = [];

// Fonctions utilitaires
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// Redimensionner les canvas
function resizeCanvases() {
  const canvases = document.querySelectorAll('canvas');
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  canvases.forEach(canvas => {
    canvas.width = width;
    canvas.height = height;
  });
  
  // Seulement si sceneData est déjà défini et qu'on est dans une scène active
  if (typeof currentSceneIndex !== 'undefined' && typeof sceneData !== 'undefined') {
    drawBackground();
    generateShapes();
  }
}

// Créer des particules
function createParticles() {
  // Vérifier que sceneData est défini
  if (typeof sceneData === 'undefined' || typeof currentSceneIndex === 'undefined') {
    return; // Sortir si pas encore prêt
  }
  
  const count = 50;
  particles = [];
  
  for (let i = 0; i < count; i++) {
    const scene = sceneData[currentSceneIndex];
    const colorPool = [scene.primary, scene.secondary, scene.accent];
    const color = colorPool[Math.floor(Math.random() * colorPool.length)];
    
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: color,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
}

// Dessiner l'arrière-plan
function drawBackground() {
  // Vérifier que sceneData est défini
  if (typeof sceneData === 'undefined' || typeof currentSceneIndex === 'undefined') {
    return; // Sortir si pas encore prêt
  }
  
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const scene = sceneData[currentSceneIndex];
  
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dessiner le fond
  ctx.fillStyle = scene.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Ajouter des formes géométriques
  const shapesCount = 15;
  for (let i = 0; i < shapesCount; i++) {
    const colorChoice = Math.random();
    let color;
    
    if (colorChoice < 0.4) {
      color = scene.primary;
    } else if (colorChoice < 0.8) {
      color = scene.secondary;
    } else {
      color = scene.accent;
    }
    
    const opacity = Math.random() * 0.2 + 0.05;
    const size = Math.random() * canvas.width * 0.3 + 100;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    
    ctx.fillStyle = `rgba(${hexToRgb(color)}, ${opacity})`;
    
    // Dessiner des formes aléatoires (cubistes)
    if (Math.random() < 0.6) {
      // Polygone
      const sides = Math.floor(Math.random() * 3) + 3;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.beginPath();
      for (let j = 0; j <= sides; j++) {
        const a = j * (Math.PI * 2) / sides + angle;
        const radius = size * (0.7 + Math.random() * 0.3);
        
        if (j === 0) {
          ctx.moveTo(x + radius * Math.cos(a), y + radius * Math.sin(a));
        } else {
          ctx.lineTo(x + radius * Math.cos(a), y + radius * Math.sin(a));
        }
      }
      ctx.closePath();
      ctx.fill();
    } else {
      // Rectangle avec rotation
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI / 2);
      
      const width = size * (0.5 + Math.random() * 0.5);
      const height = size * (0.5 + Math.random() * 0.5);
      
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.restore();
    }
  }
}

// Dessiner les formes principales
function drawShapes(time) {
  // Vérifier que les formes sont définies
  if (!shapes || shapes.length === 0) {
    return; // Sortir si pas encore prêt
  }
  
  const canvas = document.getElementById('main-canvas');
  const ctx = canvas.getContext('2d');
  
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dessiner chaque forme
  shapes.forEach(shape => {
    // Calculer l'animation basée sur le temps
    const animFactor = Math.sin(time * 0.001 + (shape.offset || 0)) * 5;
    
    ctx.save();
    ctx.globalAlpha = shape.opacity || 1;
    
    // Dessiner selon le type
    switch(shape.type) {
      // Formes de base
      case 'sun': drawSun(ctx, shape, animFactor, time); break;
      case 'field': drawField(ctx, shape, animFactor); break;
      case 'mountain': drawMountain(ctx, shape, animFactor); break;
      case 'tree': drawTree(ctx, shape, animFactor); break;
      case 'figure': drawFigure(ctx, shape, animFactor, time, shape.walking); break;
      case 'thought': drawThought(ctx, shape, animFactor, time); break;
      case 'bentFigure': drawBentFigure(ctx, shape, animFactor); break;
      case 'crossedHands': drawCrossedHands(ctx, shape, animFactor, time); break;
      case 'shadow': drawShadow(ctx, shape, animFactor); break;
      case 'sunset': drawSunset(ctx, shape, animFactor, time); break;
      case 'ship': drawShip(ctx, shape, animFactor, time); break;
      case 'tomb': drawTomb(ctx, shape, animFactor); break;
      case 'mourningFigure': drawMourningFigure(ctx, shape, animFactor, time); break;
      case 'bouquet': drawBouquet(ctx, shape, animFactor, time); break;
      case 'light': drawLight(ctx, shape, animFactor, time); break;
      case 'barrier': drawBarrier(ctx, shape, animFactor, time); break;
      case 'emotion': drawEmotion(ctx, shape, animFactor, time); break;
      
      // Nouvelles formes améliorées pour La Solitude
      case 'thinkerFigure': drawThinkerFigure(ctx, shape, animFactor, time); break;
      case 'inwardEyes': drawInwardEyes(ctx, shape, animFactor, time); break;
      case 'noSound': drawNoSound(ctx, shape, animFactor, time); break;
      
      // Nouvelles formes améliorées pour Le Cheminement
      case 'sadExpression': drawSadExpression(ctx, shape, animFactor, time); break;
      case 'distantFigure': drawDistantFigure(ctx, shape, animFactor, time); break;
      case 'anonymity': drawAnonymity(ctx, shape, animFactor, time); break;
    }
    
    ctx.restore();
  });
  
  // Dessiner les effets d'interaction si la fonction existe
  if (typeof drawInteractionEffects === 'function') {
    const interactiveCanvas = document.getElementById('interactive-canvas');
    const interactiveCtx = interactiveCanvas.getContext('2d');
    
    // Effacer le canvas interactif
    interactiveCtx.clearRect(0, 0, interactiveCanvas.width, interactiveCanvas.height);
    
    // Dessiner les effets d'interaction
    drawInteractionEffects(interactiveCtx, time);
  }
}

// Dessiner et animer les particules
function drawParticles(time) {
  // Vérifier que les particules sont définies
  if (!particles || particles.length === 0) {
    return; // Sortir si pas encore prêt
  }
  
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dessiner chaque particule
  particles.forEach(particle => {
    // Mettre à jour la position
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    
    // Reboucler si nécessaire
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;
    
    // Dessiner la particule
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Fonction principale d'animation
function animate(time) {
  drawShapes(time);
  drawParticles(time);
  
  // Continuer l'animation
  animationFrame = requestAnimationFrame(animate);
}

/**
 * Fonctions de dessin pour les formes de base
 */

function drawSun(ctx, shape, animFactor, time) {
  const radius = shape.size + animFactor;
  
  // Corps principal
  ctx.fillStyle = shape.color;
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Rayons
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = radius * 0.05;
  
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6 + time * 0.0005;
    const innerRadius = radius * 1.2;
    const outerRadius = radius * 1.8;
    
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(
      shape.x + Math.cos(angle) * innerRadius,
      shape.y + Math.sin(angle) * innerRadius
    );
    ctx.lineTo(
      shape.x + Math.cos(angle) * outerRadius,
      shape.y + Math.sin(angle) * outerRadius
    );
    ctx.stroke();
  }
  
  // Éclat central
  const gradient = ctx.createRadialGradient(
    shape.x, shape.y, 0,
    shape.x, shape.y, radius * 0.8
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, radius * 0.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawField(ctx, shape, animFactor) {
  ctx.fillStyle = shape.color;
  
  // Forme trapézoïdale pour les champs
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.width/2, shape.y - shape.height/2);
  ctx.lineTo(shape.x + shape.width/2, shape.y - shape.height/2);
  ctx.lineTo(shape.x + shape.width/2 + animFactor * 0.5, shape.y + shape.height/2);
  ctx.lineTo(shape.x - shape.width/2 + animFactor * 0.5, shape.y + shape.height/2);
  ctx.closePath();
  ctx.fill();
}

function drawMountain(ctx, shape, animFactor) {
  ctx.fillStyle = shape.color;
  
  // Forme de montagne
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size, shape.y);
  ctx.lineTo(shape.x - shape.size * 0.5, shape.y - shape.size * 0.8 + animFactor * 0.3);
  ctx.lineTo(shape.x, shape.y - shape.size * 1.2 + animFactor * 0.5);
  ctx.lineTo(shape.x + shape.size * 0.5, shape.y - shape.size * 0.7 + animFactor * 0.3);
  ctx.lineTo(shape.x + shape.size, shape.y);
  ctx.closePath();
  ctx.fill();
}

function drawTree(ctx, shape, animFactor) {
  // Tronc
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(
    shape.x - shape.size * 0.1,
    shape.y - shape.size * 0.3,
    shape.size * 0.2,
    shape.size * 0.7
  );
  
  // Feuillage (style cubiste)
  ctx.fillStyle = shape.color;
  
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.5, shape.y - shape.size * 0.3);
  ctx.lineTo(shape.x - shape.size * 0.3, shape.y - shape.size * 0.7 - animFactor * 0.2);
  ctx.lineTo(shape.x, shape.y - shape.size * 1.1 - animFactor * 0.3);
  ctx.lineTo(shape.x + shape.size * 0.3, shape.y - shape.size * 0.7 - animFactor * 0.2);
  ctx.lineTo(shape.x + shape.size * 0.5, shape.y - shape.size * 0.3);
  ctx.closePath();
  ctx.fill();
}

function drawFigure(ctx, shape, animFactor, time, walking = false) {
  ctx.fillStyle = shape.color;
  
  // Tête
  ctx.beginPath();
  ctx.arc(shape.x, shape.y - shape.size * 0.5, shape.size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Corps
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size * 0.3);
  ctx.lineTo(shape.x - shape.size * 0.3, shape.y + shape.size * 0.5);
  ctx.lineTo(shape.x + shape.size * 0.3, shape.y + shape.size * 0.5);
  ctx.closePath();
  ctx.fill();
  
  // Bras et jambes
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size * 0.1;
  
  if (walking) {
    // Animation de marche
    const walkOffset = Math.sin(time * 0.002) * 0.2;
    
    // Bras
    ctx.beginPath();
    ctx.moveTo(shape.x - shape.size * 0.15, shape.y - shape.size * 0.1);
    ctx.lineTo(
      shape.x - shape.size * 0.4,
      shape.y + shape.size * 0.2 + Math.sin(time * 0.002) * shape.size * 0.2
    );
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(shape.x + shape.size * 0.15, shape.y - shape.size * 0.1);
    ctx.lineTo(
      shape.x + shape.size * 0.4,
      shape.y + shape.size * 0.2 + Math.sin(time * 0.002 + Math.PI) * shape.size * 0.2
    );
    ctx.stroke();
    
    // Jambes
    ctx.beginPath();
    ctx.moveTo(shape.x - shape.size * 0.15, shape.y + shape.size * 0.3);
    ctx.lineTo(
      shape.x - shape.size * 0.25,
      shape.y + shape.size * 0.8 + Math.sin(time * 0.002 + Math.PI) * shape.size * 0.15
    );
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(shape.x + shape.size * 0.15, shape.y + shape.size * 0.3);
    ctx.lineTo(
      shape.x + shape.size * 0.25,
      shape.y + shape.size * 0.8 + Math.sin(time * 0.002) * shape.size * 0.15
    );
    ctx.stroke();
  } else {
    // Posture statique
    // Bras
    ctx.beginPath();
    ctx.moveTo(shape.x - shape.size * 0.15, shape.y - shape.size * 0.1);
    ctx.lineTo(shape.x - shape.size * 0.4, shape.y + shape.size * 0.2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(shape.x + shape.size * 0.15, shape.y - shape.size * 0.1);
    ctx.lineTo(shape.x + shape.size * 0.4, shape.y + shape.size * 0.2);
    ctx.stroke();
    
    // Jambes
    ctx.beginPath();
    ctx.moveTo(shape.x - shape.size * 0.15, shape.y + shape.size * 0.3);
    ctx.lineTo(shape.x - shape.size * 0.25, shape.y + shape.size * 0.8);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(shape.x + shape.size * 0.15, shape.y + shape.size * 0.3);
    ctx.lineTo(shape.x + shape.size * 0.25, shape.y + shape.size * 0.8);
    ctx.stroke();
  }
}

function drawThought(ctx, shape, animFactor, time) {
  ctx.fillStyle = shape.color;
  
  // Forme abstraite de pensée
  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.rotation + time * 0.0005);
  
  ctx.beginPath();
  ctx.moveTo(0, -shape.size);
  ctx.lineTo(shape.size, 0);
  ctx.lineTo(0, shape.size);
  ctx.lineTo(-shape.size, 0);
  ctx.closePath();
  ctx.fill();
  
  // Cercle central
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(0, 0, shape.size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawBentFigure(ctx, shape, animFactor) {
  ctx.fillStyle = shape.color;
  
  // Tête (baissée)
  ctx.beginPath();
  ctx.arc(shape.x, shape.y - shape.size * 0.3, shape.size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // Corps courbé
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size * 0.15);
  ctx.quadraticCurveTo(
    shape.x, shape.y,
    shape.x - shape.size * 0.2, shape.y + shape.size * 0.2
  );
  ctx.lineTo(shape.x + shape.size * 0.2, shape.y + shape.size * 0.3);
  ctx.quadraticCurveTo(
    shape.x, shape.y,
    shape.x, shape.y - shape.size * 0.15
  );
  ctx.closePath();
  ctx.fill();
  
  // Jambes
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size * 0.08;
  
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.1, shape.y + shape.size * 0.25);
  ctx.lineTo(shape.x - shape.size * 0.2, shape.y + shape.size * 0.6);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(shape.x + shape.size * 0.1, shape.y + shape.size * 0.25);
  ctx.lineTo(shape.x + shape.size * 0.15, shape.y + shape.size * 0.6);
  ctx.stroke();
}

function drawCrossedHands(ctx, shape, animFactor, time) {
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size * 0.15;
  
  // Animation subtile
  const armOffset = Math.sin(time * 0.001) * shape.size * 0.02;
  
  // Bras avec mains croisées
  // Bras gauche
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size, shape.y - shape.size * 0.3);
  ctx.quadraticCurveTo(
    shape.x - shape.size * 0.3, 
    shape.y,
    shape.x + shape.size * 0.3 + armOffset, 
    shape.y
  );
  ctx.stroke();
  
  // Bras droit
  ctx.beginPath();
  ctx.moveTo(shape.x + shape.size, shape.y - shape.size * 0.3);
  ctx.quadraticCurveTo(
    shape.x + shape.size * 0.3, 
    shape.y,
    shape.x - shape.size * 0.3 + armOffset, 
    shape.y + shape.size * 0.2
  );
  ctx.stroke();
  
  // Mains
  ctx.fillStyle = shape.color;
  
  // Main gauche
  ctx.beginPath();
  ctx.arc(
    shape.x + shape.size * 0.3 + armOffset,
    shape.y,
    shape.size * 0.12,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Main droite
  ctx.beginPath();
  ctx.arc(
    shape.x - shape.size * 0.3 + armOffset,
    shape.y + shape.size * 0.2,
    shape.size * 0.12,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawShadow(ctx, shape, animFactor) {
  // Ombre abstraite
  const gradient = ctx.createRadialGradient(
    shape.x, shape.y, 0,
    shape.x, shape.y, shape.size
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.size + animFactor * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSunset(ctx, shape, animFactor, time) {
  // Coucher de soleil
  const gradient = ctx.createRadialGradient(
    shape.x, shape.y, 0,
    shape.x, shape.y, shape.size
  );
  gradient.addColorStop(0, shape.color);
  gradient.addColorStop(0.7, `${shape.color}80`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.size + animFactor * 0.2, 0, Math.PI);
  ctx.fill();
}

function drawShip(ctx, shape, animFactor, time) {
  ctx.fillStyle = shape.color;
  
  // Coque
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size, shape.y + Math.sin(time * 0.001) * 2);
  ctx.lineTo(shape.x + shape.size, shape.y + Math.sin(time * 0.001) * 2);
  ctx.lineTo(shape.x + shape.size * 0.6, shape.y - shape.size * 0.5 + Math.sin(time * 0.001) * 2);
  ctx.lineTo(shape.x - shape.size * 0.6, shape.y - shape.size * 0.5 + Math.sin(time * 0.001) * 2);
  ctx.closePath();
  ctx.fill();
  
  // Voile
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size * 0.5 + Math.sin(time * 0.001) * 2);
  ctx.lineTo(shape.x, shape.y - shape.size * 2 + Math.sin(time * 0.001) * 2);
  ctx.lineTo(shape.x + shape.size * 0.8, shape.y - shape.size * 0.8 + Math.sin(time * 0.001) * 2);
  ctx.closePath();
  ctx.fill();
}

function drawTomb(ctx, shape, animFactor) {
  ctx.fillStyle = shape.color;
  
  // Base
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.width/2, shape.y - shape.height * 0.1);
  ctx.lineTo(shape.x + shape.width/2, shape.y - shape.height * 0.1);
  ctx.lineTo(shape.x + shape.width/2, shape.y + shape.height * 0.4);
  ctx.lineTo(shape.x - shape.width/2, shape.y + shape.height * 0.4);
  ctx.closePath();
  ctx.fill();
  
  // Pierre tombale
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.width * 0.4, shape.y - shape.height * 0.1);
  ctx.lineTo(shape.x + shape.width * 0.4, shape.y - shape.height * 0.1);
  ctx.lineTo(shape.x + shape.width * 0.3, shape.y - shape.height * 0.8 + animFactor * 0.2);
  ctx.lineTo(shape.x - shape.width * 0.3, shape.y - shape.height * 0.8 + animFactor * 0.2);
  ctx.closePath();
  ctx.fill();
  
  // Ombre
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.width/2, shape.y + shape.height * 0.4);
  ctx.lineTo(shape.x + shape.width/2, shape.y + shape.height * 0.4);
  ctx.lineTo(shape.x + shape.width * 0.7, shape.y + shape.height * 0.6);
  ctx.lineTo(shape.x - shape.width * 0.7, shape.y + shape.height * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawMourningFigure(ctx, shape, animFactor, time) {
  ctx.fillStyle = shape.color;
  
  // Tête
  ctx.beginPath();
  ctx.arc(shape.x, shape.y - shape.size * 0.5, shape.size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // Corps (agenouillé)
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size * 0.35);
  ctx.lineTo(shape.x - shape.size * 0.25, shape.y);
  ctx.lineTo(shape.x - shape.size * 0.35, shape.y + shape.size * 0.3);
  ctx.lineTo(shape.x + shape.size * 0.35, shape.y + shape.size * 0.3);
  ctx.lineTo(shape.x + shape.size * 0.25, shape.y);
  ctx.closePath();
  ctx.fill();
  
  // Bras (tendus vers la tombe)
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size * 0.08;
  
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size * 0.2);
  ctx.lineTo(shape.x + shape.size * 0.5 + animFactor * 0.1, shape.y - shape.size * 0.1);
  ctx.stroke();
}

function drawBouquet(ctx, shape, animFactor, time) {
  // Base du bouquet
  ctx.fillStyle = '#5D4037';
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y);
  ctx.lineTo(shape.x - shape.size * 0.3, shape.y - shape.size * 0.6);
  ctx.lineTo(shape.x + shape.size * 0.3, shape.y - shape.size * 0.6);
  ctx.closePath();
  ctx.fill();
  
  // Houx vert
  ctx.fillStyle = shape.colorHolly || '#2D5F4C';
  
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 0.4 - Math.PI * 0.8 + Math.sin(time * 0.001) * 0.1;
    const x = shape.x + Math.cos(angle) * shape.size * 0.3;
    const y = shape.y - shape.size * 0.5 + Math.sin(angle) * shape.size * 0.2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI * 0.5);
    
    // Feuille de houx
    ctx.beginPath();
    ctx.moveTo(0, -shape.size * 0.2);
    ctx.lineTo(shape.size * 0.1, -shape.size * 0.05);
    ctx.lineTo(shape.size * 0.2, -shape.size * 0.2);
    ctx.lineTo(shape.size * 0.1, 0);
    ctx.lineTo(shape.size * 0.2, shape.size * 0.2);
    ctx.lineTo(0, shape.size * 0.05);
    ctx.lineTo(-shape.size * 0.2, shape.size * 0.2);
    ctx.lineTo(-shape.size * 0.1, 0);
    ctx.lineTo(-shape.size * 0.2, -shape.size * 0.2);
    ctx.lineTo(-shape.size * 0.1, -shape.size * 0.05);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  // Bruyère en fleurs
  ctx.fillStyle = shape.color;
  
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI * 0.25 + Math.sin(time * 0.001 + i) * 0.1;
    const x = shape.x + Math.cos(angle) * shape.size * 0.3;
    const y = shape.y - shape.size * 0.4 + Math.sin(angle) * shape.size * 0.3;
    
    ctx.beginPath();
    ctx.arc(x, y, shape.size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Baies rouges du houx
  ctx.fillStyle = '#D32F2F';
  
  for (let i = 0; i < 3; i++) {
    const angle = i * Math.PI * 0.5 - Math.PI * 0.5;
    const x = shape.x + Math.cos(angle) * shape.size * 0.15;
    const y = shape.y - shape.size * 0.3 + Math.sin(angle) * shape.size * 0.15;
    
    ctx.beginPath();
    ctx.arc(x, y, shape.size * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLight(ctx, shape, animFactor, time) {
  // Effet de lumière
  const gradient = ctx.createRadialGradient(
    shape.x, shape.y, 0,
    shape.x, shape.y, shape.size
  );
  gradient.addColorStop(0, `rgba(255, 255, 255, ${shape.opacity + Math.sin(time * 0.001) * 0.05})`);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.size + animFactor, 0, Math.PI * 2);
  ctx.fill();
}

function drawBarrier(ctx, shape, animFactor, time) {
  ctx.fillStyle = shape.color;
  
  // Appliquer la rotation si définie
  ctx.save();
  ctx.translate(shape.x, shape.y);
  if (shape.angle) {
    ctx.rotate(shape.angle);
  }
  
  // Dessiner la barrière
  ctx.fillRect(
    -shape.width/2, 
    -shape.height/2 + animFactor * 0.5, 
    shape.width, 
    shape.height
  );
  
  // Ajouter des détails
  const stripeCount = 3;
  const stripeHeight = shape.height / (stripeCount * 2);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillRect(
      -shape.width/2,
      -shape.height/2 + i * stripeHeight * 2 + animFactor * 0.5,
      shape.width,
      stripeHeight
    );
  }
  
  ctx.restore();
}

function drawEmotion(ctx, shape, animFactor, time) {
  // Particule d'émotion avec effet de pulsation
  const pulseSize = shape.size * (1 + Math.sin(time * 0.002 + shape.offset) * 0.3);
  
  ctx.fillStyle = shape.color;
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, pulseSize, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Nouvelles fonctions pour La Solitude (améliorées)
 */

function drawThinkerFigure(ctx, shape, animFactor, time) {
  ctx.fillStyle = shape.color;
  
  // Tête penchée (position de réflexion)
  ctx.beginPath();
  ctx.arc(
    shape.x, 
    shape.y - shape.size * 0.5,
    shape.size * 0.18,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Corps légèrement penché
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size * 0.32);
  ctx.lineTo(shape.x - shape.size * 0.35, shape.y + shape.size * 0.3);
  ctx.lineTo(shape.x + shape.size * 0.25, shape.y + shape.size * 0.35);
  ctx.lineTo(shape.x + shape.size * 0.1, shape.y - shape.size * 0.1);
  ctx.closePath();
  ctx.fill();
  
  // Main soutenant la tête (position du penseur)
  ctx.lineWidth = shape.size * 0.08;
  ctx.strokeStyle = shape.color;
  
  // Bras soutenant la tête
  ctx.beginPath();
  ctx.moveTo(shape.x + shape.size * 0.05, shape.y - shape.size * 0.1);
  ctx.quadraticCurveTo(
    shape.x + shape.size * 0.2 + Math.sin(time * 0.001) * shape.size * 0.02,
    shape.y - shape.size * 0.2,
    shape.x - shape.size * 0.05,
    shape.y - shape.size * 0.4
  );
  ctx.stroke();
  
  // Main
  ctx.fillStyle = shape.color;
  ctx.beginPath();
  ctx.arc(
    shape.x - shape.size * 0.05,
    shape.y - shape.size * 0.45,
    shape.size * 0.08,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Autre bras
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.15, shape.y - shape.size * 0.1);
  ctx.quadraticCurveTo(
    shape.x - shape.size * 0.25,
    shape.y + shape.size * 0.1,
    shape.x - shape.size * 0.3,
    shape.y + shape.size * 0.25
  );
  ctx.stroke();
  
  // Jambes
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.2, shape.y + shape.size * 0.3);
  ctx.lineTo(shape.x - shape.size * 0.3, shape.y + shape.size * 0.7);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(shape.x + shape.size * 0.1, shape.y + shape.size * 0.35);
  ctx.lineTo(shape.x + shape.size * 0.2, shape.y + shape.size * 0.7);
  ctx.stroke();
  
  // Subtile animation de respiration
  const breatheFactor = Math.sin(time * 0.001) * shape.size * 0.01;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.ellipse(
    shape.x - shape.size * 0.1, 
    shape.y, 
    shape.size * 0.25 + breatheFactor, 
    shape.size * 0.3 + breatheFactor,
    Math.PI * 0.2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawInwardEyes(ctx, shape, animFactor, time) {
  ctx.fillStyle = shape.color;
  
  // Yeux fermés ou introspectifs
  const blinkFactor = Math.sin(time * 0.0015) > 0.9 ? 1 : 0; // Clignement occasionnel
  
  // Forme de visage abstraite
  ctx.beginPath();
  ctx.ellipse(
    shape.x,
    shape.y,
    shape.size * 0.5,
    shape.size * 0.4,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Sourcils pensifs
  ctx.lineWidth = shape.size * 0.06;
  ctx.strokeStyle = shape.color;
  
  // Sourcil gauche
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.3, shape.y - shape.size * 0.1);
  ctx.quadraticCurveTo(
    shape.x - shape.size * 0.2,
    shape.y - shape.size * 0.25 + animFactor * 0.05,
    shape.x - shape.size * 0.1,
    shape.y - shape.size * 0.15
  );
  ctx.stroke();
  
  // Sourcil droit
  ctx.beginPath();
  ctx.moveTo(shape.x + shape.size * 0.3, shape.y - shape.size * 0.1);
  ctx.quadraticCurveTo(
    shape.x + shape.size * 0.2,
    shape.y - shape.size * 0.25 + animFactor * 0.05,
    shape.x + shape.size * 0.1,
    shape.y - shape.size * 0.15
  );
  ctx.stroke();
  
  // Yeux fermés ou plissés
  ctx.lineWidth = shape.size * 0.03;
  
  // Oeil gauche
  if (blinkFactor === 0) {
    ctx.beginPath();
    ctx.ellipse(
      shape.x - shape.size * 0.2,
      shape.y,
      shape.size * 0.1,
      shape.size * (0.03 + blinkFactor * 0.04),
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(shape.x - shape.size * 0.3, shape.y);
    ctx.lineTo(shape.x - shape.size * 0.1, shape.y);
    ctx.stroke();
  }
  
  // Oeil droit
  if (blinkFactor === 0) {
    ctx.beginPath();
    ctx.ellipse(
      shape.x + shape.size * 0.2,
      shape.y,
      shape.size * 0.1,
      shape.size * (0.03 + blinkFactor * 0.04),
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(shape.x + shape.size * 0.3, shape.y);
    ctx.lineTo(shape.x + shape.size * 0.1, shape.y);
    ctx.stroke();
  }
}

function drawNoSound(ctx, shape, animFactor, time) {
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.size * 0.1;
  
  // Onde sonore barrée (symbole de silence)
  // Cercle externe
  ctx.globalAlpha = shape.opacity;
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.size + animFactor * 0.1, 0, Math.PI * 2);
  ctx.stroke();
  
  // Cercle interne
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.size * 0.6 + animFactor * 0.05, 0, Math.PI * 2);
  ctx.stroke();
  
  // Ligne diagonale (annulation)
  ctx.lineWidth = shape.size * 0.15;
  ctx.beginPath();
  ctx.moveTo(
    shape.x - shape.size - animFactor * 0.1,
    shape.y - shape.size - animFactor * 0.1
  );
  ctx.lineTo(
    shape.x + shape.size + animFactor * 0.1,
    shape.y + shape.size + animFactor * 0.1
  );
  ctx.stroke();
}

/**
 * Nouvelles fonctions pour Le Cheminement (améliorées)
 */

function drawSadExpression(ctx, shape, animFactor, time) {
  ctx.fillStyle = shape.color;
  
  // Visage abstrait
  ctx.beginPath();
  ctx.ellipse(
    shape.x,
    shape.y,
    shape.size * 0.6,
    shape.size * 0.5,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Yeux tristes
  ctx.lineWidth = shape.size * 0.05;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  
  // Oeil gauche
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.3, shape.y - shape.size * 0.1);
  ctx.lineTo(shape.x - shape.size * 0.15, shape.y);
  ctx.stroke();
  
  // Oeil droit
  ctx.beginPath();
  ctx.moveTo(shape.x + shape.size * 0.3, shape.y - shape.size * 0.1);
  ctx.lineTo(shape.x + shape.size * 0.15, shape.y);
  ctx.stroke();
  
  // Bouche triste
  ctx.beginPath();
  ctx.arc(
    shape.x,
    shape.y + shape.size * 0.4,
    shape.size * 0.2,
    Math.PI * 0.1,
    Math.PI * 0.9,
    true
  );
  ctx.stroke();
  
  // Goutte (larme)
  const tearOffset = (Math.sin(time * 0.001) + 1) * shape.size * 0.1;
  
  ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.15, shape.y + shape.size * 0.1);
  ctx.quadraticCurveTo(
    shape.x - shape.size * 0.2,
    shape.y + shape.size * 0.2 + tearOffset,
    shape.x - shape.size * 0.15,
    shape.y + shape.size * 0.3 + tearOffset
  );
  ctx.quadraticCurveTo(
    shape.x - shape.size * 0.1,
    shape.y + shape.size * 0.2 + tearOffset,
    shape.x - shape.size * 0.15,
    shape.y + shape.size * 0.1
  );
  ctx.closePath();
  ctx.fill();
}

function drawDistantFigure(ctx, shape, animFactor, time) {
  // Figure floue et distante
  ctx.fillStyle = shape.color;
  
  // Silhouette simplifiée
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y - shape.size);
  ctx.lineTo(shape.x - shape.size * 0.5, shape.y);
  ctx.lineTo(shape.x - shape.size * 0.3, shape.y + shape.size);
  ctx.lineTo(shape.x + shape.size * 0.3, shape.y + shape.size);
  ctx.lineTo(shape.x + shape.size * 0.5, shape.y);
  ctx.closePath();
  ctx.fill();
  
  // Effet de flou
  ctx.save();
  ctx.shadowColor = shape.color;
  ctx.shadowBlur = 15;
  
  ctx.beginPath();
  ctx.arc(shape.x, shape.y - shape.size * 0.7, shape.size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawAnonymity(ctx, shape, animFactor, time) {
  // Symbole d'anonymat (visage sans traits)
  ctx.fillStyle = shape.color;
  
  // Tête
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, shape.size * 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Corps vague
  ctx.beginPath();
  ctx.moveTo(shape.x - shape.size * 0.4, shape.y);
  ctx.quadraticCurveTo(
    shape.x,
    shape.y + shape.size * 1.2,
    shape.x + shape.size * 0.4,
    shape.y
  );
  ctx.closePath();
  ctx.fill();
  
  // Masque ou visage vide
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.ellipse(
    shape.x,
    shape.y,
    shape.size * 0.4,
    shape.size * 0.5,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Points d'interrogation flottants (signe d'anonymat)
  ctx.fillStyle = shape.color;
  const questionMarkCount = 3;
  
  for (let i = 0; i < questionMarkCount; i++) {
    const angle = (i / questionMarkCount) * Math.PI * 2 + time * 0.0005;
    const distance = shape.size * 0.8;
    const x = shape.x + Math.cos(angle) * distance;
    const y = shape.y + Math.sin(angle) * distance;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Point d'interrogation
    ctx.beginPath();
    ctx.arc(0, shape.size * 0.1, shape.size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.lineWidth = shape.size * 0.05;
    ctx.beginPath();
    ctx.arc(0, -shape.size * 0.05, shape.size * 0.12, Math.PI * 0.5, Math.PI * 1.8, false);
    ctx.stroke();
    
    ctx.restore();
  }
}

// Crée des ondes lors d'un clic
function createRippleEffect(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.width = '100px';
  ripple.style.height = '100px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 1000);
}