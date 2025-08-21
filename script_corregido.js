// Menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const menuItems = document.querySelector('.menu-items');
const menuLinks = document.querySelectorAll('.menu-items a');
const sections = document.querySelectorAll('.section');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    menuItems.classList.toggle('active');
});

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        
        // Show target section
        document.getElementById(targetId).classList.add('active');
        
        // Update active menu item
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close menu
        menuItems.classList.remove('active');
    });
});

// Background slideshow
const bgPhotos = document.querySelectorAll('.bg-photo');
let currentBgIndex = 0;

function changeBackground() {
    bgPhotos[currentBgIndex].classList.remove('active');
    currentBgIndex = (currentBgIndex + 1) % bgPhotos.length;
    bgPhotos[currentBgIndex].classList.add('active');
}

// Change background every 5 seconds
setInterval(changeBackground, 5000);

// Music player functionality - CORREGIDO
const bgMusic = document.getElementById('bgMusic');
let currentSongSrc = null;
let isPaused = false;
let currentTime = 0;

// Función mejorada para pausar/reanudar música
function togglePlayPause() {
    if (!bgMusic) return;
    
    if (bgMusic.paused) {
        // Si estaba pausada, reanudar desde donde se quedó
        if (isPaused && currentTime > 0) {
            bgMusic.currentTime = currentTime;
        }
        bgMusic.play().then(() => {
            updateAllPlayButtons('⏸️');
            isPaused = false;
        }).catch(e => {
            console.log('Error al reproducir:', e);
        });
    } else {
        // Guardar la posición actual antes de pausar
        currentTime = bgMusic.currentTime;
        bgMusic.pause();
        isPaused = true;
        updateAllPlayButtons('▶️');
    }
}

// Función mejorada para reproducir canciones
function playSong(songSrc) {
    if (!bgMusic) return;
    
    // Si es la misma canción que ya está sonando
    if (currentSongSrc === songSrc) {
        togglePlayPause();
        return;
    }
    
    // Si es una canción diferente
    if (currentSongSrc !== songSrc) {
        // Guardar si había una canción anterior
        const wasPlaying = !bgMusic.paused;
        
        // Cambiar la fuente
        bgMusic.src = songSrc;
        currentSongSrc = songSrc;
        currentTime = 0; // Resetear el tiempo para nueva canción
        
        // Reproducir
        bgMusic.load(); // Recargar el audio
        bgMusic.play().then(() => {
            updateAllPlayButtons('⏸️');
            isPaused = false;
        }).catch(e => {
            console.log('Error al reproducir:', e);
        });
    }
}

// Función para actualizar todos los botones de reproducción
function updateAllPlayButtons(icon) {
    const playBtns = document.querySelectorAll('.play-btn');
    playBtns.forEach(btn => {
        btn.textContent = icon;
    });
}

// Configurar event listeners para las canciones
const songs = document.querySelectorAll('.song');
songs.forEach(song => {
    const playBtn = song.querySelector('.play-btn');
    const songSrc = song.dataset.src;
    
    playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playSong(songSrc);
    });
});

// Eventos del reproductor de audio
if (bgMusic) {
    // Cuando termina la canción
    bgMusic.addEventListener('ended', () => {
        updateAllPlayButtons('▶️');
        isPaused = false;
        currentTime = 0;
    });
    
    // Cuando se pausa la canción
    bgMusic.addEventListener('pause', () => {
        updateAllPlayButtons('▶️');
        isPaused = true;
    });
    
    // Cuando se reanuda la canción
    bgMusic.addEventListener('play', () => {
        updateAllPlayButtons('⏸️');
        isPaused = false;
    });
    
    // Guardar el tiempo actual mientras se reproduce
    bgMusic.addEventListener('timeupdate', () => {
        if (!bgMusic.paused) {
            currentTime = bgMusic.currentTime;
        }
    });
}

// Auto-play music with user interaction (solo una vez)
document.addEventListener('click', () => {
    if (bgMusic && bgMusic.paused && !currentSongSrc) {
        // Reproducir la música de fondo (Woman) por defecto
        bgMusic.src = 'music/Doja Cat - Woman (Official Visualizer).mp3';
        currentSongSrc = bgMusic.src;
        currentTime = 0;
        bgMusic.play().catch(e => console.log('Auto-play prevented:', e));
    }
}, { once: true });

// Add some interactive hearts on click
document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
        createHeart(e.clientX, e.clientY);
    }
});

function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.animation = 'heartFloat 2s ease-out forwards';
    heart.style.fontSize = '30px';
    heart.style.zIndex = '1000';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Add CSS for heart animation
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Función adicional para controlar el volumen
function setVolume(volume) {
    if (bgMusic) {
        bgMusic.volume = Math.max(0, Math.min(1, volume));
    }
}

// Función para obtener información de la canción actual
function getCurrentSongInfo() {
    return {
        src: currentSongSrc,
        currentTime: currentTime,
        duration: bgMusic ? bgMusic.duration : 0,
        paused: bgMusic ? bgMusic.paused : true
    };
}
