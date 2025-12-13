// ======================================================================
// 🔧 MOTEUR DE LA BARRE D'OUTILS (MMPA🌹) - STYLE 2025 PREMIUM
// ======================================================================
(function() {
    
    // 1. IDENTIFICATION DU COURS
    const params = new URLSearchParams(window.location.search);
    let fileName = params.get('id');

    if (!fileName) {
        fileName = window.location.pathname.split('/').pop().replace('.html', '');
    }

    const titleReadable = fileName ? fileName.replace(/_/g, ' ') : "Cours sans titre";
    
    // 2. CONNEXION BASE DE DONNÉES
    const globalDB = window.dbRessources || {};
    const resources = globalDB[fileName] || {};

    // 3. Fonction de Création de Bouton
    const getBtn = (key, icon, label, color) => {
        const link = resources[key]; 
        const isActive = link && link.length > 0;
        const opacity = isActive ? "1" : "0.3";
        const cursor = isActive ? "pointer" : "default";
        const onclick = isActive ? `window.open('${link}', '_blank')` : "return false;";
        const boxShadow = isActive ? `0 4px 12px ${color}40` : "none";

        return `
        <button 
            style="
                width:40px; height:40px; border-radius:50%; 
                background:white; color:${color}; border:1px solid ${color}40; 
                opacity:${opacity}; cursor:${cursor}; 
                display:flex; align-items:center; justify-content:center; 
                font-size:16px; margin:0 5px; transition:all 0.2s ease;
                box-shadow: ${boxShadow}; flex-shrink: 0; /* Empêche l'écrasement */
            " 
            onmouseover="if(${isActive}){ this.style.transform='translateY(-2px) scale(1.1)'; this.style.background='${color}'; this.style.color='white'; }" 
            onmouseout="if(${isActive}){ this.style.transform='translateY(0) scale(1)'; this.style.background='white'; this.style.color='${color}'; }"
            title="${label}" onclick="${onclick}">
            <i class="fa-solid ${icon}"></i>
        </button>`;
    };

    // 4. Création de la Toolbar (HTML)
    const toolbar = document.createElement('div');
    toolbar.id = "course-toolbar-injector";
    
    // --- CORRECTION RESPONSIVE ICI ---
    // On fixe le top à 95px (hauteur du header bleu + bordure or)
    toolbar.style.cssText = `
        position: fixed; 
        top: 95px; 
        left: 0; 
        right: 0; 
        background: rgba(255,255,255,0.98); 
        backdrop-filter: blur(10px); 
        border-bottom: 1px solid #D9A526; 
        padding: 10px 20px; 
        display: flex; 
        flex-wrap: wrap; /* Permet le passage à la ligne sur mobile */
        justify-content: space-between; 
        align-items: center; 
        gap: 10px;
        z-index: 8000; /* Juste en dessous du header */
        box-shadow: 0 4px 10px rgba(15, 44, 72, 0.05); 
        font-family: 'Outfit', sans-serif;
    `;

    toolbar.innerHTML = `
        <div style="font-weight:700; color:#0F2C48; font-size:16px; display:flex; align-items:center; min-width: 200px;">
            <i class="fa-solid fa-graduation-cap" style="color:#D9A526; margin-right:12px; font-size:20px;"></i>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:300px;">${titleReadable}</span>
        </div>
        
        <div style="display:flex; align-items:center; overflow-x: auto; padding-bottom: 5px;">
            ${getBtn('video', 'fa-video', 'Vidéo', '#ef4444')}
            ${getBtn('info', 'fa-chart-pie', 'Infographie', '#06b6d4')}
            ${getBtn('pres', 'fa-project-diagram', 'Présentation', '#f97316')}
            ${getBtn('pdf', 'fa-file-pdf', 'Document PDF', '#dc2626')}
            
            <div style="width:1px; height:30px; background:#e2e8f0; margin:0 15px;"></div>

            <button style="background:#fffbeb; color:#d97706; border:1px solid #fcd34d; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-left:5px; flex-shrink:0;" 
                    title="Ajouter à l'agenda" onclick="alert('Fonction Agenda : À venir !')">
                <i class="fa-solid fa-bell"></i>
            </button>

            <button style="background:#0F2C48; color:white; border:none; padding:8px 20px; border-radius:30px; font-size:13px; font-weight:700; margin-left:20px; cursor:pointer; transition:0.2s; white-space:nowrap;" 
                    onmouseover="this.style.transform='scale(1.05)'" 
                    onmouseout="this.style.transform='scale(1)'"
                    onclick="document.getElementById('course-toolbar-injector').style.display='none';">
                Masquer
            </button>
        </div>
    `;

    // 5. Injection
    document.body.appendChild(toolbar);

})();