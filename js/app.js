/*
 * Create a list that holds all of your cards
 */
var symbols = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// prepares card id using index and symbol
function generateId(index, symbol) {
	return 'card' + index + '_' + symbol;
}

// extracts symbol from card id
function getSymbolFromId(card) {
	var sepIndex = card.id.indexOf('_');
	return card.id.substr(sepIndex + 1);
}

// creates the LI for one card, with card<index>_<symbol> as id, and the symbol as content.
function createCard(index, symbol) {
	return '<li id="' + generateId(index, symbol) + '" class="card"><span class="fa fa-' + symbol + '"></span></li>';
}

// generates LI items inside UL with board id.
function createBoard() {
	var boardUl = $('#board');
	var gameSymbols = symbols.concat(symbols);
	var shuffledSymbols = shuffle(gameSymbols);
	shuffledSymbols.forEach(function(elem, index, arr) {
		boardUl.append(createCard(index, elem));
	});
}

createBoard();

// variable holding the "first" openedCard
var openedCard = null;
var movesCounter = 0;

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function showCard(card) {
	// class shows makes the icon visible. class open changes background color.
	$('#' + card.id).toggleClass("show open");
}

function showMatchedCard(card) {
	$('#' + card.id).toggleClass("show open match");
}

function lockCards(card1, card2) {
	showMatchedCard(card1);
	showMatchedCard(card2);
}

function incrementMoves() {
	movesCounter += 1;
	$('#counter').text(movesCounter);
}

// manages user movement, for both span or li events.
function manageMovement(card) {
	showCard(card);
	if (openedCard == null) {
		// first clicked card
		openedCard = card;
	} else {
		// second clicked card
		if (getSymbolFromId(card) === getSymbolFromId(openedCard)) {
			// matching cards
			lockCards(card, openedCard);
		} else {
			// no matching cards

		}
		incrementMoves();
		openedCard = null;
	}
}

function addListeners() {
	// it depends on where the user clicks we got the event on the span or the li element.
	$('#board').on('click', 'span', function(event) {
		event.stopPropagation();
		manageMovement(event.target.parentElement);
	});
	$('#board').on('click', 'li', function(event) {
		event.stopPropagation();
		manageMovement(event.target);
	});
}

addListeners();
