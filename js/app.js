document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVEGACIÓN Y MENÚ MÓVIL ---
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });

    document.querySelectorAll('.nav-link, .nav-logo').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') ? this.getAttribute('href').substring(1) : 'inicio';
            const target = document.getElementById(targetId);
            if(target) {
                target.scrollIntoView();
                document.getElementById('mobile-menu').classList.add('hidden');
            }
        });
    });

    // --- LÓGICA DE LOGIN Y AHORRO DE DATOS LTE/5G ---
    const loginPanel = document.getElementById('login-panel');
    const streamWorkspace = document.getElementById('stream-workspace');
    const btnEnter = document.getElementById('btn-enter-stream');
    
    const videoContainer = document.getElementById('video-container');
    const chatContainer = document.getElementById('chat-container');
    const streamerName = 'adrianozendejas32';

    // Funciones para inyectar iframes dinámicamente
    function loadVideo() {
        // Se carga con muted=true para evitar el error de reproducción automática del navegador
        videoContainer.innerHTML = `<iframe src="https://player.kick.com/${streamerName}?muted=true" allowfullscreen="true" class="w-full h-full border-none" loading="lazy"></iframe>`;
    }

    function loadChat() {
        chatContainer.innerHTML = `<iframe src="https://kick.com/popout/${streamerName}/chat" class="w-full h-full border-none" loading="lazy"></iframe>`;
    }

    // Evento Login: Acceder al stream
    btnEnter.addEventListener('click', () => {
        loginPanel.classList.add('hidden');
        streamWorkspace.classList.remove('hidden');
        loadVideo();
        loadChat();
    });

    // Botones manuales de ahorro de datos en el panel
    document.getElementById('btn-load-video').addEventListener('click', loadVideo);
    document.getElementById('btn-load-chat').addEventListener('click', loadChat);
    
    document.getElementById('btn-stop-all').addEventListener('click', () => {
        videoContainer.innerHTML = '<div class="text-slate-500 h-full flex flex-col items-center justify-center"><i class="fas fa-video-slash text-3xl mb-2"></i><span>Video Pausado (Datos Protegidos)</span></div>';
        chatContainer.innerHTML = '<div class="text-slate-500 h-full flex flex-col items-center justify-center"><i class="fas fa-comment-slash text-3xl mb-2"></i><span>Chat Pausado</span></div>';
    });

    // --- FORMULARIO DE CONTACTO (Formspree) ---
    // Coloca aquí tu URL de Formspree si deseas usar formularios estáticos
    const formspreeEndpoint = 'https://formspree.io/f/xqpedowo'; 

    document.getElementById('contact-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('btn-submit');
        const msgBox = document.getElementById('form-msg');
        
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        try {
            const formData = new FormData(this);
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                msgBox.textContent = "¡Solicitud enviada correctamente!";
                msgBox.className = "p-3 bg-emerald-900/50 border border-emerald-600 text-emerald-200 text-sm rounded-lg text-center block mt-4";
                this.reset();
            } else {
                throw new Error("Error en servidor");
            }
        } catch (error) {
            msgBox.textContent = "Error al enviar. Verifica que hayas puesto tu enlace de Formspree en app.js.";
            msgBox.className = "p-3 bg-red-900/50 border border-red-600 text-red-200 text-sm rounded-lg text-center block mt-4";
        } finally {
            btn.disabled = false;
            btn.textContent = 'Enviar Mensaje';
            setTimeout(() => { msgBox.classList.add('hidden'); }, 6000);
        }
    });
});
