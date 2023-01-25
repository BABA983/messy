days="Monday Tuesday Wednesday      Thursday Friday   Saturday Sunday"
for day in "$days"
do
    echo "${day}"
done

echo "-------------"

for day in $days
do
    echo "${day}"
done

echo "-------------"

programs="/usr/bin/bash /usr/bin/zshell /usr/bin/new shell"
for program in $programs
do
    echo "${program}"
done

echo "-------------"

# By default, the IFS variable is set to <space><tab><newline>

programs="/usr/bin/bash;/usr/bin/zshell;/usr/bin/new shell"
OLDIFS=$IFS
IFS=';'
for program in $programs
do
    echo "${program}"
done
IFS=$OLDIFS

echo "-------------"

OLDIFS=$IFS
IFS=":"
for path in $PATH
do
    echo "${path}"
done
IFS=$OLDIFS
