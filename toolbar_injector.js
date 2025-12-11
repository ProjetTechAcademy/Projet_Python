// ======================================================================
// 🔧 MOTEUR DE LA BARRE D'OUTILS (MMPA🌹) - STYLE 2025 PREMIUM
// ======================================================================
(function() {
    
    // 1. IDENTIFICATION DU COURS
    const params = new URLSearchParams(window.location.search);
    let fileName = params.get('id');

    if (!fileName) {
        // Fallback si pas d'ID dans l'URL
        fileName = window.location.pathname.split('/').pop().replace('.html', '');
    }

    // Nettoyage du titre pour affichage (Enlève les underscores)
    const titleReadable = fileName ? fileName.replace(/_/g, ' ') : "Cours sans titre";
    
    // 2. CONNEXION BASE DE DONNÉES
    // On va chercher l'objet correspondant à l'ID dans database.js
    const globalDB = window.dbRessources || {};
    const resources = globalDB[fileName] || {};

    // 3. Fonction de Création de Bouton
    const getBtn = (key, icon, label, color) => {
        // On cherche la ressource (lien) dans l'objet resources
        const link = resources[key]; 
        
        // Est-ce actif ? (Y a-t-il un lien ?)
        const isActive = link && link.length > 0;
        
        // Styles dynamiques
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
                box-shadow: ${boxShadow};
            " 
            onmouseover="if(${isActive}){ this.style.transform='translateY(-2px) scale(1.1)'; this.style.background='${color}'; this.style.color='white'; }" 
            onmouseout="if(${isActive}){ this.style.transform='translateY(0) scale(1)'; this.style.background='white'; this.style.color='${color}'; }"
            title="${label}" onclick="${onclick}">
            <i class="fa-solid ${icon}"></i>
        </button>`;
    };

    // 4. Création de la Toolbar (HTML)
    const toolbar = document.createElement('div');
    toolbar.style.cssText = "position:fixed; top:0; left:0; right:0; background:rgba(255,255,255,0.95); backdrop-filter:blur(10px); border-bottom:4px solid #D9A526; padding:10px 20px; display:flex; justify-content:space-between; align-items:center; z-index:10000; box-shadow:0 10px 25px rgba(15, 44, 72, 0.1); font-family:'Outfit', sans-serif;";

    toolbar.innerHTML = `
        <div style="font-weight:700; color:#0F2C48; font-size:16px; display:flex; align-items:center;">
            <i class="fa-solid fa-graduation-cap" style="color:#D9A526; margin-right:12px; font-size:20px;"></i>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:500px;">${titleReadable}</span>
        </div>
        
        <div style="display:flex; align-items:center;">
            <!-- BOUTONS RESSOURCES (Connectés à database.js) -->
            ${getBtn('video', 'fa-video', 'Vidéo', '#ef4444')}
            ${getBtn('info', 'fa-chart-pie', 'Infographie', '#06b6d4')}
            ${getBtn('pres', 'fa-project-diagram', 'Présentation', '#f97316')}
            ${getBtn('pdf', 'fa-file-pdf', 'Document PDF', '#dc2626')}
            
            <div style="width:1px; height:30px; background:#e2e8f0; margin:0 15px;"></div>

            <!-- BOUTONS UTILITAIRES -->
            <button style="background:#fffbeb; color:#d97706; border:1px solid #fcd34d; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-left:5px;" 
                    title="Ajouter à l'agenda" onclick="alert('Fonction Agenda : À venir !')">
                <i class="fa-solid fa-bell"></i>
            </button>

            <button style="background:#0F2C48; color:white; border:none; padding:10px 24px; border-radius:30px; font-size:14px; font-weight:700; margin-left:20px; cursor:pointer; transition:0.2s;" 
                    onmouseover="this.style.transform='scale(1.05)'" 
                    onmouseout="this.style.transform='scale(1)'"
                    onclick="window.close()">
                Fermer
            </button>
        </div>
    `;

    // 5. Injection dans la page
    document.body.appendChild(toolbar);

})();