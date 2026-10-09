---
title: "Glossary"
description: "Definitions of the GIS and TopoKit terms used throughout this manual."
---
A chapter marks the first use of each term with a dotted underline, and hovering over it or tapping it shows the entry.

## The map and its layers

**Apple Maps** — Apple's map, drawn under every project and switched between :ui[Standard]{icon=map-standard}, :ui[Hybrid]{icon=map-hybrid}, :ui[Satellite]{icon=map-satellite} and :ui[Off] by the last sidebar button. The choice belongs to the device, not the project. See [The Apple Maps switch](/manual/basemaps/#the-apple-maps-switch).

**Basemap** — a topographic map TopoKit builds on the device from downloaded elevation and map data, drawn with no connection once built. See [What a basemap is](/manual/basemaps/#what-a-basemap-is).

**Contour interval** — the difference in height between neighbouring contour lines. See [Contour lines](/manual/basemaps/#contour-lines).

**Quarter** — half a degree of latitude by half a degree of longitude, a quarter of a 1° square. Each basemap covers one quarter or one whole square, and a quarter still downloads its square's whole elevation tile. See [Picking the area](/manual/basemaps/#picking-the-area).

**Shaded relief (hillshade)** — shading computed from elevation and a light direction. See [Ground and relief](/manual/basemaps/#ground-and-relief).

**Slope angle** — how steep the ground is, in degrees from level. A basemap's slope shading measures it across 30 m, so a short steep step reads gentler than it is, and its colours start at 27°; a spot's card measures it across about 90 m ([Height, slope and aspect at a spot](/manual/elevation/#height-slope-and-aspect-at-a-spot)). See [Ground and relief](/manual/basemaps/#ground-and-relief).

**Tile layer** — map imagery drawn as square tiles, one set per zoom level. See [Tile layers](/manual/tile-layers/).

**TMS (Tile Map Service)** — a tile-address scheme like XYZ that counts rows from the south instead of the north. Write `{-y}` in place of `{y}` in the address; with `{y}` the tiles are drawn with north and south swapped. See [Adding an XYZ tile layer](/manual/tile-layers/#adding-an-xyz-tile-layer).

**WMS** — Web Map Service, an OGC standard many government portals publish: one address offers a catalogue of named layers. TopoKit always asks the server for Web Mercator. See [Adding a WMS layer](/manual/tile-layers/#adding-a-wms-layer).

**XYZ** — the tile-address convention most providers publish, with `{z}`, `{x}` and `{y}` placeholders for zoom, column and row, which TopoKit fills in. See [Adding an XYZ tile layer](/manual/tile-layers/#adding-an-xyz-tile-layer).

## Coordinates and projections

**Axis order** — whether a coordinate pair is written latitude first or longitude first. Every vector format TopoKit reads fixes it in its specification, so only a raster can be ambiguous. See [Editing a raster](/manual/raster-overlays/#editing-a-raster).

**CRS (coordinate reference system)** — the datum, projection and units that give coordinate numbers meaning, usually identified by an EPSG code. TopoKit reads a raster's CRS from the file, or from a `.prj` chosen with a TIFF, and shows it read-only. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**Datum** — what ties a coordinate system to the ground: which ellipsoid, and where it is pinned. Two datums can put the same latitude and longitude metres or hundreds of metres apart. See [Datum accuracy](/manual/raster-overlays/#datum-accuracy).

**Ellipsoid** — the flattened sphere that models the Earth's shape. TopoKit measures lengths and areas on WGS84's; the heights it reports are above sea level, which lies tens of metres above or below the ellipsoid. See [Calculation methods](/manual/measurement/#calculation-methods).

**EPSG code** — the registry number of a coordinate reference system: `EPSG:4326` for WGS84, `EPSG:3857` for Web Mercator. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**UTM (Universal Transverse Mercator)** — a metre-based projection in 60 zones, written as zone, easting and northing. TopoKit writes `10N 417559E 5536636N`: the letter is the hemisphere, not a latitude band, and zones are plain six-degree strips without the Norway and Svalbard exceptions. See [Coordinate formats](/manual/search-and-identify/#coordinate-formats).

**Web Mercator (EPSG:3857)** — the projection web maps render in, and the one TopoKit draws in. A raster in any other projection than this or plain latitude and longitude is reprojected first. See [How reprojection works](/manual/raster-overlays/#how-reprojection-works).

**WGS84 (EPSG:4326)** — the latitude and longitude datum GPS reports in. TopoKit stores every coordinate in it, converting imports and writing every export in it. See [Importing and exporting](/manual/import-and-export/).

## Rasters and georeferencing

**GeoPDF** (`.pdf`) — a PDF carrying its georeferencing inside the file, common for published topographic maps. See [GeoPDF import](/manual/raster-overlays/#geopdf-import).

**GeoTIFF** (`.tif`, `.tiff`) — a TIFF image carrying its own position and coordinate system in the file's tags. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**NoData** — a pixel value meaning "nothing here", such as the border around a scanned sheet. See [NoData](/manual/raster-overlays/#nodata).

**Raster** — data stored as a grid of pixels: an air photo, a scanned map, a hillshade. See [Raster overlays](/manual/raster-overlays/).

**Reprojection** — recomputing an image's pixels from one CRS into another so it lines up with the map. It runs once per raster on each device, and the result never syncs. See [How reprojection works](/manual/raster-overlays/#how-reprojection-works).

**Sidecar file** — a file with an image's name carrying what the image lacks: a world file for position, a `.prj` for coordinate system. TopoKit reads them only for a TIFF, chosen in the same pick. See [Sidecar files](/manual/raster-overlays/#sidecar-files).

**WKT (well-known text)** — a coordinate system written out as text, as in a `.prj` file. TopoKit reads it in a GeoPDF and a `.prj`, never in a GeoTIFF's own tags. See [Sidecar files](/manual/raster-overlays/#sidecar-files).

**World file** (`.tfw`, `.wld`, `.tifw`, `.tiffw`) — a text sidecar holding the transform that positions an image. It replaces the position stored in the TIFF but names no projection, so choose the matching `.prj` too unless the TIFF declares one. See [Sidecar files](/manual/raster-overlays/#sidecar-files).

## Elevation

**DEM (digital elevation model)** — a raster whose pixel values are ground heights. Every height TopoKit looks up, and every basemap's relief, comes from one DEM downloaded a tile at a time; a DEM you import is drawn as imagery and never queried. See [Elevation data source](/manual/elevation/#elevation-data-source).

**Elevation profile** — a chart of ground height along a line, with climb and descent totalled as gain and loss. See [The elevation profile](/manual/elevation/#the-elevation-profile).

**Elevation tile** — one 1° square of the DEM, a 25–40 MB file kept on the device for every project until you remove it. See [Downloading tiles](/manual/elevation/#downloading-tiles).

## Features and files

**Attribute** — a named value carried on a feature beside its geometry, such as a sample ID. See [Attributes are read-only](/manual/points-lines-polygons/#attributes-are-read-only).

**GeoJSON** (`.geojson`, `.json`) — a plain-text JSON file of features and their attributes. See [GeoJSON](/manual/import-and-export/#geojson).

**GeoPackage** (`.gpkg`) — a single-file GIS database holding points, lines and polygons in typed tables. See [GeoPackage](/manual/import-and-export/#geopackage).

**GPX** (`.gpx`) — the exchange format handhelds write, holding waypoints, routes and tracks but nothing with an area. See [GPX](/manual/import-and-export/#gpx).

**KML / KMZ** — KML is an OGC XML format for points, lines and polygons; KMZ is a zip archive holding a KML. See [KML and KMZ](/manual/import-and-export/#kml-and-kmz).

**Multi-part (MultiPoint, MultiLineString, MultiPolygon)** — one feature holding several separate geometries, such as a parcel in two pieces. See [Points, lines, polygons and circles](/manual/points-lines-polygons/#faq).

**Shapefile** (`.shp`) — a multi-file vector format TopoKit neither reads nor writes; convert it to GeoPackage or GeoJSON first. See [Importing and exporting](/manual/import-and-export/#faq).

**Vector feature** — data stored as coordinates: points, lines and polygons, sharp at any zoom. See [Points, lines, polygons and circles](/manual/points-lines-polygons/).

**Waypoint / route / track** — a GPX file's marked point, planned path and travelled path. TopoKit reads all three but writes only waypoints and tracks, so a line drawn with :ui[Add Route] is written as a track. See [GPX](/manual/import-and-export/#gpx).

## Drawing and measuring

**Bearing** — the direction from one point to another, in degrees clockwise from north. A magnetic bearing subtracts the declination, which TopoKit reads from the iPhone's compass where you stand, not where the line is. See [Bearing](/manual/measurement/#bearing).

**Geodesic** — measured along the curve of the Earth's surface. Every length TopoKit reports is geodesic; for area, each polygon side is a straight line between its vertices. See [Calculation methods](/manual/measurement/#calculation-methods).

**Tool card** — the card at the bottom of the map while a tool runs, holding its live figures and buttons. See [The map](/manual/interface/#the-map).

## FAQ

**Why is a word underlined in one paragraph and not in the next?**
Only a term's first use on each page is marked, and never one inside a heading, a link or code.
