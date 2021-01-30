function blackjack (hitButton, standButton, resetButton) {
    this.hitButton = document.getElementById(hitButton);
    this.standButton = document.getElementById(standButton);
    this.resetButton = document.getElementById(resetButton);

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
    document.getElementById('blackjack-dealer').innerHTML = '';
    document.getElementById('blackjack-player').innerHTML = '';

    for (var i = 0; i < this.dealerCards.length; i++) {
        var img = document.createElement('img');

        if (i == 0 && !allCards) {
            img.src = "/src/gray_back.png";
        } else {
            img.src = "/src/" + this.dealerCards[i] + ".png";
        }
        document.getElementById('blackjack-dealer').appendChild(img);
    }

    for (var i = 0; i < this.playerCards.length; i++) {
        var img = document.createElement('img'); 
        img.src = "/src/" + this.playerCards[i] + ".png";
        document.getElementById('blackjack-player').appendChild(img);
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

    while (dealerTotal < 17 && !(dealerTotal > 21) && playerTotal < 21) {
        this.addCard(this.dealerCards);
        dealerTotal = this.calcTotal(this.dealerCards);
    }

    this.render(true);

    if (dealerTotal == playerTotal || (playerTotal > 21 && dealerTotal > 21)) {
        document.getElementById('blackjack-result').innerHTML = '<i class="fas fa-bell"></i> You drew';
        
    } else {
        if ((dealerTotal > 21 && playerTotal <= 21) || (playerTotal <= 21 && playerTotal > dealerTotal) || (playerTotal == 21 && dealerTotal != 21)) {
            document.getElementById('blackjack-result').innerHTML = '<i class="fas fa-trophy"></i> You won!';
            document.getElementById('blackjack-result').classList.add("win");
        } else {
            document.getElementById('blackjack-result').innerHTML = '<i class="fas fa-times"></i> You lost';
            document.getElementById('blackjack-result').classList.add("lose");
        }
    }

    document.getElementById('blackjack-result').classList.add("active");
}

blackjack.prototype.reset = function () {
    this.hitButton.disabled = false;
    this.standButton.disabled = false;
    document.getElementById('blackjack-result').innerHTML = 'Blank';
    document.getElementById('blackjack-result').classList = "";
    this.startGame();
}

new blackjack('hitButton', 'standButton', 'resetButton');