export function sumArray<T>(array: T[],func: (item: T) => number) {
    return array.reduce((total, item) => total + func(item), 0);


}