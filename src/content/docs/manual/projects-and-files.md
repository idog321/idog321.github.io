---
title: "Projects, saving and iCloud"
description: "Create, open, save and restore projects, sync them between iPhone and Mac through iCloud, keep them on the device for the field, and find their files."
---
A project includes the points, lines, polygons and circles you draw, saved routes and tracks, each feature's style, photos, and your folders in the Layers tab. It also includes raster overlays, tile layers with their download areas, and the basemaps you build with their build settings.

Each project is stored on disk in a folder named with a unique ID. The folder contains `project.mapproject`, its photos and any rasters copied into the project, so those files are included when you copy, sync or pin the folder. Downloaded offline tiles, downloaded elevation data and the [map data of basemaps you build](/manual/basemaps/#other-projects-and-other-devices) are stored outside the folder, on the device that downloaded or built them.

```
<projects root>/
  E8A1F3B2-.../                           ← the project, named by a unique ID
    project.mapproject                    ← the project itself, plain-text JSON
    project (conflict <date>).mapproject  ← a version set aside by an iCloud conflict
    project (replaced <date>).mapproject  ← the version a restore replaced
    Rasters/                              ← rasters copied into the project
    Photos/                               ← photos attached to features
      thumbs/                             ← preview thumbnails of those photos
```

## Creating a project

To create a project, use the new-project button at the top of the Projects tab.

:::ios
The **New Project** alert on iPhone lets you choose **Create in iCloud** or **Create Locally**. When iCloud is unavailable, the alert has a single **Create** button, which creates a local project.
:::

:::mac
The **New Project** sheet on Mac selects **Local** by default, and you can choose **iCloud** instead. When iCloud is unavailable, the choice is hidden and the project is local.
:::

::::platforms
:::ios
![The New Project alert on iPhone: a name field reading Untitled Project, then Create in iCloud, Create Locally, and Cancel](../../../assets/manual/projects-and-files-creating-a-project-alert-iphone.png)
:::

:::mac
![The New Project sheet on Mac: a Project Name field reading Untitled Project, a Local / iCloud picker with Local selected, the caption Stored on this device only, and Cancel and Create](../../../assets/manual/projects-and-files-creating-a-project-sheet-mac.png)
:::
::::

## Opening a project

**From the Projects tab**, you can find your iCloud and local projects together, with the most recently saved project first. The open project's row has a filled orange icon and a green circle with a check, while the cloud and pin icons show a project's [download and pinning status](#offline-pinning).

If iCloud has a newer version of a project already on this device, TopoKit waits up to 4 seconds for that version, then opens the copy on this device. An iCloud project that isn't yet on this device downloads before it opens, and you can follow its progress in the row. If it hasn't downloaded within 60 seconds, TopoKit reports "Project download timed out. Check your internet connection."

::::platforms
:::ios
![The Projects tab on iPhone: the new-project, Import, Export and refresh buttons, the open project's card with its counts of points, rasters and vectors and Save, Refresh and Close, then the list of projects with the open one checked](../../../assets/manual/projects-and-files-opening-a-project-panel-iphone.png)
:::

:::mac
![The Projects tab on Mac: the new-project, Import, Export and refresh buttons, the open project's card with its counts and Save, Refresh and Close, then the list of projects, the open one tinted and checked, each with a Project options button and a green cloud on the iCloud ones](../../../assets/manual/projects-and-files-opening-a-project-panel-mac.png)
:::
::::

:::mac
**From Open Recent**, you can reopen projects on Mac: **File → Open Recent** lists up to ten projects opened or created on this Mac, newest first. A `.mapproject` opened from Finder isn't added, and if you choose a project that's no longer on this Mac, TopoKit removes it from the list.
:::

**From a file**, you can open a `.mapproject` from another app without adding it to the Projects tab. You can't rename, move, save offline, restore or delete that file from TopoKit. :mac[On Mac, TopoKit saves your edits back to that file and keeps its backup beside it as a `.bak`.] :ios[On iPhone, use **Import Project** to keep a project someone sent you.]

**With Import Project** at the top of the Projects tab, you can copy a `.mapproject` or `.json` file into a new project by choosing the file. TopoKit gives the copy the same name, creates it in iCloud when iCloud is available, and opens it. Only the project file is copied, without the original's rasters and photos, and the copy has a new ID so it never merges with the original. :mac[On Mac, **File → Open Project…** (`Cmd-O`) does the same, as does dropping a `.mapproject` on the map while a project is open.]

When you launch TopoKit, it reopens your last project unless you closed it or it was a `.mapproject` opened from another app. If an iCloud project can't download, TopoKit opens no project, and you can select it in the Projects tab to try again.

## Renaming, moving and deleting

To move, pin, restore or delete a project, use the :ui[Project options]{icon=ellipsis} menu at the end of its row in the Projects tab:

- **Move to iCloud** / **Move to Local Storage**: After you confirm, TopoKit copies the whole folder to the other location, including its photos and the rasters copied into it, then removes the original. If the project is open, TopoKit saves it first and keeps it open, and an iCloud project that isn't on this device downloads first. Both choices appear only while iCloud is available, and moving a project to local storage removes it from your other devices.
- **Save Offline** / **Remove Offline Copy**: You can [pin or unpin an iCloud project](#offline-pinning).
- **Restore from Backup**: This choice appears only when TopoKit has [an earlier version you can restore](#restoring-an-earlier-version).
- **Delete**: After you confirm, TopoKit deletes the project folder, including its photos and the rasters copied into it, along with this device's backup and offline copy. Deleting an iCloud project also deletes it from your other devices.

## Saving

TopoKit saves your edits two seconds after the last change, and saves immediately when you open another project, create one or close the open project. :ios[On iPhone, it also saves immediately when TopoKit leaves the screen.] :mac[On Mac, it saves when you quit and waits up to ten seconds for the save. Closing the window also quits TopoKit.]

You can check the save status on the project card at the top of the Projects tab. An orange dot beside the name means changes are waiting for the next save, and **Not saved — changed on another device** means saving is paused because of [changes from another device](#merging-changes-from-another-device).

If an automatic save fails, the card shows "Save failed:" followed by the reason, which also appears in **Autosave Failed**. If **Save** fails, an alert gives the reason. The message "Cloud sync is paused for this session" means iCloud couldn't be verified at launch, rather than that a save failed. Your project is saved on this device and syncs the next time TopoKit opens with iCloud available.

- **Refresh**: TopoKit reloads the open project from disk, merging unsaved changes with that version when there are no conflicts and asking what to do when there are. The arrow at the top of the Projects tab only reloads the list.
- **Close**: TopoKit saves and closes the project, but keeps it open and gives the reason in an alert if the save fails. :mac[On Mac, **File → Close Project** (`Cmd-W`) does the same and leaves the window open.]

### What a save does

1. TopoKit checks that the file on disk is still the version this device last opened or saved. If another device's save has replaced it, TopoKit [merges the changes or asks what to do](#merging-changes-from-another-device) before writing anything.
2. TopoKit copies the current `project.mapproject` to a backup on this device, outside the project folder, replacing the previous backup. The backup doesn't sync, so each device keeps its own.
3. TopoKit writes the new version to a temporary file, then replaces the project file with it. The file on disk is always a complete version, either the old one or the new one.

## Restoring an earlier version

To return to an earlier version, choose **Restore from Backup**, which lists the versions TopoKit has, newest first. :mac[On Mac, **File → Restore from Backup** shows the same list for the open project.]

::::platforms
:::ios
![Restore from Backup open over a project's menu on iPhone, with Open and Rename above it, listing one Last save backup with its date and time](../../../assets/manual/projects-and-files-restoring-an-earlier-version-menus-iphone.png)
:::

:::mac
![The Project options menu on Mac with Restore from Backup open: Open, Rename, Show in Finder, Move to iCloud, Restore from Backup with its submenu listing one Last save backup with its date and time, and Delete](../../../assets/manual/projects-and-files-restoring-an-earlier-version-menus-mac.png)
:::
::::

- **Last save backup**: This is the version that was on disk before this device's latest save. A backup kept in the project folder by TopoKit 1.1 appears under the same name and contains the version before 1.1's last save.
- **Sync conflict**: This is a version set aside when [iCloud reported a conflict](#sync-conflicts).
- **Saved copy**: This is any other `.mapproject` in the project folder, including the copy kept when you restore a version.

TopoKit checks that it can read the version as a project and refuses it if it can't. Once you confirm **Restore This Version?**, TopoKit saves any unsaved edits first, keeps the version being replaced as `project (replaced 2026-04-15 14-32-05).mapproject`, then reloads the project. You can undo the restore by restoring that copy.

## When a project will not open

TopoKit runs three checks when it opens a project. If your last project fails these checks when TopoKit tries to reopen it at launch, no project opens.

1. If the file doesn't parse as JSON, TopoKit tries this device's backup, or a `.bak` beside the file if this device has no backup. When the backup can be read, TopoKit renames the bad file to `project.mapproject.corrupt` and opens the backup's version. If the backup can't be read or there is no backup, TopoKit reports an error and leaves the file unchanged. In that case, open the project on a device that has saved it.
2. If the file parses as JSON but doesn't decode into a project, TopoKit leaves it unchanged and reports "TopoKit couldn't read this project. If it was saved with a newer TopoKit on another device, update TopoKit here." TopoKit doesn't replace the file with a backup because it may contain edits from a newer TopoKit, but you can find earlier versions under [Restore from Backup](#restoring-an-earlier-version).
3. TopoKit repairs orphaned items, broken parent-child links, cycles and duplicate IDs in the layer tree. These repairs are made in place when the project opens and before every save.

## iCloud sync

You can sync an iCloud project between your iPhone and Mac through your own iCloud account and iCloud Drive, without a TopoKit account or server. A local project stays on the device where you created it. While iCloud is off or you're signed out, the Projects tab lists only local projects; your iCloud projects aren't deleted and reappear when iCloud is available again.

You can [pin an iCloud project for offline use](#offline-pinning) to keep it downloaded on this device; without pinning, the project may not be downloaded here. Photos always sync, and a [raster syncs only once it's copied into the project](/manual/raster-overlays/#rasters-and-icloud).

When a new version arrives on a device where the project is open, **Updated on another device** appears immediately, with a **Reload** button that works like **Refresh** on the project card. If the project is closed on that device, opening it merges the new version with that device's last save.

### Merging changes from another device

TopoKit never replaces your unsaved changes with another device's version, and never saves over a version it hasn't loaded. If you have unsaved changes when another device's version arrives, or make a change before you reload it, TopoKit pauses automatic saving and asks what to do in **Project Changed on Another Device**:

- **Merge Changes**: TopoKit combines both devices' changes and saves the result, then shows a **Merged** alert with the number of changes kept from each device.
- **Split Into Two Projects**: TopoKit saves your changes as a new project beside this one, with "(my changes, Oct 8, 14:32)" added to its name. The new project includes copies of the photos and the rasters copied into the original project, and TopoKit loads the other device's version of the original.
- **Overwrite Their Version**: TopoKit saves your version over the other device's version, which is kept as the **Last save backup** until the next save.
- **Decide Later**: Your changes stay on screen and saving remains paused.

When TopoKit merges changes, an item means any point, line, polygon, circle, folder, raster or layer. The merge follows these rules:

- An item added on either device is kept.
- An item deleted on one device is removed unless the other device edited it after the deletion.
- An item edited on both devices uses the newer edit.
- The project's name and other project-level settings come from whichever file is newer.
- Reordering or expanding a folder doesn't count as an edit.

TopoKit records a deletion for one year, so a device that hasn't opened the project for longer than that can make the item reappear.

When no item was edited on both devices, choosing **Save** or the banner's **Reload**, or leaving the project, merges the changes without asking. If an item was edited on both devices, **Reload** asks **Load version from iCloud?**, while **Save** and leaving the project ask **Project Changed on Another Device** again.

**Merge Changes** requires this device's record of its last save. TopoKit keeps that record only for projects in its own folders, so it can't merge a `.mapproject` opened from elsewhere.

:ios[On iPhone, your changes are saved as a separate "(my changes, …)" project if TopoKit leaves the screen before you choose, and the original shows the other device's version.] :mac[On Mac, your changes are saved as a separate "(my changes, …)" project if you quit before you choose.]

### Sync conflicts

If two devices save the same project while neither can reach iCloud, iCloud reports a conflict when both devices sync. TopoKit makes the newest version active and saves every other version beside it as a `(conflict <date>)` copy, without deleting anything. The **Project Sync Conflict** alert names each version, and you can find each copy listed as **Sync conflict** under [Restore from Backup](#restoring-an-earlier-version).

### Devices on different versions

Before you edit a project on more than one device, update TopoKit on every device that syncs it. If a device is still on 1.1, the following applies:

- TopoKit 1.1 doesn't check the file before saving or merge changes, so edits on that device are saved over another device's version without asking.
- Saving in 1.1 removes 1.2's record of deleted items.
- Saving in 1.1 removes a basemap's build settings from the project. TopoKit 1.2 keeps a copy of those settings on each device that has opened or saved the project, and writes them back on its next save.

## Offline pinning

![The Projects tab with rows in four different states: an orange pin for a pinned project, a grey cloud with a down arrow for an iCloud project not yet downloaded, a green cloud with a check for one that is downloaded, and no icon at all for a local project](../../../assets/manual/projects-and-files-offline-pinning-ios.png)

Pin an iCloud project to keep a complete copy of its folder on this device, including its photos and the rasters copied into it, so you can open it without a connection. The copy refreshes only when this device saves the project, so edits from another device are included once you've saved here.

The project's row shows a spinner while the copy is made, then an orange pin. A green cloud with a check means the project is downloaded but isn't pinned, and a grey cloud with a down arrow means an iCloud project isn't on this device. Local projects show no cloud or pin.

:mac[On Mac, choose **File → Save Offline** to pin the open project.] Moving a pinned project to local storage clears its pin, and moving a project into iCloud pins it.

If you turn off **Keep All Projects Offline** in [Settings → Storage & iCloud](/manual/settings/#storage--icloud), TopoKit removes every offline copy, including copies of projects you pinned individually.

## The project file

The `.mapproject` file contains the project's name and dates, each feature's style, and a tree of every layer and folder. TopoKit writes the file as a single line, with its keys in alphabetical order.

`nodes` is a lookup keyed by item ID, but it's written as a flat array that alternates an ID string and an item object. To find an ID in the file, search for it as an array element rather than a key. `deletedNodes` records each deleted item's ID and deletion date for [merging changes](#merging-changes-from-another-device).

`fileFormatVersion` records the format the file was written in, and [TopoKit 1.2](#devices-on-different-versions) still writes format 1.

A raster copied into the project is recorded with a path relative to the project folder, such as `Rasters/my-geotiff.tif`, so the folder can move between devices. Any other raster keeps an absolute path on this device.

## File locations

:::ios
On iPhone, you can find an iCloud project in **Files → Browse → iCloud Drive → TopoKit → Projects**. Local projects are in TopoKit's private storage, which the Files app doesn't show, so move a local project to iCloud to transfer it off the iPhone.
:::

:::mac
On Mac, choose **Show in Finder** to open a Finder window with the project's folder selected. Projects and backups use these paths:

- iCloud: `~/Library/Mobile Documents/iCloud~ns~TopoKit/Documents/Projects/<ID>/`
- Local: `~/Library/Containers/ns.TopoKit/Data/Library/Application Support/ns.topokit/Projects/<ID>/`
- Last save backup: `~/Library/Containers/ns.TopoKit/Data/Library/Application Support/ns.topokit/SaveBackups/<ID>.mapproject.bak`
:::

## FAQ

**My project isn't on my other device. Why?**
If the project is local, move it to iCloud so it can sync. Both devices need iCloud Drive; check that **Settings → Storage & iCloud** shows **Connected**.

**How do I send a project to someone?**
With the project open, choose **Export Project** at the top of the Projects tab. The exported file contains only the project, without rasters, photos or downloaded data, and the recipient uses **Import Project** to open it.

To include photos and the rasters copied into the project, [find the project folder](#file-locations) and zip it. The recipient unzips it into **iCloud Drive → TopoKit → Projects** without renaming it, and the project appears in the Projects tab. For a colleague without TopoKit, [export the layers](/manual/import-and-export/#exporting-and-sharing).
