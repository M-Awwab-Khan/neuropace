export function linearSearch<T, S>(arr: T[], n: number, target: S, compare: (a: T, t: S) => boolean): T[] {
    let temp: T[] = [];
    for(let i: number = 0; i < n; i++) {
        if(compare(arr[i], target)) {
            temp.push(arr[i]);
        }
    }
    return temp;
}