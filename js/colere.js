
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const loader = document.querySelector('.loader');
  const gameContainer = document.querySelector('.game-container');
  const introScreen = document.getElementById('intro-screen');
  const startBtn = document.getElementById('start-btn');
  const angerOrb = document.getElementById('anger-orb');
  const energyBurst = document.getElementById('energy-burst');
  const progressRing = document.getElementById('ring-progress');
  const gameUI = document.getElementById('game-ui');
  const scoreDisplay = document.getElementById('score-display');
  const timeDisplay = document.getElementById('time-display');
  const quoteContainer = document.getElementById('quote-container');
  const levelPopup = document.getElementById('level-popup');
  const gameOver = document.getElementById('game-over');
  const finalScore = document.getElementById('final-score');
  const gameOverMessage = document.getElementById('game-over-message');
  const replayBtn = document.getElementById('replay-btn');
  const menuBtn = document.getElementById('menu-btn');
  const menuReturnBtn = document.getElementById('menu-return-btn');
  const scrollDescription = document.getElementById('scroll-description');
  const descriptionPanel = document.getElementById('description-panel');
  const descriptionContent = document.querySelector('.description-content');
  const closeDescriptionBtn = document.getElementById('close-description');
  
  // Variables du jeu
  let gameActive = false;
  let score = 0;
  let angerLevel = 0;
  let maxAngerLevel = 100;
  let angerIncreaseRate = 0.3;
  let clickCooldown = false;
  let comboCount = 0;
  let lastClickTime = 0;
  let level = 1;
  let gameTimer;
  
  // Citations sur la colère
  const quotes = [
    { text: "La colère est un acide qui peut faire plus de mal au récipient dans lequel elle est stockée qu'à tout ce sur quoi elle est déversée.", author: "— Mark Twain" },
    { text: "Dans la colère, l'esprit ferme ses portes et ses fenêtres. La lumière ne peut y entrer, la sagesse ne peut y entrer.", author: "— Dalai Lama" },
    { text: "Contrôler sa colère, c'est prouver que l'on est plus fort que son adversaire.", author: "— Lao Tseu" },
    { text: "La colère nous met souvent dans des situations plus insupportables que celles qui nous provoquent.", author: "— Léonard de Vinci" },
    { text: "La colère commence par la folie et finit par le regret.", author: "— Pythagore" }
  ];
  
  // Initialisation
  function init() {
    // Animation d'entrée pour l'intro
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      gameContainer.style.opacity = '1';
      
      setTimeout(() => {
        document.querySelector('.intro-title').style.opacity = '1';
        document.querySelector('.intro-title').style.transform = 'translateY(0)';
        
        document.querySelector('.intro-desc').style.opacity = '1';
        document.querySelector('.intro-desc').style.transform = 'translateY(0)';
        
        document.querySelector('.start-btn').style.opacity = '1';
        document.querySelector('.start-btn').style.transform = 'translateY(0)';
        
        scrollDescription.style.opacity = '1';
      }, 500);
    }, 2000);
    
    // Créer les particules d'arrière-plan
    createBackgroundParticles();
    
    // Créer les lignes symboliques dans l'orbe
    createSymbolLines();
  }
  
  // Créer des particules d'arrière-plan
  function createBackgroundParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Taille aléatoire
      const size = 2 + Math.random() * 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Position aléatoire
      const x = Math.random() * 100;
      const y = Math.random() * 100 + 100;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      
      // Vitesse aléatoire
      const duration = 10 + Math.random() * 20;
      particle.style.animationDuration = `${duration}s`;
      
      // Délai aléatoire
      const delay = Math.random() * 10;
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  // Créer les lignes symboliques dans l'orbe
  function createSymbolLines() {
    const symbolsContainer = document.querySelector('.anger-symbols');
    const lineCount = 12;
    
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.className = 'symbol-line';
      
      const angle = (i / lineCount) * 360;
      const length = 50 + Math.random() * 40;
      
      line.style.width = `${length}px`;
      line.style.transform = `rotate(${angle}deg)`;
      
      const dot = document.createElement('div');
      dot.className = 'symbol-dot';
      line.appendChild(dot);
      
      symbolsContainer.appendChild(line);
    }
  }
  
  // Démarrer le jeu
  function startGame() {
    gameActive = true;
    score = 0;
    angerLevel = 0;
    level = 1;
    comboCount = 0;
    
    // Masquer l'écran d'intro
    introScreen.style.opacity = '0';
    introScreen.style.pointerEvents = 'none';
    
    // Afficher l'interface de jeu
    gameUI.style.opacity = '1';
    gameUI.style.transform = 'translateY(0)';
    
    // Afficher l'orbe de colère
    angerOrb.style.transform = 'scale(1)';
    angerOrb.style.opacity = '1';
    
    // Masquer le texte de défilement
    scrollDescription.style.opacity = '0';
    
    // Démarrer l'augmentation de la colère
    gameTimer = setInterval(updateAngerLevel, 50);
    
    // Mettre à jour l'affichage
    updateScore();
    updateAngerDisplay();
    
    // Afficher une citation après un délai
    setTimeout(showRandomQuote, 5000);
  }
  
  // Mettre à jour le niveau de colère
  function updateAngerLevel() {
    if (!gameActive) return;
    
    angerLevel += angerIncreaseRate;
    
    // Si la colère atteint son maximum, fin du jeu
    if (angerLevel >= maxAngerLevel) {
      angerLevel = maxAngerLevel;
      endGame();
    }
    
    updateAngerDisplay();
  }
  
  // Mettre à jour l'affichage de la colère
  function updateAngerDisplay() {
    // Mettre à jour l'anneau de progression
    const circumference = 2 * Math.PI * 100;
    const offset = circumference - (angerLevel / maxAngerLevel) * circumference;
    progressRing.style.strokeDashoffset = offset;
    
    // Mettre à jour le compteur de temps/pression
    timeDisplay.textContent = Math.round(maxAngerLevel - angerLevel);
    
    // Changer la couleur selon le niveau
    if (angerLevel > maxAngerLevel * 0.7) {
      progressRing.style.stroke = 'var(--anger-secondary)';
      angerOrb.style.transform = 'scale(1.05)';
    } else {
      progressRing.style.stroke = 'var(--anger-primary)';
      angerOrb.style.transform = 'scale(1)';
    }
  }
  
  // Mettre à jour le score
  function updateScore() {
    scoreDisplay.textContent = score;
  }
  
  // Gérer l'interaction avec l'orbe
  function handleOrbClick() {
    if (!gameActive || clickCooldown) return;
    
    // Appliquer un cooldown pour éviter les clics trop rapides
    clickCooldown = true;
    setTimeout(() => {
      clickCooldown = false;
    }, 300);
    
    // Vérifier le combo
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      comboCount++;
    } else {
      comboCount = 0;
    }
    lastClickTime = now;
    
    // Points de base
    let points = 10 + Math.floor(angerLevel / 2);
    
    // Bonus de combo
    if (comboCount > 0) {
      const comboBonus = comboCount * 15;
      points += comboBonus;
      showComboText(comboBonus);
    }
    
    // Ajouter au score
    score += points;
    updateScore();
    
    // Réduire le niveau de colère (effet aléatoire)
    const reductionEffect = Math.random();
    if (reductionEffect < 0.7) {
      // Réduction normale
      angerLevel = Math.max(0, angerLevel - 15 - Math.random() * 10);
    } else if (reductionEffect < 0.9) {
      // Faible réduction
      angerLevel = Math.max(0, angerLevel - 5 - Math.random() * 5);
    } else {
      // Effet inverse (la colère augmente)
      angerLevel = Math.min(maxAngerLevel, angerLevel + 10 + Math.random() * 5);
      showTextPopup('TENSION!', angerOrb);
    }
    
    // Effets visuels
    createEnergyBurst();
    createChainReaction();
    pulseOrb();
    
    // Progression de niveau
    if (score > level * 1000) {
      levelUp();
    }
    
    // Mettre à jour l'affichage
    updateAngerDisplay();
  }
  
  // Créer une explosion d'énergie
  function createEnergyBurst() {
    // Vider le conteneur d'abord
    energyBurst.innerHTML = '';
    
    const lineCount = 8 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.className = 'energy-line';
      
      const angle = Math.random() * 360;
      line.style.transform = `rotate(${angle}deg)`;
      
      // Délai aléatoire
      const delay = Math.random() * 0.2;
      line.style.animationDelay = `${delay}s`;
      
      energyBurst.appendChild(line);
    }
    
    // Afficher l'explosion
    energyBurst.style.opacity = '1';
    
    // Masquer après l'animation
    setTimeout(() => {
      energyBurst.style.opacity = '0';
    }, 500);
  }
  
  // Créer une réaction en chaîne
  function createChainReaction() {
    const reaction = document.createElement('div');
    reaction.className = 'chain-reaction';
    
    // Taille basée sur l'orbe
    const size = 400;
    reaction.style.width = `${size}px`;
    reaction.style.height = `${size}px`;
    
    // Positionner au centre de l'orbe
    const rect = angerOrb.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    reaction.style.left = `${centerX - size/2}px`;
    reaction.style.top = `${centerY - size/2}px`;
    
    document.body.appendChild(reaction);
    
    // Supprimer après l'animation
    setTimeout(() => {
      if (document.body.contains(reaction)) {
        document.body.removeChild(reaction);
      }
    }, 800);
  }
  
  // Effet de pulsation sur l'orbe
  function pulseOrb() {
    angerOrb.style.transform = 'scale(1.1)';
    setTimeout(() => {
      if (gameActive) {
        angerOrb.style.transform = 'scale(1)';
      }
    }, 150);
  }
  
  // Afficher le texte de combo
  function showComboText(bonus) {
    const text = document.createElement('div');
    text.className = 'text-popup';
    text.textContent = `COMBO x${comboCount} +${bonus}`;
    text.style.fontSize = `${Math.min(2, 1 + comboCount * 0.1)}rem`;
    
    const rect = angerOrb.getBoundingClientRect();
    text.style.left = `${rect.left + rect.width / 2 - 50}px`;
    text.style.top = `${rect.top - 30}px`;
    
    document.body.appendChild(text);
    
    // Supprimer après l'animation
    setTimeout(() => {
      if (document.body.contains(text)) {
        document.body.removeChild(text);
      }
    }, 1000);
  }
  
  // Afficher un texte popup
  function showTextPopup(message, targetElement) {
    const text = document.createElement('div');
    text.className = 'text-popup';
    text.textContent = message;
    
    const rect = targetElement.getBoundingClientRect();
    text.style.left = `${rect.left + rect.width / 2 - 30}px`;
    text.style.top = `${rect.top + rect.height / 2 - 15}px`;
    
    document.body.appendChild(text);
    
    // Supprimer après l'animation
    setTimeout(() => {
      if (document.body.contains(text)) {
        document.body.removeChild(text);
      }
    }, 1000);
  }
  
  // Passer au niveau suivant
  function levelUp() {
    level++;
    
    // Augmenter la difficulté
    angerIncreaseRate = Math.min(1.2, angerIncreaseRate + 0.1);
    
    // Afficher le niveau
    levelPopup.textContent = `NIVEAU ${level}`;
    levelPopup.style.opacity = '1';
    
    setTimeout(() => {
      levelPopup.style.opacity = '0';
    }, 2000);
    
    // Afficher une nouvelle citation
    showRandomQuote();
  }
  
  // Afficher une citation aléatoire
  function showRandomQuote() {
    if (!gameActive) return;
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.querySelector('.quote-text').textContent = randomQuote.text;
    document.querySelector('.quote-author').textContent = randomQuote.author;
    
    quoteContainer.style.opacity = '1';
    
    setTimeout(() => {
      quoteContainer.style.opacity = '0';
    }, 5000);
  }
  
  // Fin du jeu
  function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    
    // Effet d'explosion finale
    angerOrb.style.transform = 'scale(2)';
    angerOrb.style.opacity = '0';
    
    createChainReaction();
    
    // Afficher le score final
    finalScore.textContent = score;
    
    // Message personnalisé
    let message;
    if (score < 1000) {
      message = "Vous avez découvert la puissance brute de la colère. Comme toute émotion intense, elle doit être apprivoisée pour ne pas nous submerger.";
    } else if (score < 3000) {
      message = "Vous avez montré une certaine maîtrise de la colère, cette force qui peut être destructrice ou constructive selon comment nous l'accueillons.";
    } else {
      message = "Votre maîtrise de la colère est impressionnante. Vous avez compris que cette énergie, lorsqu'elle est canalisée, peut devenir un puissant catalyseur de transformation.";
    }
    
    gameOverMessage.textContent = message;
    
    // Afficher l'écran de fin de jeu après un court délai
    setTimeout(() => {
      gameOver.style.opacity = '1';
      gameOver.style.pointerEvents = 'auto';
      
      // Réafficher le texte de défilement
      setTimeout(() => {
        scrollDescription.style.opacity = '1';
      }, 1000);
    }, 1000);
  }
  
  // Afficher la description
  function showDescription() {
    descriptionPanel.style.bottom = '0';
    
    setTimeout(() => {
      descriptionContent.style.opacity = '1';
      descriptionContent.style.transform = 'translateY(0)';
    }, 300);
    
    scrollDescription.style.opacity = '0';
  }
  
  // Masquer la description
  function hideDescription() {
    descriptionContent.style.opacity = '0';
    descriptionContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      descriptionPanel.style.bottom = '-100%';
      
      // Réafficher le texte de défilement si pas en jeu
      if (!gameActive || gameOver.style.opacity === '1') {
        scrollDescription.style.opacity = '1';
      }
    }, 300);
  }
  
  // Rejouer
  function replay() {
    gameOver.style.opacity = '0';
    gameOver.style.pointerEvents = 'none';
    
    setTimeout(() => {
      startGame();
    }, 500);
  }
  
  // Navigation vers le menu principal
  function goToMenu() {
    window.location.href = 'menu.html';
  }
  
  // Event listeners
  startBtn.addEventListener('click', startGame);
  angerOrb.addEventListener('click', handleOrbClick);
  replayBtn.addEventListener('click', replay);
  menuBtn.addEventListener('click', goToMenu);
  menuReturnBtn.addEventListener('click', goToMenu);
  
  // Défilement vers la description
  scrollDescription.addEventListener('click', showDescription);
  
  document.addEventListener('wheel', function(e) {
    if (e.deltaY > 0 && scrollDescription.style.opacity !== '0') {
      showDescription();
    }
  });
  
  closeDescriptionBtn.addEventListener('click', hideDescription);
  
  // Initialiser
  init();
});
