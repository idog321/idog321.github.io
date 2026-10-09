---
title: "Before you go offline"
description: "What works with no connection, and the four things to do before a trip: a basemap, tiles and elevation, the project, and the GPS."
---
Everything stored on the device works with no connection. What TopoKit fetches from a server has to be fetched before you leave.

## What works without a connection

Works with no connection:

- Projects on the device. Drawing, editing, measuring and saving all work, and iCloud syncs the saves once the connection returns.
- Basemaps you have built: every line, mark and name draws, and tapping or searching a basemap feature works. See [What works offline](/manual/basemaps/#what-works-offline).
- Downloaded map tiles, inside the rectangle they were downloaded for. See [Using offline tiles](/manual/tile-layers/#using-offline-tiles).
- Elevation tiles on the device: heights, a spot's terrain and elevation profiles.
- Search of your layers, your basemaps and typed coordinates.
- :ios[On iPhone, track recording, which uses no network.]

Needs a connection:

- Apple Maps, which cannot be downloaded in TopoKit.
- Tile layers that stream from a server without a download.
- Place search, the **Places** section of search.
- Planning a route: every leg is a request to Apple Maps.
- Every download: map tiles, elevation tiles, a basemap's map data and **Refresh Map Data**.
- iCloud sync between devices.

Losing the connection never locks TopoKit, but buying needs the App Store, and building a basemap and downloading tiles are part of the full app, so unlock before you leave. See [Without a connection](/manual/your-topokit/#without-a-connection).

## Before a trip

Do these on Wi-Fi, on the device you are taking. Downloaded tiles, elevation tiles and built basemaps are stored on the device that fetched them, not in the project, so they do not sync. :ios[On iPhone, **Settings → Storage & iCloud → Large Downloads** decides whether these downloads may use cellular data; see [Downloads over cellular data](/manual/tile-layers/#downloads-over-cellular-data).] **Clear Downloaded Map Tiles**, **Clear Elevation Data** and **Delete Offline Basemaps** in [Storage & iCloud](/manual/settings/#storage--icloud) delete them, and **Clear Downloaded Map Tiles** takes the map tiles of basemaps built on this device too, so free space before these steps, not after.

1. Build a basemap of the area with :ui[Basemaps] in the tool sidebar. Building downloads the area's elevation and map data. Let every queued area finish: the queue is not kept if TopoKit quits. See [Building a basemap](/manual/basemaps/#building-a-basemap).
2. Download tiles and elevation for anything outside your basemaps. In the :ui[Add Data]{icon=plus} menu, **Download Map Tiles…** saves a tile layer you have added over a rectangle and zoom range, and **Download Elevation…** opens the [elevation grid](/manual/elevation/#the-elevation-grid). Leave the project open until tile downloads finish: closing it, or opening another, cancels them. See [Starting a download](/manual/tile-layers/#starting-a-download).
3. Keep the project on the device. A local project always is. For an iCloud project, choose **Save Offline** from its :ui[Project options]{icon=ellipsis} menu in the Projects tab, :mac[or **File → Save Offline** on Mac,] and the row shows an orange pin once the copy is made; or turn on **Settings → Storage & iCloud → Keep All Projects Offline** to pin every iCloud project. With no connection, an iCloud project neither downloaded nor pinned does not open: after 60 seconds TopoKit reports "Project download timed out. Check your internet connection." Then open the project once on this device so iCloud brings it up to date. See [Offline pinning](/manual/projects-and-files/#offline-pinning). In an iCloud project, check that no raster row still shows the iCloud download icon: a raster still downloading draws nothing. See [Rasters and iCloud](/manual/raster-overlays/#rasters-and-icloud).
4. Check the GPS. :ios[On iPhone, open the **GPS** tab: if it shows **Location Access Required**, tap **Open Settings** and allow location access. Turn Precise Location on for TopoKit in iOS Settings, since without it every recording profile except **Record All Fixes** rejects nearly every fix. Choose the trip's [recording profile](/manual/gps-and-track-recording/#recording-profiles) in **Settings → GPS & Recording**.] :mac[On Mac, TopoKit records no tracks; **View → Show My Location** shows your position once location access is allowed. See [Location permissions](/manual/gps-and-track-recording/#location-permissions).]

## FAQ

**I edited the same project on two devices with no connection. What happens when they sync?**
iCloud reports a conflict. TopoKit keeps every version, makes the newest active and keeps the others in the project folder as conflict copies, listed under **Restore from Backup**. See [Sync conflicts](/manual/projects-and-files/#sync-conflicts).

**Can I download on my Mac and take my iPhone?**
No. Downloaded tiles, elevation tiles and built basemaps stay on the device that fetched them. The project records what was downloaded, so on the iPhone **Download for This Device** on a tile layer's row fetches the same tiles, and **Build on This Device** on a basemap's row builds the same basemap. See [Other projects and other devices](/manual/basemaps/#other-projects-and-other-devices).
