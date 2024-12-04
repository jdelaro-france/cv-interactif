const container = document.querySelector('.container');

// Fonction pour réinitialiser les descendants
function resetDescendants(id) {
    const descendants = document.querySelectorAll(`[data-parent-id="${id}"]`);
    descendants.forEach((descendant) => {
        resetDescendants(descendant.dataset.id); // Réinitialisation récursive
        descendant.classList.add('hidden'); // Cache pour replier
        setTimeout(() => descendant.remove(), 500); // Supprime après l'animation
    });
}

// Fonction pour créer un carré descendant avec un ID spécifique
function createSquare(parentId, dataId, contentFront, contentBack, direction) {
    const square = document.createElement('div');
    square.classList.add('square', 'hidden'); // Commence plié
    square.dataset.id = dataId;
    square.dataset.parentId = parentId;
    square.dataset.clickCount = '0'; // Compteur de clics
    square.dataset.direction = direction;

    // Assigner la classe de retournement en fonction de la direction
    if (direction === 'right') {
        square.classList.add('flip-horizontal');
    } else if (direction === 'left') {
        square.classList.add('flip-horizontal-reverse');
    } else if (direction === 'down') {
        square.classList.add('flip-vertical');
    }

    const front = document.createElement('div');
    front.classList.add('front');
    front.textContent = contentFront;

    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = contentBack;

    square.appendChild(front);
    square.appendChild(back);

    // Positionnement en fonction de la direction
    const parentSquare = document.querySelector(`[data-id="${parentId}"]`);
    const parentRect = parentSquare.getBoundingClientRect();

    const squareSize = parentRect.width;

    const parentLeft = parseFloat(parentSquare.style.left) || 0;
    const parentTop = parseFloat(parentSquare.style.top) || 0;

    if (direction === 'right') {
        square.style.left = `${parentLeft + squareSize}px`;
        square.style.top = `${parentTop}px`;
    } else if (direction === 'down') {
        square.style.left = `${parentLeft}px`;
        square.style.top = `${parentTop + squareSize}px`;
    } else if (direction === 'left') {
        square.style.left = `${parentLeft - squareSize}px`;
        square.style.top = `${parentTop}px`;
    }

    container.appendChild(square);

    setTimeout(() => {
        square.classList.remove('hidden'); // Déplie le carré
        square.classList.add('unfold');
    }, 50);

    // Gestion des clics sur le carré
    square.addEventListener('click', () => {
        // Vérifier si le carré a des descendants
        const hasDescendants = document.querySelector(`[data-parent-id="${square.dataset.id}"]`);

        if (hasDescendants) {
            // Si le carré a des descendants, on les replie
            resetDescendants(square.dataset.id);

            // Remettre le carré dans son état initial si nécessaire
            square.classList.remove('flip');
            square.dataset.clickCount = '0';

            // Si c'est le carré 2 et qu'il a été retourné, on le remet dans son état initial
            if (square.dataset.id === 'square-2' && square.classList.contains('flip')) {
                square.classList.remove('flip');
                square.dataset.clickCount = '0';
            }
        } else {
            // Si le carré n'a pas de descendants, on applique le comportement initial
            let clickCount = parseInt(square.dataset.clickCount, 10);

            // Incrémenter le compteur de clics
            clickCount += 1;
            square.dataset.clickCount = clickCount.toString();

            // Actions spécifiques en fonction de l'ID du carré
            if (square.dataset.id === 'square-2') {
                if (clickCount === 1) {
                    // Premier clic : Crée le carré 3 à droite
                    createSquare(square.dataset.id, 'square-3', 'Carré 3', 'Face arrière', 'right');
                } else if (clickCount === 2) {
                    // Deuxième clic : Crée le carré 4 en dessous et retourne le carré 2
                    createSquare(square.dataset.id, 'square-4', 'Carré 4', 'Face arrière', 'down');
                    square.classList.add('flip');
                }
            } else {
                // Retourner le carré
                square.classList.add('flip');

                switch (square.dataset.id) {
                    case 'square-3':
                        // Crée le carré 5 à droite
                        createSquare(square.dataset.id, 'square-5', 'Carré 5', 'Face arrière', 'right');
                        break;
                    case 'square-5':
                        // Crée le carré 6 en dessous
                        createSquare(square.dataset.id, 'square-6', 'Carré 6', 'Face arrière', 'down');
                        break;
                    case 'square-6':
                        // Crée le carré 7 en dessous
                        createSquare(square.dataset.id, 'square-7', 'Carré 7', 'Face arrière', 'down');
                        break;
                    case 'square-7':
                        // Crée le carré 8 à droite et le retourne immédiatement
                        const square8 = createSquare(square.dataset.id, 'square-8', 'Carré 8', 'Face arrière', 'right');
                        square8.classList.add('flip');
                        square8.dataset.clickCount = '1'; // Empêche les clics supplémentaires
                        break;
                    case 'square-4':
                        // Crée le carré 9 en dessous
                        createSquare(square.dataset.id, 'square-9', 'Carré 9', 'Face arrière', 'down');
                        break;
                    case 'square-9':
                        // Crée le carré 10 à gauche et le retourne immédiatement
                        const square10 = createSquare(square.dataset.id, 'square-10', 'Carré 10', 'Face arrière', 'left');
                        square10.classList.add('flip');
                        square10.dataset.clickCount = '1'; // Empêche les clics supplémentaires
                        break;
                    default:
                        // Aucun comportement pour les autres carrés
                        break;
                }
            }
        }
    });

    return square;
}

// Gestion de la couverture initiale
const initialSquare = document.querySelector('#square1');
initialSquare.dataset.id = 'square-1';
initialSquare.dataset.expanded = 'false';
initialSquare.style.left = '0px';
initialSquare.style.top = '0px';

// Assigner la classe de retournement pour le carré initial (vers la droite)
initialSquare.classList.add('flip-horizontal');

initialSquare.addEventListener('click', () => {
    // Vérifier si le carré initial a des descendants
    const hasDescendants = document.querySelector(`[data-parent-id="${initialSquare.dataset.id}"]`);

    if (hasDescendants) {
        // Replier tous les descendants
        resetDescendants(initialSquare.dataset.id);
        initialSquare.classList.remove('flip');
        initialSquare.dataset.expanded = 'false';
        initialSquare.dataset.clickCount = '0';
    } else {
        // Déplier le carré initial
        initialSquare.classList.add('flip');
        initialSquare.dataset.expanded = 'true';
        // Crée le carré 2 à droite
        createSquare('square-1', 'square-2', 'Carré 2', 'Face arrière', 'right');
    }
});
