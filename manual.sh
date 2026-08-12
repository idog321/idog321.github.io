#!/usr/bin/env bash
# Start everything needed to read and comment on the manual.
#
#   ./manual.sh          start both servers
#   ./manual.sh stop     stop them
#   ./manual.sh check    run the gates (style + links) without starting anything
#
# The dev server clears .astro first. That cache holds RENDERED HTML, and a
# stale one is what made the browser keep showing old text all day.
set -uo pipefail
cd "$(dirname "$0")"

DEV_PORT=4321
COMMENT_PORT=4399

stop() {
  for port in $DEV_PORT $COMMENT_PORT; do
    pids=$(lsof -ti :$port 2>/dev/null || true)
    [ -n "$pids" ] && kill $pids 2>/dev/null && echo "  stopped :$port"
  done
  return 0
}

# ./manual.sh lan — also listen on the local network so a real iPhone on the
# same Wi-Fi can open the manual. Prints the address to type on the phone.
# Comments still save only from the Mac: the widget posts to localhost.
LAN=""
if [ "${1:-start}" = "lan" ]; then LAN="--host"; set -- start; fi

case "${1:-start}" in
  stop) echo "Stopping…"; stop; exit 0 ;;
  check)
    node scripts/check-style.mjs; s=$?
    node scripts/check-links.mjs; l=$?
    exit $(( s || l )) ;;
esac

echo "Stopping anything already running…"
stop
sleep 1

# nohup + disown so both survive this shell exiting. Without it the comment
# server dies whenever manual.sh is launched from a non-interactive shell, and
# the widget then has nowhere to POST — which silently ate a round of notes.
echo "Starting comment server on :$COMMENT_PORT…"
nohup node scripts/comment-server.mjs > /tmp/topokit-comments.log 2>&1 &
disown 2>/dev/null || true

echo "Starting dev server on :$DEV_PORT (clearing the content cache first)…"
nohup npm run dev ${LAN:+-- $LAN} > /tmp/topokit-dev.log 2>&1 &
disown 2>/dev/null || true

printf "Waiting for the manual"
for _ in $(seq 1 40); do
  if curl -sf -o /dev/null "http://localhost:$DEV_PORT/manual/"; then
    echo ""
    echo ""
    # The comment server is the one that fails quietly, so say plainly whether
    # it is up. A dead one looks identical to a working one until a note is lost.
    if curl -s -o /dev/null --max-time 2 "http://localhost:$COMMENT_PORT/"; then
      COMMENTS_STATUS="ready"
    else
      COMMENTS_STATUS="NOT RUNNING — comments will not save (see /tmp/topokit-comments.log)"
    fi
    echo "  Manual:   http://localhost:$DEV_PORT/manual/"
    if [ -n "$LAN" ]; then
      IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "<this-Mac's-IP>")
      echo "  iPhone:   http://$IP:$DEV_PORT/manual/   (same Wi-Fi)"
    fi
    echo "  Comments: $COMMENTS_STATUS"
    echo ""
    echo "  Logs:  /tmp/topokit-dev.log   /tmp/topokit-comments.log"
    echo "  Stop:  ./manual.sh stop"
    echo ""
    command -v open >/dev/null && open -a Safari "http://localhost:$DEV_PORT/manual/"
    exit 0
  fi
  printf "."
  sleep 1
done

echo ""
echo "Dev server did not come up. Last lines of /tmp/topokit-dev.log:"
tail -20 /tmp/topokit-dev.log
exit 1
