---
title: "The Layers tab"
description: "Organise a project's rows into folders, set the order they draw in, and move, hide, rename, copy and delete them."
---
The Layers tab lists everything in the open project, in the order it draws on the map. :ios[On iPhone, the search field at the top of the tab finds rows by name as well as places.] :mac[On Mac, the search bar is in the top bar above the map.] [Search](/manual/search-and-identify/#search) covers what it finds.

## What is in the tree

Every row is one of four kinds:

- **Features**: points, lines and polygons, drawn or imported.
- **Raster overlays**: imported GeoTIFF or GeoPDF maps.
- **Tile layers**: maps streamed from a server, and basemaps you have built.
- **Folders**: any of the above, nested to any depth.

A feature's row previews its own style, so a point shows its coloured pin and a line or polygon shows its stroke and fill.

Downloading a tile layer for offline use adds a separate **Offline: {name}** row at the top of the same folder. Its icon carries a small download arrow when the tiles are on this device, and is dimmed with an orange iCloud arrow when the project arrived by sync and the tiles did not. See [Using offline tiles](/manual/tile-layers/#using-offline-tiles), and [The basemap in the Layers tab](/manual/basemaps/#the-basemap-in-the-layers-tab) for a basemap's row.

## Draw order

Rows higher in the tree draw on top of rows below them.

A layer that is switched on can still be missing from the map, because something above it in the tree is covering it. A tile layer covers the whole map, so anything below it in the tree is hidden everywhere; a raster only hides the area inside its own footprint, so the same layer can be hidden in one part of the map and visible in another. An offline tile layer covers only the regions you downloaded, a basemap you built covers only the area it was built for, and a layer faded below 5% opacity covers nothing at all. Drag the covering layer below your data to see it again.

Points are not stacked with lines and polygons: a point always draws above every line and polygon, whatever the tree says. A point below a raster or tile layer is removed wherever that layer covers it, even a partly transparent one, and for a raster that means anywhere inside its bounding box. A line or polygon below one stays drawn and shows through as far as the layer's opacity allows.

The place and road names on Apple Maps draw over your lines and polygons until a raster or tile layer in the project is showing. From the lowest such layer up, every row in the tree draws over those names; rows below it stay under them. A basemap you built counts as such a layer only with [**Solid Background**](/manual/basemaps/#the-setup-page) on.

A new folder, drawn feature, import, raster or tile layer goes to the top of the tree or of its folder, so a new tile layer covers everything already there. A new basemap is the exception: it goes to the bottom, or directly above a top-level basemap it overlaps.

## Folders

Importing vector data always creates a folder named after the file, with every feature from the file as a row inside it; see [What happens on import](/manual/import-and-export/#what-happens-on-import).

:::ios
On iPhone, tap :ui[Add Data]{icon=plus} in the Layers toolbar and choose **New Folder**. To nest one folder in another, tap :ui[Layer options]{icon=ellipsis} on a folder's row and choose **New Subfolder**, or drag an existing folder into it.
:::

:::mac
On Mac, use the :ui[Add Data]{icon=plus} menu in the Layers toolbar and choose **New Folder**, or choose **Layer → New Folder** (`Cmd-Shift-N`). To nest one folder in another, right-click a folder and choose **New Subfolder**, or drag an existing folder into it.
:::

To put rows you already have into a new folder, use **Group** in the **Select** bar, or **New Folder with “{name}”** in a row's menu. :mac[On Mac, a selected row's right-click menu also offers **New Folder with N Items**, and **Layer → New Folder with Selection** (`Cmd-Ctrl-N`) does the same.] Each makes a folder called **New Group** in the place of the topmost chosen row, puts the rows inside it in their order, and opens its editor so you can name it.

Closing a folder only shortens the list; its contents still draw on the map.

## Styling a folder

Tap a folder's row on iPhone, or click it on Mac, to open **Edit Folder**. It shows a style row for each kind of feature directly inside the folder, and **Edit** on one opens that kind's style sheet. A folder has no style of its own, so the sheet starts from the style of the first feature of that kind inside it.

Styling a folder is how you restyle many features at once: when you choose **Done**, the style is written onto the features of that kind directly inside the folder, and a single Undo reverses it. It replaces styles set on those features one by one. Features in its subfolders keep their own styles.

It is not a live default: a feature you draw afterwards starts from the **Default Style** in [**Settings → Features**](/manual/settings/#features). A style row appears only for the kinds of feature the folder already holds, so an empty folder cannot be styled in advance. [Styling a feature](/manual/points-lines-polygons/#styling-a-feature) covers the sheets' controls.

## Selecting several rows

:::ios
On iPhone, **Select**, beside the search field, turns the tree into a checklist and hides each row's eye and :ui[Layer options]{icon=ellipsis}. Once a row is checked, a bar of actions appears; its **Hide**, **Delete**, **Share** and **Export** do to every checked row what a row's menu does to one. **Delete** and **Group** end Select; **Hide** leaves the rows checked for another action.
:::

:::mac
On Mac, **Select**, at the right of the Layers toolbar, does the same. Command-click and Shift-click turn it on as well: Command-click adds a row to the selection or takes it out, and Shift-click selects every row shown between the one you clicked last and this one, skipping rows inside closed folders.

Right-clicking a row that is part of the selection acts on every selected row, and the menu items say so, such as **Copy 3 Items** and **Delete 3 Items**. Right-clicking a row outside it acts on that row only. A row inside a selected folder goes with its folder when the selection is moved, copied, shared or exported.
:::

## Moving rows

Drag a row to move it, whether it is a feature, a raster, a tile layer, or a folder with everything inside it. Drop it on a folder to put it in that folder, or between two rows to set its position in the draw order. A folder dropped into itself or into a folder inside it stays where it was.

A row dropped on a folder, or moved into one, goes to the bottom of that folder, so it draws under everything already in it. A row moved to **Root Level** goes to the bottom of the tree.

:::ios
On iPhone, dragging moves one row at a time. For a single row, **Move to...** in the :ui[Layer options]{icon=ellipsis} menu moves it without dragging: the list is every folder in the project except the one you are moving and the folders inside it, alphabetically and without nesting, plus **Root Level** to move it out of all folders. To move several rows, check them under **Select** and tap **Move** in the bar.
:::

:::mac
On Mac, drag any selected row to move the whole selection; the rows keep their order. Dragging a row that is not selected moves only that row. Holding a dragged row at the top or bottom edge of the list scrolls the list; a row dropped on that edge goes back where it was.

To move rows without dragging, right-click one and choose **Move to**, or choose **Layer → Move To** for the selected rows. The list shows **Root Level**, then every folder in tree order, indented to show nesting. Folders the rows cannot go into are greyed out: the folder they are all already in, and any folder being moved or nested inside one. **Move** in the **Select** bar lists the folders flat and alphabetically instead, without the greying.
:::

## Showing and hiding

![Two folders on iPhone. In the first, one point is visible and one is hidden by its own eye. The second folder is switched off, and the point inside it shows an orange crossed-out eye even though its own eye is still on](../../../assets/manual/layer-tree-showing-and-hiding-ios.png)

A hidden folder hides every row inside it, whatever each row's own eye is set to. A layer that is switched on but does not appear on the map is most often inside a hidden folder. The row dims and shows an orange :ui[crossed-out eye]{icon=eye-hidden} when a folder above it is hiding it. Check each folder above the row and switch the hidden one back on.

On a selection, **Hide** hides every row in it, and reads **Show** only when every selected row is already hidden.

**Zoom to** in a row's menu frames the map on that row. A folder frames the features and rasters inside it at every depth, ignoring tile layers, and leaves the map where it is when it holds neither. A tile layer frames the area downloaded for it, or zooms out to a world view when nothing was downloaded. :mac[On Mac, **Zoom to** on a selected row, or **Layer → Zoom to Layer** (**Zoom to N Layers** for several), frames several selected rows the way it frames a folder that holds them.]

## Renaming

:::ios
On iPhone, tap a row to open its editor and change the **Name**. A point, line, polygon or raster editor keeps the new name when you leave it. A folder or tile layer editor needs **Save**, and going back without it keeps the old name. **Edit Offline Basemap**, for a basemap you built, has no **Save** and keeps the new name when you leave it.
:::

:::mac
On Mac, click a row to open its editor, type the new name, and click outside to apply it.
:::

A folder name cleared to nothing or to spaces is not applied, and the folder keeps its old name. Renaming a folder is a step on the undo history; a new name given to a point, line, polygon, raster or tile layer in its editor is not. See [Undo and redo](/manual/interface/#undo-and-redo).

Opening the editor of a point, line, polygon, raster or tile layer is part of the full app, and so is a folder's style; renaming a folder, and moving, hiding, copying and deleting rows, are not. See [What asks you to unlock](/manual/your-topokit/#what-asks-you-to-unlock).

## Copying, pasting and duplicating

**Copy** puts rows on the clipboard with their style, description and attributes, and a folder copies with everything inside it. **Paste** adds the copies as new rows, so pasting twice gives two sets, and is missing from a row's menu until rows are on the clipboard. It works in any project, so features can be copied from one project into another.

On a folder, **Paste** reads **Paste into “{name}”** and adds the copies at the bottom of that folder; on any other row it adds them directly below that row. **Duplicate** puts a copy directly below the original, with "copy" added to the end of its name, such as **Trails copy**.

Photos and a tile layer's downloaded tiles are not copied. Raster overlays and basemaps you built cannot be copied: their **Copy** and **Duplicate** are greyed out, and a folder or selection that holds them copies without them.

Copy also puts the features on the clipboard as GeoJSON text, so pasting into a text field in another app gives GeoJSON.

:::ios
On iPhone, **Copy**, **Paste** and **Duplicate** are in a row's :ui[Layer options]{icon=ellipsis} menu and act on that one row.
:::

:::mac
On Mac, **Copy**, **Paste** and **Duplicate** are in the right-click menu. On a row that is part of a selection, **Copy** and **Duplicate** act on the whole selection, and on a selection of several rows **Paste** is not offered; right-click a single row to paste. Under **Select**, `Cmd-C`, `Cmd-V` and `Cmd-D` do the same for the checked rows, and `Cmd-V` pastes at the row you clicked last. Pasted and duplicated rows become the selection, so a second `Cmd-D` duplicates the copies, not the originals.
:::

## Deleting

Deleting a folder deletes everything inside it, including any folders nested within. TopoKit always asks first.

:::ios
On iPhone, the confirmation names the row and warns that its contents go with it. **Delete** in the selection bar asks **Delete N Layers?**, with a count instead of names.
:::

:::mac
On Mac, a right-click delete never names what it is deleting. On one row the prompt is a bare **Delete Layer?**; on a selection it reads **Delete N Items?**, with a count but no names. Under **Select**, the `Delete` key asks the same about the checked rows.
:::

Undo brings deleted rows back where they were, contents included. :mac[On Mac, press `Cmd-Z`.] :ios[On iPhone, tap the Undo pill at the bottom right of the Layers tab; it gives way to the action bar while rows are checked under **Select**.] See [Undo and redo](/manual/interface/#undo-and-redo).

A basemap you built is the exception. Deleting it also deletes its map files from this device, unless a basemap in another project uses them, so Undo does not bring it back and it has to be built again. Everything deleted with it comes back, including the rest of a folder that held it.

:::mac
## The Layer menu

On Mac, the **Layer** menu in the menu bar adds data, makes folders, and acts on the rows selected in the Layers tab. Its commands for selected rows work only while the Layers tab is showing, and the whole menu is greyed while a dialog, a sheet or the basemap setup page is open over the map. A plain click on a row selects it, so outside **Select** the menu acts on the row you clicked last.

**Edit Layer…** (`Cmd-I`) opens the editor of the one selected row, opening any closed folder above it. Copy, Paste, Duplicate and Delete are not in it; see the sections above for their keys. [The menu bar](/manual/interface/#the-menu-bar) lists the whole menu.
:::

## FAQ

**A layer is switched on but I cannot see it on the map. Why?**
Most often a folder above it is hidden ([Showing and hiding](#showing-and-hiding)). Otherwise a raster or tile layer above it covers it ([Draw order](#draw-order)), or the layer is off screen, which **Zoom to** fixes.

**I deleted a folder by accident. Can I get it back?**
Yes, with Undo, until the project is closed or reopened, which clears its undo history. After that, see [Restoring an earlier version](/manual/projects-and-files/#restoring-an-earlier-version).
