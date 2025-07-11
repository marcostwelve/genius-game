const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const statusDisplay = document.getElementById('status');

const buttons = [
    document.getElementById('button-0'),
    document.getElementById('button-1'),
    document.getElementById('button-2'),
    document.getElementById('button-3'),
];

/* Variáveis de jogo */

let sequence = [];
let playerSequece = [];
let score = 0;
let canPlayerClick = false;
let gameInProgress = false;

// --- Configurações de Som (Tone.js) ---
// Cria sintetizadores para cada cor. Usar sons diferentes ajuda na memorização.
const synths = [
    new Tone.Synth({oscillator: { type: 'sine'}, envelope: {attack: 0.1, decay: 0.1, sustain: 0.2, release: 0.2}}).toDestination(),
    new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 } }).toDestination(),
    new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 } }).toDestination(),
    new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 } }).toDestination(),
];

const notes = ['C4', 'E4', 'G4', 'A4']; /* notas para cada cor */

// --- Funções do Jogo ---

/**
 * Inicia um novo jogo ou reinicia o jogo atual.
*/

function startGame() {
    // Garante que o contexto de áudio seja iniciado por um gesto do usuário
    Tone.start();

    gameInProgress = true;
    sequence = [];
    playerSequece = [];
    score = 0;
    messageDisplay.textContent = '';
    scoreDisplay.textContent = '00';
    startButton.textContent = 'Reiniciar';
    statusDisplay.textContent = 'Observe';
    nextRound();
}

 /**
 * Avança para a próxima rodada, adicionando um novo passo à sequência.
 */
 function nextRound() {
    canPlayerClick = false;
    playerSequece = [];
    scoreDisplay.textContent = String(score).padStart(2, 0);
    statusDisplay.textContent = 'Observe';

    // Adiciona uma nova cor aleatória à sequência

    const newColor = Math.floor(Math.random() * 4);
    sequence.push(newColor);

    // Mostra a sequência para o jogador
    playSequece();
 }

 /**
 * Reproduz a sequência de cores e sons para o jogador.
 */
 function playSequece() {
    let i = 0;
    const interval = setInterval(() => {
        if (i < sequence.length) {
            lightUpButton(sequence[i]);
            i++;
        } else {
            clearInterval(interval);
            canPlayerClick = true; // Permite que o jogador comece a clicar
            statusDisplay.textContent = 'Sua vez';
        }
    }, 800) // Intervalo entre as luzes
 }

/**
 * Acende um botão, toca o som correspondente e o apaga em seguida.
 * @param {number} colorIndex - O índice da cor/botão (0-3).
 */

function lightUpButton(colorIndex) {
    const button = buttons[colorIndex];
    button.classList.add('lit');
    synths[colorIndex].triggerAttackRelease(notes[colorIndex], '8n');

    setTimeout(() => {
        button.classList.remove('lit');
    }, 400); // Duraçao da luz
}

/**
 * Lida com o clique do jogador em um dos botões coloridos.
 * @param {Event} event - O evento de clique.
 */

function handlePlayerClick(event) {
    if (!canPlayerClick || !gameInProgress) return;

    const clickedColor = parseInt(event.target.dataset.color);

    //Acende o botão clicado
    lightUpButton(clickedColor);
    playerSequece.push(clickedColor);

    // Verfica se o clique está correto
    const lastIndex = playerSequece.length - 1;
    if (playerSequece[lastIndex] !== sequence[lastIndex]) {
        endGame();
        return;
    }

    // Verifica se o jogador completou a sequência da rodada
    if (playerSequece.length === sequence.length) {
        score++;
        canPlayerClick = false; // Impede cliques enquanto a próxima rodada não começa
        statusDisplay.textContent = 'Correto!';
        setTimeout(nextRound, 1200); // Pausa antes da próxima rodada
    }
}

/**
 * Termina o jogo, mostrando a mensagem de "Game Over".
 */

function endGame() {
    gameInProgress = false;
    canPlayerClick = false;
    messageDisplay.textContent = 'Fim de Jogo!';
    statusDisplay.textContent = '';
    startButton.textContent = 'Jogar novamente';
    // Toca som de erro
    const errorSynth = new Tone.Synth().toDestination();
    errorSynth.triggerAttackRelease('B2', '4n');
}

startButton.addEventListener('click', startGame);
buttons.forEach(button => {
     // Usamos 'mousedown' para uma resposta mais rápida em desktops
     // e 'touchstart' para dispositivos móveis.

     button.addEventListener('mousedown', handlePlayerClick);
     button.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Previne eventos de mouse fantasma
        handlePlayerClick(e);
     })
})