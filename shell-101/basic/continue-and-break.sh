echo "For each folder, choose y/n to show contents, or c to cancel."
for file in ~/*
do
    # If the file is not a directory, or it cannot be searched, skip it.
    if ! [ -d "$file" ] || ! [ -x "$file" ]; then continue; fi

    # Ask the user if they want to see the contents.
    read -p "Show: $file? [y/n/c]: " choice

    # If the user chose 'c' for cancel, break.
    if [ "$choice" = "c" ]; then break; fi

    # If the user choice 'y' to show contents, list them.
    if [ "$choice" = "y" ]; then ls "$file"; fi
done
