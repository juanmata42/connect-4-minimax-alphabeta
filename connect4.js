//funciones de cosas bonitas
document.getElementById("Mrebelde.png").style.display = "none";
document.getElementById("Mimperio.png").style.display = "none";
let epico = new Audio("Duel of the Fates.mp3");
let PJs = ["rebeldes.png", "rebeldes2.png", "imperio.png", "imperio2.png"]
let IAs = ["droide.png", "droide2.png", "droidemalo.png", "droidemalo2.png"]
let fichaTurno

//ending function
function end(ganador) {
    epico.pause();
    if (ganador === "rebeldes.png" || ganador === "rebeldes2.png") {
        let fanfarria = new Audio("rebelwin.mp3");
        fanfarria.play()
        document.getElementById("fin").style.background = 'url("rebelwin.gif")';
        document.getElementById("fin").style.backgroundSize = "cover";
        document.getElementById("fin").innerHTML = "Rebels Win"
        document.getElementById("fin").style.display = "block";
    } else if (ganador === "imperio.png" || ganador === "imperio2.png") {
        let fanfarria = new Audio("imperialwin.mp3");
        fanfarria.play()
        document.getElementById("fin").style.background = 'url("imperialwin.gif")';
        document.getElementById("fin").style.backgroundSize = "cover";
        document.getElementById("fin").innerHTML = "The Empire Wins"
        document.getElementById("fin").style.display = "block";
    } else if (ganador === "droide.png" || ganador === "droide2.png") {
        let fanfarria = new Audio("droidwin.mp3");
        fanfarria.play()
        document.getElementById("fin").style.background = 'url("droidwin.gif")';
        document.getElementById("fin").style.backgroundSize = "cover";
        document.getElementById("fin").innerHTML = "R2D2 Wins"
        document.getElementById("fin").style.display = "block";
    } else if (ganador === "droidemalo.png" || ganador === "droidemalo2.png") {
        let fanfarria = new Audio("Mdroidwin.mp3");
        fanfarria.play()
        document.getElementById("fin").style.background = 'url("Mdroidwin.gif")';
        document.getElementById("fin").style.backgroundSize = "cover";
        document.getElementById("fin").innerHTML = "Droids Win"
        document.getElementById("fin").style.display = "block";
    } else if (ganador === "empate") {
        let fanfarria = new Audio("peace.mp3");
        fanfarria.play()
        document.getElementById("fin").style.background = 'url("peace.gif")';
        document.getElementById("fin").style.backgroundSize = "cover";
        document.getElementById("fin").innerHTML = "tie"
        document.getElementById("fin").style.display = "block";
    }
}

//mouse follower
function mouseFollower(nave) {
    let raton = document.getElementById(nave);
    raton.style.display = "block"
    document.body.style.cursor = "url(cursor_vacio.png), auto";
    let allButtons = document.getElementsByTagName("button")
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].style.cursor = "url(cursor_vacio.png), auto";;
    }
    const onMouseMove = (e) => {
        raton.style.left = e.pageX + 'px';
        raton.style.top = e.pageY + 'px';
    }
    document.addEventListener('mousemove', onMouseMove);
}

//enfasis columna

Object.prototype.classHighlight = function(over = 'over') {

    const that = [...this],

        toggleHighlight = (event) => {
            that.forEach(
                (el) => el.classList.toggle(over, event.type === 'mouseenter')
            );
        };
    that.forEach(
        (element) => {
            element.addEventListener('mouseenter', toggleHighlight);
            element.addEventListener('mouseleave', toggleHighlight);
        });
};


//lo importante de verdad
/**
 * Crea un nuevo Board, hipotético o real
 * 
 * @constructor
 * @this {Board}
 * @param {Game} game el objeto principal del game
 * @param {array} field El campo de juego
 * @param {number} player el jugador actual
 */
function Board(game, field, player) {
    this.game = game
    this.field = field;
    this.player = player;
}

/**
 * Si se ha terminado "una" situación
 *
 * @param {number} depth profundidad
 * @param {number} score puntuación de la posición
 * @return {boolean}
 */
Board.prototype.isFinished = function(depth, score) {
    if (depth == 0 || score == this.game.score || score == -this.game.score || this.isFull()) {
        return true;
    }
    return false;
}

/**
 * Coloca en el Board actual (hipotético o real)
 *
 * @param {number} column number
 * @return {boolean} 
 */
Board.prototype.place = function(column) {
    // Check columna si es válida
    // 1. si no está vacía 2. si no se sale del board
    if (this.field[0][column] == null && column >= 0 && column < this.game.columns) {
        // Bottom to top
        for (let y = this.game.rows - 1; y >= 0; y--) {
            if (this.field[y][column] == null) {
                this.field[y][column] = this.player; // cambia para escribir el valor del jugador del momento
                break; // se termina al ponerlo
            }
        }
        this.player = this.game.switchRound(this.player);
        return true;
    } else {
        return false;
    }
}

/**
 * devuelve la puntuación de cada dirección
 *
 * @param {number} row
 * @param {number} column
 * @param {number} delta_y
 * @param {number} delta_x
 * @return {number}
 */
Board.prototype.scorePosition = function(row, column, delta_y, delta_x) {
    let human_points = 0;
    let computer_points = 0;

    // guarda posiciones ganadoras
    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    // determinamos puntuación con el número de espacios libres
    for (let i = 0; i < 4; i++) {
        if (this.field[row][column] == 0) {
            this.game.winning_array_human.push([row, column]);
            human_points++; // por cada ficha del jugador humano
        } else if (this.field[row][column] == 1) {
            this.game.winning_array_cpu.push([row, column]);
            computer_points++; // por cada ficha del jugador IA
        }

        // nos movemos por el board
        row += delta_y;
        column += delta_x;
    }

     // devuelve victoria o puntuación
    if (human_points == 4) {
        this.game.winning_array = this.game.winning_array_human;
        // IA (100000)
        return -this.game.score;
    } else if (computer_points == 4) {
        this.game.winning_array = this.game.winning_array_cpu;
        // Humano (-100000)
        return this.game.score;
    } else {
        // devuelve los puntos de la IA
        return computer_points;
    }
}

/**
 * Puntuación general del board
 *
 * @return {number}
 */
Board.prototype.score = function() {
    let points = 0;

    let vertical_points = 0;
    let horizontal_points = 0;
    let diagonal_points1 = 0;
    let diagonal_points2 = 0;

    // Verticales
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [x][x][ ][ ][ ][ ][ ] 1
    // [x][x][x][ ][ ][ ][ ] 2
    // [x][x][x][ ][ ][ ][ ] 3
    // [ ][x][x][ ][ ][ ][ ] 4
    // [ ][ ][x][ ][ ][ ][ ] 5
    for (let row = 0; row < this.game.rows - 3; row++) {
        for (let column = 0; column < this.game.columns; column++) {
            let score = this.scorePosition(row, column, 1, 0);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            vertical_points += score;
        }
    }

    // Horizontales
    //  0  1  2  3  4  5  6
    // [x][x][x][x][ ][ ][ ] 0
    // [ ][x][x][x][x][ ][ ] 1
    // [ ][ ][x][x][x][x][ ] 2
    // [ ][ ][ ][x][x][x][x] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (let row = 0; row < this.game.rows; row++) {
        for (let column = 0; column < this.game.columns - 3; column++) {
            let score = this.scorePosition(row, column, 0, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            horizontal_points += score;
        }
    }



    // Diagonales izq-abajo
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [ ][x][ ][ ][ ][ ][ ] 1
    // [ ][ ][x][ ][ ][ ][ ] 2
    // [ ][ ][ ][x][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (let row = 0; row < this.game.rows - 3; row++) {
        for (let column = 0; column < this.game.columns - 3; column++) {
            let score = this.scorePosition(row, column, 1, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points1 += score;
        }
    }

    // Diagonales izq-arriba
    // Possible situation
    //  0  1  2  3  4  5  6
    // [ ][ ][ ][x][ ][ ][ ] 0
    // [ ][ ][x][ ][ ][ ][ ] 1
    // [ ][x][ ][ ][ ][ ][ ] 2
    // [x][ ][ ][ ][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (let row = 3; row < this.game.rows; row++) {
        for (let column = 0; column <= this.game.columns - 4; column++) {
            let score = this.scorePosition(row, column, -1, +1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points2 += score;
        }

    }

    points = horizontal_points + vertical_points + diagonal_points1 + diagonal_points2;
    return points;
}

/**
 * comprueba si un board está lleno
 *
 * @return {boolean}
 */
Board.prototype.isFull = function() {
    for (let i = 0; i < this.game.columns; i++) {
        if (this.field[0][i] == null) {
            return false;
        }
    }
    return true;
}

/**
 * Devuelve copia del board
 *
 * @return {Board}
 */
Board.prototype.copy = function() {
    let new_board = new Array();
    for (let i = 0; i < this.field.length; i++) {
        new_board.push(this.field[i].slice());
    }
    return new Board(this.game, new_board, this.player);
}



/**
 * Minimax (+Alpha-Beta)
 */
function Game() {
    this.rows = 6; // Altura
    this.columns = 7; // Anchura
    this.status = 0; // 0: jugando, 1: ganado J1, 2: perdido J2, 3: empate
    this.depth = 4; // Profundidad
    this.score = 100000, // puntuación de victoria
    this.round = 0; // 0 o 1
    this.winning_array = []; // array de fichas ganadoras
    this.iterations = 0; // Iteration count

    that = this;

    that.init();
}

Game.prototype.init = function() {
    // Pinta el board real
    // con un array bidimensional
    let game_board = new Array(that.rows);
    for (let i = 0; i < game_board.length; i++) {
        game_board[i] = new Array(that.columns);

        for (let j = 0; j < game_board[i].length; j++) {
            game_board[i][j] = null;
        }
    }

    // crea el board desde el object
    this.board = new Board(this, game_board, 0);

    // crea el board visual
    game_board = "";
    for (let i = 0; i < that.rows; i++) {
        game_board += "<tr>";
        for (let j = 0; j < that.columns; j++) {
            game_board += `<td class='empty col${j}'></td>`;
        }
        game_board += "</tr>";
    }

    document.getElementById('game_board').innerHTML = game_board;

    // para los clicks, escuchando
    let td = document.getElementById('game_board').getElementsByTagName("td");

    for (let i = 0; i < td.length; i++) {
        if (td[i].addEventListener) {
            td[i].addEventListener('click', that.act, false);
        } else if (td[i].attachEvent) {
            td[i].attachEvent('click', that.act)
        }
    }
    document.getElementsByClassName('col0').classHighlight('lightsaber');
    document.getElementsByClassName('col1').classHighlight('lightsaber');
    document.getElementsByClassName('col2').classHighlight('lightsaber');
    document.getElementsByClassName('col3').classHighlight('lightsaber');
    document.getElementsByClassName('col4').classHighlight('lightsaber');
    document.getElementsByClassName('col5').classHighlight('lightsaber');
    document.getElementsByClassName('col6').classHighlight('lightsaber');

}

//player seleccionadores  qwerty  solo funciona de momento si eres pj y el segundo es robot
let players = 0
let player1 = {}
let player2 = {}

function P1Selector(celda) {
    let botonesp1 = [document.getElementById("rebeldes.png"), document.getElementById("imperio.png")]
    let seleccion = document.getElementById(celda.id);
    botones1 = botonesp1.map(cambiando => cambiando.disabled = true)
    botonesp1.splice(botonesp1.indexOf(seleccion), 1)
    botonessp1 = botonesp1.map(cambiando => cambiando.classList.replace("botonesSelectores", "noSeleccion"))
    seleccion.classList.replace("botonesSelectores", "seleccion")
    player1.personaje = seleccion.id
    if (seleccion.id === "rebeldes.png") {
        document.getElementById("rebeldes2.png").disabled = true;
        document.getElementById("rebeldes2.png").classList.replace("botonesSelectores", "noSeleccion")
        player1.cursor = "Mrebelde.png";
        mouseFollower(player1.cursor);
    } else if (seleccion.id === "imperio.png") {
        document.getElementById("imperio2.png").disabled = true;
        document.getElementById("imperio2.png").classList.replace("botonesSelectores", "noSeleccion")
        player1.cursor = "Mimperio.png";
        mouseFollower(player1.cursor);
    } else if (seleccion.id === "droide.png") {
        document.getElementById("droide2.png").disabled = true;
        document.getElementById("droide2.png").classList.replace("botonesSelectores", "noSeleccion")
        that.depth = 6
    } else if (seleccion.id === "droidemalo.png") {
        document.getElementById("droidemalo2.png").disabled = true;
        document.getElementById("droidemalo2.png").classList.replace("botonesSelectores", "noSeleccion")
        that.depth = 4
    }
    players += 1
    if (players === 2) {
        epico.play()
        fichaTurno = player1.personaje
    }
}

function P2Selector(celda) {
    let botonesp2 = [document.getElementById("rebeldes2.png"), document.getElementById("imperio2.png"), document.getElementById("droide2.png"), document.getElementById("droidemalo2.png")]
    let seleccion = document.getElementById(celda.id);
    botones2 = botonesp2.map(cambiando => cambiando.disabled = true)
    botonesp2.splice(botonesp2.indexOf(seleccion), 1)
    botonessp2 = botonesp2.map(cambiando => cambiando.classList.replace("botonesSelectores", "noSeleccion"))
    seleccion.classList.replace("botonesSelectores", "seleccion")
    player2.personaje = seleccion.id
    if (seleccion.id === "rebeldes2.png") {
        document.getElementById("rebeldes.png").disabled = true;
        document.getElementById("rebeldes.png").classList.replace("botonesSelectores", "noSeleccion")
        player2.cursor = "Mrebelde.png";
    } else if (seleccion.id === "imperio2.png") {
        document.getElementById("imperio.png").disabled = true;
        document.getElementById("imperio.png").classList.replace("botonesSelectores", "noSeleccion")
        player2.cursor = "Mimperio.png"
    } else if (seleccion.id === "droide2.png") {
        that.depth = 6
    } else if (seleccion.id === "droidemalo2.png") {
        that.depth = 4
    }
    players += 1
    if (players === 2) {
        epico.play()
        fichaTurno = player1.personaje
    }
}

/**
 * Al hacer click
 */
Game.prototype.act = function(e) {
    let element = e.target || window.event.srcElement;
    if (players === 2) {
        if (that.round == 0) {
            if (PJs.includes(player1.personaje)) { 
                that.place(element.cellIndex);
                if  (IAs.includes(player2.personaje)) { 
                    that.generateComputerDecision() } 
                } else if (IAs.includes(player1.personaje)) { 
                    that.generateComputerDecision() }
        }

        else if (that.round == 1) {
            if (PJs.includes(player2.personaje)) { 
                that.place(element.cellIndex) 
                if (IAs.includes(player1.personaje)) { 
                    that.generateComputerDecision() 
                }
            }
        }
    }
}
let firstRound=false;
Game.prototype.place = function(column) {
    // Si el juego no ha terminado
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        for (let y = that.rows - 1; y >= 0; y--) {
            if (document.getElementById('game_board').rows[y].cells[column].classList.contains('empty')) {
                if (that.round == 1) {
                    document.getElementById('game_board').rows[y].cells[column].classList.remove('empty');
                    document.getElementById('game_board').rows[y].cells[column].classList.add('coin', 'cpu-coin');
                    let img = document.createElement("img");
                    img.src = player2.personaje;
                    document.getElementById('game_board').rows[y].cells[column].appendChild(img);
                } else {
                    document.getElementById('game_board').rows[y].cells[column].classList.remove('empty');
                    document.getElementById('game_board').rows[y].cells[column].classList.add('coin', 'human-coin');
                    let img = document.createElement("img");
                    img.src = player1.personaje;
                    document.getElementById('game_board').rows[y].cells[column].appendChild(img);
                }
                break;
            }
        }

        if (!that.board.place(column)) {
            return alert("Columna llena");
        }


        that.round = that.switchRound(that.round);
        that.updateStatus();
    }
}

Game.prototype.generateComputerDecision = function() {
    
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        that.iterations = 0; // Reset iteration count

        // AI is thinking
        players = 1
        setTimeout(function() {
            // llama al algoritmo
            let ai_move = that.maximizePlay2(that.board, that.depth);
            // Coloca decisión de la IA
            that.place(ai_move[0]);
            
        }, 100);
        players = 2
    } 
}

/**
 * Algorithm
 * Minimax principle
 */
 //si IA es player 2
Game.prototype.maximizePlay2 = function(board, depth, alpha, beta) {
    // pilla la puntuación del board
    let score = board.score();

    // Break si se ha terminado
    if (board.isFinished(depth, score)) return [null, score];

    // Column, Score
    let max = [null, -99999];

    // para todos los posibles movimientos
    for (let column = 0; column < that.columns; column++) {
        let new_board = board.copy(); // Crea un nuevo board

        if (new_board.place(column)) {

            that.iterations++; // Debug

            let next_move = that.minimizePlay2(new_board, depth - 1, alpha, beta); // Recursive calling

            // evalua el nuevo movimiento
            if (max[0] == null || next_move[1] > max[1]) {
                max[0] = column;
                max[1] = next_move[1];
                alpha = next_move[1];
            }

            if (alpha >= beta) return max;
        }
    }

    return max;
}

Game.prototype.minimizePlay2 = function(board, depth, alpha, beta) {
    let score = board.score();

    if (board.isFinished(depth, score)) return [null, score];

    // Column, score
    let min = [null, 99999];

    for (let column = 0; column < that.columns; column++) {
        let new_board = board.copy();

        if (new_board.place(column)) {

            that.iterations++;

            let next_move = that.maximizePlay2(new_board, depth - 1, alpha, beta);

            if (min[0] == null || next_move[1] < min[1]) {
                min[0] = column;
                min[1] = next_move[1];
                beta = next_move[1];
            }

            if (alpha >= beta) return min;

        }
    }
    return min;
}

Game.prototype.switchRound = function(round) {
    if (round == 0) {
        document.getElementById("Mrebelde.png").style.display = "none";
      document.getElementById("Mimperio.png").style.display = "none";
      if (PJs.includes(player2.personaje))
        {mouseFollower(player2.cursor)}
      fichaTurno = player2.personaje
        return 1;
    } else {
        document.getElementById("Mrebelde.png").style.display = "none";
      document.getElementById("Mimperio.png").style.display = "none";
      if (PJs.includes(player1.personaje))
        {mouseFollower(player1.cursor)}
      fichaTurno = player1.personaje
        return 0;
    }
}

Game.prototype.updateStatus = function() {
    // P1gana
    if (that.board.score() == -that.score) {
        that.status = 1;
        that.markWin();
        end(player1.personaje);
    }

    // P2gana
    if (that.board.score() == that.score) {
        that.status = 2;
        that.markWin();
        end(player2.personaje);
    }

    // Empate
    if (that.board.isFull()) {
        that.status = 3;
        end("empate");
    }


}

Game.prototype.markWin = function() {
    document.getElementById('game_board').className = "finished";
    for (let i = 0; i < that.winning_array.length; i++) {
        let name = document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className;
        document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className = name + " win";
    }
}

Game.prototype.restartGame = function() {
    location.reload();
}

/**
 * Start game
 */
function Start() {
    window.Game = new Game();
}

window.onload = function() {
    Start()
};