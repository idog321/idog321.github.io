---
title: "Before you go offline"
description: "What works with no connection, and the four things to do before a trip: a basemap, tiles and elevation, the project, and the GPS."
---
## What works without a connection

Without a connection, you can do the following:

- Work with [projects stored on the device](/manual/projects-and-files/#offline-pinning). iCloud syncs what you save once the connection returns.
- Use basemaps you have built, including [tapping](/manual/search-and-identify/#what-a-tap-finds) and [searching](/manual/search-and-identify/#what-each-section-finds) their features.
- View [downloaded map tiles](/manual/tile-layers/#using-offline-tiles) inside the rectangle they were downloaded for.
- Use [elevation tiles on the device](/manual/elevation/#downloading-tiles) to check heights and a spot's terrain, and view elevation profiles.
- [Search your layers, your basemaps and typed coordinates](/manual/search-and-identify/#what-each-section-finds).
- :ios[On iPhone, record tracks without using the network.]

You need a connection to do the following:

- Use Apple Maps, which cannot be downloaded in TopoKit.
- Use tile layers that stream from a server without a download.
- Search for places in the **Places** section of search.
- Plan a route, since every leg is a request to Apple Maps.

## Before a trip

Before you leave, complete these steps on Wi-Fi using the device you are taking. Downloaded tiles, elevation tiles and a basemap's built files are stored on the device that downloaded or built them. These files are not stored in the project, so they do not sync. Free space before you begin, because **Clear Downloaded Map Tiles** in [Storage & iCloud](/manual/settings/#storage--icloud) also deletes the map tiles of basemaps built on this device.

1. Use :ui[Basemaps] in the tool sidebar to [build a basemap of the area](/manual/basemaps/#building-a-basemap), which downloads the area's elevation and map data. Wait for every queued area to finish, because TopoKit does not keep the queue if it quits.
2. For areas outside your basemaps, use the :ui[Add Data]{icon=plus} menu to download tiles and elevation. Choose **Download Map Tiles…** to save tiles from a tile layer you have added, within a rectangle and zoom range. Choose **Download Elevation…** to open the [elevation grid](/manual/elevation/#the-elevation-grid). Keep the project open until [tile downloads finish](/manual/tile-layers/#starting-a-download), because closing the project or opening another cancels them.
3. For an iCloud project, open it once on this device so iCloud brings it up to date. Then choose **Save Offline** from its :ui[Project options]{icon=ellipsis} menu in the Projects tab, :mac[or **File → Save Offline** on Mac,] or turn on **Settings → Storage & iCloud → Keep All Projects Offline**. The [offline copy](/manual/projects-and-files/#offline-pinning) preserves the project as it was on this device when you pinned it, and only saves from this device refresh the copy. Local projects are always stored on the device, but an iCloud project does not open without a connection unless it has been downloaded or pinned.
4. Check that location access is allowed before you leave. :ios[On iPhone, open the **GPS** tab, and if it shows **Location Access Required**, tap **Open Settings** and allow location access. Turn on Precise Location for TopoKit in iOS Settings, because without it every [recording profile](/manual/gps-and-track-recording/#recording-profiles) except **Record All Fixes** rejects nearly every fix.] :mac[On Mac, allow [location access](/manual/gps-and-track-recording/#location-permissions) to show your position with **View → Show My Location**. TopoKit does not record tracks on Mac.]

## FAQ

**I edited the same project on two devices with no connection. What happens when they sync?**
iCloud reports a [conflict](/manual/projects-and-files/#sync-conflicts), and TopoKit makes the newest version active. TopoKit keeps every other version in the project folder as a conflict copy, listed under **Restore from Backup**.
