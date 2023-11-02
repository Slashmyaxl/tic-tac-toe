const gameboard = (function () {

    const gameboardDisplay = document.querySelector('.gameboard');
    const rows = 3;
    const columns = 3;
    let board = [];

    for(i = 0; i < rows; i++) {
        board[i] = [];
        for(j = 0; j < columns; j++) {
            board[i].push('');
        }
    };

    const clearBoard = function () { 
        board = board.map(row => row.map(index => index = ''));
    };

    const getBoard = () => board;

    const displayBoard = function () {

        while(gameboardDisplay.firstChild) {
            gameboardDisplay.removeChild(gameboardDisplay.lastChild);
        }

        board.forEach((row) => {

            for (i = 0; i < row.length; i++) {
                    const square = document.createElement('div');
                    square.setAttribute('class', 'square')
                    square.setAttribute('id', `${board.indexOf(row)}, ${[i]}`);
                    square.textContent = row[i];
                    gameboardDisplay.appendChild(square);
                }
            });
        };
    
    const placeMarker = function (row, column, player) {
        board[row][column] = player.marker;
        displayBoard();
    }

    displayBoard();
    return {getBoard, displayBoard, clearBoard, placeMarker}
})();


function createPlayer(name, marker) {
    function declareWinner() {
        return `Game Over. ${this.name} wins!`;
    }
    return {name, marker, declareWinner};
}


const gameController = (function () {
    
    const players = [];
    let activePlayer;
    const marquee = document.querySelector('.marquee');
    
    const gatherPlayers = () => {
        const startButton = document.getElementById('start');
        
        startButton.addEventListener('click', (event) => {
        event.preventDefault();
        const matchup = document.querySelector('.matchup');
        const p1Input = document.getElementById('p1-name');
        const p2Input = document.getElementById('p2-name');

        players[0] = createPlayer(p1Input.value, 'X');
        players[1] = createPlayer(p2Input.value, 'O');

        matchup.textContent = `(${players[0].marker}) ${players[0].name} vs. ${players[1].name} (${players[1].marker})`;
        startNewGame();
        });  
    };

    const startNewGame = () => {
        gameboard.clearBoard();
        gameboard.displayBoard();
        activePlayer = players[0];
        marquee.textContent = `${players[0].name}'s turn...`
        getPlayerChoice(); 
    }

    const getPlayerChoice = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('click', () => {
                playRound(square.id.charAt(0), square.id.charAt(3))
                });
        }); 
    };

    const playRound = function (row, column) {
        if (gameboard.getBoard()[row][column] === '') {
            gameboard.placeMarker(row, column, getActivePlayer());
            return isGameOver() === true
            ? getActivePlayer().declareWinner() 
            : switchPlayer();    
        } else {
            marquee.textContent = 'Please select a valid square!';
            return;
        };
    };

    const switchPlayer = function () {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        marquee.textContent = `${activePlayer.name}'s turn...`
        getPlayerChoice();
    };

    const getActivePlayer = () => activePlayer;

    const isGameOver = () => {

        const board = gameboard.getBoard();
        const emptySquaresExist = board.flat().includes('');
        let winner;
          
        const checkRows = () => {
            for (i = 0; i < board.length; i++) {
                !board[i].includes('O') && !board[i].includes('')
                ? winner = players[0]
                : !board[i].includes('X') && !board[i].includes('')
                ? winner = players[1]
                : winner;
            };
            checkColumns();
        }

        const checkColumns = () => {
            const cols = [
                [board[0][0], board[1][0], board[2][0]], 
                [board[0][1], board[1][1], board[2][1]],
                [board[0][2], board[1][2], board[2][2]]
            ];

            for (i = 0; i < cols.length; i++) {
                !cols[i].includes('O') && !cols[i].includes('')
                ? winner = players[0]
                : !cols[i].includes('X') && !cols[i].includes('')
                ? winner = players[1]
                : winner;
            };
            checkDiags();  
        }

        const checkDiags = () => {
            const diags = [
                [board[0][0], board[1][1], board[2][2]], 
                [board[0][2], board[1][1], board[2][0]]
            ];

            for (i = 0; i < diags.length; i++) {
                !diags[i].includes('O') && !diags[i].includes('')
                ? winner = players[0]
                : !diags[i].includes('X') && !diags[i].includes('')
                ? winner = players[1]
                : winner;
            };  
        }

        const checkTie = () => {
            if (!emptySquaresExist) { return true }
        }

        checkRows();

        winner ? marquee.textContent = winner.declareWinner()
        : checkTie() ? marquee.textContent = 'Tie Game!'
        : marquee.textContent = '';
        
        return winner || checkTie() ? true : false;       
    }

    gatherPlayers();
})();