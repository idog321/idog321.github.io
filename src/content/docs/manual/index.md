---
title: "Overview"
description: "What TopoKit is, the platforms it runs on, and how to read this manual."
---
## What TopoKit is

TopoKit is a native mapping app for geospatial fieldwork, built for iPhone and Mac. It is made for geologists, ecologists, foresters, and anyone who takes their own spatial data into the field. It reads the file formats a GIS professional already works in: GPX, KML, GeoJSON, GeoPackage, GeoTIFF, and GeoPDF. Setting up a field map is simple and takes only a few minutes.

Everything you create is stored in a **project**: features, imported maps, recorded tracks, and attached photos. Projects can stay locally on your device, or sync between devices through iCloud Drive, both of which keep working without a signal. A project is a single folder, so you can copy it, move it, or back it up in one piece. See [Projects and files](/manual/projects-and-files/).

The map is built directly on Apple's MapKit rather than a third-party library, so the base map is Apple Maps.

## What you can do

- **Create features** — drop points, draw lines and polygons, style them, and attach photos. See [Map tools](/manual/map-tools/).
- **Measure** — distance, area, and bearing are shown live as you draw. See [Measuring](/manual/measurement/).
- **Record tracks** — record your path on iPhone, with settings to tune how tightly the GPS is filtered, and trip statistics attached. See [GPS and track recording](/manual/gps-and-track-recording/).
- **Get directions** — find and save walking and driving routes. See [Directions and routing](/manual/directions-and-routing/).
- **Read elevation** — point elevations, and a profile along any path, from a global 30 m model. See [Elevation and DEMs](/manual/elevation/).
- **Work offline** — download tile layers and elevation data ahead of time, and work without a signal. See [Tile layers](/manual/tile-layers/).
- **Import and export** — the standard GIS formats. See [Vector import and export](/manual/vector-import-export/) and [Raster overlays](/manual/raster-overlays/).

## What data you can use

| Data type | What it is | Formats |
|---|---|---|
| [Vector features](/manual/points-lines-polygons/) | Points, lines, and polygons you draw or import | GPX, KML, KMZ, GeoJSON, GeoPackage |
| [Raster overlays](/manual/raster-overlays/) | Georeferenced images pinned to real-world coordinates: aerial photos, scanned topographic sheets, your own maps. Reprojected to line up with the map. | GeoTIFF, GeoPDF |
| [Tile layers](/manual/tile-layers/) | Map imagery streamed from a web service, which you can download for offline use | XYZ tile URLs, WMS services |
| [Elevation](/manual/elevation/) | Ground heights for point elevations and profiles, from a global 30 m model | Downloaded by TopoKit on demand |
| [GPS tracks](/manual/gps-and-track-recording/) | Your recorded path, with trip statistics attached | Recorded in-app (iPhone only) |

You supply your own tile layers. Beyond Apple's own base map, TopoKit ships with no catalogue of background maps: you add your own by pasting in the web address of a map service, as either an XYZ tile URL or a WMS service. Plenty of government agencies publish free services. See [Tile layers](/manual/tile-layers/).

## Privacy

TopoKit has no account, no sign-in, and no server of its own. Everything you collect is written to your device, and nothing is uploaded. There is no analytics or tracking.

Syncing between devices runs on your own iCloud account, the same one your photos use. Projects move between iPhone and Mac without passing through a TopoKit server. See [Projects and files](/manual/projects-and-files/).

TopoKit uses the network for three purposes:

- **Apple's map service**, for the base map, place search, and directions.
- **The global elevation model**, downloaded on demand from a public dataset. Those requests identify the tile you need, and nothing else.
- **Any tile layer you add yourself**, which contacts the server whose address you supplied.

Your features, tracks, photos, and imported files are never part of any of that. The full [privacy policy](/privacy.html) has the detail.

## Platforms

TopoKit runs on iPhone and Mac (iOS 26.2 and macOS 26.2 or later).

## How to use this manual

TopoKit is meant to be picked up quickly, and if you have used mapping or GIS software before, most features will be where you expect. If you are new to the app, [Getting started](/manual/getting-started/) will help you learn the basics and walk you through building your first project. All the other chapters walk you through each area in full, including how measurements are calculated and rasters reprojected. If you only care about one platform, the **All / Mac / iPhone** buttons beside the search bar filter every page to that platform.
