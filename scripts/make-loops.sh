#!/usr/bin/env bash
# Derives extra looping clips (gallery reels + footer/background loops) from public/media/hero.mp4.
# Replace hero.mp4 with real footage, re-run this, and every clip updates. Needs ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/../public/media"
enc() { # name, vf
  ffmpeg -y -loglevel error -i hero.mp4 -an -t "$3" -vf "$2" -c:v libx264 -crf 29 -preset slow -pix_fmt yuv420p -movflags +faststart "$1.mp4"
  ffmpeg -y -loglevel error -i hero.mp4 -an -t "$3" -vf "$2" -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 "$1.webm"
}
enc reel-dusk  "scale=960:-2,eq=saturation=1.25:contrast=1.05,colorbalance=rs=.18:gs=-.02:bs=-.2:rm=.12:bm=-.12" 12
enc reel-moon  "scale=960:-2,hue=h=-35:s=.55,eq=brightness=-0.06:contrast=1.1,colorbalance=bs=.18:bm=.12" 12
enc reel-mist  "crop=iw*0.62:ih*0.62:iw*0.2:ih*0.38,scale=960:-2,eq=saturation=.9:brightness=0.03,gblur=sigma=.6" 12
enc footer-loop "scale=640:-2,eq=brightness=-0.18:saturation=.8,gblur=sigma=2.5" 12
