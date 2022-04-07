#!/bin/bash

#You'll need https://github.com/ejwa/gitinspector to be installed in your system

# check if command exists and fail otherwise
command_exists() {
  command -v "$1" >/dev/null 2>&1
  if [[ $? -ne 0 ]]; then
    echo "I require $1 but it's not installed. Aborting."
    exit 1
  fi
}

for COMMAND in "gitinspector" "mkdir"; do
    command_exists "${COMMAND}"
done

BASEPATH="/home/erik/dev"
STATS="labs-back/analysis/quincenal"
mkdir -p $BASEPATH/$STATS

PREFIX="01-1aMarzo"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-03-01"
export UNTIL="2021-03-15"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html


PREFIX="02-2aMarzo"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-03-16"
export UNTIL="2021-03-31"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html


PREFIX="03-1aAbril"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-04-01"
export UNTIL="2021-04-15"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html


PREFIX="04-2aAbril"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-04-16"
export UNTIL="2021-04-30"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html

PREFIX="05-1aMayo"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-05-01"
export UNTIL="2021-05-15"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-movil > $BASEPATH/$STATS/$PREFIX/movil.html

PREFIX="06-2aMayo"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-05-16"
export UNTIL="2021-05-31"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-movil > $BASEPATH/$STATS/$PREFIX/movil.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-shop > $BASEPATH/$STATS/$PREFIX/shop.html

PREFIX="07-1aJunio"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-06-01"
export UNTIL="2021-06-15"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-movil > $BASEPATH/$STATS/$PREFIX/movil.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-shop > $BASEPATH/$STATS/$PREFIX/shop.html
PREFIX="08-2aJunio"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-06-16"
export UNTIL="2021-06-30"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-movil > $BASEPATH/$STATS/$PREFIX/movil.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-shop > $BASEPATH/$STATS/$PREFIX/shop.html

PREFIX="09-1aJulio"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-07-01"
export UNTIL="2021-07-15"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-movil > $BASEPATH/$STATS/$PREFIX/movil.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-shop > $BASEPATH/$STATS/$PREFIX/shop.html
PREFIX="10-2aJulio"
echo "Generating $PREFIX..."
mkdir -p $BASEPATH/$STATS/$PREFIX
export SINCE="2021-07-16"
export UNTIL="2021-07-31"
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-back > $BASEPATH/$STATS/$PREFIX/back.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-admin > $BASEPATH/$STATS/$PREFIX/admin.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-movil > $BASEPATH/$STATS/$PREFIX/movil.html
gitinspector -HlmrTw -F html -f js,ts,html,css,scss,json --since $SINCE --until $UNTIL $BASEPATH/labs-shop > $BASEPATH/$STATS/$PREFIX/shop.html
