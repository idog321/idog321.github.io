---
title: "Getting started"
description: "Your first TopoKit project in five minutes: create, mark, measure, import, take offline, record, and export."
---
Eight steps, about five minutes: create a project, pick a base map, mark a point, measure a field, import a file, take it offline, record a track, and export it all.


## 1. Create a project

A **project** holds everything for one job: your points, lines, maps, and photos, in a single project folder you can move or back up. Open the **Projects tab** and tap the new-project button at the top. If you are signed into iCloud you will be asked where it should be stored:

- **iCloud** syncs the project to all your devices, with its photos and any rasters you chose to copy into it.
- **Local** keeps it on this device only.

Two things never sync either way: a raster you imported without copying it into the project — the default — and any tiles or elevation data you download, which are stored per device rather than inside the project. You can move a project between the two later.

If you are not signed into iCloud the choice does not appear and the project is created locally. You can move a project between them later. Details in [Projects and files](/manual/projects-and-files/).

## 2. Pick your base map

Tap the button at the bottom of the **tool sidebar** to cycle the background map through :ui[Standard]{icon=map-standard}, :ui[Hybrid]{icon=map-hybrid} (satellite with labels):v11[ and ]:v111[, ]:ui[Satellite]{icon=map-satellite}:v111[ and :ui[No Map]{icon=map-no-map}]. Hybrid is the default. The choice applies to the whole app rather than to one project, and it is remembered between launches. All three map styles come from Apple over the network, so for a background you can rely on in the field, download a tile layer instead.

## 3. Mark your first point

Tap :ui[Add Point]{icon=add-point} in the tool sidebar. A card appears at the bottom of the screen: tap the map where you want the point. If you have given TopoKit location access, the card also shows an orange :ui[location]{icon=location} button that places the point where you are standing instead. Give it a name, pick a colour, attach a photo, and tap :ui[Create]{icon=check}. TopoKit autosaves everything within a couple of seconds; you never need to manually save.

## 4. Measure something

Tap :ui[Add Polygon]{icon=add-polygon} and tap out the corners of a field, lot, or clearing. The tool card at the bottom shows live **area and perimeter** as you go, as well as how many points the shape has. If you just wanted the number, tap the value to copy it and press :ui[Cancel]{icon=x}. If the shape is worth keeping, press :ui[Save] and it becomes a feature like your point. The live figures are not stored with the shape, so seeing them again means retracing it — copy the value before you press either button. The drawing tools and the measuring tools are the same tools; saving is the only difference. More in [Map tools](/manual/map-tools/) and [Measuring](/manual/measurement/).

## 5. Import data

Your existing data works here. TopoKit reads GPX, KML and KMZ, GeoJSON, GeoPackage, and georeferenced maps — GeoTIFF imagery and GeoPDF sheets. :mac[On Mac, drag the files onto the window.] :ios[On iPhone, pick them from the **Layers** tab's :ui[plus]{icon=plus} menu.] Each file becomes a folder in the layer tree, with every feature inside it ready to edit, style, and measure like anything you drew yourself. See [File formats at a glance](/manual/file-formats/) if you do not recognise a file.

## 6. Prepare for offline use

Download two kinds of data before you leave Wi-Fi: **map tiles** for your work area, and **elevation tiles** if you need elevation profiles offline. Your project data works offline as long as it is on the device: local projects always are. An iCloud project is only guaranteed to be there if you **pin** it, from its row in the Projects tab — opening it once downloads it, but the system can evict an unpinned project to free space. Pinning works the same on Mac and iPhone. Details in [Tile layers](/manual/tile-layers/), [Elevation and DEMs](/manual/elevation/), and [Projects and files](/manual/projects-and-files/).

## 7. Record your track

Track recording is iPhone only. Open the **GPS tab** and tap **Record Track**. TopoKit records your path in the background, filters out GPS glitches, and saves the result as a line with distance, time, and elevation statistics attached. Details in [GPS and track recording](/manual/gps-and-track-recording/).

## 8. Export your data

To export one feature or folder, right-click it on Mac, or use the :ui[More]{icon=ellipsis} menu on its row on iPhone. All four formats — GPX, KML, GeoJSON and GeoPackage — are offered whatever you picked. To export everything at once, tap **Select** in the layer tree, choose your layers, and use the **Export** button that appears. See [Vector import and export](/manual/vector-import-export/).

