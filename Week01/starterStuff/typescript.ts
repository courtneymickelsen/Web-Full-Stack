function newFunction (a: number, b: number) {
    return a + b
}

function insertAtBeginning<T>(array: T[], value: T) {
    const newArray = [value, ...array];
    return newArray;
}

const demoArray = [1, 2, 3]

const updatedArray = insertAtBeginning(demoArray, 0)