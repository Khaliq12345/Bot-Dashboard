<template>
    <div>
        <!-- Main -->
        <div class="circular-progress-container">
    <div class="circular-progress"></div>
</div>
    </div>
</template>

<style>
.circular-progress-container {
    width: 100px; /* Largeur totale du cercle */
    height: 100px; /* Hauteur totale du cercle */
    border-radius: 50%; /* Rend le conteneur circulaire */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative; /* Pour positionner l'indicateur à l'intérieur */
    overflow: hidden; /* Important pour masquer les parties de la bordure */
}

.circular-progress {
    width: 90px; /* Taille du cercle intérieur (laisse une bordure pour le fond) */
    height: 90px;
    border-radius: 50%;
    border: 5px solid #eee; /* Couleur de fond de la progression (gris clair) */
    border-top: 5px solid #6cdb34; /* Couleur de la progression (bleu) */
    border-right: 5px solid #63db34; /* Pour créer un effet de "segment" */
    animation: spin 1s linear infinite; /* Animation de rotation */

    /* Si vous voulez un cercle complet sans fond visible,
       vous pouvez faire la bordure de fond sur le conteneur
       et la bordure de progression sur l'élément. */
    /* Alternative pour un cercle plein qui tourne sur un fond : */
    /*
    border: 5px solid #eee; // Bordure de fond
    border-top: 5px solid #3498db; // Bordure de progression
    border-right: 5px solid #3498db; // Répéter pour la progression
    border-bottom: 5px solid #3498db; // Répéter
    border-left: 5px solid #3498db; // Répéter
    */
    /* La clé est de masquer les bords qui ne tournent pas ou de faire un dégradé */
}

/* Keyframes pour l'animation de rotation */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Pour un indicateur plus simple avec juste une ligne qui tourne */
/* Un exemple plus simple et courant pour un chargement simple */
.simple-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(0, 0, 0, 0.1); /* Bordure de fond semi-transparente */
    border-left-color: #90db34; /* La couleur de la progression */
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
</style>
