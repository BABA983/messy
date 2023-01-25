# ls ~/Downloads/*.json

# It is important to remember that the shell performs all of the types of expansion 
# that we have described in order.
# This means that word expansion is performed before pathname expansion.
# the space in the pathname have been preserved
# pathname expansion happen after word splitting
# the pathname themeselves are left as-is

ls ~/Downloads/[0-9].json
