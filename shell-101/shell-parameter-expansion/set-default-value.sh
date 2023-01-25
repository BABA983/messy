# The ${var:-default} operator returns the value of the variable var or the text default if it is not found
read -p "Enter your username: " user
username=${user:-$USER}
echo "Username: $username"
# Prints what you typed or the value of $USER otherwise
