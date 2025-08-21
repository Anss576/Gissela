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

// Music player functionality - Control de música de fondo (Woman)
const bgMusic = document.getElementById('bgMusic');
let currentSongSrc = null;

// Función para pausar/reanudar la música actual
function togglePlayPause() {
    if (!bgMusic) return;
    
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            updateAllPlayButtons('⏸️');
        }).catch(e => {
            console.log('Error al reproducir:', e);
        });
    } else {
        bgMusic.pause();
        updateAllPlayButtons('▶️');
    }
}

// Función para actualizar todos los botones de reproducción
function updateAllPlayButtons(icon) {
    const playBtns = document.querySelectorAll('.play-btn');
    playBtns.forEach(btn => {
        btn.textContent = icon;
    });
}

// Función para reproducir una canción específica
function playSong(songSrc) {
    if (!bgMusic) return;
    
    // Si es la misma canción que ya está sonando, solo pausar/reanudar
    if (currentSongSrc === songSrc && !bgMusic.paused) {
        togglePlayPause();
        return;
    }
    
    // Si es una canción diferente o está pausada, cambiar y reproducir
    bgMusic.src = songSrc;
    currentSongSrc = songSrc;
    
    bgMusic.play().then(() => {
        updateAllPlayButtons('⏸️');
    }).catch(e => {
        console.log('Error al reproducir:', e);
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

// Evento cuando termina la canción
if (bgMusic) {
    bgMusic.addEventListener('ended', () => {
        updateAllPlayButtons('▶️');
    });
    
    // Evento cuando se pausa la canción
    bgMusic.addEventListener('pause', () => {
        updateAllPlayButtons('▶️');
    });
    
    // Evento cuando se reanuda la canción
    bgMusic.addEventListener('play', () => {
        updateAllPlayButtons('⏸️');
    });
}

// Auto-play music with user interaction (solo una vez)
document.addEventListener('click', () => {
    if (bgMusic && bgMusic.paused && !currentSongSrc) {
        // Reproducir la música de fondo (Woman) por defecto
        bgMusic.src = 'music/Doja Cat - Woman (Official Visualizer).mp3';
        currentSongSrc = bgMusic.src;
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
