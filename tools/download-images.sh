#!/usr/bin/env bash
# Downloads the photos used on the page into assets/img (macOS / Linux).
# Run:  bash tools/download-images.sh
set -u
cd "$(dirname "$0")/../assets/img" && mkdir -p portfolio

get() { curl -L --fail -o "$1" "$2" && echo "saved $1" || echo "FAILED $1"; }

get about.avif "https://techwiz-solution.vercel.app/about.avif"
get offer.jpg  "https://techwiz-solution.vercel.app/larki.jpg"
get why-1.jpg  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=800&q=80"
get why-2.jpg  "https://images.unsplash.com/photo-1739285452618-0b7b3d04f953?auto=format&fit=crop&w=800&h=800&q=80"
get why-3.jpg  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&h=800&q=80"

get portfolio/gsc-two-guys.png       "https://techwiz-solution.vercel.app/Graph.png"
get portfolio/gsc-bnc.png            "https://techwiz-solution.vercel.app/blindgraph.png"
get portfolio/gsc-interior-films.png "https://techwiz-solution.vercel.app/interiorgraph.png"
