# file exists and is a directory same as 
# if ! [ -d ~/backups ] shorthand for the test command
# man test for further reading
if ! test -d ~/backups
then
    echo "Creating backups folder"
    # mkdir ~/backups
fi

if ! [ -d ~/backups ]; then
  echo "Creating backups folder"
fi

if [ -e /usr/local/bin/common ]
then
    echo "The 'common' command has been installed in the local bin folder."
else
    echo "The 'common' command has not been installed in the local bin folder."
fi

if [ -x /usr/local/bin/common ]; then
    echo "The 'common' command has been installed and is executable."
elif [ -e /usr/local/bin/common ]; then
    echo "The 'common' command has been installed and is not executable."
else
    echo "The 'common' command has not been installed."
fi

year=2023

if [ $year -ge 2020 ] && [ $year -lt 2030 ]; then
    echo "$year is in the 2020s"
fi

# -a(and) and -o(or)
if [ $year -ge 2020 -a $year -lt 2030 ]; then
    echo "$year is in the 2020s"
fi

# Conditional Expressions
if [[ $year -ge 2020 && $year -lt 2030 ]]; then
    echo "$year is in the 2020s"
fi

# Using Regexes in a Conditional Expression
echo "$SHELL"
zsh_regex="zsh$"
if [[ $SHELL =~ $zsh_regex ]]; then
    echo "It looks like your shell '$SHELL' is Z-Shell"
fi

# The $BASH_REMATCH variable is an array - the first result value in the array is the entire match
shell_regex="([^/]+)$"
if [[ $SHELL =~ $shell_regex ]]; then
    echo "Your shell binary is: ${BASH_REMATCH[1]}"
else
    echo "Unable to extract your shell binary"
fi
