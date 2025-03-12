/**
 * ======================================
 * SYSTÈME DE GESTION DES RESSOURCES
 * ======================================
 */
let resourcesLoaded = 0;
const totalResources = 15; // Nombre total de ressources à charger
let loadingForceComplete = false; // Indicateur pour forcer la fin du chargement

function updateLoadingProgress() {
    resourcesLoaded++;
    const percentage = (resourcesLoaded / totalResources) * 100;
    const loadingBar = document.getElementById('loading-bar');
    
    if (loadingBar) {
        loadingBar.style.width = percentage + '%';
    }
    
    console.log(`Chargement: ${resourcesLoaded}/${totalResources} (${percentage.toFixed(2)}%)`);
    
    if (resourcesLoaded >= totalResources || loadingForceComplete) {
        console.log("Chargement terminé, affichage du contenu...");
        completeLoading();
    }
}

// Fonction pour terminer le chargement et afficher le contenu
function completeLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement && loadingElement.style.display !== 'none') {
        setTimeout(() => {
            loadingElement.style.display = 'none';
            
            // Activation manuelle de la première section
            const tristesse = document.getElementById('tristesse');
            if (tristesse) {
                tristesse.classList.add('active');
                showEmotionTextElements('tristesse');
                resetStoryProgress('tristesse');
            }
        }, 500);
    }
}

// Bouton de démarrage d'urgence
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', function() {
        loadingForceComplete = true;
        completeLoading();
    });
});

/**
 * ======================================
 * SYSTÈME AUDIO
 * ======================================
 */
let audioEnabled = false;
const audioToggle = document.querySelector('.audio-toggle');
const audioElements = {
    tristesse: new Audio(),
    colere: new Audio(),
    degout: new Audio()
};

// Configuration des éléments audio avec des sons factices
audioElements.tristesse.src = 'data:audio/mp3;base64,SUQzAwAAAAAAIlRJVDIAAAAZAAAASW1hZ2luYXJ5IFJhaW4gQW1iaWVuY2UAAAAAAAAAAAA=';
audioElements.tristesse.loop = true;
audioElements.tristesse.volume = 0.4;

audioElements.colere.src = 'data:audio/mp3;base64,SUQzAwAAAAAAIlRJVDIAAAAZAAAASW1hZ2luYXJ5IEZpcmUgQ3JhY2tsaW5nAAAAAAAAAAAAA=';
audioElements.colere.loop = true;
audioElements.colere.volume = 0.4;

audioElements.degout.src = 'data:audio/mp3;base64,SUQzAwAAAAAAIlRJVDIAAAAZAAAASW1hZ2luYXJ5IEZsaWVzIEJ1enppbmcAAAAAAAAAAAAA=';
audioElements.degout.loop = true;
audioElements.degout.volume = 0.4;

// Gestionnaires d'événements pour l'audio
function toggleAudio() {
    audioEnabled = !audioEnabled;
    
    // Mise à jour de l'icône
    audioToggle.innerHTML = audioEnabled ? 
        '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>' : 
        '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
    
    // Gestion des éléments audio
    if (audioEnabled) {
        // Détermine quel audio jouer en fonction de la section visible actuelle
        const activeSection = document.querySelector('.emotion-container.active');
        if (activeSection) {
            const id = activeSection.id;
            audioElements[id].play().catch(e => console.warn("Erreur lecture audio:", e));
        }
    } else {
        // Pause de tous les audios
        Object.values(audioElements).forEach(audio => {
            try {
                audio.pause();
            } catch(e) {
                console.warn("Erreur pause audio:", e);
            }
        });
    }
}

function switchAudio(sectionId) {
    if (!audioEnabled) return;
    
    // Pause de tous les audios
    Object.values(audioElements).forEach(audio => {
        try {
            audio.pause();
        } catch(e) {
            console.warn("Erreur pause audio:", e);
        }
    });
    
    // Lecture de l'audio approprié
    if (audioElements[sectionId]) {
        audioElements[sectionId].play().catch(e => console.warn("Erreur lecture audio:", e));
    }
}

/**
 * ======================================
 * SYSTÈME DE GESTION DES SECTIONS ET NAVIGATION
 * ======================================
 */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            showEmotionTextElements(entry.target.id);
            updateActiveNavDot(entry.target.id);
            switchAudio(entry.target.id);
            resetStoryProgress(entry.target.id);
        } else {
            entry.target.classList.remove('active');
            hideEmotionTextElements(entry.target.id);
        }
    });
}, observerOptions);

function showEmotionTextElements(id) {
    const container = document.querySelector(`#${id} .emotion-text`);
    if (!container) return;
    
    container.classList.add('visible');
    
    setTimeout(() => {
        const title = container.querySelector('.emotion-title');
        if (title) title.classList.add('visible');
    }, 500);
    
    setTimeout(() => {
        const narration = container.querySelector('.emotion-narration');
        if (narration) narration.classList.add('visible');
    }, 1000);
}

function hideEmotionTextElements(id) {
    const container = document.querySelector(`#${id} .emotion-text`);
    if (!container) return;
    
    const title = container.querySelector('.emotion-title');
    const narration = container.querySelector('.emotion-narration');
    
    if (title) title.classList.remove('visible');
    if (narration) narration.classList.remove('visible');
    container.classList.remove('visible');
}

function updateActiveNavDot(sectionId) {
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.section === sectionId) {
            dot.classList.add('active');
        }
    });
}

// Observez les sections une fois que le document est chargé
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.emotion-container').forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionId = dot.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Gestionnaire du bouton audio
    audioToggle.addEventListener('click', toggleAudio);
});