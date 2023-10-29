const fizzBuzz =(input: number): string | number => {
    if (input % 15 === 0) return 'FizzBuzz';
    if (input % 5 === 0) return 'Buzz';
    if (input % 3 === 0) return 'Fizz';
    return input;
}

const isPalindrome = (input: number): boolean => {
    const string = input.toString();
    for (let i = 0, j = string.length - 1; i < j; ++i, --j) {
        if (string[i] !== string[j]) {
            return false;
        }
    }
    return true;
};
console.log("Result for FizzBuzz :");
for (let i: number = 1; i <= 100; i++) console.log(fizzBuzz(i));

console.log("Result for Palindrome :");
console.log(isPalindrome(5347));
console.log(isPalindrome(7887));
console.log(isPalindrome(45654));
console.log(isPalindrome(9876));
console.log(isPalindrome(40.04));