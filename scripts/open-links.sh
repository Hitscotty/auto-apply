while read line; do
    open -a opera $line
done < scripts/links.txt
