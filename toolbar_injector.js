// ======================================================================
// 🔧 MOTEUR DE LA BARRE D'OUTILS (MMPA🌹) - STYLE 2025 PREMIUM
// CORRECTION V2 : Ajout du bouton de Validation de Cours (Progression)
// MISE À JOUR V3 : Intégration des liens externes (cours_links.js)
// ======================================================================
(function() {
    
    // 1. IDENTIFICATION DU COURS
    const params = new URLSearchParams(window.location.search);
    let fileName = params.get('id');

    if (!fileName) {
        // Fallback pour les fichiers locaux
        fileName = window.location.pathname.split('/').pop().replace('.html', '');
    }

    const courseID = fileName.split('/').pop().replace('.html', ''); // ID du cours (ex: B1_M01_S001_...)
    const titleReadable = courseID ? courseID.replace(/_/g, ' ') : "Cours sans titre";
    
    // 2. CONNEXION BASE DE DONNÉES
    // Assurez-vous que window.dbRessources est disponible (chargé par database.js)
    const dbRessources = window.dbRessources || {};
    const resources = dbRessources[courseID] || {};
    
    // NOUVEAU: Connexion aux liens PDF externes (chargé par cours_links.js)
    const externalPDFLinks = window.pdfLinks || {};
    const externalLink = externalPDFLinks[courseID] || null;


    // 3. LOGIQUE DE VALIDATION DE COURS DANS LE LOCALSTORAGE
    function markCourseAsCompleted() {
        if (!courseID || courseID === "Cours sans titre") {
            alert("Erreur : Impossible d'identifier le module à valider.");
            return;
        }

        // On utilise la clé 'devEliteProgress' mise à jour par Mon_Espace_Dev.html
        const progressKey = 'devEliteProgress';
        let progress = JSON.parse(localStorage.getItem(progressKey)) || {};
        
        // Marque le cours actuel comme complété
        if (!progress[courseID]) {
            progress[courseID] = { status: 'completed', date: new Date().toISOString() };
            localStorage.setItem(progressKey, JSON.stringify(progress));
            
            alert(`✅ Module "${courseID}" Validé ! Redirection vers le Dashboard...`);
        } else {
            if (confirm(`Le module "${courseID}" est déjà validé le ${new Date(progress[courseID].date).toLocaleDateString()}. Voulez-vous annuler la validation ?`)) {
                 delete progress[courseID];
                 localStorage.setItem(progressKey, JSON.stringify(progress));
                 alert(`❌ Module "${courseID}" dévalidé. Mise à jour du Dashboard...`);
            } else {
                 return; // Annule la redirection
            }
        }

        // Redirection vers le dashboard pour voir la mise à jour (simule le comportement utilisateur)
        window.location.href = "Mon_Espace_Dev.html";
    }
    
    // Rendre la fonction accessible depuis le scope global pour le bouton
    window.markCourseAsCompleted = markCourseAsCompleted;

    // 4. Fonction de Création de Bouton de Ressources
    const getBtn = (key, icon, label, color) => {
        let link = resources[key]; 
        let isIcon = true;
        let isExternal = false;
        
        // Cas spécial : Bouton Lien Externe (🔗)
        if (key === 'external_link') {
            link = externalLink;
            icon = '🔗'; // Utilise l'émoji comme icône
            isIcon = false;
            color = '#4f46e5'; // Indigo
            isExternal = true;
        }

        const isActive = link && link.length > 0; 
        const opacity = isActive ? "1" : "0.3";
        const cursor = isActive ? "pointer" : "default";
        const onclick = isActive ? `window.open('${link}', '_blank')` : "return false;";
        const boxShadow = isActive ? `0 4px 12px ${color}40` : "none";
        
        // Couleur pour l'état hover
        const hoverColor = isExternal ? '#4f46e5' : color;


        return `
        <button 
            style="
                width:40px; height:40px; border-radius:50%; 
                background:white; color:${hoverColor}; border:1px solid ${hoverColor}40; 
                opacity:${opacity}; cursor:${cursor}; 
                display:flex; align-items:center; justify-content:center; 
                font-size:16px; margin:0 5px; transition:all 0.2s ease;
                box-shadow: ${boxShadow}; flex-shrink: 0;
            " 
            onmouseover="if(${isActive}){ this.style.transform='translateY(-2px) scale(1.1)'; this.style.background='${hoverColor}'; this.style.color='white'; }" 
            onmouseout="if(${isActive}){ this.style.transform='translateY(0) scale(1)'; this.style.background='white'; this.style.color='${hoverColor}'; }"
            title="${label}" onclick="${onclick}">
            ${isIcon ? `<i class="fa-solid ${icon}"></i>` : icon}
        </button>`;
    };
    
    // 5. Création du Bouton de Validation Spécifique
    const validationBtn = `
        <button 
            id="validation-button-course"
            style="
                background: #0F2C48; color: #10b981; border: 2px solid #10b981; 
                padding: 8px 20px; border-radius: 30px; font-size: 13px; font-weight: 700; 
                margin-left: 20px; cursor: pointer; transition: 0.2s; white-space: nowrap; 
                display: flex; align-items: center; gap: 8px; flex-shrink: 0;
            " 
            onmouseover="this.style.background='#10b981'; this.style.color='#0F2C48';" 
            onmouseout="this.style.background='#0F2C48'; this.style.color='#10b981';"
            title="Valider la complétion de ce module" 
            onclick="markCourseAsCompleted()">
            <i class="fa-solid fa-check"></i>
            <span>Valider</span>
        </button>`;

    // 6. Création de la Toolbar (HTML)
    const toolbar = document.createElement('div');
    toolbar.id = "course-toolbar-injector";
    
    toolbar.style.cssText = `
        position: fixed; 
        left: 0; 
        right: 0; 
        background: rgba(255,255,255,0.98); 
        backdrop-filter: blur(10px); 
        border-bottom: 1px solid #D9A526; 
        padding: 10px 20px; 
        display: flex; 
        flex-wrap: wrap; 
        justify-content: space-between; 
        align-items: center; 
        gap: 10px;
        z-index: 9998; 
        box-shadow: 0 4px 10px rgba(15, 44, 72, 0.05); 
        font-family: 'Outfit', sans-serif;
        transition: top 0.3s ease-out; 
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
            ${getBtn('external_link', '', 'Lien externe Cours PDF', '#4f46e5')} <!-- NOUVEAU BOUTON -->
            
            <div style="width:1px; height:30px; background:#e2e8f0; margin:0 15px;"></div>
            
            ${validationBtn}
            
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

    // 7. Injection et Ajustement de la position TOP (Réutilisant la correction précédente)
    document.body.appendChild(toolbar);

    function updateToolbarPosition() {
        const header = document.getElementById('mainHeader'); 
        if (header) {
            const headerHeight = header.offsetHeight;
            toolbar.style.top = `${headerHeight}px`;
            
            const mainContent = document.querySelector('.main-content');
            if(mainContent) {
                const toolbarHeight = toolbar.offsetHeight;
                const totalOffset = headerHeight + toolbarHeight + 15;
                mainContent.style.paddingTop = `${totalOffset}px`;
            }
        } else {
            toolbar.style.top = '95px'; 
        }
        
        // Mise à jour de l'état du bouton "Valider" si le cours est déjà complété
        const progress = JSON.parse(localStorage.getItem('devEliteProgress')) || {};
        const isCompleted = !!progress[courseID];
        const validationBtnElement = document.getElementById('validation-button-course');
        
        if (validationBtnElement) {
            const span = validationBtnElement.querySelector('span');
            const icon = validationBtnElement.querySelector('i');
            
            if (isCompleted) {
                span.textContent = 'Dévalider';
                icon.className = 'fa-solid fa-undo';
                validationBtnElement.title = `Ce module est Validé ! Cliquez pour Dévalider.`;
                validationBtnElement.style.borderColor = '#B4792A'; // Bronze pour l'état d'achèvement/révision
                validationBtnElement.style.color = '#B4792A';
            } else {
                span.textContent = 'Valider';
                icon.className = 'fa-solid fa-check';
                validationBtnElement.title = `Valider la complétion de ce module`;
                validationBtnElement.style.borderColor = '#10b981'; // Vert pour la validation
                validationBtnElement.style.color = '#10b981';
            }
        }
    }
    
    window.addEventListener('load', updateToolbarPosition);
    window.addEventListener('resize', updateToolbarPosition);
    
    const resizeObserver = new ResizeObserver(updateToolbarPosition);
    const headerElement = document.getElementById('mainHeader');
    if (headerElement) {
        resizeObserver.observe(headerElement);
    }

})();