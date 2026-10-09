---
title: "Search and identify"
description: "What a tap, a hold or a right-click on the map opens, what each card shows, and what the search bar finds."
---
Tap anything on the map, your own features or the marks, names and trails of a [basemap](/manual/basemaps/#what-a-basemap-is) you built, and a card says what it is. Hold a spot on iPhone, or right-click it on Mac, for a card about the ground there. One search bar finds your layers, basemap names, places and typed coordinates.

## What a tap finds

:mac[On Mac, a click does everything a tap does in this chapter.]

Your own points, lines and polygons answer, so a recorded track, a saved route and a circle answer too: the first two are lines, and a circle is saved as a polygon. A line answers a tap on or just beside its stroke; a polygon anywhere inside its outline except in a hole, and just outside its edge.

Only what the map is drawing answers. A hidden layer does not, nor anything below a tile layer in the tree, because the tile layer covers it (see [Draw order](/manual/layer-tree/#draw-order)). Nor does a pin folded into a cluster bubble, or a basemap mark the map has thinned away at this zoom.

On a basemap you built:

- **Marks**: peaks, passes, huts, campsites, viewpoints, springs, towns and every other mark the map prints. The line under the name is the mark's kind, such as "Peak" or "Hut". A mark's **Elevation** is in the basemap's contour unit, not your Units setting.
- **Road and river names**: a printed name lights that road or river along its length.
- **Area names**: a printed park, lake, sea, glacier, island or forest name lights the whole area.
- **Trails**: footpaths, tracks, cycleways and steps answer anywhere along their line, and so do ski runs and lifts where the basemap draws them. The kind line adds ", unpaved" where the data marks the surface.

A road or river away from its printed name does not answer, nor do the fill of a lake or the sea, contours, land cover, borders, tile layers, rasters or Apple Maps' own labels.

While a drawing tool or Edit Vertices is running, a tap goes to the tool and opens no card. A tap on empty map, or starting a tool, closes the card.

### Several things under one tap

The card opens on the best answer and lists the rest under **Also here**; choosing a row swaps the card and moves the outline. Your points come first, then basemap marks, your lines, your polygons and basemap lines. Polygons go smallest first, so a doline comes before the karst unit around it. Among basemap marks a town's name comes before a hut or an area name, and both before a peak; otherwise the nearest comes first.

Pins closer together than about a centimetre open as a list: "**N points here**", or "**N things here**" when a basemap mark, a line or an area is under them too. Until you choose a row, the card offers nothing but **Close**.

A cluster bubble zooms in to spread its points. When they lie within 6 m of each other, or the map is zoomed in as far as it goes, the card lists them instead (see [Points on the map](/manual/points-lines-polygons/#points-on-the-map)).

## The card

:ios[On iPhone, the card opens at the bottom of the screen and the bottom sheet steps aside; when the card closes, the sheet returns at its slim height even if it was raised before.]
:mac[On Mac, the card is a popover on the pin, or at the spot you clicked for a line or an area, and it closes when you click elsewhere.]

- **Name**: a tap copies it.
- **Line under the name**: your feature's folder path, top folder first; a basemap thing's kind, such as "Footpath, unpaved"; or a place's address, which copies.
- **Coordinate**: in your **Coordinate Format** (see [Units & Coordinates](/manual/settings/#units--coordinates)); a tap copies it. On a line it is the point of the line nearest your tap.
- **Cells**: a point's **Elevation**; a line's **Length**, with **Low** and **High** where its points carry heights; a recorded track's **Time**, **Moving** where it differs from **Time**, **Gain**, **Loss** and **Avg speed**; a polygon's **Area**, with holes taken out, and **Perimeter**. A tap copies a cell. [Calculation methods](/manual/measurement/#calculation-methods) says how the figures are computed.
- **Distance from you**: on a point, a mark, a place or the place card, the last line gives the distance and true bearing from your last known position, for example "3.20 km NE of you".
- **Your own features** also show their description, cut at five lines with a tap copying all of it, and an imported HTML description as plain text with its links dropped; a row of thumbnails under **Photos (N)**, each opening the [photo viewer](/manual/points-lines-polygons/#photos); and **Details**, folded behind a row that counts them, such as "7 attributes": the feature's attributes in alphabetical order, each value a tap to copy, scrolling past six. **Details** leaves out the keys TopoKit fills itself, among them `distance`, any key starting `track_` or `gps`, and a point's `elevation`.

### The card's buttons

Each button appears only where it applies. On iPhone the round buttons carry no text; the names below are their VoiceOver labels, and on Mac their tooltips.

- **The pill**: **Edit** on your own feature opens its editor. **Save** on a basemap line or area keeps it in the project (see [Saving a trail or a park](#saving-a-trail-or-a-park)). **Add Point** on a mark, a place or a held spot opens the point editor there, with a mark's or a place's name and a peak's height filled in (see [Adding a point](/manual/points-lines-polygons/#adding-a-point)).
- **Place**: on a point, a mark or a place, opens the place card for the ground under it, with the thing you came from under **Also here**.
- **Start here**: on the place card only (see [Holding a spot and the place card](#holding-a-spot-and-the-place-card)).
- :ios[**Route here**]:mac[**Route to Here**]: starts **Add Route** with this spot as the destination (see [Starting from a point or a place](/manual/routes/#starting-from-a-point-or-a-place)).
- **Zoom to**: frames your feature or the whole lit trail or park, and centres a mark or a place.
- **Elevation profile**: on any line, a basemap trail included, opens [the elevation profile](/manual/elevation/#the-elevation-profile) for the whole line. On a named trail it waits until the whole trail has been read.
- **Share**: **Coordinates** shares the name and coordinate as text:mac[, and on Mac also copies them]. **GPX**, **KML**, **GeoJSON** and **GeoPackage** share the feature as a file, without GPX for an area, and a mark, a place or a spot as a file holding one point under the card's name (see [Exporting and sharing](/manual/import-and-export/#exporting-and-sharing)). A basemap trail or park offers files once its whole shape has been read.

Add Point, Save, Route here, Elevation profile, the tools under Start here and the place card's terrain download ask to unlock TopoKit; reading, copying, Zoom to and Share do not (see [What asks you to unlock](/manual/your-topokit/#what-asks-you-to-unlock)).

## Saving a trail or a park

1. Tap the trail, road, river or ski run, or the park's printed name.
2. Wait for **Save** to brighten.
3. Tap **Save**.

The feature goes into a folder named **From the map**, made at the top of the Layers tab the first time, in your **Default Style** for lines or polygons (see [Features](/manual/settings/#features)), and the card becomes the saved feature's own.

**Save** stays dimmed while TopoKit reads the whole feature from the basemap data on the device, across every basemap in the project. A named line is read as the stretch you tapped plus every stretch of the same name that joins it within 250 m, stretch to stretch. Until the read finishes, **Shown here** gives the length lit on screen; afterwards the card shows **Length**, **Stretches** when there is more than one, and a line such as "2 more stretches with this name, nearest 3.20 km away" for those left out. A named area is read with any same-named area that touches it; the card then gives **Area**, and a line such as "2 more with this name, nearest 3.20 km away" counts the rest. An unnamed way has no name to join by, so **Save** keeps only the stretch lit on the map, as it does for a named line the basemap data cannot find under its name. A read that finds nothing, with no lit stretch to fall back on, leaves **Save** dimmed.

Once **From the map** holds a line, **Save** on another basemap line becomes a menu with **Add to <line>** and **Save as new line**. **Add to** joins the new stretch onto a line in **From the map**, preferring one with the same name. It refuses a named trail that line already holds, but appends an unnamed stretch every time. It builds one line from a long trail's sections, or from a trail and the road walk between two of them.

## Holding a spot and the place card

:::ios
On iPhone, hold the map still for half a second. The phone gives a haptic tap if **Settings → Toolbar & Haptics → Haptic Feedback** is on, a ring with a dot marks the spot, and its place card opens; nothing is added to the project. A hold does nothing while a tool is running. Holding a pin or a trail still opens the place card, with the pin or trail under **Also here**.
:::

The place card also opens from a typed coordinate picked in search and from **Place** on a card. :mac[On Mac, right-click bare ground and choose **Info**.]

The card is titled **Marked Location**. The coordinate comes first, then "Near <place>" once Apple's place look-up answers, which needs a connection.

When the elevation tile for the spot is on the device, the card leads with **Elevation**, **Slope** and **Aspect**; without it, the card offers to download that tile (see [Height, slope and aspect at a spot](/manual/elevation/#height-slope-and-aspect-at-a-spot)).

**Sunrise**, **Sunset** and **Daylight** are for today, and each appears only when the sun rises or sets there that day. The note under them reads "in your time zone" until the look-up finds the spot's own time zone, then "in local time".

**Start here** is a menu of **Add Line**, **Add Polygon**, **Add Circle** and **Add Route**, each starting with the spot as its first point, or a circle's centre. It needs an open project; without one, choosing a tool closes the card and starts nothing. **Add Point** opens the point editor at the spot with no name filled in.

:::mac
## Right-clicking the map

Right-click the map, or Control-click it. Right-clicking a cluster bubble spreads or lists its points, as a click does, with no menu. While a tool is running there is no menu. Right-clicking a point of the line or polygon you are drawing or reshaping deletes that point at once (see [Moving, adding and deleting vertices](/manual/points-lines-polygons/#moving-adding-and-deleting-vertices)).

On bare ground the spot is ringed while the menu is open. Without a project the menu holds only **Info**, **Copy Coordinates** and **Copy As**.

- **Info**: opens the place card.
- **Add Point Here**: opens the point editor at the spot. Nothing is saved until you click **Create**.
- **Add Line From Here**, **Add Polygon From Here**, **Add Route From Here**: start that tool with the spot as its first point. **Add Circle Here** uses the spot as the centre.
- **Copy Coordinates**: copies the spot in your Coordinate Format.
- **Copy As**: copies the spot in any of the four formats without changing the setting.

On a feature, a mark or a basemap line, the menu holds that thing's card actions: **Info**, **Place Info** on a point or a mark, then **Edit…**, **Save** or **Add Point**, **Route to Here**, **Zoom To**, **Elevation Profile** on a line, and **Share**. Your own feature also gets **Delete…**, which asks first; [Undo](/manual/interface/#undo-and-redo) brings it back. When more than one thing is under the pointer, **Also Here** lists the others.
:::

## Search

:mac[On Mac, the search bar is at the top of the map, and **Edit → Search** (`Cmd-F`) puts the cursor in it.] :ios[On iPhone, the search bar is at the top of the **Layers** tab.] It works with or without a project open.

Results come in up to four sections, in this order: **Coordinate**, **Layers**, **Basemaps** and **Places**. Picking a row frames it, opens its card as a tap would, and clears the search. A raster, which a tap never answers, opens a card with its name; a folder or a tile layer has no single spot, so nothing opens. A place is framed at the extent Apple gives, so a lake is framed whole, never closer than about 1 km. A place or a typed coordinate is marked with the ring and dot, and nothing is saved until you choose **Add Point**.

### What each section finds

| Section | What it searches | Order and limit |
|---|---|---|
| **Coordinate** | Text that reads as a coordinate in any of the four formats. The one row, **Go to coordinate**, shows the reading in decimal degrees and the format read, such as "UTM 10U", and opens the place card. Works offline. | Always first. |
| **Layers** | Names of folders, features, rasters and tile layers, anywhere in the name, ignoring case and accents. Also the parent folder's name, attribute keys and values, a point's coordinate and a tile layer's URL. A basemap you built is listed here as a tile layer, "Generated on this device". | Names that start with the text first. Up to 100 rows. |
| **Basemaps** | Names your project's basemaps print, from the data on the device, hidden basemaps included. Needs two letters or digits, so `19` finds Highway 19; every typed word must start a word of the name, so `tin h` finds Tin Hat Mountain. Works offline. | An exact name, then towns, peaks, water and parks, then trails, rivers and huts, then roads. Within each group, names that start with the typed text come first, then the nearest to you, or to the middle of the map. Up to 20 rows. |
| **Places** | Apple's suggestions for addresses, points of interest and natural features, favouring the part of the world the map shows. Needs a connection. | Up to eight rows. |

A query that is exactly a category word, such as `points`, `lines`, `area`, `rasters`, `tiles` or `folders`, lists every layer of that kind under **Layers** instead of matching names.

### Coordinate formats

| Format | Example | What it reads |
|---|---|---|
| DD | `49.976361, -124.149780` | A comma, a semicolon or a space between the values. Hemisphere letters are optional, before or after each number; label the first value E or W and it is read as longitude first. |
| DMS | `49°58'35"N 124°08'59"W` | Hemisphere letter required on both. Degree mark `°` or `d` and minute mark `'`, `′` or `m` required; seconds mark optional. Capital `D`, `M`, `S` and bare numbers are not read. |
| DDM | `49°58.5817'N 124°08.9868'W` | Degree mark and hemisphere letter required; minute mark optional. |
| UTM | `10U 417559 5536636` | Zones 1–60, a six-digit easting, a northing of five to eight digits. `N` and `S` are the hemisphere; any other letter is a latitude band, `C` to `M` south and `P` to `X` north. |

Decimals take a point in every format. A comma always separates latitude from longitude, so `49,5 8,2` gives no coordinate row and `48,2` is read as latitude 48, longitude 2.

In UTM, `S` means the southern hemisphere, not the band for 32° to 40° N; type a place in that band with `N`. A typed zone is used as typed, even outside its own 6° band, so a grid reference read off a map drawn in a neighbouring zone goes to the right place. When TopoKit writes UTM it uses the plain 6° zone, without the Norway and Svalbard exceptions, and the hemisphere letter: `10N 417559E 5536636N`. Anything TopoKit copies pastes back into search and is read.

## The ring and the outline

A picked pin grows and prints its name, whatever **Pin Names** is set to (see [Points on the map](/manual/points-lines-polygons/#points-on-the-map)). A tapped basemap mark gets an orange ring; a held spot, a typed coordinate and a picked place get the ring with a dot.

A line gets a solid orange band wider than the line, drawn under it; an area gets an orange band just outside its edge. A basemap trail lights as far as the map has loaded, then the whole feature once it has been read. The outline stays while the card is open, and on a line while its elevation profile is open.

## FAQ

**Why did the card close when I zoomed out?**
A peak's, a hut's or a town's card closes when the map stops printing its mark at that zoom. A park's or a trail's card stays, because its outline is still on the map.
