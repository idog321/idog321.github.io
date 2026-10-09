---
title: "TopoKit manual"
description: "What TopoKit is, what it does, the platforms it runs on, what it sends over the network, and how to read this manual."
---
## What TopoKit is

TopoKit is a native mapping app for geospatial fieldwork on iPhone and Mac, made for geologists, ecologists, foresters and anyone who takes their own spatial data into the field. It reads GPX, KML, KMZ, GeoJSON, GeoPackage, GeoTIFF and GeoPDF.

Everything you make is kept in a **project**: features, imported maps, recorded tracks and photos. A project is stored on the device or in iCloud Drive, which syncs it between your iPhone and Mac. See [Projects, saving and iCloud](/manual/projects-and-files/).

The map under your layers is Apple Maps, in **Standard**, **Hybrid** or **Satellite**, or turned **Off** so that only your own layers show. Basemaps that TopoKit builds draw on top of Apple Maps. See [Basemaps](/manual/basemaps/#the-apple-maps-switch).

## What you can do

- **Build basemaps**: TopoKit builds a topographic map of an area you pick, on the device, with shaded relief, contours, slope angle, trails, roads, water and place names, and the finished map draws without a signal. See [Basemaps](/manual/basemaps/).
- **Add your own maps**: TopoKit streams any XYZ or WMS map service from its address, and reprojects imported GeoTIFF and GeoPDF maps to line up with the map. See [Tile layers](/manual/tile-layers/) and [Raster overlays](/manual/raster-overlays/).
- **Search and identify**: a tap on a trail, a peak or one of your own features opens a card that says what it is; search takes names and coordinates; holding a spot, or right-clicking it on a Mac, gives its elevation, slope, aspect, sunrise and sunset. See [Search and identify](/manual/search-and-identify/).
- **Draw features**: points, lines, polygons and circles carry their own styles and photos. See [Points, lines, polygons and circles](/manual/points-lines-polygons/).
- **Measure**: distance, area and bearing update live as you draw. See [Measuring](/manual/measurement/).
- **Read elevation**: TopoKit gives the height of any point, and a profile along any line, recorded track or basemap trail, from a 30 m elevation model. See [Elevation](/manual/elevation/).
- **Record tracks**: the iPhone records tracks with trip statistics and GPS filtering you can tune. See [GPS and recording tracks](/manual/gps-and-track-recording/).
- **Plan routes**: Apple Maps fills in the roads between the stops you add, for driving, walking or cycling; the route saves as a line, shares as a file, or opens in Apple Maps or another maps app. See [Routes](/manual/routes/).
- **Import and export**: the vector formats above import as layers, and any feature or folder exports as a file. See [Importing and exporting](/manual/import-and-export/).
- **Work offline**: basemaps, downloaded map tiles and downloaded elevation all work without a signal. See [Before you go offline](/manual/offline/).

## Platforms

TopoKit runs on iPhone and Mac, iOS 26 and macOS 26 or later.

TopoKit is free to download, and most of what it does needs the full app, which covers every iPhone and Mac on the same Apple Account; see [Your TopoKit](/manual/your-topokit/).

## Privacy

TopoKit has no account, no sign-in, no analytics or tracking, and no server that receives your data. No request it makes carries a project: it sends a coordinate, an area or a search text only for the thing you asked it to do. Projects sync through iCloud Drive under your own Apple Account, which is the system's traffic, not TopoKit's. See also the [privacy policy](/privacy).

### What TopoKit sends, and where

- **Apple Maps**: the map imagery for the area on screen; every search, as you type it, with the area the map is showing, including text that matches your layers or reads as a coordinate; the coordinate of a spot you hold, to name the nearest place and its time zone; and for a route, each leg's two ends and the travel mode, and each stop's coordinate to name it.
- **The App Store**: a check of what you own and the current prices, at launch, each time TopoKit returns to the foreground, and when you buy, restore or redeem a code.
- **Elevation data**: one file for each one-degree square, named by the square and carrying nothing else, whenever TopoKit downloads elevation. See [Elevation](/manual/elevation/#elevation-data-source) for the source.
- **Map data for basemaps** ([Overture Maps](https://overturemaps.org)): a listing to find the newest release, then only the parts of the data that cover the area you picked, sent with the app's name, version and platform. The same requests measure the download size before a build, and opening a built basemap's editor checks once for newer data. A basemap whose data is already on the device builds without them.
- **topokit.ca**: before any map-data request, TopoKit reads one small file that can point it to another copy of the map data or pause map-data downloads. The request carries a timestamp and the app's name, version and platform. If topokit.ca does not answer, TopoKit goes straight to the map data. When the file pauses map-data downloads, a basemap build stops and shows the file's message, or "Map data downloads are currently disabled" if it has none.
- **Tile and WMS servers you add**: the tiles for the area on screen, a WMS service's capabilities when you connect to it, and for an offline download every tile in the area you chose, sent with the app's name, version and platform.
- **Routes you hand off**: Apple Maps receives the start, the end and the travel mode; another maps app also receives up to nine stops between them.
- **Email you send**: **Send Feedback**, **Send Logs to Developer** and a crash report each open a draft to feedback@topokit.ca in your own mail, and nothing goes until you send it. The diagnostic log can include project names, file paths and coordinates, and TopoKit says so before it attaches it; a crash report holds the app and system versions and the steps the app was running when it crashed, not your projects or locations.

:ios[On iPhone, **Settings → Storage & iCloud → Large Downloads** decides whether elevation data, offline map downloads and a basemap's map data may use cellular data; it does not affect browsing the map or iCloud sync. See [Tile layers](/manual/tile-layers/#downloads-over-cellular-data).]

## How to use this manual

[Your first project](/manual/getting-started/) walks through the basics; the other chapters cover each area in full.

The **All**, **Mac** and **iPhone** buttons beside the search box, or in the menu on a narrow screen, hide the other platform's sections, sentences and table rows on every page, and the site remembers the choice. A sentence that applies to one platform names it, so it reads correctly in **All**.

The first time a chapter uses a term from the [Glossary](/manual/glossary/), it is underlined with dots; hover over it or tap it for the definition.

## FAQ

**Which version of TopoKit does this manual describe?**
TopoKit 1.2. **Settings → About TopoKit → Version** shows the one installed, and **What's New** on the same page lists the changes in every release, newest first. After an update, an orange dot on the row marks notes you have not opened.

**How do I report a problem or send feedback?**
**Settings → Help & Feedback → Send Feedback** opens an email to feedback@topokit.ca, and **Send Logs to Developer** on the same page attaches the diagnostic log. :mac[On a Mac, both are also in the **Help** menu.]
