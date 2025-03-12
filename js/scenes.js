/**
 * Définition des scènes pour l'animation cubiste de "Demain, dès l'aube..."
 * Contient les données des scènes et les fonctions spécifiques pour chaque visualisation
 */

// Données des scènes
const sceneData = [
    {
      title: "L'Aube",
      lines: [
        "Demain, dès l'aube, à l'heure où blanchit la campagne,",
        "Je partirai. Vois-tu, je sais que tu m'attends."
      ],
      background: "#1A1A2E",
      primary: "#3B4D7B",
      secondary: "#A68DAD",
      accent: "#F7C59F"
    },
    {
      title: "Le Voyage",
      lines: [
        "J'irai par la forêt, j'irai par la montagne.",
        "Je ne puis demeurer loin de toi plus longtemps."
      ],
      background: "#1E2639",
      primary: "#2C5F60",
      secondary: "#68A691",
      accent: "#E0AB94"
    },
    {
      title: "La Solitude",
      lines: [
        "Je marcherai les yeux fixés sur mes pensées,",
        "Sans rien voir au dehors, sans entendre aucun bruit,"
      ],
      background: "#232331",
      primary: "#455561",
      secondary: "#7B6D8D",
      accent: "#D8B4A0"
    },
    {
      title: "Le Cheminement",
      lines: [
        "Seul, inconnu, le dos courbé, les mains croisées,",
        "Triste, et le jour pour moi sera comme la nuit."
      ],
      background: "#28293D",
      primary: "#484D6D",
      secondary: "#8A817C",
      accent: "#BCB6FF"
    },
    {
      title: "L'Indifférence",
      lines: [
        "Je ne regarderai ni l'or du soir qui tombe,",
        "Ni les voiles au loin descendant vers Harfleur,"
      ],
      background: "#2A2B3D",
      primary: "#5E4B56",
      secondary: "#9C8CB0",
      accent: "#F1AB86"
    },
    {
      title: "L'Arrivée",
      lines: [
        "Et quand j'arriverai, je mettrai sur ta tombe",
        "Un bouquet de houx vert et de bruyère en fleur."
      ],
      background: "#1D1D2C",
      primary: "#58355E",
      secondary: "#7D6B7D",
      accent: "#D8A7B0"
    }
  ];
  
  /**
   * Fonctions pour générer des formes spécifiques à chaque scène
   */
  
  // Génération des formes pour chaque scène
  function generateShapes() {
    shapes = [];
    const scene = sceneData[currentSceneIndex];
    
    // Différentes formes selon la scène
    switch(currentSceneIndex) {
      case 0: // L'Aube
        generateDawnShapes(scene);
        break;
      case 1: // Le Voyage
        generateJourneyShapes(scene);
        break;
      case 2: // La Solitude - AMÉLIORÉ
        generateSolitudeShapes(scene);
        break;
      case 3: // Le Cheminement - AMÉLIORÉ
        generateWalkingShapes(scene);
        break;
      case 4: // L'Indifférence
        generateIndifferenceShapes(scene);
        break;
      case 5: // L'Arrivée
        generateArrivalShapes(scene);
        break;
    }
  }
  
  // L'Aube
  function generateDawnShapes(scene) {
    // Soleil
    shapes.push({
      type: 'sun',
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.3,
      size: window.innerWidth * 0.15,
      color: scene.accent,
      offset: Math.random() * Math.PI * 2
    });
    
    // Champs (horizon)
    for (let i = 0; i < 10; i++) {
      shapes.push({
        type: 'field',
        x: window.innerWidth * Math.random(),
        y: window.innerHeight * (0.6 + Math.random() * 0.3),
        width: window.innerWidth * (0.1 + Math.random() * 0.2),
        height: window.innerHeight * 0.1,
        color: Math.random() < 0.5 ? scene.primary : scene.secondary,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    // Effet de blanchiment sur l'horizon
    for (let i = 0; i < 15; i++) {
      shapes.push({
        type: 'light',
        x: window.innerWidth * Math.random(),
        y: window.innerHeight * 0.6 + Math.random() * 30 - 15,
        size: window.innerWidth * (0.03 + Math.random() * 0.05),
        color: '#FFFFFF',
        opacity: Math.random() * 0.3 + 0.1,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
  
  // Le Voyage
  function generateJourneyShapes(scene) {
    // Montagnes
    for (let i = 0; i < 5; i++) {
      shapes.push({
        type: 'mountain',
        x: window.innerWidth * (0.2 + i * 0.15),
        y: window.innerHeight * 0.5,
        size: window.innerWidth * (0.1 + Math.random() * 0.1),
        color: i % 2 === 0 ? scene.primary : scene.secondary,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    // Arbres (forêt)
    for (let i = 0; i < 8; i++) {
      shapes.push({
        type: 'tree',
        x: window.innerWidth * (0.1 + i * 0.1),
        y: window.innerHeight * 0.7,
        size: window.innerHeight * (0.1 + Math.random() * 0.1),
        color: scene.accent,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    // Figure qui marche
    shapes.push({
      type: 'figure',
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.65,
      size: window.innerWidth * 0.08,
      color: scene.primary,
      offset: 0,
      walking: true
    });
  }
  
  // La Solitude - AMÉLIORÉ
  function generateSolitudeShapes(scene) {
    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.5;
    
    // Cercle intérieur des pensées (plus complexe)
    const thoughtCircleRadius = window.innerWidth * 0.25;
    const thoughtCount = 30; // Plus de pensées
    
    // Figure centrale plus expressive
    shapes.push({
      type: 'thinkerFigure', // Nouveau type pour un penseur plus expressif
      x: centerX,
      y: centerY * 1.2,
      size: window.innerWidth * 0.15,
      color: scene.primary,
      offset: 0
    });
    
    // Yeux fermés ou introspectifs
    shapes.push({
      type: 'inwardEyes',
      x: centerX,
      y: centerY * 0.9,
      size: window.innerWidth * 0.1,
      color: scene.primary,
      offset: 0
    });
    
    // Spirale de pensées (pour montrer l'introspection)
    for (let i = 0; i < thoughtCount; i++) {
      const angle = (i / thoughtCount) * Math.PI * 6; // Spirale
      const radiusFactor = 0.3 + (i / thoughtCount) * 0.7;
      const distance = thoughtCircleRadius * radiusFactor;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY * 0.8 + Math.sin(angle) * distance * 0.6;
      const size = window.innerWidth * (0.01 + (i / thoughtCount) * 0.04);
      
      shapes.push({
        type: 'thought',
        x, y, size,
        color: i % 3 === 0 ? scene.accent : (i % 2 === 0 ? scene.secondary : scene.primary),
        opacity: 0.8 - (i / thoughtCount) * 0.5,
        offset: angle,
        rotation: angle * 2
      });
    }
    
    // Barrières visuelles (représentant l'isolation du monde extérieur)
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = window.innerWidth * 0.4 + Math.random() * window.innerWidth * 0.2;
      
      shapes.push({
        type: 'barrier',
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        width: window.innerWidth * 0.08,
        height: window.innerHeight * (0.1 + Math.random() * 0.2),
        color: scene.background,
        opacity: 0.7,
        angle: angle + Math.PI/2,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    // Symboles de "sans entendre aucun bruit"
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const distance = window.innerWidth * 0.35;
      
      shapes.push({
        type: 'noSound',
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: window.innerWidth * 0.03,
        color: scene.secondary,
        opacity: 0.4,
        offset: angle
      });
    }
  }
  
  // Le Cheminement - AMÉLIORÉ
  function generateWalkingShapes(scene) {
    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.5;
    
    // Figure courbée centrale plus expressive
    shapes.push({
      type: 'bentFigure',
      x: centerX,
      y: centerY * 1.1,
      size: window.innerWidth * 0.2,
      color: scene.primary,
      opacity: 0.95,
      offset: 0
    });
    
    // Mains croisées détaillées
    shapes.push({
      type: 'crossedHands',
      x: centerX,
      y: centerY * 1.3,
      size: window.innerWidth * 0.12,
      color: scene.primary,
      opacity: 0.9,
      offset: 0
    });
    
    // Expression de tristesse
    shapes.push({
      type: 'sadExpression',
      x: centerX,
      y: centerY * 0.85,
      size: window.innerWidth * 0.08,
      color: scene.primary,
      opacity: 0.85,
      offset: 0
    });
    
    // Ombres plus nombreuses (la nuit)
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * window.innerWidth * 0.4;
      
      shapes.push({
        type: 'shadow',
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: window.innerWidth * (0.05 + Math.random() * 0.1),
        color: scene.background,
        opacity: Math.random() * 0.5 + 0.2,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    // Solitude (personnes floues et distantes)
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      const distance = window.innerWidth * 0.35;
      
      shapes.push({
        type: 'distantFigure',
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: window.innerWidth * 0.04,
        color: scene.secondary,
        opacity: 0.3,
        offset: angle
      });
    }
    
    // Symboles d'anonymat ("inconnu")
    shapes.push({
      type: 'anonymity',
      x: centerX,
      y: centerY * 0.6,
      size: window.innerWidth * 0.1,
      color: scene.accent,
      opacity: 0.5,
      offset: 0
    });
  }
  
  // L'Indifférence
  function generateIndifferenceShapes(scene) {
    const centerX = window.innerWidth * 0.5;
    const horizonY = window.innerHeight * 0.6;
    
    // Figure qui marche
    shapes.push({
      type: 'figure',
      x: centerX * 0.6,
      y: horizonY,
      size: window.innerWidth * 0.1,
      color: scene.primary,
      opacity: 0.9,
      offset: 0,
      walking: true
    });
    
    // Coucher de soleil (ignoré)
    shapes.push({
      type: 'sunset',
      x: centerX * 1.4,
      y: window.innerHeight * 0.3,
      size: window.innerWidth * 0.15,
      color: scene.accent,
      opacity: 0.3, // Atténué car ignoré
      offset: 0
    });
    
    // Voiles (Harfleur)
    for (let i = 0; i < 3; i++) {
      const x = window.innerWidth * (0.7 + i * 0.1);
      const y = window.innerHeight * 0.5;
      
      shapes.push({
        type: 'ship',
        x, y,
        size: window.innerWidth * 0.05,
        color: scene.secondary,
        opacity: 0.25, // Atténué car ignoré
        offset: i * Math.PI / 4
      });
    }
    
    // Barrière entre la figure et les beautés ignorées
    for (let i = 0; i < 5; i++) {
      shapes.push({
        type: 'barrier',
        x: centerX,
        y: horizonY * (0.7 + i * 0.15),
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.02,
        color: scene.primary,
        opacity: 0.5 - i * 0.08,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
  
  // L'Arrivée
  function generateArrivalShapes(scene) {
    const centerX = window.innerWidth * 0.5;
    const groundY = window.innerHeight * 0.65;
    
    // Tombe
    shapes.push({
      type: 'tomb',
      x: centerX,
      y: groundY,
      width: window.innerWidth * 0.18,
      height: window.innerHeight * 0.25,
      color: scene.secondary,
      offset: 0
    });
    
    // Figure en deuil
    shapes.push({
      type: 'mourningFigure',
      x: centerX - window.innerWidth * 0.1,
      y: groundY,
      size: window.innerWidth * 0.1,
      color: scene.primary,
      offset: 0
    });
    
    // Bouquet
    shapes.push({
      type: 'bouquet',
      x: centerX + window.innerWidth * 0.05,
      y: groundY - window.innerHeight * 0.05,
      size: window.innerWidth * 0.06,
      color: scene.accent,
      colorHolly: '#2D5F4C',
      offset: 0
    });
    
    // Particules d'émotion
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * window.innerWidth * 0.3;
      
      shapes.push({
        type: 'emotion',
        x: centerX + Math.cos(angle) * distance,
        y: groundY - window.innerHeight * 0.1 + Math.sin(angle) * distance * 0.5,
        size: window.innerWidth * (0.005 + Math.random() * 0.015),
        color: i % 3 === 0 ? scene.accent : scene.secondary,
        opacity: Math.random() * 0.6 + 0.4,
        offset: Math.random() * Math.PI * 2
      });
    }
  }