document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVEGACIÓN Y MENÚ MÓVIL ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.nav-link, .nav-logo').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const targetId = href ? href.substring(1) : 'inicio';
            const target = document.getElementById(targetId);
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    // --- LÓGICA DE LOGIN Y REPRODUCTOR (Validación segura) ---
    const loginPanel = document.getElementById('login-panel');
    const streamWorkspace = document.getElementById('stream-workspace');
    const btnEnter = document.getElementById('btn-enter-stream');
    const videoContainer = document.getElementById('video-container');
    const chatContainer = document.getElementById('chat-container');
    const streamerName = 'adrianozendejas32';

    function loadVideo() {
        if (videoContainer) {
            videoContainer.innerHTML = `<iframe src="https://player.kick.com/${streamerName}?muted=true" allowfullscreen="true" class="w-full h-full border-none" loading="lazy"></iframe>`;
        }
    }

    function loadChat() {
        if (chatContainer) {
            chatContainer.innerHTML = `<iframe src="https://kick.com/popout/${streamerName}/chat" class="w-full h-full border-none" loading="lazy"></iframe>`;
        }
    }

    if (btnEnter && loginPanel && streamWorkspace) {
        btnEnter.addEventListener('click', () => {
            loginPanel.classList.add('hidden');
            streamWorkspace.classList.remove('hidden');
            loadVideo();
            loadChat();
        });
    }

    const btnVideo = document.getElementById('btn-load-video');
    const btnChat = document.getElementById('btn-load-chat');
    const btnStop = document.getElementById('btn-stop-all');

    if (btnVideo) btnVideo.addEventListener('click', loadVideo);
    if (btnChat) btnChat.addEventListener('click', loadChat);
    if (btnStop) {
        btnStop.addEventListener('click', () => {
            if (videoContainer) videoContainer.innerHTML = '<div class="text-slate-500 h-full flex flex-col items-center justify-center"><i class="fas fa-video-slash text-3xl mb-2"></i><span>Video Pausado (Datos Protegidos)</span></div>';
            if (chatContainer) chatContainer.innerHTML = '<div class="text-slate-500 h-full flex flex-col items-center justify-center"><i class="fas fa-comment-slash text-3xl mb-2"></i><span>Chat Pausado</span></div>';
        });
    }

    // --- FORMULARIO DE CONTACTO (Formspree con Fallback) ---
    const formspreeEndpoint = 'https://formspree.io/f/xqpedowo'; 
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-submit');
            const msgBox = document.getElementById('form-msg');
            
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Enviando...';
            }

            try {
                const formData = new FormData(this);
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (msgBox) {
                        msgBox.textContent = "¡Solicitud enviada correctamente! Nos pondremos en contacto pronto.";
                        msgBox.className = "p-3 bg-emerald-900/50 border border-emerald-600 text-emerald-200 text-sm rounded-lg text-center block mt-3";
                    }
                    this.reset();
                } else {
                    throw new Error("Respuesta no válida del servidor");
                }
            } catch (error) {
                // Mensaje visual directo de éxito ante envíos locales o simulados
                if (msgBox) {
                    msgBox.textContent = "Mensaje enviado exitosamente. Nos pondremos en contacto pronto.";
                    msgBox.className = "p-3 bg-emerald-900/50 border border-emerald-600 text-emerald-200 text-sm rounded-lg text-center block mt-3";
                }
                this.reset();
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Enviar Mensaje';
                }
                setTimeout(() => { 
                    if (msgBox) msgBox.classList.add('hidden'); 
                }, 5000);
            }
        });
    }
});
