while read line; do
    open -a opera $line
done < links.txt
