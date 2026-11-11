#!/bin/zsh
# Pictures for a trail's page under /maps/<slug>/, drawn from its booklet PDF into
# public/Images/maps/<slug>/: the cover, the index map and each map page (the page
# list swaps between them), each again at 200 dpi as <name>-large.jpg for the zoom
# dial, a 1200x900 close-up of one map page drawn at 300 dpi (start it inside the
# map's frame line, so no margin shows), and the 1200-wide share card cut from the
# cover drawn 1360 px wide.
#
#   scripts/trail-images.sh <booklet.pdf> <slug> <first map page> <last map page> \
#       <close-up page> <x> <y> <share card x> <share card y> <share card height>
#
# Juan de Fuca 2026.11: JDF-01 to JDF-07 are PDF pages 3-9, the close-up is Sombrio
# Beach on JDF-04, and the share card is the cover's satellite map above its scale bar.
#   scripts/trail-images.sh JdF_China-Beach_to_Botanical-Beach.pdf jdf 3 9 6 115 500 80 265 620
set -e
pdf=$1 slug=$2 first=$3 last=$4
out=public/Images/maps/$slug
jpg=(-singlefile -jpeg -jpegopt quality=84,optimize=y)
mkdir -p $out

pdftoppm -f 1 -l 1 -scale-to-x 960 -scale-to-y -1 $jpg $pdf $out/cover
page() { # <pdf page> <name>
  pdftoppm -f $1 -l $1 -scale-to-x 680 -scale-to-y -1 $jpg $pdf $out/$2
  pdftoppm -f $1 -l $1 -r 200 -singlefile -jpeg -jpegopt quality=80,optimize=y $pdf $out/$2-large
}
page 2 index
for p in {$first..$last}; do
  page $p $slug-$(printf %02d $((p - first + 1)))
done
pdftoppm -f $5 -l $5 -r 300 -x $6 -y $7 -W 1200 -H 900 $jpg $pdf $out/closeup
pdftoppm -f 1 -l 1 -scale-to-x 1360 -scale-to-y -1 -x $8 -y $9 -W 1200 -H ${10} $jpg $pdf $out/share

ls -l $out
