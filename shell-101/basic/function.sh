# $1	The first parameter
# $2	The second parameter
# ${11}	The 11th parameter - if the parameter is more than one digit you must surround it with braces
# $#	The number of parameters
# $@	The full set of parameters as an array
# $*	The full set of parameters as a string separated by the first value in the $IFS variable
# ${@:start:count}	A subset of 'count' parameters starting at parameter number 'start'

# Set some variables.
title="My Cool Script"
version="1.2"
succeeded=0

# Create a function that writes a message and changes a variable.
title() {
    # Note that we can read variables...
    title_message="${title} - version ${version}"
    echo "${title_message}"

    # ...and set them as well.
    succeeded=1
}

# Show the value of 'succeeded' before and after the function call.
echo "Succeeded: ${succeeded}"
title
echo "Succeeded: ${succeeded}"
echo "Title Message: ${title_message}"

run_loop() {
    local count=0
    for i in {1..10}; do
        # Update our counter.
        count=$((count + 1))
    done
    echo "Count is: ${count}"
}
count=1
run_loop
echo "Count is: ${count}"


sum() {
    local value1=$1
    local value2=$2
    local result=$((value1 + value2))
    echo "The sum of ${value1} and ${value2} is ${result}"
}

sum 1 2

# Create a function that sums a set of numbers.
sum() {
    local total=0
    for value in $@; do
        total=$((total + value))
    done

    # Write out the result.
    echo "Summed $# values for a total of: ${total}"
}

sum 1 2 3 4 5

# Show the top 'n' values of a set.
show_top() {
    local n=$1
    local values=${@:2:n}
    echo "Top ${n} values: ${values}"
}

show_top 3 10 20 30 40 50

# Return value
result=""
is_even() {
    local number=$1

    # A number is even if when we divide it by 2 there is no remainder.
    # Set 'result' to 1 if the parameter is even and 0 otherwise.
    if [ $((number % 2)) -eq 0 ]; then
        result=1
    else
        result=0
    fi
}
number=3
is_even $number
echo "result is $result"

lowercase() {
    local params="$@"
    # Translate all uppercase characters to lowercase characters.
    echo "$params" | tr '[:upper:]' '[:lower:]' 
}
result=$(lowercase "HELLO WORLD")
echo "$result"
lowercase "HAHA"

# echo is like return keyword in other language
# dont write message in halfway through the function
# we should pipe it to a black hole
# We can use this trick in our functions to stop commands from 'polluting' our result
# in sh, return is used for return status code
# 0 indicate success, non-zero status code is used to specify an error code
command_exists() {
    # if type "$1" >> /dev/null; then
    if type "$1"; then
        # echo "1"
        return 0
    else
        # echo "0"
        return 1
    fi
}
# command_exists touch

if command_exists touch; then
  echo "command "touch" exists"
else
  echo "command "touch" is not installed"
fi

type "test"
echo "Result: $?"
