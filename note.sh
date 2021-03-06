#!/bin/bash

# allows the user to simply record a note, saves it together with unix time in notes/
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mkdir -p $DIR/logs

read -p "Enter note: " n

if [ -z $1 ] 
then 
  T="$(date +%s)" # defualt to current time
else
  T=$1 # argument was provided, use it!
fi

logfile="$DIR/logs/notes_$(python $DIR/rewind7am.py $T).txt"
echo "$T $n" >> $logfile
echo "logged note: $T $n into $logfile"
