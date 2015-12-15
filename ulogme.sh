#!/bin/bash

if [ "$(uname)" == "Darwin" ]; then
  # This is a Mac
  ./osx/run_ulogme_osx.sh
else
  # Assume Linux
/home/grrr/opt/ulogme/keyfreq.sh &
/home/grrr/opt/ulogme/logactivewin.sh
fi
