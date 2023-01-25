fruit=apples
echo "I like $fruit"

# The line above is expanded to:
echo "I like apples"

echo "My backup folder is: ${HOME}backup"

echo "My backup folder is: $HOMEbackup"

# Default value ${param:-default}
# Assign default value ${param:=default}
# Display Error if null or unset ${param:?message}

# backup_location=${BACKUP_DIR:?Please set BACKUP_DIR to use this script}
# cp -r ~/effective-shell ${BACKUP_DIR}

# Alternate value ${param:+alternate}
# Offset and length ${param:offset} ${param:offset:length}
# Expand variable name ${!name*}
__prefix_USER_NAME__="BABA"
__prefix_USER_PASSWORD__=123
# At this point we might have a script that uses the variables above...

# Now clean up any variables we created.
for var_name in ${!__prefix*}
do
    echo "Cleaning up: ${var_name}..."
    unset ${var_name}
done

# Array expansion ${!array[@}
days=("Monday" "Tuesday" "Wednesday" "Thursday" "Friday" "Saturday" "Sunday")
echo "${!days[@]}"

# The line above is expanded to:
# echo "0 1 2 3 4 5 6"

# Parameter length ${#array[@]}
days=("Monday" "Tuesday" "Wednesday" "Thursday" "Friday" "Saturday" "Sunday")
echo "There are ${#days[@]} days in a week"

# Remove pattern from front
address=https://effective-shell.com
echo "Address: ${address#https://}"

# The line above is expanded to:
# echo "Address: effective-shell.com"

# You can also tell the shell to remove as many sequential matches of pattern as possible,
# by using the ${parameter##pattern} expression. 
# This can be useful to strip out all of the characters up to a certain point in a parameter
folder=/Users/baba/backups/2023-01-24
echo "Today's backup folder is: ${folder##*/}"

# The line above is expanded to:
echo "Today's backup folder is: 2023-01-24"

# Remove pattern from back ${parameter%pattern}
echo "My working directory is: ${PWD}"
echo "My parent folder is: ${PWD%/*}"

# We can also remove as many matches as possible, by using the expression ${parameter%%pattern}
archive=effective-shell.tar.gz
echo "Name of archive is: ${archive%%.*}"

# Pattern replacement ${parameter/pattern/string}
message="Hello Dave"
echo "${message/Hello/Goodbye}"

# Upper or losercase
message="Hello World"
echo ${message^^}
echo ${message,,}

# Parameter indirection
parameter_name="HOME"
echo "${!parameter_name}"
