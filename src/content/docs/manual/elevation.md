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
- The surface was surveyed between 2011 and 2015, so ground that has changed since is not in it.

## Downloading tiles

An elevation tile downloads only when you ask for it, from one of the places below or by [building a basemap](/manual/basemaps/#building-a-basemap) over an area whose tile is not on the device.

Every one of these stores the tile in the app's own data area, not a cache, so it stays until you remove it. Tiles belong to the device, not the project, and never sync through iCloud, so each device downloads its own.

:ios[On iPhone, an elevation download over cellular data follows **Settings → Storage & iCloud → Large Downloads**; see [Downloads over cellular data](/manual/tile-layers/#downloads-over-cellular-data).]

### When a tile is missing

When the tile is missing, each place that reads heights asks before downloading:

- The profile says "This line needs N elevation tiles that are not on this device." and offers **Download N tiles** with a size. The size assumes the largest tile, so the download is usually smaller. With no connection the profile says so and offers nothing; it checks when it opens, so reopen it once you are back online. Closing the profile cancels its download.
- A point's editor shows **Get Elevation** with "(25–40 MB download)" beside it, and downloads as soon as you tap it.
- A spot's card says "Terrain for this spot is not downloaded." with a **Download** button sized for that one tile.

### The elevation grid

1. With a project open, choose **Download Elevation…** from the :ui[Add Data]{icon=plus} menu on the tool sidebar, or from the :ui[plus]{icon=plus} menu in the [Layers tab](/manual/layer-tree/). :mac[On Mac it is also in the **Layer** menu.]
2. Tap or click squares to select them.
3. Choose **Download**.

:ios[On iPhone, opening the grid ends any tool in progress and discards an unfinished drawing.]

Each square's colour gives its state:

- **Green**: the tile is on the device.
- **Blue**: selected for download.
- **Red**: on the device and selected, so it is marked for deletion.
- **Grey**: the last download found no tile there. Tapping it selects it to try again.
- **No square**: the dataset publishes nothing there.

Tiles finished before you cancel stay on the device. A dropped connection, a timeout or a server error gets a tile up to three attempts, and an attempt not finished in 15 minutes fails; a tile that still fails is not stored, so its square can be selected again.

The trash button in the bar turns red once a red square is selected, and removes exactly those tiles after you confirm.

### Removing tiles

In **Settings → Storage & iCloud → Elevation Data**, **Manage Tiles** deletes one tile at a time and **Clear Elevation Data** deletes them all; see [Storage & iCloud](/manual/settings/#storage--icloud). A tile is named by its south-west corner, so N49° W123° covers 49° to 50° north and 123° to 122° west.

## Coverage gaps

The dataset publishes nothing over open ocean or north of 84°N; Antarctica is covered. Armenia and Azerbaijan are absent from the release TopoKit reads, so they have no square to select and return no height.

Over ground with no terrain data the profile shows a hole: a dashed line with no fill beneath joins the heights either side of it, and the dashed stretch is not data.

The line above the chart gives, in orange, the length with no terrain under it, as in "850 m with no terrain data", counting both where the dataset publishes no tile and where a tile on the device holds no value under the line, such as along a coastline.

## Disk space

Plan on 25–40 MB a tile, each covering about 111 km north to south and narrower east to west away from the equator.

## Elevation at a point

TopoKit finds the tile covering the point and interpolates between the four surrounding values. If any of the four has no value, the result is empty rather than zero.

A point's editor has no field for typing a height; its **Elevation** section fills in on its own when the tile is on the device. Over open sea, or where the tile holds no value, it reads "Not available" and nothing is saved. A height that is found is saved with the point and shows on its card. See [Editing a feature](/manual/points-lines-polygons/#editing-a-feature).

### Height, slope and aspect at a spot

A spot's card reads the ground anywhere without making a point; [Holding a spot and the place card](/manual/search-and-identify/#holding-a-spot-and-the-place-card) covers opening one.

With the spot's tile on the device, the card leads with **Elevation**, **Slope** and **Aspect**.

- **Slope** and **Aspect** come from four heights 45 m north, south, east and west of the spot, so they describe a patch about 90 m across, not the spot itself.
- **Aspect** is the downhill compass direction and appears only where the slope is 1° or more.
- Where one of the four neighbours has no value, such as just across the edge of a tile that is not on the device, the card shows **Elevation** alone.

## The elevation profile

The elevation profile charts the ground along any line, drawn or imported, a recorded track, a saved route, or a trail, road or other line on a basemap you built. Polygons and circles have no profile. It opens from **Elevation profile** on a line's [card](/manual/search-and-identify/#the-card), and from **Elevation Profile** in the line's menu in the [Layers tab](/manual/layer-tree/) and in its editor. :mac[On Mac, **Elevation Profile** is also in the right-click menu on a line and in the **Layer** menu.]

A named trail or road on a basemap is profiled along its whole length, not only the stretch you tapped; an unnamed one along the stretch outlined on the map.

Opening a profile from the Layers tab, the line's editor or the **Layer** menu ends any tool in progress and discards an unfinished drawing.

The profile samples the ground about every 30 m, matching the model's own spacing, and at every vertex, so a GPS track with fixes a few metres apart is sampled at every fix.

The height scale fits the heights in view, never less than 20 m (66 ft) top to bottom, so a gentle grade can look steep and two profiles are rarely on the same scale.

The numbers under the chart:

- **Distance**: the line's length, including any gap between its parts.
- **Gain** and **Loss**: the total climb and descent, counting a rise or fall only once it reaches 4 m (13 ft) from the last counted height, the terrain model's own error from one point to the next. The step across a hole in the data, or across a gap between two parts of a line, is not counted. Without a hole or gap, gain minus loss equals the change in height from start to end.
- **Min**, **Max** and **Avg**: taken from the samples, so a summit between two samples is not in **Max**, and **Avg** weighs every sample equally, so on a GPS track it leans toward stretches where the fixes lie closest together.

All six follow **Settings → Units & Coordinates → Units**, not the units the measuring tools start with; see [Units & Coordinates](/manual/settings/#units--coordinates). A tap or click on a number copies it.

### Selecting and zooming

Selecting a stretch gives its own climb and descent. :mac[On Mac, drag across the chart.] :ios[On iPhone, hold a finger on the chart for a moment, then drag; a drag without the hold only moves the marker.] A stretch under 50 m is dropped.

![Selecting a stretch of the elevation profile: hold, then drag across the chart, and the stretch lights on the map while the numbers switch to the stretch's own](/media/elevation-profile-stretch.svg)

Pinch the chart to zoom into part of the line, down to 200 m or 2% of the line, whichever is longer. Double-click or double-tap the bar along the foot of the zoomed chart to show the whole line.

### The line above the chart

When the chart carries a note, such as a length with no terrain data, gaps between the line's parts or side pieces left out of the profile, the line above the chart shows only the first. A tap or click on a note, or on the line at rest, opens a short note on where the heights come from and how **Gain** and **Loss** are counted, with every chart note in full.

### Recorded tracks and lines in several parts

A recorded track, whether TopoKit's own or another app's track whose points carry times, is charted in the order it was travelled, with heights from the terrain model rather than the altitudes it recorded, so its **Gain** and **Loss** can differ from the track's own figures; see [Trip statistics](/manual/gps-and-track-recording/#trip-statistics).

On any line in several parts, a jump of 100 m or less between parts is charted as ground. A longer jump is a gap, drawn dashed like a hole in the data and included in **Distance**.

### A profile while you draw

The :ui[Add Line]{icon=add-line} and :ui[Add Route] tool cards have an **Elevation profile** button. The drawing stays editable while the profile is open, and the chart redraws after each point you add, move or delete, clearing any selected stretch or zoom window.

A route is charted along the roads its legs follow.

## FAQ

**Can TopoKit read heights from my own DEM or lidar?**
No. Every height comes from the Copernicus model. A DEM imported as a [raster](/manual/raster-overlays/) is drawn as an image and never read for heights.

**Why does no grid appear when I choose Download Elevation…?**
The grid is drawn only once a 1° square is large enough on screen; zoom in until the squares appear.
