// Converts a passed in string to spinalTap case.
export function spinalTapConversion(str) {
    // Uses .replace() to replace any instance where a lowercase character is followed by a uppercase, and it simply inserts a space between the two.
    str = str.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Initializes the regexPattern variable that looks for all spaces or "_".
    let regexPattern = /[ _]/g;

    // Uses .split() method with the regexPattern to split the string at all spaces or "_" and then joins the words with a "-" and then converts any uppercase character to lowercase.
    return str.split(regexPattern).join('-').toLowerCase()
}

// Capitalizes the first character of the passed in string, if the string is a sentence, then all words are capitalized.
export function capitalizeName(str) {
    // Splits the string into separate words.
    let arr = str.split(' ');

    // Iterates through all of the words in the array.
    for (const index in arr) {
        // Replaces the word in the array with its capitalized counterpart.
        arr[index] = arr[index][0].toUpperCase() + arr[index].substring(1);
    }

    // Returns a string composed of all words in the array joined by a space.
    return arr.join(' ');
}