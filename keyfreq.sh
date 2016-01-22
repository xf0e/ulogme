#!/bin/bash
# logs the key press frequency over 9 second window. Logs are written
# in logs/keyfreqX every 9 seconds, where X is unix timestamp of 7am of the
# recording day.

LANG=en_US.utf8
silent=true
helperfile="logs/keyfreqraw" # temporary helper file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mkdir -p logs

#echo -n "keyfreq started"
while true
    do
        windowLength=9 #seconds
        # check each possible keyboard
        keyboardIds=$(xinput | grep 'slave  keyboard' | grep -o 'id=[0-9]*' | cut -d= -f2)
        # and grep only the updated ones
        filesToGrep=''
        for id in $keyboardIds; do
            fileName="$helperfile.$id"
            timeout $windowLength xinput test $id > $fileName &
            filesToGrep+="$fileName "
        done
        sleep $windowLength
        sleep .5 #make sure that all `xinput test` finished
            
        # count number of key release events
        num=$(grep release $filesToGrep | wc -l)
            
        # append unix time stamp and the number into file
        logfile="logs/keyfreq_$(python $DIR/rewind7am.py).txt"
        echo "$(date +%s) $num"  >> $logfile
        if [ "$silent" = false ]; then
            echo "logged key frequency: $(date) $num release events detected into $logfile"
        fi
done
    