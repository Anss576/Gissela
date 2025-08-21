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

// Music player functionality - Fixed
const bgMusic = document.getElementById('bgMusic');
let currentSongSrc = null;
let isPlaying = false;

// Función para actualizar el estado de los botones
function updatePlayButtons() {
    const playBtns = document.querySelectorAll('.play-btn');
    playBtns.forEach(btn => {
        const songDiv = btn.closest('.song');
        const songSrc = songDiv.dataset.src;
        
        if (currentSongSrc === songSrc && isPlaying) {
            btn.textContent = '⏸️';
        } else {
            btn.textContent = '▶️';
        }
    });
}

// Función para reproducir una canción específica
function playSong(songSrc) {
    if (!bgMusic) return;
    
    // Si es la misma canción que ya está sonando
    if (currentSongSrc === songSrc) {
        if (isPlaying) {
            // Pausar la canción actual
            bgMusic.pause();
            isPlaying = false;
            updatePlayButtons();
        } else {
            // Reanudar la canción
            bgMusic.play().then(() => {
                isPlaying = true;
                updatePlayButtons();
            });
        }
        return;
    }
    
    // Si es una canción diferente
    bgMusic.src = songSrc;
    currentSongSrc = songSrc;
    
    bgMusic.play().then(() => {
        isPlaying = true;
        updatePlayButtons();
    }).catch(e => {
        console.log('Error al reproducir:', e);
    });
}

// Función para volver a la canción de fondo "Woman"
function playBackgroundMusic() {
    if (!bgMusic) return;
    
    bgMusic.src = 'music/Doja Cat - Woman (Official Visualizer).mp3';
    currentSongSrc = bgMusic.src;
    
    bgMusic.play().then(() => {
        isPlaying = true;
        updatePlayButtons();
    }).catch(e => {
        console.log('Error al reproducir música de fondo:', e);
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

// Eventos del reproductor
if (bgMusic) {
    bgMusic.addEventListener('ended', () => {
        // Cuando termina una canción, volver a "Woman"
        playBackgroundMusic();
    });
    
    bgMusic.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButtons();
    });
    
    bgMusic.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButtons();
    });
}

// Auto-play music with user interaction
document.addEventListener('click', () => {
    if (bgMusic && !isPlaying && !currentSongSrc) {
        playBackgroundMusic();
    }
}, { once: true });

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
