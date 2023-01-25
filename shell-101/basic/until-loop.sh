# Create an empty random number string - we're going to build it up in the loop.
random_number=""

# Keep on looping until the random number is at least 15 characters long.
until [ "${#random_number}" -ge 15 ]
do
    random_number+=$RANDOM
done
echo "Random Number: ${random_number}"

random_number=""
while [ "${#random_number}" -lt 15 ]
do
    random_number+=$RANDOM
done
echo "Random Number: ${random_number}"
