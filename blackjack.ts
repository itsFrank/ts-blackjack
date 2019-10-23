import * as rl from "readline-sync"

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

const THOROUGH_SHUFFLE : number = 500;
const DEALER_STOP_VALUE : number = 17;

let cardSuits : string[] = ["H", "C", "D", "S"]
let cardValues : string[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A"
];

class Card {
    private value : string;
    private suit: string;
    private score : number;
    // Convert value string to a point score
    private static valueStrToScore(value : string) : number {
        let score : number = parseInt(value);
        if (isNaN(score)) {
            switch (value) {
                case "J":
                    score = 10;
                    break;
                case "Q":
                    score = 10;
                    break;
                case "K":
                    score = 10;
                    break;
                case "A":
                    score = 1; // score of 1 will have a special clause in the Hand class to handle the duality of the Ace
                    break;
                default:
                    throw Error(`Card value ${value} is invalid`);
            }
        }
        return score;
    }

    constructor(value : string, suit : string) {
        this.value = value;
        this.suit = suit;
        this.score = Card.valueStrToScore(value);
    }

    public getPrintString() : string {
        return `| ${this.value}${this.value === "10" ? "" : " "} ${this.suit} `;
    }

    public getScore() : number {
        return this.score;
    }
}

// A hand of cards
class Hand {
    private cards : Card[] = []; // Cards in the hand
    private handValue : number[] = []; // All possible values for the current hand (only 1 if no aces are present)

    constructor() {
        this.handValue.push(0); // initialize hand to zero (no cards)
    }

    // Add a new card to the hand
    public addCard(card : Card) : void {
        this.cards.push(card);

        // Increment all possible hand values by value of new card
        for (let i = 0; i < this.handValue.length; i++) {
            this.handValue[i] += card.getScore();
        }

        // Generate new possible values if card being added is an ace
        if (card.getScore() == 1) {
            let numValues : number = this.handValue.length;
            for (let i = 0; i < numValues; i++) {
                this.handValue.push(this.handValue[i] + 10);
            }
        }
    }

    // If any permutation of the card values makes a blackjack
    public is21() : boolean {
        for (let value of this.handValue) {
            if (value == 21) return true;
        }
        return false;
    }

    // Check is all possible values of the hand are above 21
    public isBust() : boolean {
        for (let value of this.handValue) {
            if (value <= 21) return false;
        }
        return true;
    }

    // Find best score that is not a bust
    public bestValue() : number {
        let best : number = 0;

        for (let value of this.handValue) {
            if (value <= 21 && value > best) best = value;
        }

        return best;
    }

    getHandString(hideDealer : boolean = false) : string {
        let handString : string = ""
        for (let i = 0; i < this.cards.length; i++) {
            if (i == 0 && hideDealer) handString += "| -  - "
            else handString += this.cards[i].getPrintString();
        }
        handString += "|"
        
        return handString;
    }
}

// The deck cards are pulled from
class Deck {
    private cards : Card[] = [];

    constructor() {
        this.generateFreshDeck();
    }

    public generateFreshDeck() {
        // Construct fresh 52-card deck
        this.cards = [];

        for (let suit of cardSuits) {
            for (let value of cardValues) {
                this.cards.push(new Card(value, suit));
            }
        }

        this.shuffle(THOROUGH_SHUFFLE);
    }

    public shuffle(numSwaps : number) {
        for (let i = 0; i < numSwaps; i++) {
            let idxA = randomInt(0, this.cards.length);
            let idxB = randomInt(0, this.cards.length);
            
            let tmpCard : Card = this.cards[idxA];
            this.cards[idxA] = this.cards[idxB];
            this.cards[idxB] = tmpCard;
        }
    }

    printDeck() {
        for(let card of this.cards) {
            console.log(`${card.getPrintString()}| = ${card.getScore()}`)
        }
    }

    pickCard() : Card {
        if (this.cards.length == 0) { // deck ran out of cards
            console.log("Current deck ran out of cards, shuffling a fresh one...")
            this.generateFreshDeck();
        }
        return this.cards.pop(); // get next card in deck
    }
}

// Game initialization
console.log("Welcome to blackjack");

function printGameState(dealerHand : Hand, playerHand : Hand) {
    console.log("Dealer Hand: " + dealerHand.getHandString(true));
    console.log("Player Hand: " + playerHand.getHandString());
}

function playHand(deck : Deck) : number { // true 1 player wins, -1 if dealer wins, 0 if tie
    let dealerHand : Hand = new Hand();
    let playerHand : Hand = new Hand();

    console.log("Dealing initial hands...\n")
    dealerHand.addCard(deck.pickCard());
    dealerHand.addCard(deck.pickCard());
    playerHand.addCard(deck.pickCard());
    playerHand.addCard(deck.pickCard());

    let playerBlackjack : boolean = playerHand.is21();
    let dealerBlackjack : boolean = playerHand.is21();
    
    console.log("Dealer Hand: " + dealerHand.getHandString(true));
    console.log("Player Hand: " + playerHand.getHandString());
    console.log();

    if (playerBlackjack && dealerBlackjack) {
        console.log("Double Blackjack! Tie...");
        return 0;
    } else if (playerBlackjack) {
        console.log("Blackjack! You win!");
        return 1;
    } else if (dealerBlackjack) {
        console.log("Dealer Hand: " + dealerHand.getHandString());
        console.log("Dealer gets blackjack! You lose...");
        return -1;
    }

    // Player hand loop
    let playerDone : boolean = false;
    let playerBust : boolean = false;
    while (!playerDone) {
        console.log("Your hand: " + playerHand.getHandString() + "\n");
        let response : string = rl.question("Would you like to hit (h) or stand (s): ");

        if (response.toLowerCase() === "h") {
            playerHand.addCard(deck.pickCard()); // add card to player hand
            
            if (playerHand.isBust()) { // check for bust
                playerBust = true;
                playerDone = true;
            }
        } else if (response.toLowerCase() === "s") {
            playerDone = true;
        } else {
            console.log("Invalid input")
        }
    }

    if (playerBust) {
        console.log("Your hand: " + playerHand.getHandString() + "\n");
        console.log("Bust! You lose!")
        return -1;
    }

    // Dealer hand loop
    let dealerDone : boolean = false;
    let dealerBust : boolean = false;
    console.log("dealers turn...")
    while (!dealerDone) {
        console.log("Dealer's hand: " + dealerHand.getHandString(true) + "\n");

        // Dealer must hit
        if (dealerHand.bestValue() < DEALER_STOP_VALUE) {
            console.log("Dealer hits...")
            dealerHand.addCard(deck.pickCard());

            if (dealerHand.isBust()) { // check for bust
                dealerBust = true;
                dealerDone = true;
            }
        } else {
            console.log("Dealer stands...")
            dealerDone = true;
        }
    }

    if (dealerBust) {
        console.log("Dealer's hand: " + dealerHand.getHandString() + "\n");
        console.log("Dealer busts! You win!")
        return 1;
    }

    console.log("Final hands...");
    console.log("Dealer Hand: " + dealerHand.getHandString());
    console.log("Player Hand: " + playerHand.getHandString());

    if (dealerHand.bestValue() == playerHand.bestValue()) {
        console.log("Tie!");
        return 0;
    } else if (dealerHand.bestValue() >= playerHand.bestValue()) {
        console.log("Dealer wins!");
        return -1;
    } else if (dealerHand.bestValue() <= playerHand.bestValue()) {
        console.log("You wins!");
        return 1;
    }

    return 0;
}

// Main game loop
let gameOn : boolean = true;
while (gameOn) {
    let deck : Deck = new Deck();
    let response : string = rl.question("Would you like to play a new hand with the current deck (h) or get a fresh deck (d) or quit (q): ");
    if (response.toLowerCase() === "d") {
        console.log("Shuffling deck...");
        deck.generateFreshDeck();
    } else if (response.toLowerCase() === "h") {
        playHand(deck);
    } else if (response.toLowerCase() === "q") {
        gameOn = false;
    } else {
        console.log("Invalid input")
    }
}
