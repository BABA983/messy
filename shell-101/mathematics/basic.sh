read -p "Enter a number: " number1
read -p "Enter another number: " number2
sum=$number1+$number2
echo "The sum of $number1 and $number2 is $sum"

read -p "Enter a number: " number1
read -p "Enter another number: " number2
sum=$(($number1 + $number2))
echo "The sum of $number1 and $number2 is $sum"

# Addition
echo $((3+4)) # prints 7
# Subtraction
echo $((4-2)) # prints 2
# Multiplication
echo $((4*2)) # prints 8
# Division
echo $((4/2)) # prints 2
# Exponent
echo $((4**3)) # prints 64
# Modulus
echo $((7%3)) # prints 1
# Prefix Increment
i=1; echo $((++i)) # prints 1, i is set to 2
# Postfix Increment
i=1; echo $((i++)) # prints 2, i is set to 2
# Prefix Decrement
i=3; echo $((--i)) # prints 3, i is set to 2
# Postfix Decrement
i=3; echo $((i--)) # prints 2, i is set to 2
# Increment
i=3; echo $((i+=3)) # prints 6, i is set to 6
# Decrement
i=3; echo $((i-=2)) # prints 1, i is set to 1

read -p "Enter a value in Celsius: " celcius
fahrenheit=$(( (celcius * 9/5) + 32 ))
echo "${celcius} degrees Celsius is ${fahrenheit} degrees Fahrenheit"
