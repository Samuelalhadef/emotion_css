/**
 * ======================================
 * SYSTÈME DE NARRATION DES HISTOIRES
 * ======================================
 */
const narrations = {
    tristesse: [
        "Le cœur lourd, je contemple nos souvenirs qui s'effacent doucement dans la pluie. Chaque goutte qui tombe emporte avec elle un fragment de notre histoire.",
        "Les photos jaunies par le temps reflètent des moments qui ne reviendront jamais. Je sens ma poitrine se serrer tandis que les souvenirs s'estompent lentement.",
        "L'absence creuse un vide que rien ne semble pouvoir combler. Je suis seul face à ce monde devenu gris, où les couleurs se sont évanouies avec toi.",
        "Mes larmes se mêlent à la pluie dans un dernier adieu silencieux. La tristesse n'est plus une émotion, elle est devenue mon univers tout entier."
    ],
    colere: [
        "Une légère contrariété, un simple agacement. Je sens mon rythme cardiaque s'accélérer tandis que mes poings se serrent imperceptiblement.",
        "L'irritation grandit, comme un feu qui trouve son combustible. Ma respiration devient saccadée, mes pensées se brouillent sous l'effet de cette tension croissante.",
        "La colère prend le contrôle. COMMENT ONT-ILS OSÉ?! Je ne vois plus que rouge, mes mains tremblent d'une rage que je peine à contenir!",
        "Les dégâts sont faits. Autour de moi, les débris de ce que j'ai détruit dans ma fureur. La colère se dissipe, laissant place à un vide épuisant."
    ],
    degout: [
        "Au premier regard, rien d'anormal dans cette assiette. Puis, un détail attire mon attention, quelque chose d'inhabituel qui fait plisser mes yeux.",
        "Mon nez détecte une odeur étrange, légèrement âcre. Je remarque alors de minuscules mouvements à la surface. Est-ce mon imagination?",
        "La réalité s'impose avec horreur - l'assiette est infestée! Je sens mon estomac se nouer, ma gorge se contracte, et une vague nauséeuse me submerge.",
        "L'écœurement est total. Je ne peux plus regarder sans ressentir cette répulsion viscérale qui fait frissonner chaque parcelle de mon corps."
    ]
};

// Suivi de l'état de l'histoire
const storyStates = {
    tristesse: {
        currentPhase: 0,
        phaseTime: 0,
        phaseDuration: 8000, // millisecondes par phase
        narrationPhase: 0
    },
    colere: {
        currentPhase: 0,
        phaseTime: 0,
        phaseDuration: 8000,
        narrationPhase: 0
    },
    degout: {
        currentPhase: 0,
        phaseTime: 0,
        phaseDuration: 8000,
        narrationPhase: 0
    }
};

function updateStoryProgress(sectionId, deltaTime) {
    try {
        const state = storyStates[sectionId];
        if (!state) return 0;
        
        // Mise à jour du temps de phase
        state.phaseTime += deltaTime;
        
        // Vérification s'il faut passer à la phase suivante
        if (state.phaseTime >= state.phaseDuration) {
            state.currentPhase = Math.min(state.currentPhase + 1, 3);
            state.phaseTime = 0;
            
            // Mise à jour des marqueurs de timeline
            updateTimelineMarkers(sectionId, state.currentPhase);
            
            // Mise à jour du texte de narration si nécessaire
            if (state.narrationPhase !== state.currentPhase) {
                state.narrationPhase = state.currentPhase;
                updateNarrationText(sectionId, state.narrationPhase);
            }
        }
        
        // Mise à jour de la barre de progression
        const progressElement = document.getElementById(`${sectionId}-progress`);
        if (progressElement) {
            const progressPercent = (state.currentPhase * state.phaseDuration + state.phaseTime) / (4 * state.phaseDuration) * 100;
            progressElement.style.width = `${Math.min(progressPercent, 100)}%`;
        }
        
        return state.currentPhase;
    } catch (error) {
        console.error("Erreur dans updateStoryProgress:", error);
        return 0;
    }
}

function updateTimelineMarkers(sectionId, phase) {
    try {
        const markers = document.querySelectorAll(`#${sectionId} .timeline-marker`);
        
        markers.forEach((marker, index) => {
            if (index <= phase) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    } catch (error) {
        console.error("Erreur dans updateTimelineMarkers:", error);
    }
}

function updateNarrationText(sectionId, phase) {
    try {
        const narrationElement = document.querySelector(`#${sectionId} .emotion-narration`);
        if (!narrationElement) return;
        
        // Vérification que les narrations existent
        if (!narrations[sectionId] || !narrations[sectionId][phase]) return;
        
        // Fondu sortant
        narrationElement.classList.remove('visible');
        
        // Mise à jour du texte et fondu entrant
        setTimeout(() => {
            narrationElement.textContent = narrations[sectionId][phase];
            narrationElement.classList.add('visible');
        }, 500);
    } catch (error) {
        console.error("Erreur dans updateNarrationText:", error);
    }
}

function resetStoryProgress(sectionId) {
    try {
        // Réinitialisation de la progression de la timeline
        const progressElement = document.getElementById(`${sectionId}-progress`);
        if (progressElement) {
            progressElement.style.width = '0%';
        }
        
        // Réinitialisation des marqueurs de timeline
        const markers = document.querySelectorAll(`#${sectionId} .timeline-marker`);
        markers.forEach(marker => marker.classList.remove('active'));
        if (markers.length > 0) {
            markers[0].classList.add('active');
        }
        
        // Redémarrage de l'histoire
        if (storyStates[sectionId]) {
            storyStates[sectionId].currentPhase = 0;
            storyStates[sectionId].phaseTime = 0;
            storyStates[sectionId].narrationPhase = 0;
        }
        
        // Réinitialisation des éléments spécifiques à l'histoire
        if (sectionId === 'tristesse') {
            resetTristesseStory();
        } else if (sectionId === 'colere') {
            resetColereStory();
        } else if (sectionId === 'degout') {
            resetDegoutStory();
        }
        
        // Mise à jour du texte de narration basé sur la réinitialisation
        updateNarrationText(sectionId, 0);
    } catch (error) {
        console.error("Erreur dans resetStoryProgress:", error);
    }
}