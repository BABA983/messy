# my_options=1
if declare -p -A my_options 2>&1 /dev/null; then
    echo "'my_options' exists"
else
    echo "'my_options' does not exist"
fi
