---
title: "Before you go offline"
description: "What works with no connection, and the four things to do before a trip: a basemap, tiles and elevation, the project, and the GPS."
---
## What works without a connection

Works with no connection:

- Projects on the device. iCloud syncs what you save once the connection returns.
- Basemaps you have built, including tapping and searching their features. See [What works offline](/manual/basemaps/#what-works-offline).
- Downloaded map tiles, inside the rectangle they were downloaded for. See [Using offline tiles](/manual/tile-layers/#using-offline-tiles).
- Elevation tiles on the device: heights, a spot's terrain and elevation profiles.
- Search of your layers, your basemaps and typed coordinates.
- :ios[On iPhone, track recording, which uses no network.]

Needs a connection:

- Apple Maps, which cannot be downloaded in TopoKit.
- Tile layers that stream from a server without a download.
- Place search, the **Places** section of search.
- Planning a route: every leg is a request to Apple Maps.

Building a basemap and downloading tiles need the full app, and buying it needs the App Store, so unlock before you leave. See [Without a connection](/manual/your-topokit/#without-a-connection).

## Before a trip

Do these on Wi-Fi, on the device you are taking. Downloaded tiles, elevation tiles and built basemaps are stored on the device that fetched them, not in the project, so they do not sync. Free space before these steps, not after: **Clear Downloaded Map Tiles** in [Storage & iCloud](/manual/settings/#storage--icloud) also deletes the map tiles of basemaps built on this device.

1. Build a basemap of the area with :ui[Basemaps] in the tool sidebar. Building downloads the area's elevation and map data. Let every queued area finish: the queue is not kept if TopoKit quits. See [Building a basemap](/manual/basemaps/#building-a-basemap).
2. Download tiles and elevation for anything outside your basemaps. In the :ui[Add Data]{icon=plus} menu, **Download Map Tiles…** saves a tile layer you have added over a rectangle and zoom range, and **Download Elevation…** opens the [elevation grid](/manual/elevation/#the-elevation-grid). Leave the project open until tile downloads finish: closing it, or opening another, cancels them. See [Starting a download](/manual/tile-layers/#starting-a-download).
3. Keep the project on the device. A local project always is. For an iCloud project, choose **Save Offline** from its :ui[Project options]{icon=ellipsis} menu in the Projects tab, :mac[or **File → Save Offline** on Mac,] or turn on **Settings → Storage & iCloud → Keep All Projects Offline**. With no connection, an iCloud project neither downloaded nor pinned does not open. Open the project once on this device so iCloud brings it up to date. See [Offline pinning](/manual/projects-and-files/#offline-pinning).
4. Check the GPS. :ios[On iPhone, if the **GPS** tab shows **Location Access Required**, tap **Open Settings** and allow location access. Turn Precise Location on for TopoKit in iOS Settings, since without it every [recording profile](/manual/gps-and-track-recording/#recording-profiles) except **Record All Fixes** rejects nearly every fix.] :mac[On Mac, TopoKit records no tracks; **View → Show My Location** shows your position once location access is allowed. See [Location permissions](/manual/gps-and-track-recording/#location-permissions).]

## FAQ

**I edited the same project on two devices with no connection. What happens when they sync?**
iCloud reports a conflict. TopoKit makes the newest version active and keeps every other version in the project folder as a conflict copy, listed under **Restore from Backup**. See [Sync conflicts](/manual/projects-and-files/#sync-conflicts).
