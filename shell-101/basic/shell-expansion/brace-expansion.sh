#!/usr/bin/bash
mkdir -p ./tmp/{one,two,three}

touch ./tmp/file{1..5}.txt

for x in {0..10..2}; do echo $x; done
