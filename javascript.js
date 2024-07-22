const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle-button');
const startButton = document.getElementById('start-button');
let pieces = [];

const imgSrc = 'gambar1.jpg'; // Ganti dengan path ke gambar Anda
const gridSize = 4;
const totalPieces = gridSize * gridSize;
const pieceSize = 100; // Ukuran potongan puzzle
let username = '';

startButton.addEventListener('click', () => {
    username = document.getElementById('username').value.trim();
    if (username === '') {
        alert('Silakan masukkan nama Anda untuk memulai puzzle.');
        return;
    }
    startPuzzle();
});

function startPuzzle() {
    // Kosongkan kontainer puzzle sebelum memulai baru
    puzzleContainer.innerHTML = '';
    pieces = [];

    // Lanjutkan dengan logika puzzle seperti sebelumnya
    createPuzzlePieces();
    renderPuzzle();
}

function createPuzzlePieces() {
    for (let i = 0; i < totalPieces - 1; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundImage = `url(${imgSrc})`;
        piece.style.backgroundPosition = `${(i % gridSize) * -pieceSize}px ${(Math.floor(i / gridSize)) * -pieceSize}px`;
        piece.style.left = `${(i % gridSize) * pieceSize}px`;
        piece.style.top = `${Math.floor(i / gridSize) * pieceSize}px`;
        piece.setAttribute('data-index', i);

        piece.addEventListener('touchstart', handleTouchStart);
        piece.addEventListener('touchmove', handleTouchMove);
        piece.addEventListener('touchend', handleTouchEnd);

        pieces.push(piece);
        puzzleContainer.appendChild(piece);
    }

    const emptyPiece = document.createElement('div');
    emptyPiece.classList.add('puzzle-piece', 'empty');
    pieces.push(emptyPiece);
    puzzleContainer.appendChild(emptyPiece);
}

function shufflePuzzle() {
    for (let i = pieces.length - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    renderPuzzle();
}

function renderPuzzle() {
    puzzleContainer.innerHTML = '';
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
}

function handleTouchStart(event) {
    event.preventDefault();
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    currentX = startX;
    currentY = startY;
}

function handleTouchMove(event) {
    event.preventDefault();
    currentX = event.touches[0].clientX;
    currentY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    event.preventDefault();
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) movePiece('right');
        else movePiece('left');
    } else {
        if (deltaY > 0) movePiece('down');
        else movePiece('up');
    }
}

function movePiece(direction) {
    const emptyPiece = pieces.find(p => p.classList.contains('empty'));
    const emptyIndex = pieces.indexOf(emptyPiece);

    let targetIndex;
    switch (direction) {
        case 'up':
            targetIndex = emptyIndex + gridSize;
            break;
        case 'down':
            targetIndex = emptyIndex - gridSize;
            break;
        case 'left':
            targetIndex = emptyIndex + 1;
            break;
        case 'right':
            targetIndex = emptyIndex - 1;
            break;
        default:
            return;
    }

    if (isValidMove(targetIndex, emptyIndex)) {
        [pieces[targetIndex], pieces[emptyIndex]] = [pieces[emptyIndex], pieces[targetIndex]];
        renderPuzzle();
    }
}

function isValidMove(targetIndex, emptyIndex) {
    const currentRow = Math.floor(targetIndex / gridSize);
    const currentCol = targetIndex % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    return (
        (currentRow === emptyRow && Math.abs(currentCol - emptyCol) === 1) ||
        (currentCol === emptyCol && Math.abs(currentRow - emptyRow) === 1)
    );
}

shuffleButton.addEventListener('click', shufflePuzzle);
