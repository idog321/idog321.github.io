---
title: "Elevation"
description: "Where TopoKit's heights come from, how elevation tiles download and are removed, and how to read a height at a point and a profile along a line."
---
TopoKit reads ground heights from one elevation model, downloaded an elevation tile at a time and kept on the device, so heights and profiles work with no connection once the tiles are there.

## Elevation data source

Heights come from [Copernicus GLO-30](https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model), distributed as 1° × 1° tiles, with each value covering about 30 metres of ground.

- Terrain narrower than about 30 metres, such as a gully or a levee bank, is not in the model.
- Heights are measured above sea level, not above the ellipsoid. The two differ by tens of metres in most places.
- The model is a surface with trees and buildings included, so under forest it reads partway up the trees, and in town it reads roofs.
- The surface was surveyed between 2011 and 2015, so ground that has changed since, such as a new cut, a quarry or a slide, is not in it.

## Downloading tiles

An elevation tile downloads only when you ask for it: from an elevation profile, from :ui[Get Elevation] in a point's editor, from a spot's card, from the elevation grid, or by [building a basemap](/manual/basemaps/#building-a-basemap) over an area whose tile is not on the device.

Every one of these stores the tile in the app's own data area, not a cache, so it stays until you remove it. Tiles belong to the device, not the project: every project on that device uses them, and they never sync through iCloud, so each device downloads its own.

Downloading elevation tiles and opening a saved line's profile are part of the full app; reading a height from a tile already on the device is not. See [What asks you to unlock](/manual/your-topokit/#what-asks-you-to-unlock).

:ios[On iPhone, an elevation download over cellular data follows **Large Downloads** in **Settings → Storage & iCloud**. A download it holds reads "Waiting for Wi-Fi…" in the panel, editor, card or bar that started it, and goes ahead by itself once the iPhone is on Wi-Fi; see [Downloads over cellular data](/manual/tile-layers/#downloads-over-cellular-data).]

### When a tile is missing

A query whose tile is on the device reads it from storage and makes no network request. When the tile is missing, each place that reads heights asks before downloading:

- **The profile panel**: says "This line needs N elevation tiles that are not on this device." and offers **Download N tiles** with a size, wherever the panel was opened from, drawing included. Nothing downloads until you tap it. The size assumes every tile is as large as a tile gets, so the download is usually smaller. With no connection the panel says so and offers nothing; it checks when it opens, so reopen it once you are back online. Closing the panel cancels its download.
- **A point's editor**: shows :ui[Get Elevation] with "(25–40 MB download)" beside it, and downloads as soon as you tap it.
- **A spot's card**: says "Terrain for this spot is not downloaded." with a **Download** button sized for that one tile. Nothing downloads until you tap it. A failed download leaves "The terrain could not be downloaded." and a **Try again** button.

### The elevation grid

1. With a project open, choose **Download Elevation…** from the :ui[Add Data]{icon=plus} menu on the tool sidebar, or from the :ui[plus]{icon=plus} menu in the [Layers tab](/manual/layer-tree/). :mac[On Mac it is also in the **Layer** menu.] The grid opens over the map.
2. Tap or click squares to select them. The bar counts the new tiles and estimates their size.
3. Choose **Download**.

The red :ui[X] at the left of the bar closes the grid without downloading and drops the selection, as does starting a tool. :mac[On Mac, Esc also closes it.]

:ios[On iPhone, opening the grid ends any tool in progress and discards an unfinished drawing.]

Each square's colour gives its state:

- **Green**: the tile is on the device.
- **Blue**: selected for download.
- **Red**: on the device and selected, so it is marked for deletion.
- **Grey**: the last download found no tile there. Tapping it selects it to try again.
- **No square**: the dataset publishes nothing there.

Once a square is wide enough on screen it carries the name of its row in **Manage Tiles**, such as N49 W123.

After **Download** the grid closes and a progress bar headed **Elevation Data** counts the tiles. Its cancel button asks first, and tiles finished before you cancel stay on the device. A tile whose connection drops, times out or meets a server error gets up to three attempts, and an attempt not finished in 15 minutes fails. A tile that still fails is not stored, so its square is unfilled the next time and can be selected again. The **Download Complete** alert says how many failed.

Selecting squares already on the device marks them for deletion. The trash button in the bar turns red once such a square is selected, and removes exactly those tiles after you confirm.

### Removing tiles

**Settings → Storage & iCloud → Elevation Data** shows how many tiles are on the device and their size. See [Storage & iCloud](/manual/settings/#storage--icloud).

- **Manage Tiles**: opens **Downloaded Elevation Tiles**, one row per tile with its size and a delete button that asks first. A row is named by the tile's south-west corner, so N49° W123° covers 49° to 50° north and 123° to 122° west. Unavailable until a tile is on the device.
- **Clear Elevation Data**: deletes every tile after asking, naming the count and total size.

To clear one area, select its squares in [the elevation grid](#the-elevation-grid). Basemaps already built are left as they are; building that area again downloads its tile again, unless the build only changes the basemap's look. See [Storage](/manual/basemaps/#storage).

## Coverage gaps

The dataset publishes nothing over open ocean or north of 84°N; Antarctica is covered. In the elevation grid those squares carry no overlay, and tapping one shows "No elevation data exists for this square." instead of selecting it. A height asked for there has no value. Armenia and Azerbaijan are absent from the release TopoKit reads, so they have no square to select and return no height.

A profile over ground with no terrain data shows a hole. The chart line breaks, and a dashed line in the same colour, with no fill beneath, joins the last height before the hole to the first after it; the dashed stretch is not data. **Gain** and **Loss** do not count the step across it.

The line above the chart turns orange and gives the length with no terrain under it, as in "850 m with no terrain data". That length counts both kinds of hole: where the dataset publishes no tile, and where a tile on the device holds no value under the line, such as along a coastline. When no part of the line has terrain data, the panel reads "No elevation data available".

## Disk space

Plan on 25–40 MB a tile. Each tile covers 1° of latitude by 1° of longitude: about 111 km north to south, and narrower east to west away from the equator.

## Elevation at a point

TopoKit finds the tile covering the point and interpolates between the four surrounding values. If any of the four has no value, the result is empty rather than zero.

A point's editor has an **Elevation** section and no field for typing a height. It fills in on its own when the tile is on the device; otherwise it offers :ui[Get Elevation] (see [When a tile is missing](#when-a-tile-is-missing)). Over open sea, or where the tile holds no value, it reads "Not available" and nothing is saved. A height that is found is saved with the point and shows on its card. See [Editing a feature](/manual/points-lines-polygons/#editing-a-feature).

### Height, slope and aspect at a spot

A spot's card reads the ground anywhere without making a point. :ios[On iPhone, touch and hold the map, or tap **Place** on a point's card.] :mac[On Mac, right-click empty ground and choose **Info**, or choose **Place Info** on a point.] See [Holding a spot and the place card](/manual/search-and-identify/#holding-a-spot-and-the-place-card).

With the spot's tile on the device, the card leads with **Elevation**, **Slope** and **Aspect**.

- **Slope** and **Aspect** come from four heights 45 m north, south, east and west of the spot, so they describe a patch about 90 m across, not the spot itself.
- **Slope** is in whole degrees. **Aspect** is the downhill compass direction, in degrees and a compass point, as in "225° · SW", and appears only where the slope is 1° or more.
- Where one of the four neighbours has no value, such as just across the edge of a tile that is not on the device, the card shows **Elevation** alone.

Where no tile is published, the card shows neither the rows nor the offer.

## The elevation profile

The elevation profile charts the ground along any line, drawn or imported, a recorded track, a saved route, or a trail, road or other line on a basemap you built. Polygons and circles have no profile. It opens from:

- :ui[Elevation profile] on a line's [card](/manual/search-and-identify/#the-card).
- **Elevation Profile** in the line's menu in the [Layers tab](/manual/layer-tree/).
- **Elevation Profile** in the line's editor.
- :mac[On Mac, **Elevation Profile** in the right-click menu on a line, and in the **Layer** menu for the line selected in the Layers tab.]
- The :ui[Add Line]{icon=add-line} and :ui[Add Route] tool cards while you draw (see [A profile while you draw](#a-profile-while-you-draw)).

A named trail or road on a basemap is profiled along its whole length, not only the stretch you tapped; an unnamed one along the stretch outlined on the map.

Opening a profile from the Layers tab, the line's editor or the **Layer** menu ends any tool in progress and discards an unfinished drawing. The panel closes on its own when you start a tool, open another project or delete the line it charts.

Opening a profile frames the whole line on the map above the panel. On a saved line, the viewfinder button at the foot of the panel, **Zoom to**, frames it again after you pan away.

The profile samples the ground about every 30 m, matching the model's own spacing, and at every vertex, so a GPS track with fixes a few metres apart is sampled at every fix. Moving along the chart marks the matching spot on the map. :ios[On iPhone, drag along the chart.] :mac[On Mac, the marker follows the pointer.]

The height scale fits the heights in view, never less than 20 m (66 ft) top to bottom, so a gentle grade can look steep and two profiles are rarely on the same scale.

The numbers under the chart:

- **Distance**: the line's length, including any gap between its parts.
- **Gain** and **Loss**: the total climb and descent, counting a rise or fall only once it reaches 4 m (13 ft) from the last counted height, the terrain model's own error from one point to the next. The step across a hole in the data, or across a gap between two parts of a line, is not counted. Without a hole or gap, gain minus loss equals the change in height from start to end.
- **Min**, **Max** and **Avg**: taken from the samples, so a summit between two samples is not in **Max**, and **Avg** weighs every sample equally, so on a GPS track it leans toward stretches where the fixes lie closest together.

All six follow **Settings → Units & Coordinates → Units**, not the units the measuring tools start with; see [Units & Coordinates](/manual/settings/#units--coordinates). A tap or click on a number copies it.

A profile opened from a line's card, or from the Mac right-click menu, has a share button at the foot of the panel with the card's formats. One opened from the Layers tab, the line's editor or the **Layer** menu has none.

### Selecting and zooming

Selecting a stretch gives its own climb and descent. :mac[On Mac, drag across the chart.] :ios[On iPhone, hold a finger on the chart for a moment, then drag; a drag without the hold only moves the marker.]

The map lights the stretch with a handle at each end and draws the rest of the line fainter. The numbers switch to the stretch's own, with **Selection** in place of **Distance**. Drag the handles on the chart to resize the stretch; a stretch under 50 m is dropped. **Clear** above the chart removes it, and so does a tap or click on the chart outside it.

Pinch the chart to zoom into part of the line, down to 200 m or 2% of the line, whichever is longer. When the pinch ends, the map frames the same part. A bar along the foot of the zoomed chart shows where the window lies: drag it to slide the window, press beside it to move the window there, and double-click or double-tap it to show the whole line. :mac[On Mac, a two-finger scroll or a mouse wheel over the chart also slides the window.]

### The line above the chart

The line above the chart shows the first of these that applies: a selection, with its length, its ends and **Clear**; a zoom window, with its span and the whole-line button; a note the chart carries; otherwise a hint on selecting a stretch until you have selected one on this device, and after that where the heights come from. A note can be a length with no terrain data, in orange (see [Coverage gaps](#coverage-gaps)), gaps between the line's parts, or side pieces left out of the profile. Only the first note fits on the line.

A tap or click on a note, or on the line at rest, opens a short note on where the heights come from and how **Gain** and **Loss** are counted, with every chart note in full.

### Recorded tracks and lines in several parts

A recorded track, whether TopoKit's own or another app's track whose points carry times, is charted in the order it was travelled, with heights from the terrain model rather than the altitudes it recorded. Its **Gain** and **Loss** can differ from the track's own figures, which come from the recording; see [Trip statistics](/manual/gps-and-track-recording/#trip-statistics).

Any other line in several parts keeps its saved order when each part starts within 100 m of where the last one ended. Otherwise, and wherever a road is drawn once for each direction, the profile follows the line's through-route: side pieces off the main line are left out; a doubled road is charted along one side; and the route runs the way the line was filed.

On any line in several parts, a jump of 100 m or less between parts is charted as ground. A longer jump is a gap: the chart joins its two sides with a dashed line and no fill beneath, **Distance** includes it, and **Gain** and **Loss** skip it.

### A profile while you draw

The :ui[Add Line]{icon=add-line} and :ui[Add Route] tool cards have an :ui[Elevation profile] button. It is dimmed until the line has two points, and on a route until every leg has been worked out. It opens the same panel over the drawing. The panel holds the tool card's own lines and row, :ui[Save] among them, so the drawing stays editable, and the chart redraws after each point you add, move or delete, clearing any selected stretch or zoom window.

- **A line** is charted along the straight segments between its points.
- **A route** is charted along the roads its legs follow, and a straight leg along its straight line. Each stop is marked on the chart with a numbered badge, and the readout names a stop as you move onto it.

## FAQ

**Why is the height different from my GPS reading?**
The model is a surface at about 30 m spacing: under trees or in town it reads partway up the trees or the roofs, and it smooths anything narrower than a 30 m cell. A receiver set to show height above the ellipsoid also differs from the model's height above sea level by tens of metres in most places. See [Elevation data source](#elevation-data-source).

**Can TopoKit read heights from my own DEM or lidar?**
No. Every height comes from the Copernicus model. A DEM imported as a [raster](/manual/raster-overlays/) is drawn as an image and never read for heights.

**Does elevation work without a connection?**
Yes, for every tile already on the device, so download the area with **Download Elevation…** before you go. Offline, a profile that needs a missing tile offers no download, and any other elevation download waits up to 15 minutes for a connection, then fails. See [Before a trip](/manual/offline/#before-a-trip).

**Why does no grid appear when I choose Download Elevation…?**
The grid is drawn only once a 1° square is large enough on screen; zoom in until the squares appear. Over open sea there are no squares to draw.
