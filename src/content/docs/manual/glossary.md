---
title: "Glossary"
description: "Definitions of the GIS and TopoKit terms used throughout this manual."
---
Except for raster, route and track, the first use of each term in a chapter has a dotted underline. Hover over or tap an underlined term to read its glossary entry.

## The map and its layers

**Apple Maps**: Apple's map appears under every project. Use [the last sidebar button](/manual/basemaps/#the-apple-maps-switch) to switch between :ui[Standard]{icon=map-standard}, :ui[Hybrid]{icon=map-hybrid}, :ui[Satellite]{icon=map-satellite} and :ui[Off]. Your choice applies to the device rather than the project.

**Basemap**: TopoKit builds a topographic [basemap](/manual/basemaps/#what-a-basemap-is) on your device from downloaded elevation and map data. You can view the basemap without a connection once it's built.

**Contour interval**: The contour interval is the difference in height between neighbouring [contour lines](/manual/basemaps/#contour-lines).

**Quarter**: A quarter measures half a degree of latitude by half a degree of longitude, covering a quarter of a 1° square. Each [basemap area](/manual/basemaps/#picking-the-area) covers one quarter or one whole square, but choosing a quarter still downloads the whole elevation tile for its square.

**Shaded relief (hillshade)**: [Shaded relief](/manual/basemaps/#ground-and-relief) is shading computed from elevation and a light direction.

**Slope angle**: The slope angle describes how steep the ground is, in degrees from level. A basemap's [slope shading](/manual/basemaps/#ground-and-relief) measures the angle across 40 to 60 m, so a short steep step appears gentler than it is; the shading colours start at 27°. The [card for a spot](/manual/elevation/#height-slope-and-aspect-at-a-spot) measures the angle across about 90 m.

**Tile layer**: A [tile layer](/manual/tile-layers/) displays map imagery as square tiles, with one set of tiles for each zoom level.

**TMS (Tile Map Service)**: Like XYZ, TMS is a tile-address scheme, but it counts rows from the south instead of the north. When you [add a TMS tile layer](/manual/tile-layers/#adding-an-xyz-tile-layer), write `{-y}` in place of `{y}` in the address; using `{y}` draws the tiles with north and south swapped.

**WMS**: Web Map Service is an OGC standard used by many government portals to publish a catalogue of named layers at one address. TopoKit always requests Web Mercator from the server for a [WMS layer](/manual/tile-layers/#adding-a-wms-layer).

**XYZ**: Most providers publish tiles using the XYZ tile-address convention. An [XYZ tile address](/manual/tile-layers/#adding-an-xyz-tile-layer) uses `{z}`, `{x}` and `{y}` placeholders for zoom, column and row, which TopoKit fills in.

## Coordinates and projections

**Axis order**: Axis order determines whether a coordinate pair is written latitude first or longitude first. Every vector format TopoKit reads specifies the order, so only a [raster](/manual/raster-overlays/#editing-a-raster) can have an ambiguous axis order.

**CRS (coordinate reference system)**: A [coordinate reference system](/manual/raster-overlays/#coordinate-systems) defines the datum, projection and units that give coordinate numbers meaning, and is usually identified by an EPSG code. TopoKit reads a raster's CRS from the file or from a `.prj` you choose with a TIFF, and displays it as read-only.

**Datum**: A datum relates a coordinate system to the ground by specifying which ellipsoid it uses and where that ellipsoid is positioned. The same latitude and longitude can refer to locations metres or hundreds of metres apart in [different datums](/manual/raster-overlays/#datum-accuracy).

**Ellipsoid**: An ellipsoid is a flattened sphere used to model the Earth's shape. TopoKit [measures the lines and polygons in a project](/manual/measurement/#calculation-methods) on the WGS84 ellipsoid, but reports heights above sea level, which lies tens of metres above or below the ellipsoid.

**EPSG code**: An EPSG code is the registry number of a [coordinate reference system](/manual/raster-overlays/#coordinate-systems), such as `EPSG:4326` for WGS84 or `EPSG:3857` for Web Mercator.

**UTM (Universal Transverse Mercator)**: UTM is a metre-based projection divided into 60 zones, with coordinates written as zone, easting and northing. TopoKit uses the [format](/manual/search-and-identify/#coordinate-formats) `10N 417559E 5536636N`, where the letter identifies the hemisphere rather than a latitude band. Its zones are six-degree strips without the Norway and Svalbard exceptions.

**Web Mercator (EPSG:3857)**: TopoKit draws its map in Web Mercator, the projection used to render web maps. Before drawing a raster, TopoKit [reprojects it](/manual/raster-overlays/#how-reprojection-works) unless it uses Web Mercator or plain latitude and longitude (EPSG:4326, 4269 or 4258).

**WGS84 (EPSG:4326)**: GPS reports latitude and longitude in the WGS84 datum. TopoKit stores every feature in WGS84, converting [vector imports](/manual/import-and-export/) to it and using it for every vector export.

## Rasters and georeferencing

**GeoPDF** (`.pdf`): A [GeoPDF](/manual/raster-overlays/#geopdf-import) includes its georeferencing inside the PDF file and is commonly used for published topographic maps.

**GeoTIFF** (`.tif`, `.tiff`): A GeoTIFF is a TIFF image with its position and [coordinate system](/manual/raster-overlays/#coordinate-systems) recorded in the file's tags.

**NoData**: A [NoData](/manual/raster-overlays/#nodata) pixel value means "nothing here", such as in the border around a scanned sheet.

**Raster**: A [raster](/manual/raster-overlays/) stores data as a grid of pixels, as in an air photo, a scanned map or a hillshade.

**Reprojection**: [Reprojection](/manual/raster-overlays/#how-reprojection-works) recomputes an image's pixels from one CRS into another so the image lines up with the map. Each device reprojects a raster and caches its own result, which never syncs.

**Sidecar file**: A [sidecar file](/manual/raster-overlays/#sidecar-files) has the same name as an image and supplies information the image lacks: a world file specifies the position, and a `.prj` specifies the coordinate system. TopoKit reads sidecar files only for a TIFF, and only when you choose them together with the TIFF.

**WKT (well-known text)**: WKT describes a coordinate system as text, as in a [`.prj` file](/manual/raster-overlays/#sidecar-files). TopoKit reads WKT in a GeoPDF or a `.prj`, but never in a GeoTIFF's own tags.

**World file** (`.tfw`, `.wld`, `.tifw`, `.tiffw`): A [world file](/manual/raster-overlays/#sidecar-files) is a text sidecar file that specifies the transform used to position an image. It replaces the position stored in the TIFF but does not specify a projection, so choose the matching `.prj` too unless the TIFF declares a projection.

## Elevation

**DEM (digital elevation model)**: A DEM is a raster whose pixel values represent ground heights. TopoKit uses [one DEM](/manual/elevation/#elevation-data-source), downloaded a tile at a time, for every height lookup and every basemap's relief. A DEM you import is drawn as imagery and is never queried.

**Elevation profile**: An [elevation profile](/manual/elevation/#the-elevation-profile) charts ground height along a line and totals the climb and descent as gain and loss.

**Elevation tile**: Each [elevation tile](/manual/elevation/#downloading-tiles) is a 25–40 MB file containing one 1° square of the DEM. The tile is kept on your device for use in every project until you remove it.

## Features and files

**Attribute**: An [attribute](/manual/points-lines-polygons/#attributes-are-read-only) is a named value stored with a feature in addition to its geometry, such as a sample ID.

**GeoJSON** (`.geojson`, `.json`): A [GeoJSON file](/manual/import-and-export/#geojson) stores features and their attributes as plain-text JSON.

**GeoPackage** (`.gpkg`): A [GeoPackage](/manual/import-and-export/#geopackage) is a single-file GIS database that stores points, lines and polygons in typed tables.

**GPX** (`.gpx`): Handhelds write waypoints, routes and tracks in the [GPX exchange format](/manual/import-and-export/#gpx), which does not include anything with an area.

**KML / KMZ**: [KML](/manual/import-and-export/#kml-and-kmz) is an OGC XML format for points, lines and polygons, and KMZ is a zip archive containing a KML file.

**Multi-part (MultiPoint, MultiLineString, MultiPolygon)**: A [multi-part feature](/manual/points-lines-polygons/#faq) contains several separate geometries, such as a parcel in two pieces.

**Shapefile** (`.shp`): A shapefile is a multi-file vector format. To [import its data into TopoKit](/manual/import-and-export/#faq), convert it to GeoPackage or GeoJSON first, because TopoKit neither reads nor writes shapefiles.

**Vector feature**: A vector feature stores data as coordinates, so [points, lines and polygons](/manual/points-lines-polygons/) remain sharp at any zoom.

**Waypoint / route / track**: In a [GPX file](/manual/import-and-export/#gpx), a waypoint is a marked point, a route is a planned path and a track is a travelled path. TopoKit reads all three but writes only waypoints and tracks, so a line drawn with :ui[Add Route] is written as a track.

## Drawing and measuring

**Bearing**: A [bearing](/manual/measurement/#bearing) gives the direction from one point to another in degrees clockwise from north. A magnetic bearing subtracts the declination, which TopoKit reads from the iPhone's compass at your location rather than at the line's location.

**Geodesic**: A geodesic measurement follows the curve of the Earth's surface. TopoKit uses [geodesic measurements](/manual/measurement/#calculation-methods) for every length on your own data except a circle's circumference, which is calculated as 2πr from its radius. For area calculations, each polygon side is a straight line between its vertices.

**Tool card**: While a tool runs, the [tool card](/manual/interface/#the-map) at the bottom of the map displays its live figures and buttons.

## FAQ

**Why is a word underlined in one paragraph and not in the next?**
Only the first use of a term on each page is marked, and terms inside headings, links or code are never marked.
