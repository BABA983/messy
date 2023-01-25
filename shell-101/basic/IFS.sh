# $IFS means internal field separator

# old_ifs="$IFS"
# IFS=":"
# # Do some stuff
# IFS="$IFS"

echo "$IFS"
text="mother,danzig,1988"
IFS=","
echo "$IFS"
for word in $text
do
    echo "Word: $word"
done


