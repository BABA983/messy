# The ${var^^} operator returns the value of var with the text transformed to uppercase
message="don't shout"
echo ${message^^}
# Prints: DON'T SHOUT

message="DON'T SHOUT"
echo ${message,,}
# Prints: don't shout
