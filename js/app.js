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

// number of movements to hide each star
var STARS_LEVEL = [2, 4, 6]; // [15, 25, 35];
var starsNumber = STARS_LEVEL.length;
var visibleStars = starsNumber;

function createStar(index) {
	return '<li id="star' + index + '"><span class="fa fa-star"></span></li>';
}

function createStars() {
	var starsUL = $('#stars');
	for (var i = 0; i < starsNumber; i++) {
		starsUL.append(createStar(i));
	}
}

createStars();

// variable holding the "first" openedCard
var openedCard = null;
var movesCounter = 0;
var pairsToMatch = symbols.length;

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
	// remove show and open, add match
	$('#' + card.id).toggleClass("show open match");
}

function addMachedPair() {
	pairsToMatch -= 1;
	if (pairsToMatch === 0) {
		var starsString = visibleStars + " stars";
		if (visibleStars === 1) {
			starsString = visibleStars + " star";
		}
		alert("Congratulations!!! You have win with " + movesCounter + " movements. You're a " + starsString + " player!!");
	}
}

function lockCards(card1, card2) {
	showMatchedCard(card1);
	showMatchedCard(card2);
	setTimeout(function() {
		addMachedPair();
	}, 300);
}

// shows failed color, and 1 second later, hides the card
function showFailedCard(card) {
	// remove show and open, add failed
	$('#' + card.id).toggleClass("show open failed");
	setTimeout(function() {
		$('#' + card.id).toggleClass("failed");
	}, 500);
}

function hideCards(card1, card2) {
	showFailedCard(card1);
	showFailedCard(card2);
}

function hideStars() {
	var stars = $('#stars').children();
	visibleStars = starsNumber;
	STARS_LEVEL.forEach(function(elem, index, arr) {
		// for each star, check if it must be hidden
		if (movesCounter > elem) {
			var starIndex = STARS_LEVEL.length - index - 1; // to hide from right
			var starLi = $('#star' + starIndex);
			var starSpan = starLi.children();
			starSpan.removeClass("fa-star");
			starSpan.addClass("fa-star-o");
			visibleStars --;
		}
	});
}

function incrementMoves() {
	movesCounter += 1;
	$('#counter').text(movesCounter);
	hideStars();
}

// manages user movement, for both span or li events.
function manageMovement(card) {
	showCard(card);
	if (openedCard == null) {
		// first clicked card
		openedCard = card;
	} else {
		incrementMoves();
		// second clicked card
		if (getSymbolFromId(card) === getSymbolFromId(openedCard)) {
			// matching cards
			lockCards(card, openedCard);
		} else {
			// no matching cards
			hideCards(card, openedCard);
		}
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
