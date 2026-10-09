---
title: "Your first project"
description: "What the introduction sets up, then one pass through a field job: a project, a map, a point, a measured shape, offline data, a track and an export."
---
## The first launch

A new install opens with an introduction before the map: eight pages on iPhone, seven on Mac, which has no permissions page. It sets your appearance and units and creates your first project.

**Customize Your Look** and **Units & Coordinates** set the same options as **Settings → Appearance** and **Settings → Units & Coordinates**, so a choice made here is changed there later. :ios[On iPhone, the toolbar side is in **Settings → Toolbar & Haptics**.] :mac[On Mac, the panel side is in **Settings → Appearance → Panel Position**.] :ios[On iPhone, **TopoKit Needs Your Permission** asks for Location, Camera and Photo Library up front. A permission skipped there or denied is turned on later in the iPhone's Settings app under TopoKit, not in TopoKit's Settings; until then GPS tracking and **Take Photo** do not work. Choosing a photo from the library needs no permission.] :mac[On Mac, each permission is asked for when a feature first needs it.]

**Create Your First Project** makes a project, and that project is open when the introduction ends. The name starts as **My First Project**. **Storage** appears only when iCloud is available, and starts at **iCloud**.

:::ios
On iPhone, **Skip** at the top right goes from the first three pages to the permissions page, from the project page to the story without creating a project, and from the story to the plans.
:::

:::mac
On Mac, **Skip** at the top right goes from the first three pages to the project page, and from the story to the plans. Escape ends the introduction at once, and creates no project unless **Create Project** was already pressed. Return presses the page's main button, **Create Project** included.
:::

**Settings → Help & Feedback → Replay Introduction** runs the introduction again from its first page; its **Create Project** makes another project and opens it in place of the open one, and **Skip** keeps the one you have. :mac[On Mac, **Help → Replay Introduction** does the same.]

When the introduction ends, TopoKit shows a safety notice, **Before you head out**, once on each device; [Your TopoKit](/manual/your-topokit/#the-safety-notice) has what it says.

Creating a project other than the one the introduction makes, drawing and measuring, importing, tile and elevation downloads, building basemaps and recording tracks are part of the full app; see [Your TopoKit](/manual/your-topokit/#what-asks-you-to-unlock).

## Create a project

A project holds everything for one job: points, lines, polygons, rasters and photos. With no project open, every button in the tool sidebar except the Apple Maps switch is dimmed, so skipping the introduction's project means making one here first. Creating another project saves the open one and opens the new one in its place.

:::ios
1. In the **Projects** tab, tap the new-project button at the top left.
2. Name the project and tap **Create in iCloud** or **Create Locally**. Without iCloud the one button is **Create**.
:::

:::mac
1. Click the new-project button at the top of the **Projects** tab, or choose **File → New Project…** (`Cmd-N`).
2. Name the project, choose **Local** or **iCloud** if the switch is shown, and click **Create**.
:::

A project can move between iCloud and this device later; see [Projects, saving and iCloud](/manual/projects-and-files/#creating-a-project).

## Choose a map

The **Apple Maps** button at the bottom of the tool sidebar cycles :ui[Standard]{icon=map-standard}, :ui[Hybrid]{icon=map-hybrid}, :ui[Satellite]{icon=map-satellite} and :ui[Off]. Standard, Hybrid and Satellite load from Apple over the network; [Basemaps](/manual/basemaps/#the-apple-maps-switch) covers the switch in full.

For a map that draws with no connection, build a basemap:

1. Tap **Basemaps** in the tool sidebar, directly above the Apple Maps button.
2. Tap **Light** or **Dark**.
3. Tap the map to pick the area. Each tap adds a quarter of a 1° square.
4. Tap **Build**. The picker closes and the areas build one after another.

TopoKit downloads elevation and map data for the area once and builds the basemap on the device; after that it draws offline. Larger areas and your own look are in [Building a basemap](/manual/basemaps/#building-a-basemap).

## Mark a point

1. Tap :ui[Add Point]{icon=add-point}.
2. Tap the map where the point goes, or tap the orange :ui[location]{icon=location} button on the tool card to place it where you are. The button appears only once TopoKit has location access.
3. Name the point, choose its style, add a photo if it needs one, and tap :ui[Create], which stays dimmed until the point has a name.

Every other way to add a point is in [Adding a point](/manual/points-lines-polygons/#adding-a-point).

## Draw and measure

1. Tap :ui[Add Polygon]{icon=add-polygon} and tap the corners of the area. The tool card shows the area, perimeter and point count as you go. Drag a corner to move it, or pull out the faint dot between two corners to add one.
2. Tap a figure to copy it.
3. Tap :ui[Save] to keep the shape once it has three corners, name it in the editor that opens, and tap :ui[Create]. To discard the shape instead, tap ✕ on the tool card.

The drawing tools and the measuring tools are the same tools; saving is the only difference. :ui[Add Line]{icon=add-line} gives distance and bearing the same way. The figures are not stored with the shape, but tapping a saved polygon shows its area and perimeter again. Units and the earth model behind each figure are in [Measuring](/manual/measurement/#live-measurements).

## Prepare for offline

Before you leave a connection, put three kinds of map data on the device. The :ui[Add Data]{icon=plus} menu in the tool sidebar holds **Download Map Tiles…**, which saves an area of a tile layer added with **Add Tile Layer…** in the same menu, and **Download Elevation…**, which saves the terrain behind heights and elevation profiles. Downloaded tiles, downloaded elevation and a basemap's map data are stored on the device, not in the project, so each device needs its own.

A local project is always on the device. An iCloud project downloads when you open it, but only **Save Offline** in the :ui[Project options]{icon=ellipsis} menu on its row in the Projects tab keeps a copy on the device that iCloud cannot remove to free space. :mac[On Mac, **File → Save Offline** does the same for the open project.]

The full checklist is in [Before you go offline](/manual/offline/), and pinning in [Offline pinning](/manual/projects-and-files/#offline-pinning).

:::ios
## Record a track

1. Open the **GPS** tab and tap **Record Track**. Recording needs an open project.
2. Tap **Stop Recording** when you finish, then **Save Recording**. Stopping pauses the track, and **Cancel** in that alert resumes recording.
3. Name the track and tap **Save**. With no name the track is called Track and its start date and time; a recording with no points saves nothing.

TopoKit keeps recording with the screen off or another app open, and saves the track as a line with its distance, time and elevation statistics. Profiles and auto-pause are in [Recording a track](/manual/gps-and-track-recording/#recording-a-track).
:::

## Export your data

:ios[On iPhone, tap :ui[Layer options]{icon=ellipsis} on a feature's or folder's row in the **Layers** tab and choose **Export to File**.] :mac[On Mac, right-click the row and choose **Export to File**, or select it and choose **Layer → Export to File**.] Then choose GPX, KML, GeoJSON or GeoPackage and pick where the file goes; it is named after the row.

Only vector features export. GPX cannot carry polygons: a folder exported as GPX leaves its polygons out, and an export of nothing but polygons is refused, so export the shape from [Draw and measure](#draw-and-measure) as KML, GeoJSON or GeoPackage. Formats and sharing are in [Exporting and sharing](/manual/import-and-export/#exporting-and-sharing).

## FAQ

**Do I need to save my work?**
No. TopoKit saves the open project two seconds after your last change. :mac[On Mac, **File → Save** (`Cmd-S`) saves at once.] See [Saving](/manual/projects-and-files/#saving).

**How do I bring in the GPX, KML or GeoTIFF files I already have?**
Tap :ui[Add Data]{icon=plus} in the tool sidebar and choose **Add Vector Layer…** or **Add Raster Layer…**. :mac[On Mac, you can also drag the files onto the window.] Each vector file becomes a folder of features; a GeoTIFF or GeoPDF becomes one [raster overlay](/manual/raster-overlays/). See [Importing a file](/manual/import-and-export/#importing-a-file).

**Can I record a track on my Mac?**
No, recording is iPhone only. Record into an iCloud project and the track appears on the Mac with the rest of the project.
