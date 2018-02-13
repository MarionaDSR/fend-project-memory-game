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

// resets the board, emptying existing LI and creating the new ones.
function resetBoard() {
	var boardUl = $('#board');
	boardUl.empty();
	createBoard();	
}

// number of movements to hide each star
var STARS_LEVEL = [15, 25, 35]; // [2, 4, 6];
var starsNumber = STARS_LEVEL.length;
var visibleStars;

// creates the LI for one star
function createStar(index) {
	return '<li id="star' + index + '"><span class="fa fa-star"></span></li>';
}

// generates LI items inside UL with stars id.
function createStars() {
	var starsUL = $('#stars');
	for (var i = 0; i < starsNumber; i++) {
		starsUL.append(createStar(i));
	}
}

// resets the stars, emptying existing LI and creating the new ones.
function resetStars() {
	var starsUL = $('#stars');
	starsUL.empty();
	createStars();	
}

var openedCard; // variable holding the "first" openedCard to be able to compare it with the second one
var movesCounter;
var pairsToMatch;
var initTime; // to see the lapse of time

var timerTimeOut; // to be able to stop timer

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

 // makes a card visible
function showCard(card) {
	// class shows makes the icon visible. class open changes background color.
	$('#' + card.id).toggleClass("show open");
}

// keeps a card visible after matching
function showMatchedCard(card) {
	// remove show and open, add match
	$('#' + card.id).toggleClass("show open match");
}

// decreases the number of pairs to match. If game done, tells user
function addMachedPair() {
	pairsToMatch -= 1;
	if (pairsToMatch === 0) {
		var starsString = visibleStars + " stars";
		if (visibleStars === 1) {
			starsString = visibleStars + " star";
		}
		var formatedTime = formatSeconds(getSeconds());
		if (confirm("Congratulations!!! You have win with " + movesCounter + " movements in " + formatedTime + ". You're a " + starsString + " player!!" + 
			"\nDo you want to play again?")) {
			restartGame();
		} else {
			stopTimer();
		}
	}
}

// shows matched cards and does necessary business to control the end of the game
function lockCards(card1, card2) {
	showMatchedCard(card1);
	showMatchedCard(card2);
	setTimeout(function() {
		addMachedPair();
	}, 300);
}

// shows failed color, and half a second later, hides the card
function showFailedCard(card) {
	// remove show and open, add failed
	$('#' + card.id).toggleClass("show open failed");
	setTimeout(function() {
		$('#' + card.id).toggleClass("failed");
	}, 500);
}

// hides the two cards
function hideCards(card1, card2) {
	showFailedCard(card1);
	showFailedCard(card2);
}

// checks if the number of movements requires to hide an star, and hides it
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

// increments movement counter, updates UI: number of movements and stars
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

// adds listeners for cards and reset button
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
	$('.restart').on('click', 'span', function(event) {
		restartGame();
	})
}

// formats seconds to mm:ss
// method taken from https://stackoverflow.com/a/17781037
function formatSeconds(seconds)
{
    var date = new Date(1970,0,1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

// calculates the number of seconds from initTime to now
function getSeconds() {
	var currentTime = new Date().getTime();
	var seconds = (currentTime - initTime) / 1000;
	return seconds;	
}

// updates timer with current seconds, every second
function updateTimer() {
	var formatedTime = formatSeconds(getSeconds());
	$('#timer').text(formatedTime);
	timerTimeOut = setTimeout(updateTimer, 1000);
}

// stops timer
function stopTimer() {
	clearTimeout(timerTimeOut);
}

// shows timer, starting its update loop
function showTimer() {
	updateTimer();
}

// init variables for a new game
function initCounters() {
	openedCard = null;
	movesCounter = 0;
	pairsToMatch = symbols.length;
	visibleStars = starsNumber;
	initTime = new Date().getTime();
}

// init variables for a new game and updates user interface for moves
function resetCounters() {
	initCounters();
	$('#counter').text(movesCounter);
}

// stops timer and stars a new one
function resetTimer() {
	stopTimer();
	updateTimer();
}

// resets game elements: board, stars, counters, timer
function restartGame() {
	resetBoard();
	resetStars();
	resetCounters();
	resetTimer();
}

// inits a new game
function initGame() {
	createBoard();
	createStars();
	initCounters();
	addListeners();
	showTimer();
}

initGame();