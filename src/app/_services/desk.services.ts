import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Observable } from 'rxjs';
import { Deck } from '../_models/deck.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class DeckService {
    private deck: Deck[] = [];
    private deckSubject = new BehaviorSubject<Deck[]>([]);

    constructor() { }

    addToDeck(deck: Deck): boolean {
        deck.id = uuidv4();
        this.deck.push(deck);
        this.deckSubject.next([...this.deck]);
        return true;
    }

    getDeck(): Observable<Deck[]> {
        return this.deckSubject.asObservable();
    }

    getDeckById(deckId: string): Observable<Deck | undefined> {
        return this.deckSubject.asObservable().pipe(
            map(decks => decks.find(deck => deck.id === deckId))
        );
    }

    updateDeck(deck: Deck): boolean {
        const index = this.deck.findIndex(d => d.id === deck.id);
        if (index !== -1) {
            this.deck[index] = { ...deck };
            this.deckSubject.next([...this.deck]);
            return true;
        } else {
            return false;
        }
    }

    deleteDeck(deckId: string): void {
        const index = this.deck.findIndex(deck => deck.id === deckId);
        if (index !== -1) {
            this.deck.splice(index, 1);
            this.deckSubject.next([...this.deck]);
        }
    }

    countDecks(): number {
        return this.deck.length;
    }
}