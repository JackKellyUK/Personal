function blackjack (hitButton, standButton, resetButton, resultNot) {
    this.hitButton = document.getElementById(hitButton);
    this.standButton = document.getElementById(standButton);
    this.resetButton = document.getElementById(resetButton);
    this.resultNot = document.getElementById(resultNot);

    this._init();
}

blackjack.prototype._init = function () {
    this.startNewGame();

    this.hitButton.addEventListener("click",this.hit.bind(this));
    this.standButton.addEventListener("click",this.endGame.bind(this));
    this.resetButton.addEventListener("click",this.reset.bind(this));
}

blackjack.prototype.startNewGame = function () {
    this.getDeckValues();
    this.createDeck();
    this.startGame();
}

blackjack.prototype.startGame = function () {
    this.playerCards = [];
    this.dealerCards = [];

    //Add 2 players cards
    this.addCard(this.playerCards);
    this.addCard(this.playerCards);

    //Add 2 dealer cards
    this.addCard(this.dealerCards);
    this.addCard(this.dealerCards);

    this.render(false);

    if (this.calcTotal(this.playerCards) >= 21) {
        this.endGame();
    }
}

blackjack.prototype.getDeckValues = function () {
    this.deckValues = {};
    var suits = ['H','C','D','S'];
    
    for (var suitCount = 0; suitCount < 4; suitCount++) {
        for (var numberCount = 1; numberCount < 14; numberCount++) {
            this.deckValues[(numberCount + suits[suitCount])] = numberCount;
        }
    }
}

blackjack.prototype.createDeck = function () {
    this.deck = [];
    var suits = ['H','C','D','S'];
    
    for (var suitCount = 0; suitCount < 4; suitCount++) {
        for (var numberCount = 1; numberCount < 14; numberCount++) {
            this.deck.push(numberCount + suits[suitCount]);
        }
    }
}

blackjack.prototype.addCard = function (array) {

    if (this.deck.length < 1) {
        this.createDeck();
    }

    var random = this.deck[Math.floor(Math.random()*this.deck.length)];

    array.push(random);

    var index = this.deck.indexOf(random);
    if (index > -1) {
        this.deck.splice(index, 1);
    }
}

blackjack.prototype.calcTotal = function (array) {
    var total = 0;
    var aces = 0;

    for (var arrCount = 0; arrCount < array.length; arrCount++) {
        value = this.deckValues[array[arrCount]]
        total += Math.min(value,10);

        if (value == 1) {
            aces++;
        }
    }

    for (var aceCount = 0; aceCount < aces; aceCount++) {
        if (total + 10 <= 21) {
            total += 10;
        }
    }

    return total;
}

blackjack.prototype.render = function (allCards) {
    var dealerParent = document.getElementById("blackjack-dealer").getElementsByTagName('img');
    var playerParent = document.getElementById("blackjack-player").getElementsByTagName('img');

    for (var i = 0; i < this.dealerCards.length; i++) {

        if (i == 0 && !allCards) {
            dealerParent[i].src = "/src/gray_back.png";
        } else {
            dealerParent[i].src = "/src/" + this.dealerCards[i] + ".png";
        }
    }

    for (var i = 0; i < this.playerCards.length; i++) {
        playerParent[i].src = "/src/" + this.playerCards[i] + ".png";
    }
}

blackjack.prototype.hit = function () {
    this.addCard(this.playerCards);
    this.render(false);

    if (this.calcTotal(this.playerCards) >= 21) {
        this.endGame();
    }
}

blackjack.prototype.endGame = function () {
    this.hitButton.disabled = true;
    this.standButton.disabled = true;

    var playerTotal = this.calcTotal(this.playerCards);
    var dealerTotal = this.calcTotal(this.dealerCards);

    while (dealerTotal < 17 && !(dealerTotal > 21)) {
        this.addCard(this.dealerCards);
        dealerTotal = this.calcTotal(this.dealerCards);
    }

    this.render(true);

    if (dealerTotal == playerTotal || (playerTotal > 21 && dealerTotal > 21)) {
        this.resultNot.innerHTML = '<i class="fas fa-bell"></i> You drew';
        
    } else {
        if ((dealerTotal > 21 && playerTotal <= 21) || (playerTotal <= 21 && playerTotal > dealerTotal) || (playerTotal == 21 && dealerTotal != 21)) {
            this.resultNot.innerHTML = '<i class="fas fa-trophy"></i> You won!';
            this.resultNot.classList.add("win");
        } else {
            this.resultNot.innerHTML = '<i class="fas fa-times"></i> You lost';
            this.resultNot.classList.add("lose");
        }
    }

    this.resultNot.classList.add("active");
}

blackjack.prototype.reset = function () {
    this.hitButton.disabled = false;
    this.standButton.disabled = false;

    this.resultNot.classList = "";
    this.resultNot.innerHTML = 'Blank';

    var dealerParent = document.getElementById("blackjack-dealer").getElementsByTagName('img');
    var playerParent = document.getElementById("blackjack-player").getElementsByTagName('img');

    console.log(dealerParent);

    for (var i = 0; i < 7; i++) {
        dealerParent[i].src = "/src/blank.png";
        playerParent[i].src = "/src/blank.png";
    }

    this.startGame();
}

new blackjack('hitButton', 'standButton', 'resetButton', 'blackjack-result');