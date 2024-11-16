import { INSTRUMENTATION_HOOK_FILENAME } from "next/dist/lib/constants";
import { Flashcard } from "../types";

export default class DynamicArray<T> {
    
    public size: number;
    private capacity: number;
    private data: T[];

    constructor(c: number = 1) {
        this.data = [];
        this.capacity = c;
        this.size = 0;
    }

    isEmpty(): boolean {
        return this.size == 0;
    }

    isFull(): boolean {
        return this.size == this.capacity;
    }

    shrinkArray(): void {
        this.capacity = this.size;

        let temp: T[] =  new Array(this.capacity);
        for(let i = 0; i < this.capacity; i++) {
            temp[i] = this.data[i];
        }

        this.data = temp;
    }

    growArray(): void {
        this.capacity = this.capacity*2;

        let temp: T[] = new Array(this.capacity);
        for(let i = 0; i < this.size; i++) {
            temp[i] = this.data[i];
        }

        this.data = temp;

    }

    insertAt(i: number, e: T): void {
        if(i < 0 || i >this.size) {
            throw new Error("Invalid Index");
        }

        if(this.size == this.capacity) {
            this.growArray();
        }

        if(i != this.size) {
            for(let j: number = this.size; j >= i -1; j--) {
                this.data[j] = this.data[j-1];
            }
        }

        this.data[i] = e;
        this.size++;
    }

    deleteAt(i: number): T {
        if(this.isEmpty()) {
            throw new Error("Deletion from Empty Array");
        }

        if(i < 0 || i >= this.size) {
            throw new Error("Invalid Index");
        }

        let temp: T = this.data[i];

        for(let j = i; j < this.size - 1; j++) {
            this.data[j] = this.data[j+1];
        }

        this.size--;

        if(this.size == this.capacity / 2) {
            this.shrinkArray();
        }

        return temp;

    }

    getElement(i: number): T {
        return this.data[i];
    }

    setElement(i: number, e: T): void {
        this.data[i] = e;
    }

    append(e: T): void {
        this.insertAt(this.size, e);
    }

    pop(i: number = this.size - 1): T {
        return this.deleteAt(i);
    }

}

