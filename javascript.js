const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle-button');
let pieces = [];

const imgSrc = 'gambar1.jpg'; // Ganti dengan path ke gambar Anda
const gridSize = 4;
const totalPieces = gridSize * gridSize;
const pieceSize = 100; // Ukuran potongan puzzle

function createPuzzlePieces() {
    for (let i = 0; i < totalPieces - 1; i++) { // Kurangi satu potongan untuk potongan yang kosong
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundImage = `url(${imgSrc})`;
        piece.style.backgroundPosition = `${(i % gridSize) * -pieceSize}px ${(Math.floor(i / gridSize)) * -pieceSize}px`;
        piece.style.left = `${(i % gridSize) * pieceSize}px`;
        piece.style.top = `${Math.floor(i / gridSize) * pieceSize}px`;
        piece.setAttribute('data-index', i);

        piece.addEventListener('click', () => movePiece(piece));

        pieces.push(piece);
        puzzleContainer.appendChild(piece);
    }

    // Tambahkan potongan kosong sebagai potongan terakhir
    const emptyPiece = document.createElement('div');
    emptyPiece.classList.add('puzzle-piece', 'empty');
    pieces.push(emptyPiece);
    puzzleContainer.appendChild(emptyPiece);
}

function shufflePuzzle() {
    for (let i = pieces.length - 2; i > 0; i--) { // Kurangi satu potongan untuk potongan yang kosong
        const j = Math.floor(Math.random() * i);
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    renderPuzzle();
}

function renderPuzzle() {
    puzzleContainer.innerHTML = ''; // Kosongkan kontainer puzzle
    pieces.forEach(piece => puzzleContainer.appendChild(piece)); // Tambahkan kembali potongan-potongan sesuai urutan acak
}

function movePiece(piece) {
    const emptyPiece = pieces.find(p => p.classList.contains('empty'));
    const currentIndex = pieces.indexOf(piece);
    const emptyIndex = pieces.indexOf(emptyPiece);

    if (isValidMove(currentIndex, emptyIndex)) {
        // Tukar posisi potongan puzzle
        [pieces[currentIndex], pieces[emptyIndex]] = [pieces[emptyIndex], pieces[currentIndex]];
        renderPuzzle();
    }
}

function isValidMove(currentIndex, emptyIndex) {
    // Mendapatkan koordinat baris dan kolom untuk potongan puzzle
    const currentRow = Math.floor(currentIndex / gridSize);
    const currentCol = currentIndex % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    // Memeriksa apakah potongan puzzle dapat digerakkan ke potongan kosong
    return (
        (currentRow === emptyRow && Math.abs(currentCol - emptyCol) === 1) || // Bergerak horizontal
        (currentCol === emptyCol && Math.abs(currentRow - emptyRow) === 1) // Bergerak vertikal
    );
}

shuffleButton.addEventListener('click', shufflePuzzle);

createPuzzlePieces();
renderPuzzle();
