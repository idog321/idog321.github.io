---
title: "TopoKit manual"
description: "What TopoKit is, what it does, the platforms it runs on, what it sends over the network, and how to read this manual."
---
## What TopoKit is

TopoKit is a native mapping app for geospatial fieldwork on iPhone and Mac. You can use it to read GPX, KML, KMZ, GeoJSON, GeoPackage, GeoTIFF and GeoPDF.

Everything you make is kept in a [**project**](/manual/projects-and-files/), including features, imported maps, recorded tracks and photos.

You can display Apple Maps beneath your layers in **Standard**, **Hybrid** or **Satellite**, or choose **Off** to show only your own layers. [Basemaps you build in TopoKit](/manual/basemaps/#the-apple-maps-switch) are drawn on top of Apple Maps.

## What you can do

- **Build basemaps**: Create a [topographic map](/manual/basemaps/) of an area you choose. TopoKit builds it on your device, with shaded relief, contours, slope angle, trails, roads, water and place names.
- **Add your own maps**: Stream an XYZ or WMS map service from its address using [tile layers](/manual/tile-layers/), or import GeoTIFF and GeoPDF maps as [raster overlays](/manual/raster-overlays/). TopoKit reprojects the imported maps to line up with the map.
- **Search and identify**: [Search by name or coordinates](/manual/search-and-identify/), or tap a trail, a peak or one of your own features to open a card identifying it. To view a spot's elevation, slope, aspect, sunrise and sunset, hold the spot or right-click it on a Mac.
- **Draw features**: Create [points, lines, polygons and circles](/manual/points-lines-polygons/), each with its own style and photos.
- **Measure**: View [distance, area and bearing](/manual/measurement/) as they update live while you draw.
- **Read elevation**: TopoKit uses a 30 m elevation model to show the [height of any point](/manual/elevation/) and a profile along any line, recorded track or basemap trail.
- **Record tracks**: [Record tracks on your iPhone](/manual/gps-and-track-recording/) with trip statistics and GPS filtering you can adjust.
- **Plan routes**: Add stops to a [route](/manual/routes/) for driving, walking or cycling, and Apple Maps fills in the roads between them. You can save the route as a line or share it as a file.
- **Import and export**: Import the vector formats listed above as layers, or [export any feature or folder as a file](/manual/import-and-export/).
- **Work offline**: Use basemaps, downloaded map tiles and downloaded elevation [without a signal](/manual/offline/).

## Platforms

TopoKit runs on iPhone with iOS 26 or later and on Mac with macOS 26 or later.

Your purchase covers every iPhone and Mac signed into the same Apple Account, as explained in [Your TopoKit](/manual/your-topokit/).

## Privacy

TopoKit has no account or sign-in, no analytics or tracking, and [no server that receives your data](/privacy). None of its requests include a project. Your projects sync through iCloud Drive under your own Apple Account; the system handles this traffic, rather than TopoKit.

### What TopoKit sends, and where

- **Apple Maps**: TopoKit requests map imagery for the area on screen and sends every search as you type it, along with the area the map is showing. This includes search text that matches your layers or reads as a coordinate. When you hold a spot or open its place card, TopoKit sends the spot's coordinate to identify the nearest place and its time zone. For a route, it sends each leg's two ends and the travel mode, along with the coordinate of each unnamed stop to find its name.
- **The App Store**: TopoKit requests current prices at launch and checks what you own at launch, each time the app returns to the foreground, and when you buy, restore or redeem a code.
- **Elevation data**: Whenever TopoKit downloads elevation, it requests one file for each one-degree square, named by the square, from the [elevation data source](/manual/elevation/#elevation-data-source).
- **Map data for basemaps** ([Overture Maps](https://overturemaps.org)): TopoKit requests a listing to find the newest release, then only the parts of the data that cover the area you chose. These requests include the app's name, version and platform, and the same requests are used to measure the download size before a build. Opening a built basemap's editor also checks once for newer data, while a basemap whose data is already on the device builds without these requests.
- **topokit.ca**: Before any map-data request, TopoKit reads one small file that can direct it to another copy of the map data or pause map-data downloads. This request includes a timestamp and the app's name, version and platform. TopoKit proceeds directly to the map data if topokit.ca does not respond. When the file pauses map-data downloads, the basemap build stops and displays the file's message, or "Map data downloads are currently disabled" if the file has no message.
- **Tile and WMS servers you add**: TopoKit requests tiles for the area on screen and a WMS service's capabilities when you connect to it. For an offline download, it requests every tile in the area you chose. All of these requests include the app's name, version and platform.
- **Routes you hand off**: When you send a route to Apple Maps, it receives the start and the end, each with the name shown in the tool card, and the travel mode. Another maps app receives the coordinates of the start, the end and up to nine stops between them, along with the travel mode.
- **Email you send**: **Send Feedback** and **Send Logs to Developer** in [**Settings → Help & Feedback**](/manual/settings/#help--feedback) each open a draft to support@topokit.ca in your own mail, as does a crash report. Nothing is sent until you send the email. The diagnostic log can include project names, file paths and coordinates, and **Send Logs to Developer** tells you this before attaching the log. A crash report includes the app and system versions, the device model and where the crash happened; it does not include your projects, your locations or the log.

## How to use this manual

Start with [Your first project](/manual/getting-started/) to learn the basics, then use the other chapters for a full explanation of each area.

Use the **All**, **Mac** and **iPhone** buttons beside the search box to choose which platforms you read about. On a narrow screen, these buttons are in the menu. When you select a platform, the other platform's sections, sentences and table rows are hidden on every page, and the site remembers your choice.

Hover over or tap a term with a dotted underline to read its [Glossary](/manual/glossary/) definition. Each term is underlined the first time it appears in a chapter's text, except for raster, route and track.

## FAQ

**Which version of TopoKit does this manual describe?**
This manual describes TopoKit 1.2; you can check your installed version in **Settings → About TopoKit → Version**.
