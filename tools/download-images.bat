@echo off
rem Downloads the photos used on the page into assets\img (Windows 10 or newer).
rem Double-click this file, wait until it says "Done", then refresh the page.
cd /d "%~dp0..\assets\img"
if not exist portfolio mkdir portfolio

echo Downloading section photos...
curl -L --fail -o about.avif "https://techwiz-solution.vercel.app/about.avif"
curl -L --fail -o offer.jpg  "https://techwiz-solution.vercel.app/larki.jpg"
curl -L --fail -o why-1.jpg  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=800&q=80"
curl -L --fail -o why-2.jpg  "https://images.unsplash.com/photo-1739285452618-0b7b3d04f953?auto=format&fit=crop&w=800&h=800&q=80"
curl -L --fail -o why-3.jpg  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&h=800&q=80"

echo Downloading Search Console graphs...
curl -L --fail -o portfolio\gsc-two-guys.png       "https://techwiz-solution.vercel.app/Graph.png"
curl -L --fail -o portfolio\gsc-bnc.png            "https://techwiz-solution.vercel.app/blindgraph.png"
curl -L --fail -o portfolio\gsc-interior-films.png "https://techwiz-solution.vercel.app/interiorgraph.png"

echo.
echo Done. Files are in assets\img
pause
