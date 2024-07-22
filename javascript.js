const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle-button');
let pieces = [];

const imgSrc = 'gambar1.jpg'; // Ganti dengan path ke gambar Anda
const gridSize = 4;
const totalPieces = gridSize * gridSize;
const pieceSize = 100; // Ukuran potongan puzzle

let startX, startY;

function createPuzzlePieces() {
    for (let i = 0; i < totalPieces - 1; i++) { // Kurangi satu potongan untuk potongan yang kosong
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

function handleTouchStart(event) {
    event.preventDefault(); // Mencegah perilaku bawaan sentuhan
    startX = event.touches[0].clientX; // Simpan posisi awal X
    startY = event.touches[0].clientY; // Simpan posisi awal Y
}

function handleTouchMove(event) {
    event.preventDefault(); // Mencegah perilaku bawaan sentuhan
    // Memastikan sentuhan dimulai pada potongan puzzle
    if (event.target.classList.contains('puzzle-piece')) {
        const piece = event.target;
        const currentIndex = pieces.indexOf(piece);
        const emptyPiece = pieces.find(p => p.classList.contains('empty'));
        const emptyIndex = pieces.indexOf(emptyPiece);

        // Menghitung pergeseran sentuhan
        const deltaX = event.touches[0].clientX - startX;
        const deltaY = event.touches[0].clientY - startY;

        // Menentukan arah swipe berdasarkan pergeseran
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0 && isValidMove(currentIndex, emptyIndex - 1)) {
                movePiece(piece, emptyPiece);
            } else if (deltaX < 0 && isValidMove(currentIndex, emptyIndex + 1)) {
                movePiece(piece, emptyPiece);
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && isValidMove(currentIndex, emptyIndex - gridSize)) {
                movePiece(piece, emptyPiece);
            } else if (deltaY < 0 && isValidMove(currentIndex, emptyIndex + gridSize)) {
                movePiece(piece, emptyPiece);
            }
        }
    }
}

function handleTouchEnd(event) {
    event.preventDefault(); // Mencegah perilaku bawaan sentuhan
    renderPuzzle();
}

function movePiece(piece, emptyPiece) {
    const currentIndex = pieces.indexOf(piece);
    const emptyIndex = pieces.indexOf(emptyPiece);

    // Tukar posisi potongan puzzle
    [pieces[currentIndex], pieces[emptyIndex]] = [pieces[emptyIndex], pieces[currentIndex]];
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
