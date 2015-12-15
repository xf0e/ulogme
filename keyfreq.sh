#!/bin/bash


# logs the key press frequency over 9 second window. Logs are written
# in logs/keyfreqX.txt every 9 seconds, where X is unix timestamp of 7am of the
# recording day.

LANG=en_US.utf8
silent=true
helperfile="logs/keyfreqraw.txt" # temporary helper file

mkdir -p logs

#echo -n "keyfreq started"
while true
do
  sudo showkey > $helperfile &
  PID=$!

  # work in windows of 9 seconds
  sleep 9
  sudo kill $PID

  # count number of key release events
  num=$(cat $helperfile | grep release | wc -l)

  # append unix time stamp and the number into file
  logfile="logs/keyfreq_$(python2 rewind7am.py).txt"
  echo "$(date +%s) $num"  >> $logfile
  if [ "$silent" = false ]; then
      echo "logged key frequency: $(date) $num release events detected into $logfile"
  fi
done
