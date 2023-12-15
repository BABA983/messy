#!/bin/bash

# Based on https://superuser.com/a/40629/1732828
#
# Generates a .ico file with 16, 32, 48 and 64 pixels versions in it from the given .png file.

set -e

sizes=("16" "32" "48" "64")

if ! command -v icotool &>/dev/null; then
	echo "Error: 'icotool' command not working/found. Maybe you need to install 'icoutils'?"
	exit 1
fi
if ! command -v convert &>/dev/null; then
	echo "Error: 'convert' command not working/found. Maybe you need to install 'ImageMagick'?"
	exit 2
fi
if [ "$#" -ne 1 ]; then
	echo "Syntax: $0 file.png"
	exit 3
fi

if [ ! -f "$1" ]; then
	echo "File '$1' does not exist!"
	exit 4
fi
if [ ! -r "$1" ]; then
	echo "File '$1' is not readable!"
	exit 5
fi

src="$1"
base=$(basename "${src}" .png)

pngFilesArr=()

for size in "${sizes[@]}"; do
	pngFileName="${base}_${size}.png"
	convert "${src}" -thumbnail ${size}x${size} "$pngFileName"
	pngFilesArr+=("${pngFileName}")
done

icotool -c -o "${base}.ico" "${pngFilesArr[@]}"

rm -f "${pngFilesArr[@]}"
