/**
 * ======================================
 * ANIMATION DE DÉGOÛT
 * ======================================
 */
let foodPlate = null;
let flies = [];

// Fonction pour réinitialiser l'histoire de dégoût
function resetDegoutStory() {
    try {
        // Suppression de l'assiette de nourriture si elle existe
        if (foodPlate && foodPlate.element && foodPlate.element.parentNode) {
            foodPlate.element.parentNode.removeChild(foodPlate.element);
            foodPlate = null;
        }
        
        // Suppression des mouches
        flies.forEach(fly => {
            if (fly && fly.element && fly.element.parentNode) {
                fly.element.parentNode.removeChild(fly.element);
            }
        });
        flies = [];
    } catch (error) {
        console.error("Erreur dans resetDegoutStory:", error);
    }
}

// Fonction auxiliaire pour créer les mouches
function createFlies(container, foodPlate) {
    try {
        if (!container || !foodPlate) return;
        
        flies = []; // Réinitialiser le tableau de mouches
        
        for (let i = 0; i < 10; i++) {
            const fly = document.createElement('div');
            fly.className = 'fly';
            container.appendChild(fly);
            
            flies.push({
                element: fly,
                x: foodPlate.x + (Math.random() - 0.5) * 100,
                y: foodPlate.y + (Math.random() - 0.5) * 100,
                angle: Math.random() * Math.PI * 2,
                speed: 1 + Math.random() * 2,
                phaseOffset: Math.random() * Math.PI * 2,
                circleRadius: 20 + Math.random() * 60,
                baseX: foodPlate.x,
                baseY: foodPlate.y,
                size: 5 + Math.random() * 5,
                active: false
            });
        }
    } catch (error) {
        console.error("Erreur dans createFlies:", error);
    }
}

function initDegoutCanvas() {
    try {
        const canvas = document.getElementById('degout-canvas');
        if (!canvas) {
            console.error("Canvas degout non trouvé");
            updateLoadingProgress(); // Continuer malgré l'erreur
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('degout');
        
        // Définition du canvas à pleine taille
        function resizeCanvas() {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Création de blobs pour l'arrière-plan
        const blobs = [];
        const blobCount = 10;
        
        for (let i = 0; i < blobCount; i++) {
            blobs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 40 + Math.random() * 60,
                color: `rgba(${100 + Math.random() * 50}, ${150 + Math.random() * 50}, ${0 + Math.random() * 30}, ${0.1 + Math.random() * 0.3})`,
                points: [],
                pointCount: 6 + Math.floor(Math.random() * 4),
                speed: 0.3 + Math.random() * 0.7,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                pulseSpeed: 0.5 + Math.random() * 1.5
            });
        }
        
        for (let blob of blobs) {
            for (let i = 0; i < blob.pointCount; i++) {
                const angle = (i / blob.pointCount) * Math.PI * 2;
                const randomRadius = blob.radius * (0.7 + Math.random() * 0.6);
                
                blob.points.push({
                    angle: angle,
                    radius: randomRadius,
                    originalRadius: randomRadius,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }
        
        // Création du personnage
        const character = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: 80,
            eyeSize: 15,
            mouthWidth: 30,
            mouthHeight: 10,
            eyebrowAngle: Math.PI * 0.1,
            blinkTimer: 0,
            targetX: canvas.width * 0.7,
            targetY: canvas.height * 0.5,
            disgustLevel: 0, // 0 = neutre, 3 = dégoût extrême
            moveSpeed: 0.04
        };
        
        // Création de l'assiette de nourriture
        if (container) {
            foodPlate = {
                element: document.createElement('div'),
                x: canvas.width * 0.3,
                y: canvas.height * 0.5,
                phase: 0,
                rottenLevel: 0
            };
            
            foodPlate.element.className = 'food-plate';
            
            const food = document.createElement('div');
            food.className = 'food';
            foodPlate.element.appendChild(food);
            
            foodPlate.element.style.left = `${foodPlate.x - 100}px`;
            foodPlate.element.style.top = `${foodPlate.y - 100}px`;
            container.appendChild(foodPlate.element);
            
            // Création des mouches
            createFlies(container, foodPlate);
        }
        
        function drawBlob(blob, time) {
            try {
                if (!ctx) return;
                
                ctx.fillStyle = blob.color;
                ctx.beginPath();
                
                // Mise à jour des points
                for (let i = 0; i < blob.pointCount; i++) {
                    const point = blob.points[i];
                    point.radius = point.originalRadius + 
                        Math.sin(time * 0.001 * blob.pulseSpeed + point.pulsePhase) * (point.originalRadius * 0.3);
                }
                
                // Dessin du blob
                for (let i = 0; i <= blob.pointCount; i++) {
                    const point = blob.points[i % blob.pointCount];
                    const angle = point.angle + blob.angle;
                    
                    const x = blob.x + Math.cos(angle) * point.radius;
                    const y = blob.y + Math.sin(angle) * point.radius;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        const prevPoint = blob.points[(i - 1) % blob.pointCount];
                        const prevAngle = prevPoint.angle + blob.angle;
                        const prevX = blob.x + Math.cos(prevAngle) * prevPoint.radius;
                        const prevY = blob.y + Math.sin(prevAngle) * prevPoint.radius;
                        
                        const cpX = (x + prevX) / 2;
                        const cpY = (y + prevY) / 2;
                        
                        ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
                    }
                }
                
                ctx.fill();
            } catch (error) {
                console.error("Erreur dans drawBlob:", error);
            }
        }
        
        function drawCharacter(time) {
            try {
                if (!ctx) return;
                
                // Tête
                const skinHue = Math.max(0, 48 - character.disgustLevel * 8);
                ctx.fillStyle = `hsl(${skinHue}, 80%, 80%)`;
                ctx.beginPath();
                ctx.arc(character.x, character.y, character.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Yeux
                const blinkAmount = Math.max(0, 1 - Math.abs(character.blinkTimer - 50) / 10);
                const eyeHeight = character.eyeSize * (1 - blinkAmount * 0.9);
                
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.ellipse(
                    character.x - character.size * 0.3, 
                    character.y - character.size * 0.2, 
                    character.eyeSize, 
                    eyeHeight, 
                    0, 0, Math.PI * 2
                );
                ctx.ellipse(
                    character.x + character.size * 0.3, 
                    character.y - character.size * 0.2, 
                    character.eyeSize, 
                    eyeHeight, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                
                // Pupilles - regarder ailleurs à mesure que le dégoût augmente
                if (blinkAmount < 0.8) {
                    ctx.fillStyle = '#304030';
                    
                    // Direction du regard dépend du niveau de dégoût
                    const gazeDirection = Math.min(1, character.disgustLevel * 0.3) * 10;
                    
                    ctx.beginPath();
                    ctx.arc(
                        character.x - character.size * 0.3 - gazeDirection, 
                        character.y - character.size * 0.2, 
                        character.eyeSize * 0.5, 
                        0, Math.PI * 2
                    );
                    ctx.arc(
                        character.x + character.size * 0.3 - gazeDirection, 
                        character.y - character.size * 0.2, 
                        character.eyeSize * 0.5, 
                        0, Math.PI * 2
                    );
                    ctx.fill();
                }
                
                // Sourcils - s'inclinent vers le haut à mesure que le dégoût augmente
                const eyebrowDisgustAngle = character.eyebrowAngle + character.disgustLevel * 0.05;
                
                ctx.fillStyle = `hsl(${skinHue - 20}, 60%, 50%)`;
                ctx.save();
                
                ctx.translate(character.x - character.size * 0.3, character.y - character.size * 0.35);
                ctx.rotate(-eyebrowDisgustAngle);
                ctx.fillRect(-character.size * 0.25, -character.size * 0.05, character.size * 0.5, character.size * 0.1);
                ctx.restore();
                
                ctx.save();
                ctx.translate(character.x + character.size * 0.3, character.y - character.size * 0.35);
                ctx.rotate(eyebrowDisgustAngle);
                ctx.fillRect(-character.size * 0.25, -character.size * 0.05, character.size * 0.5, character.size * 0.1);
                ctx.restore();
                
                // Bouche (expression dégoûtée) - plus inclinée vers le bas avec le dégoût
                const mouthDisgustAmount = 0.2 + character.disgustLevel * 0.3;
                
                ctx.fillStyle = '#d04040';
                ctx.beginPath();
                ctx.moveTo(character.x - character.mouthWidth / 2, character.y + character.size * 0.25);
                ctx.quadraticCurveTo(
                    character.x, 
                    character.y + character.size * 0.25 + character.mouthHeight * mouthDisgustAmount, 
                    character.x + character.mouthWidth / 2, 
                    character.y + character.size * 0.25
                );
                ctx.quadraticCurveTo(
                    character.x, 
                    character.y + character.size * 0.25 - character.mouthHeight / 2, 
                    character.x - character.mouthWidth / 2, 
                    character.y + character.size * 0.25
                );
                ctx.fill();
                
                // Rides du nez - plus prononcées avec le dégoût
                const wrinkleAmount = Math.min(1, character.disgustLevel * 0.5);
                
                if (wrinkleAmount > 0.1) {
                    ctx.strokeStyle = `rgba(${208 - skinHue}, ${160 - skinHue * 0.5}, ${128 - skinHue * 0.3}, ${wrinkleAmount})`;
                    ctx.lineWidth = 2;
                    
                    // Première ride
                    ctx.beginPath();
                    ctx.moveTo(character.x - character.size * 0.15, character.y - character.size * 0.05);
                    ctx.quadraticCurveTo(
                        character.x, 
                        character.y - character.size * (0.03 + wrinkleAmount * 0.05), 
                        character.x + character.size * 0.15, 
                        character.y - character.size * 0.05
                    );
                    ctx.stroke();
                    
                    // Deuxième ride si très dégoûté
                    if (wrinkleAmount > 0.5) {
                        ctx.beginPath();
                        ctx.moveTo(character.x - character.size * 0.1, character.y - character.size * 0.1);
                        ctx.quadraticCurveTo(
                            character.x, 
                            character.y - character.size * (0.08 + wrinkleAmount * 0.03), 
                            character.x + character.size * 0.1, 
                            character.y - character.size * 0.1
                        );
                        ctx.stroke();
                    }
                }
                
                // Teinte verte pour dégoût extrême
                if (character.disgustLevel > 2) {
                    ctx.fillStyle = `rgba(100, 255, 100, ${(character.disgustLevel - 2) * 0.1})`;
                    ctx.beginPath();
                    ctx.arc(character.x, character.y, character.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            } catch (error) {
                console.error("Erreur dans drawCharacter:", error);
            }
        }
        
        // Suivi du temps
        let lastTime = 0;
        
        function animate(time) {
            try {
                const deltaTime = time - lastTime;
                lastTime = time;
                
                // Mise à jour de la progression de l'histoire
                const phase = updateStoryProgress('degout', deltaTime);
                
                // Mises à jour spécifiques à la phase
                updatePhaseElements(phase, deltaTime);
                
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Dessin de l'arrière-plan avec un dégradé basé sur la phase de l'histoire
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, `rgba(${26 + phase * 3}, ${59 - phase * 5}, ${12 + phase * 3}, 1)`);
                gradient.addColorStop(1, `rgba(${44 - phase * 3}, ${76 - phase * 6}, ${28 - phase * 2}, 1)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Mise à jour et dessin des blobs
                for (let blob of blobs) {
                    // Déplacement lent du blob
                    blob.x += Math.cos(blob.angle) * blob.speed * (deltaTime / 16);
                    blob.y += Math.sin(blob.angle) * blob.speed * (deltaTime / 16);
                    
                    // Changement de direction occasionnel
                    if (Math.random() < 0.01) {
                        blob.angle += (Math.random() - 0.5) * Math.PI / 4;
                    }
                    
                    // Rotation du blob
                    blob.angle += blob.rotationSpeed * (deltaTime / 16);
                    
                    // Rebond sur les bords
                    if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
                    if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
                    if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
                    if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;
                    
                    drawBlob(blob, time);
                }
                
                // Mise à jour du personnage
                character.blinkTimer += 1;
                if (character.blinkTimer > 200) {
                    character.blinkTimer = 0;
                }
                
                // Déplacement du personnage basé sur la phase et le niveau de dégoût
                switch (phase) {
                    case 0:
                        character.targetX = canvas.width * 0.6;
                        character.disgustLevel = 0.2;
                        break;
                    case 1:
                        character.targetX = canvas.width * 0.5;
                        character.disgustLevel = 1;
                        break;
                    case 2:
                        character.targetX = canvas.width * 0.65;
                        character.disgustLevel = 2;
                        break;
                    case 3:
                        character.targetX = canvas.width * 0.75;
                        character.disgustLevel = 3;
                        break;
                }
                
                // Éloignement du personnage de la nourriture à mesure que le dégoût augmente
                character.x += (character.targetX - character.x) * character.moveSpeed * (deltaTime / 16);
                character.y += (character.targetY - character.y) * character.moveSpeed * (deltaTime / 16);
                
                // Dessin du personnage
                drawCharacter(time);
                
                requestAnimationFrame(animate);
            } catch (error) {
                console.error("Erreur dans animate de degout:", error);
                requestAnimationFrame(animate); // Continuer l'animation malgré l'erreur
            }
        }
        
        function updatePhaseElements(phase, deltaTime) {
            try {
                // Vérification que foodPlate existe
                if (!foodPlate || !foodPlate.element) {
                    console.log("foodPlate non disponible, création...");
                    if (container) {
                        foodPlate = {
                            element: document.createElement('div'),
                            x: canvas.width * 0.3,
                            y: canvas.height * 0.5,
                            phase: 0,
                            rottenLevel: 0
                        };
                        
                        foodPlate.element.className = 'food-plate';
                        
                        const food = document.createElement('div');
                        food.className = 'food';
                        foodPlate.element.appendChild(food);
                        
                        foodPlate.element.style.left = `${foodPlate.x - 100}px`;
                        foodPlate.element.style.top = `${foodPlate.y - 100}px`;
                        container.appendChild(foodPlate.element);
                        
                        // Création des mouches si nécessaire
                        if (flies.length === 0) {
                            createFlies(container, foodPlate);
                        }
                    } else {
                        console.error("Container non disponible pour foodPlate");
                        return;
                    }
                }
                
                // Animation de l'assiette de nourriture basée sur la phase
                if (phase >= 0 && foodPlate.phase === 0) {
                    foodPlate.phase = 1;
                    foodPlate.element.style.opacity = '1';
                }
                
                // La nourriture devient plus pourrie avec chaque phase
                const food = foodPlate.element.querySelector('.food');
                if (food) {
                    food.style.background = `linear-gradient(to bottom right, 
                        hsl(${90 - phase * 20}, ${70 - phase * 10}%, ${40 - phase * 5}%), 
                        hsl(${70 - phase * 20}, ${60 - phase * 10}%, ${30 - phase * 5}%))`;
                }
                
                // Vérification que flies est un tableau
                if (!Array.isArray(flies)) {
                    console.error("flies n'est pas un tableau");
                    return;
                }
                
                // Les mouches apparaissent dans les phases ultérieures
                for (let i = 0; i < flies.length; i++) {
                    const fly = flies[i];
                    if (!fly || !fly.element) continue;
                    
                    // Détermination de quand chaque mouche doit apparaître
                    if (phase >= 1 && i < 3 && !fly.active) {
                        fly.active = true;
                        fly.element.style.opacity = '0.7';
                    } else if (phase >= 2 && i < 7 && !fly.active) {
                        fly.active = true;
                        fly.element.style.opacity = '0.7';
                    } else if (phase >= 3 && !fly.active) {
                        fly.active = true;
                        fly.element.style.opacity = '0.7';
                    }
                    
                    // Animation des mouches actives
                    if (fly.active) {
                        // Mouvement circulaire avec du hasard
                        const time = Date.now() * 0.001;
                        const flyCircleRadius = fly.circleRadius * (1 + Math.sin(time * 0.5) * 0.2);
                        
                        // Positionnement de base autour de la nourriture avec un chaos croissant à mesure que le dégoût augmente
                        const chaosLevel = Math.min(1, phase * 0.2);
                        
                        fly.baseX = foodPlate.x + (Math.sin(time * 0.3) * 30 * chaosLevel);
                        fly.baseY = foodPlate.y + (Math.cos(time * 0.2) * 20 * chaosLevel);
                        
                        // Calcul de la position avec des variations aléatoires
                        fly.x = fly.baseX + Math.cos(time * fly.speed + fly.phaseOffset) * flyCircleRadius;
                        fly.y = fly.baseY + Math.sin(time * fly.speed + fly.phaseOffset) * flyCircleRadius * 0.6;
                        
                        // Application d'une instabilité aléatoire basée sur la phase (plus chaotique dans les phases ultérieures)
                        if (Math.random() < 0.1 * phase) {
                            fly.x += (Math.random() - 0.5) * 10 * phase;
                            fly.y += (Math.random() - 0.5) * 10 * phase;
                        }
                        
                        // Changements de direction occasionnels
                        if (Math.random() < 0.02) {
                            fly.phaseOffset += (Math.random() - 0.5) * Math.PI;
                        }
                        
                        // Les mouches deviennent plus grandes dans les phases ultérieures
                        const sizeFactor = 1 + phase * 0.3;
                        fly.element.style.width = `${fly.size * sizeFactor}px`;
                        fly.element.style.height = `${fly.size * sizeFactor}px`;
                        
                        // Positionnement de la mouche
                        fly.element.style.left = `${fly.x}px`;
                        fly.element.style.top = `${fly.y}px`;
                        
                        // Ajout d'ombres pour rendre les mouches plus visibles
                        fly.element.style.boxShadow = `0 0 ${3 + phase}px rgba(0, 0, 0, 0.5)`;
                        
                        // Ajout d'un effet d'ailes avec des pseudo-éléments
                        const animationSpeed = 200 - phase * 20; // Bourdonnement plus rapide dans les phases ultérieures
                        fly.element.style.animation = `flutter ${animationSpeed}ms infinite alternate ease-in-out`;
                        
                        // Dans la phase la plus dégoûtante, certaines mouches se posent réellement sur la nourriture
                        if (phase >= 3 && Math.random() < 0.01) {
                            // Atterrissage sur la nourriture
                            const angle = Math.random() * Math.PI * 2;
                            const landRadius = 50 * Math.random();
                            fly.x = foodPlate.x + Math.cos(angle) * landRadius;
                            fly.y = foodPlate.y + Math.sin(angle) * landRadius;
                            fly.element.style.left = `${fly.x}px`;
                            fly.element.style.top = `${fly.y}px`;
                            
                            // Pause brève
                            fly.element.style.animation = 'none';
                            
                            // Redécollage après un moment
                            setTimeout(() => {
                                if (fly.element) {
                                    fly.element.style.animation = `flutter ${animationSpeed}ms infinite alternate ease-in-out`;
                                }
                            }, 500 + Math.random() * 1000);
                        }
                    }
                }
                
                // Ajout de taches de moisissure en phase 2 et 3
                if (phase >= 2 && foodPlate.rottenLevel < phase) {
                    foodPlate.rottenLevel = phase;
                    
                    // Ajout de taches de moisissure à la nourriture
                    const moldSpots = phase >= 2 ? 3 + phase * 2 : 0;
                    const food = foodPlate.element.querySelector('.food');
                    
                    if (food) {
                        for (let i = 0; i < moldSpots; i++) {
                            const moldSpot = document.createElement('div');
                            moldSpot.style.position = 'absolute';
                            moldSpot.style.width = `${5 + Math.random() * 15}px`;
                            moldSpot.style.height = `${5 + Math.random() * 15}px`;
                            moldSpot.style.borderRadius = '50%';
                            moldSpot.style.backgroundColor = `hsl(${Math.random() < 0.5 ? 80 : 40}, ${60 + Math.random() * 20}%, ${30 + Math.random() * 20}%)`;
                            moldSpot.style.left = `${Math.random() * 80 + 10}%`;
                            moldSpot.style.top = `${Math.random() * 80 + 10}%`;
                            moldSpot.style.opacity = '0';
                            moldSpot.style.transition = 'opacity 1s';
                            food.appendChild(moldSpot);
                            
                            // Apparition progressive de la tache de moisissure
                            setTimeout(() => {
                                if (moldSpot) {
                                    moldSpot.style.opacity = '0.7';
                                }
                            }, 100 * i);
                        }
                    }
                }
                
                // Ajout d'un effet de goutte dégoûtante dans la phase finale
                if (phase >= 3 && container) {
                    // Création de gouttes visqueuses à intervalles aléatoires
                    if (Math.random() < 0.05) {
                        const drip = document.createElement('div');
                        drip.style.position = 'absolute';
                        drip.style.width = `${3 + Math.random() * 5}px`;
                        drip.style.height = `${10 + Math.random() * 20}px`;
                        drip.style.borderRadius = '50% 50% 20% 20% / 30% 30% 70% 70%';
                        drip.style.backgroundColor = `hsla(${70 - Math.random() * 50}, 70%, 25%, 0.7)`;
                        
                        // Positionnement au bas de l'assiette de nourriture
                        const angle = (Math.random() - 0.5) * Math.PI;
                        drip.style.left = `${foodPlate.x + Math.cos(angle) * 100}px`;
                        drip.style.top = `${foodPlate.y + 100}px`;
                        drip.style.transformOrigin = 'center top';
                        container.appendChild(drip);
                        
                        // Animation de la goutte qui tombe
                        let dripY = foodPlate.y + 100;
                        const dripFall = setInterval(() => {
                            dripY += 1 + Math.random() * 2;
                            if (drip) {
                                drip.style.top = `${dripY}px`;
                            }
                            
                            // Suppression quand elle atteint le bas de l'écran
                            if (dripY > window.innerHeight) {
                                clearInterval(dripFall);
                                if (drip && drip.parentNode) {
                                    drip.parentNode.removeChild(drip);
                                }
                            }
                        }, 50);
                        
                        // Disparition progressive au fil du temps
                        setTimeout(() => {
                            if (drip) {
                                drip.style.transition = 'opacity 1s';
                                drip.style.opacity = '0';
                                
                                // Suppression après la disparition
                                setTimeout(() => {
                                    if (drip && drip.parentNode) {
                                        drip.parentNode.removeChild(drip);
                                    }
                                }, 1000);
                            }
                        }, 3000 + Math.random() * 2000);
                    }
                }
            } catch (error) {
                console.error("Erreur dans updatePhaseElements de degout:", error);
            }
        }
        
        animate(0);
        updateLoadingProgress();
    } catch (error) {
        console.error("Erreur globale dans initDegoutCanvas:", error);
        updateLoadingProgress(); // Continuer malgré l'erreur
    }
}