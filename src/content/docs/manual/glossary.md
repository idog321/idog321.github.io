---
title: "Glossary"
description: "Plain-language definitions of the GIS terms used throughout this manual."
---
Short, plain-language definitions of the GIS terms this manual uses. Skim it now if you are new to GIS.

**Attribute** — a named value carried on a feature alongside its geometry: a species, a sample ID, a survey code. TopoKit has no attribute editor, so collect geometry here and attribute it in your desktop GIS. See [Attributes are read-only](/manual/points-lines-polygons/#attributes-are-read-only).

**Axis order** — whether a coordinate pair is written latitude-first or longitude-first. Every vector format fixes this in its own spec, so only a raster can be genuinely ambiguous. See [Troubleshooting](/manual/raster-overlays/#troubleshooting).

**Base map** — Apple's map underneath the whole project, cycled between :ui[Standard]{icon=map-standard}, :ui[Hybrid]{icon=map-hybrid}:v11[ and ]:v111[, ]:ui[Satellite]{icon=map-satellite}:v111[ and :ui[No Map]{icon=map-no-map}]. It is an app-wide preference, not a project setting. See [The base map button](/manual/map-tools/#the-base-map-button).

**Bearing** — the compass direction from one point to another, in degrees clockwise from north. Declination is the local difference between true north and magnetic north. See [Bearing](/manual/measurement/#bearing).

**Bounding box** — the smallest north-south/east-west rectangle that contains a feature or raster. TopoKit uses it for zooming, downloads, and clipping. See [Raster overlays](/manual/raster-overlays/).

**CRS (coordinate reference system)** — the convention that gives coordinate numbers meaning: which datum, which projection, which units, identified by an EPSG code. TopoKit reads a file's CRS and shows it read-only; there is no CRS picker. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**Datum** — what ties a coordinate system to the ground: which ellipsoid, and where it is pinned. Two datums can put the same latitude and longitude hundreds of metres apart. See [Datum accuracy](/manual/raster-overlays/#datum-accuracy).

**DEM (digital elevation model)** — a raster whose pixel values are ground heights rather than colours. Every elevation TopoKit reports comes from one built-in DEM; a DEM you import yourself is drawn as imagery and never queried. See [Elevation data source](/manual/elevation/#elevation-data-source).

**Ellipsoid** — the slightly flattened sphere used as a mathematical stand-in for the Earth's shape. Every TopoKit coordinate is expressed against WGS84's. See [Calculation methods](/manual/measurement/#calculation-methods).

**EPSG code** — the registry number that identifies a coordinate reference system, written `EPSG:4326` (WGS84) or `EPSG:3857` (Web Mercator). A file declares its own and TopoKit reads it rather than asking you. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**Geodesic distance** — distance following the curve of the Earth's surface rather than a straight line through it. Every length TopoKit reports is geodesic; area is not, so perimeter and area on one card come from different earth models. See [Calculation methods](/manual/measurement/#calculation-methods).


**GeoJSON** (`.geojson`, `.json`) — a plain-text JSON file of features with their attributes, readable in any text editor. See [GeoJSON](/manual/vector-import-export/#geojson).

**GeoPackage** (`.gpkg`) — a single-file GIS database, and the format that survives a round trip to desktop GIS best. See [GeoPackage](/manual/vector-import-export/#geopackage).

**GeoPDF** (`.pdf`) — a PDF carrying its georeferencing inside the file, a common format for published and scanned topographic maps. See [GeoPDF import](/manual/raster-overlays/#geopdf-import).

**Georeferencing** — the coordinates and transform stored inside an image file, saying which patch of ground each pixel covers. TopoKit reads it at import and offers no way to add or edit it. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**GeoTIFF** (`.tif`, `.tiff`) — a TIFF image carrying its own position and coordinate system in the file's tags. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**GNSS (global navigation satellite system)** — the satellite constellations a receiver fixes its position from: GPS, and also GLONASS, Galileo and BeiDou. A consumer receiver is good to 3–8 m in open sky, so a track along a straight road zig-zags by about that much without anything being wrong. See [GNSS](/manual/gps-and-track-recording/#faq).

**GPX** (`.gpx`) — the exchange format handhelds and watches write, holding waypoints, routes and recorded tracks, but nothing with an area. See [GPX](/manual/vector-import-export/#gpx).


**KML / KMZ** — KML is Google Earth's XML format for points, lines and polygons; KMZ is a zip archive holding a KML. See [KML](/manual/vector-import-export/#kml).

**Multi-part feature (MultiPoint, MultiLineString, MultiPolygon)** — one feature holding several separate geometries: a track split by a signal gap, a parcel in two pieces, an island group. On-map editing reaches only the first part. See [Points, lines, polygons and circles](/manual/points-lines-polygons/#finishing-and-editing-a-line).

**NoData** — a pixel value meaning "nothing was measured here": ocean in a land-use map, gaps in a DEM. TopoKit can draw those pixels transparent, but you type the value in yourself. See [NoData](/manual/raster-overlays/#nodata).

**Orthometric vs ellipsoidal height** — height measured from sea level, versus height measured from the mathematical ellipsoid a GNSS receiver works in; the two differ by tens of metres. TopoKit reports orthometric elevations. See [Elevation data source](/manual/elevation/#elevation-data-source).

**Overzoom** — drawing a map past its sharpest available tile by scaling the last one up: blurry, still readable, and not a failed download. Downloading a tile layer resets its ceiling to the highest zoom fetched, so the live layer goes soft above that too. See [Starting a download](/manual/tile-layers/#starting-a-download).

**Raster** — data stored as a grid of pixels: an air photo, a scanned map, a hillshade. In TopoKit, rasters are georeferenced images drawn on the base map. See [Raster overlays](/manual/raster-overlays/).

**Reprojection** — recomputing an image's pixels from one CRS into another so it lines up with the map. It runs once per raster per device, and the cached result never syncs. See [How reprojection works](/manual/raster-overlays/#how-reprojection-works).

**Shapefile** (`.shp`) — the multi-file vector format most desktop GIS exports by default. TopoKit reads and writes none of it — convert to GeoPackage or GeoJSON first. See [Shapefile](/manual/vector-import-export/#shapefile).

**Tile layer** — map imagery fetched from a web service as small square images ("tiles"), one set per zoom level. TopoKit ships with none, so every tile layer is one whose address you supplied. See [Tile layers](/manual/tile-layers/).

**Tool card** — the card at the bottom of the screen while a tool is running, holding that tool's live values and its :ui[Cancel]{icon=x}, :ui[Undo] and :ui[Save] buttons. See [The map](/manual/interface/#the-map).

**UTM (Universal Transverse Mercator)** — a metre-based projection cut into 60 north–south zones, written as a zone plus an easting and a northing (`10U 417559 5536636`). Eastings and northings are shown to the whole metre, though the fields accept decimals. See [Units and coordinates](/manual/ui-settings-styling/#units-and-coordinates).

**Vector feature** — data stored as coordinates: points, lines, and polygons. Unlike imagery, vector data stays sharp at any zoom and is tiny on disk. See [Points, lines, polygons and circles](/manual/points-lines-polygons/).

**Waypoint / route / track** — the three feature types a GPX file can hold: a standalone marked point, a planned path between points, and a path actually walked. TopoKit reads all three but writes only waypoints and tracks. See [GPX](/manual/vector-import-export/#gpx).

**Web Mercator (EPSG:3857)** — the projection every mainstream web map renders in, Apple's included, and the frame everything in TopoKit draws in. A raster that is not already in it, or in plain latitude/longitude, is reprojected first. See [How reprojection works](/manual/raster-overlays/#how-reprojection-works).

**WGS84 (EPSG:4326)** — the latitude/longitude datum GPS reports in, and the default for exchanging coordinates. Every coordinate in a TopoKit project is stored in it, and every export is written back out in it. See [Vector import and export](/manual/vector-import-export/).

**WKT (well-known text)** — a coordinate system written out as text, the `PROJCS[...]` block a desktop GIS puts in a `.prj` file. TopoKit reads it from a GeoPDF but never from a GeoTIFF. See [Coordinate systems](/manual/raster-overlays/#coordinate-systems).

**WMS** — Web Map Service, the OGC standard most government data portals use. One address exposes a catalogue of named layers to pick from, instead of a single tile URL. See [Adding a WMS layer](/manual/tile-layers/#adding-a-wms-layer).

**World file** — a small text sidecar (`.tfw`, `.wld`) holding the transform that positions an otherwise plain image. TopoKit does not use one placed beside a TIFF; write the transform into the TIFF instead. See [the raster FAQ](/manual/raster-overlays/#faq).

**XYZ** — the simple tile-URL convention most providers publish, with `{z}`, `{x}`, and `{y}` placeholders for zoom, column, and row. You paste the template and TopoKit fills in the numbers. See [Adding an XYZ tile layer](/manual/tile-layers/#adding-an-xyz-tile-layer).
