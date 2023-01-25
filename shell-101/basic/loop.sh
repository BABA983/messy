for item in ../*
do
    echo "Found: $item"
done

days=("Monday" "Tuesday" "Wednesday" "Thursday" "Friday" "Saturday" "Sunday")
for day in ${days[@]}
do
    echo -n "$day, "
done
echo "happy days!"

sentence="What can the harvest hope for, if not for the care of the Reaper Man?"
for word in $sentence
do
    echo "$word"
done

for script in ../*/*.sh
do
    echo "Found script: $script"
done

echo "-------------"

for script in ~/a-folder-that-doesnt-exist/scripts/*.sh
do
    echo "Found: $script"
done

# By default, if a shell 'glob' (a pattern that includes a wildcard) does not match any files,
# the shell simply leaves the pattern as-is.
# two ways to resolve this problem

shopt -s nullglob
for script in ~/a-folder-that-doesnt-exist/scripts/*.sh
do
    echo "Found: $script"
done

for script in ~/a-folder-that-doesnt-exist/scripts/*.sh
do
    # if the file does not exist
    if ! [ -e "$script" ]; then
      continue
    fi
    echo "Found: $script"
done

# Find all symlinks and print each one.
# links=$(find ~ -type l)
# for link in $links
# do
#     echo "Found Link: $link"
# done

echo "$IFS"

for (( i = 1; i <= 5; i++ ))
do
    echo "Loop ${i}"
done

echo "---------------"

for i in {1..10}
do
    echo "Loop ${i}"
done

echo "---------------"

for i in {0..25..5}
do
    echo "Loop ${i}"
done


# Create an empty array of random numbers.
random_numbers=()

# As long as the length of the array is less than five, continue to loop.
while [ ${#random_numbers[@]} -lt 5 ]
do
    # Get a random number, ask the user if they want to add it to the array.
    random_number=$RANDOM
    read -p "Add $random_number to the list? (y/n): " choice
    
    # If the user chose 'y' add the random number to the array.
    if [ "$choice" = "y" ]; then random_numbers+=($random_number); fi
done

# Show the contents of the array.
echo "Random Numbers: ${random_numbers[@]}"

while read line; do
    echo "Read: $line"
done < ../../README.md
echo "---------------"
# If the last line is does not end with a newline, then it is not read
# Backlashes will be treated as escape sequences and lead to broken output
# Leading whitespace will be removed
while IFS="" read -r line || [ -n "$line" ]; do
    echo "Read: $line"
done < ../../README.md

while true
do
    echo "1) Move forwards"
    echo "2) Move backwards"
    echo "3) Turn Left"
    echo "4) Turn Right"
    echo "5) Explore"
    echo "0) Quit"
    
    read -p "What will you do: " choice
    if [ $choice -eq 0 ]; then
        exit
    fi
    # The rest of the game logic would go here!
    # ...
done

