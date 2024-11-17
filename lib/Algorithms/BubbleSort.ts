export function bubbleSort<T>(arr: T[], n: number, compare: (a: T,b: T) => boolean): void {
    for(let i: number = 0; i < n-1; i++) {
        let swapped: boolean = false;

        for(let j: number = 0; j < n-1-i; j++) {
            if( compare(arr[j], arr[j+1]) ) {
                let temp: T = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                swapped = true;
            }

        }

        if(!swapped) {
            break;
        }

    }
}