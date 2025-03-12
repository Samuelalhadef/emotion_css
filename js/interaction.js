/**
 * Système d'interaction pour déplacer les formes
 * Ajoute l'interactivité à l'animation cubiste de "Demain, dès l'aube..."
 */

// Variables globales pour l'interaction
let isDragging = false;
let selectedShape = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let hoverShape = null;
let interactionEnabled = true; // Flag pour activer/désactiver l'interaction

// Fonction pour activer/désactiver l'interactivité
function toggleInteraction() {
  interactionEnabled = !interactionEnabled;
  
  // Réinitialiser les états si on désactive
  if (!interactionEnabled) {
    isDragging = false;
    selectedShape = null;
    hoverShape = null;
  }
  
  // Ajouter un indicateur visuel
  const interactionIndicator = document.getElementById('interaction-indicator') || createInteractionIndicator();
  interactionIndicator.textContent = interactionEnabled ? "Mode interactif: ON 🖐️" : "Mode interactif: OFF 👁️";
  interactionIndicator.classList.toggle('active', interactionEnabled);
}

// Créer un indicateur visuel du mode d'interaction
function createInteractionIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'interaction-indicator';
  indicator.className = 'interaction-indicator';
  indicator.style.position = 'fixed';
  indicator.style.top = '20px';
  indicator.style.left = '20px';
  indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  indicator.style.color = 'white';
  indicator.style.padding = '8px 12px';
  indicator.style.borderRadius = '4px';
  indicator.style.fontSize = '14px';
  indicator.style.fontFamily = 'sans-serif';
  indicator.style.zIndex = '1000';
  indicator.style.cursor = 'pointer';
  indicator.style.transition = 'background-color 0.3s, transform 0.2s';
  indicator.textContent = interactionEnabled ? "Mode interactif: ON 🖐️" : "Mode interactif: OFF 👁️";
  indicator.classList.toggle('active', interactionEnabled);
  
  // Ajouter un écouteur pour basculer le mode
  indicator.addEventListener('click', function() {
    toggleInteraction();
    // Jouer un son quand on change de mode
    playInteractionSound('strong-click');
  });
  
  document.body.appendChild(indicator);
  return indicator;
}

// Fonction pour vérifier si un point est à l'intérieur d'une forme
function isPointInShape(x, y, shape) {
  // Vérifier en fonction du type de forme
  switch (shape.type) {
    case 'sun':
    case 'emotion':
    case 'thought':
      // Pour les formes circulaires, vérifier la distance
      const dx = x - shape.x;
      const dy = y - shape.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= shape.size;
      
    case 'field':
    case 'barrier':
    case 'tomb':
      // Pour les formes rectangulaires
      return x >= shape.x - shape.width/2 && 
             x <= shape.x + shape.width/2 && 
             y >= shape.y - shape.height/2 && 
             y <= shape.y + shape.height/2;
      
    case 'figure':
    case 'bentFigure':
    case 'thinkerFigure':
    case 'mourningFigure':
    case 'distantFigure':
      // Pour les figures humaines, utiliser un rayon approximatif
      const figureRadius = shape.size * 1.2;
      const dfx = x - shape.x;
      const dfy = y - shape.y;
      return Math.sqrt(dfx * dfx + dfy * dfy) <= figureRadius;
      
    case 'mountain':
    case 'tree':
      // Pour les formes triangulaires, utiliser une approximation rectangulaire
      return x >= shape.x - shape.size && 
             x <= shape.x + shape.size && 
             y >= shape.y - shape.size * 1.2 && 
             y <= shape.y + shape.size * 0.5;
      
    case 'bouquet':
    case 'crossedHands':
    case 'sadExpression':
    case 'inwardEyes':
    case 'noSound':
    case 'anonymity':
    case 'shadow':
    case 'sunset':
    case 'ship':
    case 'light':
      // Pour les autres formes, utiliser une approximation circulaire
      const dox = x - shape.x;
      const doy = y - shape.y;
      return Math.sqrt(dox * dox + doy * doy) <= shape.size * 1.5;
      
    default:
      // Par défaut, utiliser une distance arbitraire
      const dsx = x - shape.x;
      const dsy = y - shape.y;
      return Math.sqrt(dsx * dsx + dsy * dsy) <= (shape.size || 50);
  }
}

// Fonction pour trouver la forme sous la souris
function findShapeAtPosition(x, y) {
  if (!shapes || !interactionEnabled) return null;
  
  // Parcourir les formes en ordre inverse (formes dessinées en dernier = dessus)
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (isPointInShape(x, y, shapes[i])) {
      return shapes[i];
    }
  }
  
  return null;
}

// Gestionnaire pour le début du déplacement
function startDrag(e) {
  if (!interactionEnabled) return;
  
  // Obtenir les coordonnées du clic
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);
  
  // Trouver la forme sous la souris
  const shape = findShapeAtPosition(x, y);
  
  if (shape) {
    selectedShape = shape;
    isDragging = true;
    
    // Calculer l'offset pour que le déplacement soit relatif au point de clic
    dragOffsetX = x - shape.x;
    dragOffsetY = y - shape.y;
    
    // Jouer un son de sélection
    playInteractionSound('click');
    
    // Mettre à jour le style du curseur
    document.body.style.cursor = 'grabbing';
  }
}

// Gestionnaire pour le déplacement
function drag(e) {
  // Mettre à jour le survol pour l'effet visuel
  updateHoverEffect(e);
  
  if (!isDragging || !selectedShape || !interactionEnabled) return;
  
  // Empêcher la sélection de texte pendant le déplacement
  e.preventDefault();
  
  // Obtenir les coordonnées
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);
  
  // Mettre à jour la position de la forme
  selectedShape.x = x - dragOffsetX;
  selectedShape.y = y - dragOffsetY;
  
  // Jouer un son subtil pendant le déplacement (occasionnellement)
  if (Math.random() < 0.05) {
    playInteractionSound('hover');
  }
}

// Gestionnaire pour la fin du déplacement
function endDrag() {
  if (isDragging && selectedShape) {
    // Jouer un son de relâchement
    playInteractionSound('click');
  }
  
  isDragging = false;
  selectedShape = null;
  
  // Restaurer le style du curseur
  document.body.style.cursor = 'default';
}

// Gestionnaire pour l'effet de survol
function updateHoverEffect(e) {
  if (!interactionEnabled) {
    if (hoverShape) {
      hoverShape = null;
      document.body.style.cursor = 'default';
    }
    return;
  }
  
  // Obtenir les coordonnées
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);
  
  // Trouver la forme sous la souris
  const shape = findShapeAtPosition(x, y);
  
  // Mettre à jour la forme survolée
  if (shape !== hoverShape) {
    // Si on entre sur une nouvelle forme
    if (shape && !isDragging) {
      hoverShape = shape;
      document.body.style.cursor = 'grab';
      
      // Jouer un son de survol
      playInteractionSound('hover');
    } 
    // Si on quitte une forme
    else if (!shape && hoverShape && !isDragging) {
      hoverShape = null;
      document.body.style.cursor = 'default';
    }
  }
}

// Fonction pour dessiner des effets visuels autour de la forme sélectionnée/survolée
function drawInteractionEffects(ctx, time) {
  if (!interactionEnabled) return;
  
  // Dessiner l'effet de survol
  if (hoverShape && !isDragging) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = time * 0.01; // Animation de la ligne pointillée
    
    // Dessiner un contour selon la forme
    if (hoverShape.size) {
      ctx.beginPath();
      ctx.arc(hoverShape.x, hoverShape.y, hoverShape.size * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (hoverShape.width && hoverShape.height) {
      ctx.strokeRect(
        hoverShape.x - hoverShape.width/2 - 5, 
        hoverShape.y - hoverShape.height/2 - 5, 
        hoverShape.width + 10, 
        hoverShape.height + 10
      );
    }
    
    ctx.restore();
  }
  
  // Dessiner l'effet de sélection pendant le déplacement
  if (selectedShape && isDragging) {
    ctx.save();
    
    // Effet de pulsation
    const pulseScale = 1 + Math.sin(time * 0.01) * 0.05;
    
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // Doré
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    
    // Effet de sélection selon la forme
    if (selectedShape.size) {
      ctx.beginPath();
      ctx.arc(
        selectedShape.x, 
        selectedShape.y, 
        selectedShape.size * 1.3 * pulseScale, 
        0, 
        Math.PI * 2
      );
      ctx.stroke();
      
      // Points de contrôle aux angles
      drawControlPoints(ctx, selectedShape.x, selectedShape.y, selectedShape.size * 1.3);
    } else if (selectedShape.width && selectedShape.height) {
      const width = selectedShape.width * pulseScale;
      const height = selectedShape.height * pulseScale;
      
      ctx.strokeRect(
        selectedShape.x - width/2,
        selectedShape.y - height/2,
        width, 
        height
      );
      
      // Points de contrôle aux coins
      drawRectControlPoints(ctx, selectedShape);
    }
    
    ctx.restore();
  }
}

// Dessiner des points de contrôle autour d'une forme circulaire
function drawControlPoints(ctx, x, y, radius) {
  const pointRadius = 4;
  const points = 4; // Nombre de points de contrôle
  
  ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Doré
  
  for (let i = 0; i < points; i++) {
    const angle = (i * Math.PI * 2) / points;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.arc(px, py, pointRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Dessiner des points de contrôle aux coins d'un rectangle
function drawRectControlPoints(ctx, shape) {
  const pointRadius = 4;
  const halfWidth = shape.width / 2;
  const halfHeight = shape.height / 2;
  const x = shape.x;
  const y = shape.y;
  
  ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Doré
  
  // Coin supérieur gauche
  ctx.beginPath();
  ctx.arc(x - halfWidth, y - halfHeight, pointRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Coin supérieur droit
  ctx.beginPath();
  ctx.arc(x + halfWidth, y - halfHeight, pointRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Coin inférieur gauche
  ctx.beginPath();
  ctx.arc(x - halfWidth, y + halfHeight, pointRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Coin inférieur droit
  ctx.beginPath();
  ctx.arc(x + halfWidth, y + halfHeight, pointRadius, 0, Math.PI * 2);
  ctx.fill();
}

// Fonction pour initialiser l'interactivité
function initInteraction() {
  // Créer l'indicateur d'interactivité
  createInteractionIndicator();
  
  // Initialiser la touche I pour activer/désactiver l'interactivité
  document.addEventListener('keydown', function(e) {
    if (e.key === 'i' || e.key === 'I') {
      toggleInteraction();
    }
  });
  
  // Ajouter les écouteurs d'événements pour la souris
  document.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  // Ajouter les écouteurs d'événements pour le tactile
  document.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', endDrag);
  
  console.log("Système d'interaction initialisé");
}

// Initialiser le système au chargement du document
document.addEventListener('DOMContentLoaded', initInteraction);