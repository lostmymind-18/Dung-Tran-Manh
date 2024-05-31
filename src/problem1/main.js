//TASK
// Provide 3 unique implementations of the following function in JavaScript.

// **Input**: `n` - any integer

// *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

// **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.


// --------------------------------------------------------------------------------------------

//SOLUTION
const error_code = -99999;

var sum_to_n_a = function(n) {
    // your code here
    if(n < 0) return error_code;;
    let result = 0;
    for(let i = 1; i <= n; i++){
        result += i;
    }
    return result;
};

var sum_to_n_b = function(n) {
    // your code here
    if(n < 0) return error_code;;
    if(n == 0) return 0;
    return n + sum_to_n_b(n-1);
};

var sum_to_n_c = function(n) {
    // your code here
    if(n < 0) return error_code;
    return n*(n+1)/2;
};