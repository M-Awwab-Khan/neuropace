import DynamicArray from "./DynamicArray";


export default class MinPriorityQueue<T> {
    private data: DynamicArray<T>;
    private compare: (a: T, b: T) => boolean;

    constructor(c: (a: T, b: T) => boolean) {
        this.data = new DynamicArray<T>();
        this.compare = c;
    }

    // static fromArray(cards: T[]): MinPriorityQueue<T> {
    //     for(const card of cards) {
    //         this.data.append(card);
    //     }

    //     this.heapifyBuild();
    //     return this;
    // }


    static fromArray<T>(cards: T[], compare: (a: T, b: T) => boolean): MinPriorityQueue<T> {
        const queue = new MinPriorityQueue<T>(compare);  // Create a new instance of MinPriorityQueue

        for (const card of cards) {
            queue.data.append(card);  // Add each card to the queue's data
        }

        queue.heapifyBuild();  // Build the heap structure

        return queue;  // Return the new instance of MinPriorityQueue
    }




    isEmpty(): boolean {
        return this.data.isEmpty();
    }

    heapifyUp(child: number): void {
        if(!this.isEmpty()) {
            let parent: number = Math.floor((child - 1) / 2);

            // let childDate: number = new Date(this.data[child].nextReviewDate).getTime();
            // let parentDate: number = new Date(this.data[parent].nextReviewDate).getTime();

            while(parent >= 0 && this.compare(this.data.getElement(child), this.data.getElement(parent))) {
                let temp: T = this.data.getElement(child);

                this.data.setElement(child, this.data.getElement(parent));
                this.data.setElement(parent, temp);

                child = parent;
                parent = Math.floor((child - 1) / 2);
            }
        }
    }

    heapifyDown(parent: number) {
        if(!this.isEmpty()) {
            let l: number = (2 * parent) + 1;
            let r: number = (2 * parent) + 2;
            let min: number = parent;

            if(l < this.data.size && this.compare(this.data.getElement(l), this.data.getElement(min))) {
                min = l;
            }

            if(r < this.data.size && this.compare( this.data.getElement(r), this.data.getElement(min) )) {
                min = r;
            }

            if(min != parent) {
                let temp: T = this.data.getElement(min);
                this.data.setElement(min, this.data.getElement(parent));
                this.data.setElement(parent, temp);

                // After swapping, Parent is at min index
                this.heapifyDown(min);
            }

        }
    }

    heapifyBuild(): void {
        if(!this.isEmpty()) {
            // Starting from non-lead nodes
            let parent: number = Math.floor(this.data.size / 2) - 1;

            while(parent >= 0) {
                this.heapifyDown(parent--);
            }
        }
    }

    size(): number {
        return this.data.size;
    }

    front(): T | null {
        if(this.isEmpty()) {
            return null;
        }
        return this.data.getElement(0);
    }

    enqueue(card: T): void {
        this.data.append(card);
        this.heapifyUp(this.data.size - 1);
    }

    dequeue(): T {
        let temp: T = this.data.pop(0);

        return temp;
    }


}
