# Typescript Blackjack

A super console blackjack game I made to practice for a Triplebyte interview. From start to finish it took ~1h 45m.

To play just `npm i` and `ts-node blackjack.ts`

Sample output:

```
> ts-node blackjack.ts  
Would you like to play a new hand with the current deck (h) or get a fresh deck (d) or quit (q): h 
Dealing initial hands... 

Dealer Hand: | -  - | A  H |
Player Hand: | Q  D | 5  D |

Your hand: | Q  D | 5  D |

Would you like to hit (h) or stand (s): h 
Your hand: | Q  D | 5  D | 5  S | 

Would you like to hit (h) or stand (s): s 
dealers turn... 
Dealer's hand: | -  - | A  H |

Dealer hits...
Dealer's hand: | -  - | A  H | 4  S |

Dealer stands...
Final hands...
Dealer Hand: | 3  D | A  H | 4  S |
Player Hand: | Q  D | 5  D | 5  S |
You wins! 
Would you like to play a new hand with the current deck (h) or get a fresh deck (d) or quit (q): h 
Dealing initial hands... 

Dealer Hand: | -  - | 2  H |
Player Hand: | 9  H | 4  D |

Your hand: | 9  H | 4  D |

Would you like to hit (h) or stand (s): s 
dealers turn... 
Dealer's hand: | -  - | 2  H |

Dealer hits...
Dealer's hand: | -  - | 2  H | J  S |

Dealer hits...
Dealer's hand: | A  C | 2  H | J  S | Q  D |

Dealer busts! You win!
Would you like to play a new hand with the current deck (h) or get a fresh deck (d) or quit (q): h 
Dealing initial hands... 

Dealer Hand: | -  - | 10 D |
Player Hand: | 8  C | 5  H |

Your hand: | 8  C | 5  H |

Would you like to hit (h) or stand (s): h 
Your hand: | 8  C | 5  H | 6  S | 

Would you like to hit (h) or stand (s): h 
Your hand: | 8  C | 5  H | 6  S | 2  C | 

Would you like to hit (h) or stand (s): h 
Your hand: | 8  C | 5  H | 6  S | 2  C | Q  S | 

Bust! You lose!
Would you like to play a new hand with the current deck (h) or get a fresh deck (d) or quit (q):
```
