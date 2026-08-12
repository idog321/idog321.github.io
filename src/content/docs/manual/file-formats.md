---
title: "File formats at a glance"
description: "Every format TopoKit reads and writes, grouped by the kind of data, with what survives a round trip."
---

## Vector data

Points, lines, and polygons. All five formats below import, and all except KMZ also export. Full detail, including exactly which attributes survive, is in [Vector import and export](/manual/vector-import-export/).

| Format | What it is | Import | Export |
|---|---|---|---|
| **GPX** (`.gpx`) | Tracks, routes, and waypoints, the standard handheld GPS and fitness-app format | Yes | Yes |
| **GeoJSON** (`.geojson`, `.json`) | The web-standard vector format, readable in any text editor | Yes | Yes |
| **KML** (`.kml`) | Google Earth's XML format. Unlike GPX it carries polygons | Yes | Yes |
| **KMZ** (`.kmz`) | A zipped KML | Yes | No |
| **GeoPackage** (`.gpkg`) | A single-file GIS database | Yes | Yes |

GeoPackage preserves the most data. Attributes and per-vertex elevation survive in both directions, and so do the per-vertex timestamps on recorded tracks, which makes it the format to choose when the data is going to a colleague or into desktop GIS and coming back.

**GPX, KML, and GeoJSON imports are capped at 100 MB.** GeoPackage has no size cap, but a very large file can still run an iPhone out of memory. See [Vector import and export](/manual/vector-import-export/).

**Shapefiles (`.shp`) are not supported.** Convert them to any of the formats listed above before importing.

## Raster overlays

Georeferenced images pinned to real-world coordinates, drawn in the order you put them in the layer tree. Rasters are import only — TopoKit never converts them to another format. Sharing a raster sends the original file, exactly as you imported it. See [Raster overlays](/manual/raster-overlays/).

| Format | What it is |
|---|---|
| **GeoTIFF** (`.tif`, `.tiff`) | A standard format for georeferenced imagery: aerial photos, hillshades, exports from desktop GIS |
| **GeoPDF** (`.pdf`) | A PDF carrying its georeferencing inside the file — a common format for published and scanned topographic maps |

Some rasters have to be reprojected before they line up with the map, which TopoKit handles automatically. After importing a raster that requires a reprojection, a **Reprojection Required** sheet appears, which provides all the necessary information for proper reprojection to occur. Pressing **Cancel** on the sheet leaves the raster disabled. The original file you imported is never modified in this process.

Three conditions trigger a reprojection: the raster's coordinate system is not one the map uses, that coordinate system could not be read with confidence, or the raster is a GeoPDF georeferenced by control points. A control-point GeoPDF always needs reprojecting, even when the control points are already in WGS84.

## Tile layers

Map imagery streamed from a web service. You supply the address; nothing is imported or exported. See [Tile layers](/manual/tile-layers/).

| Source | What it is |
|---|---|
| **XYZ tile URL** | A tile address with `{z}`, `{x}`, and `{y}` placeholders for zoom, column, and row, which TopoKit fills in as you pan |
| **WMS service** | A map service address. TopoKit reads the service's catalogue and lists its layers for you to pick from, one layer per tile layer |

## Exporting data

Select a feature or a folder in the layer tree and export it to GPX, KML, GeoJSON, or GeoPackage. To export several features at once, turn on **Select** mode in the layer tree, select them, and export the selection.

- **Rasters are shared, not converted.** A shared raster (or a shared folder holding one) is the original file exactly as you imported it. The reprojected version TopoKit built for display stays on the device, so the recipient gets your source file in its original coordinate system.
- **GPX cannot carry polygons.** Exporting a polygon to GPX does not fail — it writes a valid file with no features in it. Use KML, GeoJSON or GeoPackage for anything with an area.
- **Styling does not travel in either direction.** No format carries your colours, widths or pin glyphs out, and none is read on the way in either — an imported file is drawn with your import defaults from Settings. GeoJSON and GeoPackage do carry your attributes.

## DEMs

- **A DEM you import as a raster is displayed as imagery only.** Elevation values always come from TopoKit's own global elevation model, never from a file you supply. See [Elevation and DEMs](/manual/elevation/).
