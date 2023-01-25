green='\e[0;32m'
reset='\e[0m'
echo -e "Do you like ${green}apples${reset}?"

green=$(tput setaf 2) # set ansi foreground to '2' (green)
reset=$(tput sgr0)    # reset the colours
echo -e "Do you like ${green}apples${reset}?"

rainbow () {
    local message="$1"
    local reset='\e[0m'
    for ((colour=31; colour<=37; colour++))
    do
        colour_code="\\e[0;${colour}m"
        printf "${colour} - ${colour_code}${message}${reset}\n"
    done
}

rainbow hello

rainbow hello > ./tmp/coloring-output.txt

# This version of the function will not write the ANSI escape sequences
# if the output device is not a terminal
# because [ -t 1 ] as a way to check the output is going to terminal
rainbow () {
    local message="$1"
    local reset='\e[0m'
    for ((colour=31; colour<=37; colour++))
    do
        colour_code="\\e[0;${colour}m"
        if [ -t 1 ]; then
            printf "${colour} - ${colour_code}${message}${reset}\n"
        else
            printf "${colour} - ${message}\n"
        fi
    done
}

rainbow hello > ./tmp/coloring-output2.txt
