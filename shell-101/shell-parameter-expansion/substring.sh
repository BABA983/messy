# The ${var:start:count} operator returns a subset of the var variable, 
# starting at position start and extracting up to count characters.
# If count is omitted everything from start to the end of the string is returned

path="~/effective-shell"
echo "${path:0:2}"
# Prints ~/
echo "${path:2}"
# Prints effective-shell
