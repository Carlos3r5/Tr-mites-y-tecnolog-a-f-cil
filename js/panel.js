/* js/panel.js - Controlador de Alto Rendimiento */
const channelName = 'adrianozendejas32';
let isVideoActive = false;
let isChatActive = false;
let isLowQuality = false;

let currentScene = 1;
let photoCounter = 0;

let screenCaptureStream = null;
const hiddenCaptureVideo = document.createElement('video');
hiddenCaptureVideo.autoplay = true;
hiddenCaptureVideo.muted = true;
hiddenCaptureVideo.playsInline = true;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Caché de elementos del DOM
const DOM = {};

document.addEventListener('DOMContentLoaded', () => {
    DOM.activationCard = document.getElementById('activation-card');
    DOM.streamDisplay = document.getElementById('stream-display');
    DOM.videoFrame = document.getElementById('video-frame');
    DOM.chatFrame = document.getElementById('chat-frame');
    DOM.btnVideo = document.getElementById('btn-toggle-video');
    DOM.btnChat = document.getElementById('btn-toggle-chat');
    DOM.btnDataSaver = document.getElementById('btn-data-saver');
    DOM.badgeEscena = document.getElementById('badge-escena');
    DOM.toast = document.getElementById('toast-scene');
    DOM.toastText = document.getElementById('toast-text');
    DOM.cameraFlash = document.getElementById('camera-flash');
    DOM.photoModal = document.getElementById('photo-modal');
    DOM.modalContainer = document.getElementById('modal-stream-container');
    DOM.modalBadge = document.getElementById('modal-badge');
});

function activarStream() {
    if (DOM.activationCard) DOM.activationCard.classList.add('hidden');
    if (DOM.streamDisplay) DOM.streamDisplay.style.display = 'block';

    loadVideo();
    loadChat();
}

/* Alternar Ahorro de Datos (160p) */
function toggleLowQualityVideo() {
    isLowQuality = !isLowQuality;
    if (isLowQuality) {
        if (DOM.btnDataSaver) {
            DOM.btnDataSaver.className = "btn btn-saver active";
            DOM.btnDataSaver.innerHTML = `<i class="fas fa-check-circle"></i> Ahorro (160p)`;
        }
        mostrarToast("Ahorro Activo: Transmisión a 160p");
    } else {
        if (DOM.btnDataSaver) {
            DOM.btnDataSaver.className = "btn btn-saver";
            DOM.btnDataSaver.innerHTML = `<i class="fas fa-compress-alt"></i> Ahorro (160p)`;
        }
        mostrarToast("Calidad HD Restaurada");
    }
    loadVideo();
}

/* Cambiar de Escena (Tecla O) */
function cambiarEscena() {
    currentScene++;
    photoCounter = 0;
    if (DOM.badgeEscena) DOM.badgeEscena.textContent = `📁 Escena #${currentScene}`;
    mostrarToast(`Escena #${currentScene} Activa`);
}

function mostrarToast(texto) {
    if (DOM.toast && DOM.toastText) {
        DOM.toastText.textContent = texto;
        DOM.toast.style.display = 'block';
        setTimeout(() => { DOM.toast.style.display = 'none'; }, 2000);
    }
}

/* Vinculación rápida para capturas en PC */
async function vincularCapturaPC() {
    if (screenCaptureStream && screenCaptureStream.active) return true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return false;

    try {
        screenCaptureStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: "browser" },
            audio: false,
            preferCurrentTab: true
        });
        hiddenCaptureVideo.srcObject = screenCaptureStream;
        await hiddenCaptureVideo.play();
        return true;
    } catch (err) {
        return false;
    }
}

/* Tomar Foto Instantánea (Tecla P) */
async function tomarFotoInstantanea() {
    if (DOM.cameraFlash) {
        DOM.cameraFlash.classList.remove('flash-effect');
        void DOM.cameraFlash.offsetWidth;
        DOM.cameraFlash.classList.add('flash-effect');
    }

    photoCounter++;
    const now = new Date();
    const timeStamp = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `Escena_${currentScene}_Foto_${photoCounter}_${timeStamp}.png`;

    // Modo PC
    if (!isMobile && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const vinculado = await vincularCapturaPC();
        if (vinculado && hiddenCaptureVideo.readyState >= 2 && DOM.videoFrame) {
            const rect = DOM.videoFrame.getBoundingClientRect();
            const scaleX = hiddenCaptureVideo.videoWidth / window.innerWidth;
            const scaleY = hiddenCaptureVideo.videoHeight / window.innerHeight;

            const cropX = rect.left * scaleX;
            const cropY = rect.top * scaleY;
            const cropW = rect.width * scaleX;
            const cropH = rect.height * scaleY;

            const canvas = document.createElement('canvas');
            canvas.width = cropW;
            canvas.height = cropH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(hiddenCaptureVideo, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

            const link = document.createElement('a');
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            mostrarToast(`📸 Foto #${photoCounter} Guardada`);
            return;
        }
    }

    // Modo Móvil / iPhone
    if (DOM.modalBadge) DOM.modalBadge.textContent = `📁 ESCENA #${currentScene} - FOTO #${photoCounter}`;
    if (DOM.modalContainer) {
        DOM.modalContainer.innerHTML = `<iframe src="https://player.kick.com/${channelName}" allow="autoplay; fullscreen" allowfullscreen="true"></iframe>`;
    }
    if (DOM.photoModal) DOM.photoModal.style.display = 'flex';
}

function cerrarModalFoto() {
    if (DOM.modalContainer) DOM.modalContainer.innerHTML = '';
    if (DOM.photoModal) DOM.photoModal.style.display = 'none';
}

/* Atajos de teclado para PC */
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const key = e.key.toLowerCase();
    if (key === 'p') {
        e.preventDefault();
        tomarFotoInstantanea();
    } else if (key === 'o') {
        e.preventDefault();
        cambiarEscena();
    }
});

/* Control de Reproductor */
function loadVideo() {
    const srcUrl = isLowQuality 
        ? `https://player.kick.com/${channelName}?autoplay=true&muted=true&quality=160p`
        : `https://player.kick.com/${channelName}?autoplay=true`;

    if (DOM.videoFrame) {
        DOM.videoFrame.innerHTML = `<iframe src="${srcUrl}" allow="autoplay; fullscreen" allowfullscreen="true"></iframe>`;
    }
    if (DOM.btnVideo) DOM.btnVideo.innerHTML = `<i class="fas fa-pause"></i> Video`;
    isVideoActive = true;
}

function unloadVideo() {
    if (DOM.videoFrame) {
        DOM.videoFrame.innerHTML = `<div style="color:#64748b; text-align:center; padding:1rem;"><i class="fas fa-video-slash" style="font-size:1.5rem; margin-bottom:4px;"></i><br><span style="font-size:0.75rem;">Video Pausado</span></div>`;
    }
    if (DOM.btnVideo) DOM.btnVideo.innerHTML = `<i class="fas fa-play"></i> Video`;
    isVideoActive = false;
}

function toggleVideo() {
    if (isVideoActive) unloadVideo();
    else loadVideo();
}

/* Control de Chat */
function loadChat() {
    if (DOM.chatFrame) {
        DOM.chatFrame.innerHTML = `<iframe src="https://kick.com/popout/${channelName}/chat"></iframe>`;
    }
    if (DOM.btnChat) DOM.btnChat.innerHTML = `<i class="fas fa-pause"></i> Chat`;
    isChatActive = true;
}

function unloadChat() {
    if (DOM.chatFrame) {
        DOM.chatFrame.innerHTML = `<div style="color:#64748b; text-align:center; padding:1rem;"><i class="fas fa-comment-slash" style="font-size:1.5rem; margin-bottom:4px;"></i><br><span style="font-size:0.75rem;">Chat Pausado</span></div>`;
    }
    if (DOM.btnChat) DOM.btnChat.innerHTML = `<i class="fas fa-play"></i> Chat`;
    isChatActive = false;
}

function toggleChat() {
    if (isChatActive) unloadChat();
    else loadChat();
}

function pausarStream() {
    unloadVideo();
    unloadChat();
    if (DOM.streamDisplay) DOM.streamDisplay.style.display = 'none';
    if (DOM.activationCard) DOM.activationCard.classList.remove('hidden');
}
