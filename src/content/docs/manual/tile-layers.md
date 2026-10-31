---
title: "Tile layers"
description: "Add XYZ and WMS tile layers and download regions for offline use."
---
A tile layer displays a map streamed from a server, and TopoKit fetches only the tiles for the area on screen.

::::platforms
:::ios
![A topographic tile layer drawn over Mount St. Helens on iPhone: the crater, the lava dome and the contour lines fill the map at the 1 km scale, with the orange location dot on the crater's south rim](../../../assets/manual/tile-layers-on-the-map-iphone.png)
:::

:::mac
![A topographic tile layer drawn over Mount St. Helens on a Mac: the crater and its contour lines fill the map, and the layer's row, named Topo, sits at the top of the Layers tab](../../../assets/manual/tile-layers-on-the-map-mac.png)
:::
::::

To add a tile layer, paste the address of a service you choose; TopoKit does not include tile sources. If you don't have a source of your own, you can [build a topographic map](/manual/basemaps/#building-a-basemap) with :ui[Basemaps] in the tool sidebar.

## Finding a tile source

The [Maps](/maps/) page lists XYZ and WMS services by country, province and state.

Choose the tab that matches the service address:

- An XYZ address contains `{z}`, `{x}` and `{y}`.
- A WMS address contains `service=WMS`, or is the bare endpoint the provider gives for WMS.

WFS, WMTS and WCS addresses do not work, even when they contain `request=GetCapabilities`. Vector-tile addresses do not work either, even though they contain `{z}`, `{x}` and `{y}`.

Before adding an address, test it in a browser with real numbers in place of the placeholders. TopoKit does not send authentication, so it cannot use an address that returns an error page or a login form.

## Adding a tile layer

:::mac
On Mac, open :ui[Add Data]{icon=plus} in the [tool sidebar](/manual/interface/#the-tool-sidebar) or :ui[plus]{icon=plus} in the **Layers** tab, then choose **Add Tile Layer…**. You can also choose **Layer → Add Tile Layer…** in the menu bar.
:::

:::ios
On iPhone, tap :ui[Add Data]{icon=plus} in the [tool sidebar](/manual/interface/#the-tool-sidebar) or :ui[plus]{icon=plus} in the **Layers** tab, then choose **Add Tile Layer…**.

:::

::::platforms
:::ios
![The Add Data menu on iPhone: Add Vector Layer…, Add Raster Layer… and Add Tile Layer…, each with a line naming its formats, then Download Map Tiles… and Download Elevation…](../../../assets/manual/getting-started-prepare-for-offline-menu-iphone.png)
:::

:::mac
![The Add Data menu on Mac: Add Vector Layer…, Add Raster Layer… and Add Tile Layer…, each with a line naming its formats, then Download Map Tiles… and Download Elevation…](../../../assets/manual/getting-started-prepare-for-offline-menu-mac.png)
:::
::::

The sheet accepts any text as a template and does not show a preview. If the address is wrong, the layer is still added but draws nothing.

The new layer appears at the top of the **Layers** tab. It hides all points below it, even where its tiles are transparent, and covers everything else below it except through the transparent parts of its tiles. To keep your data visible, drag the tile layer below it to [change the draw order](/manual/layer-tree/#draw-order).

### Adding an XYZ tile layer

1. Enter a **Layer Name**, or leave it blank to use XYZ Layer.
2. Paste the provider's address into **Tile URL Template**, keeping the placeholders in the order the provider documents. Some services use `{z}/{y}/{x}`.
3. Tap **Add**.

::::platforms
:::ios
![Add Tile Layer on iPhone on the XYZ Tiles tab: the Layer Name field reading Topo, the Tile URL Template field with a public topographic map service's address typed in, the hint line about the placeholders, Save URL and Add](../../../assets/manual/tile-layers-adding-an-xyz-tile-layer-sheet-iphone.png)
:::

:::mac
![The Add Tile Layer sheet on Mac on the XYZ Tiles tab: a saved source listed under Saved Sources, the Layer Name field reading Topo, the Tile URL Template field with a public topographic map service's address typed in, its tail showing the {z}/{y}/{x} order, the hint line about the placeholders, Save URL, and Cancel and Add](../../../assets/manual/tile-layers-adding-an-xyz-tile-layer-sheet-mac.png)
:::
::::

For a TMS server, which counts rows from the south, use `{-y}` in place of `{y}`. Using `{y}` requests tiles from the wrong rows, with north and south swapped.

- **API keys**: Put the key in the address as the provider documents it. TopoKit cannot add a header, so a provider that requires its key in a header does not work.
- **Placeholders**: TopoKit always replaces `{s}` with `a`, but sends `{r}` as written, so remove that placeholder from the address.
- **Tile size**: Tiles are 256 × 256 pixels.
- **Zoom ceiling**: TopoKit assumes the server publishes tiles up to z19 and scales up the last tile beyond that. If the server has no tiles at a zoom below the ceiling, that zoom appears blank. When a download finds that the server stops short of its **Max Zoom Level**, TopoKit lowers the ceiling to the deepest zoom fetched. A later download raises the ceiling to its own **Max Zoom Level** when it reaches that level and the level is deeper than the current ceiling.

### Adding a WMS layer

:::mac
![The Add Tile Layer sheet on Mac on the WMS Service tab after Connect: the service's address in the field, its one layer listed under a Filter field and selected, the Layer Name filled in from it, Format PNG, Transparent ticked, Save URL, and Cancel and Add](../../../assets/manual/tile-layers-adding-a-wms-layer-sheet-mac.png)
:::

1. Select **WMS Service** and paste the service address. TopoKit adds the GetCapabilities request to a bare endpoint and uses an address that already contains `SERVICE` and `REQUEST` as is.
2. Tap **Connect** to read the service's WMS 1.1.1 or 1.3.0 capabilities, including nested layers. If `WMS server error: HTTP 401` or `HTTP 403` appears under the field, the server requires a login.
3. Choose a layer from the list, where an orange triangle marks any layer that does not advertise Web Mercator.
4. Choose a **Format**. PNG preserves transparency, JPEG is smaller for opaque imagery, and PNG 8-bit is a smaller PNG for flat-colour maps.
5. Leave **Transparent** on to let the layers beneath show through, or turn it off for opaque imagery.
6. Tap **Add**.

- **Projection**: TopoKit always requests EPSG:3857.
- **Tile size**: Tiles are 512 × 512 pixels, both on the map and in downloads.
- **Style**: TopoKit always uses the server's default style.
- **Zoom ceiling**: The ceiling works as it does for XYZ, but starts at z18.

### Saving a source for reuse

- **XYZ**: Use **Save URL** to save the name and template at the top of the **XYZ Tiles** tab. Tap a saved template to fill in the form without adding the layer, or tap its ✕ to remove it from **Saved Sources**. You can also choose **Edit Name** or **Delete** from its context menu.
- **WMS**: Use **Save URL** after **Connect** to save the service. To save a layer with the sheet's current **Format** and **Transparent** settings, star its row. You can then tap the starred layer under its saved service to add it without connecting. To rename a saved service or starred layer, choose **Rename** from its context menu.

You can use saved sources in every project on the device where you saved them. They are stored on that device rather than in the project, so they are not available on other devices.

## Managing tile layers

To change a tile layer's name or opacity, choose **Edit** from its row's :ui[Layer options]{icon=ellipsis} menu or its right-click menu on Mac. :mac[On Mac, you can also choose **Layer → Edit Layer…** (`Cmd-I`).] These are the only properties you can change in the editor.

::::platforms
:::ios
![The Topo row's Layer options menu on iPhone: Edit, Hide and Zoom to, Download for Offline and Remove Offline Tiles, Move to... and New Folder with “Topo”, Copy and Duplicate, and Delete](../../../assets/manual/tile-layers-managing-tile-layers-menu-iphone.png)
:::

:::mac
![The right-click menu on the Topo row on Mac: Edit, Hide and Zoom to, Move to and New Folder with “Topo”, Copy and Duplicate, Download for Offline and Remove Offline Tiles, and Delete](../../../assets/manual/tile-layers-managing-tile-layers-menu-mac.png)
:::
::::

:::mac
![The Edit Tile Layer popover on Mac: the name field reading Topo, the Opacity slider at 100%, and the Source URL with its copy button](../../../assets/manual/tile-layers-editing-a-tile-layer-popover-mac.png)
:::
:ios[On iPhone, tap **Save** to keep a new name. If you leave without saving, TopoKit keeps your opacity change but not the new name.] :mac[On Mac, the editor is a popover, and the new name is saved when it closes.]

To change the address, delete the layer and add it again, copying the address first by tapping it under **Source URL**. For a WMS layer, tap the **Layer** row below it to copy the machine name, which you can use to find the layer again with **Filter**.

A tile layer covers Apple Maps, including its place names. Apple's names show only through the transparent parts of the tiles, or through the layer when its opacity is below 100%.

## Offline downloads

You can download a layer's tiles for a rectangle to this device so you can view that area without a connection, and you can save any number of downloads for a layer.

### Starting a download

To start a download, choose **Download Map Tiles…** from the :ui[Add Data]{icon=plus} menu or the :ui[plus]{icon=plus} menu in the **Layers** tab. :mac[On Mac, you can also find it in the **Layer** menu.]

To open the same sheet with a tile layer already selected, choose **Download for Offline** from its :ui[Layer options]{icon=ellipsis} menu or its right-click menu on Mac. :mac[On Mac, you can also choose **Layer → Download for Offline…** for the selected layer.]

::::platforms
:::ios
![Download Tiles on iPhone after drawing a region round the crater: Tile Layer reading Topo, the Region row with Draw chosen and the corners' coordinates, Download Mode on All zoom levels, the Max Zoom Level slider at z14, the cards reading 23 Tiles and 345 KB Storage, and Cancel and Download](../../../assets/manual/tile-layers-starting-a-download-sheet-iphone.png)
:::

:::mac
![The download sheet on Mac: Tile Layer reading Topo, Region with Map View chosen and the corners' coordinates round Mount St. Helens, Download Mode on All zoom levels, the Max Zoom Level slider at z14, the cards reading 111 Tiles and 1.7 MB Storage, and Cancel and Download](../../../assets/manual/tile-layers-starting-a-download-sheet-mac.png)
:::
::::

1. Choose a **Tile Layer** from the list, which excludes **Offline: …** layers and built basemaps.
2. Set the rectangle under **Region** using one of these options:
   - :mac[Choose **Map View** to use the current map view on Mac.]
   - Choose **Draw**, tap two opposite corners on the map, then tap **Done** on the tool card. Tap the tool card's arrow to clear the corners and start again, or tap its ✕ to abandon the download. If the layer is hidden, **Draw** turns it on and leaves it on.
   - Choose **Coordinates** and enter a **Northwest Corner** and a **Southeast Corner** in the [coordinate format](/manual/points-lines-polygons/#coordinate-entry-formats) set in Settings.
3. Choose a **Download Mode**. **All zoom levels** fetches every zoom from 0 to the maximum. **Max resolution only** downloads less by fetching only the maximum zoom, then building the lower zooms from it on the device, clipped to the rectangle. While TopoKit builds them, the bar reads "Building: {layer name}".
4. Set the **Max Zoom Level** from 1 to 20; the starting level is z16. Each level up has up to four times as many tiles as the level below it.
5. Tap **Download**.

The **Tiles** estimate is exact, while the **Storage** estimate counts every tile at 15 KB regardless of its format or size. If the estimate exceeds 500 MB, a warning appears, but you can still download the tiles.

### While it downloads

You can run several downloads at once, each with its own progress bar.

- **Cancel**: Tap ✕, then **Cancel Download** to stop the download and remove its rectangle. TopoKit deletes the partial tiles if the layer has no finished download; otherwise, it keeps them for reuse in a later download.
- **Retries**: TopoKit tries a tile up to three times if a dropped connection or server error prevents it from downloading. It does not retry a tile the server refuses with a 4xx response, such as 404 or 429.
- **Retry Failed**: If some tiles fail, **Download Complete** reports them, and you can choose **Retry Failed** to fetch only the missing tiles. If the download fails outright, **Download Failed** offers **Retry**.
- **Stopping**: Downloads run only while their project is open, and tiles already on disk are kept when a download stops. Starting the same download again fetches only the missing tiles.

### Downloads over cellular data

:::ios
On iPhone, TopoKit checks before a tile download uses cellular data or a personal hotspot, following **Settings → Storage & iCloud → Large Downloads** in [Storage & iCloud](/manual/settings/#storage--icloud).

With the default setting, **Always Ask**, TopoKit asks **Download Using Cellular Data?** once, regardless of how many downloads are waiting. Your answer applies until the iPhone next connects to Wi-Fi: choose **Download** to allow cellular data until then, or **Wait for Wi-Fi** to pause the downloads. Choosing **Always Allow** also changes the setting so TopoKit stops asking.

TopoKit repeats the check during a download, so a download started on Wi-Fi does not continue over cellular data without asking. When a download is waiting, its bar reads "{layer name}: Waiting for Wi-Fi…", and it resumes automatically when the iPhone connects to Wi-Fi. This setting does not affect map browsing or iCloud sync.
:::

:::mac
On Mac, downloads use any connection, including a personal hotspot, and there is no cellular setting.
:::

### Using offline tiles

When a download finishes, an **Offline: {layer name}** layer appears at the top of the source layer's folder. Each download adds a separate layer, named **Offline: {layer name} (2)** for the next download and so on, and downloads never merge. Each layer reads only the downloaded tiles within its own rectangle and scales up its sharpest tile beyond the downloaded maximum zoom.

::::platforms
:::ios
![Two rows at the top of the Layers tab on iPhone: Offline: Topo, its tile icon badged with a download arrow, above the Topo tile layer it came from](../../../assets/manual/tile-layers-using-offline-tiles-panel-iphone.png)
:::

:::mac
![Two rows at the top of the Layers tab on Mac: Offline: Topo, its tile icon badged with a download arrow, above the Topo tile layer it came from](../../../assets/manual/tile-layers-using-offline-tiles-panel-mac.png)
:::
::::

:::ios
<video src="/media/tile-layers-using-offline-tiles-iphone.mp4" autoplay loop muted playsinline aria-label="Downloading tiles on iPhone: Download Map Tiles… from the Layers tab's + menu, the Topo layer, Draw with two corners tapped round Mount St. Helens and Done, the sheet with the Max Zoom Level dragged to z14 and the cards reading 23 tiles, Download, the Download Complete alert, the Offline: Topo row appearing above Topo, and then Topo's eye tapped so only the downloaded rectangle draws over Apple's imagery of the volcano"></video>
:::

:::mac
<video src="/media/tile-layers-using-offline-tiles.mp4" autoplay loop muted playsinline aria-label="Downloading tiles on a Mac: Download Map Tiles… chosen from the Add Data menu, the sheet with the Topo layer and Map View over Mount St. Helens, the zoom set to 14 and the cards reading 111 tiles, Download, the Download Complete alert, the Offline: Topo row appearing above Topo, the map zoomed out twice, and then the Topo row's eye clicked so the streamed layer goes and the downloaded rectangle stands alone over Apple's imagery"></video>
:::

Each download's rectangle and zoom range are saved in the project, so its **Offline: …** layer appears on another device without tiles, which never sync. To download the same rectangle and zooms on that device, use the **Offline tiles available** banner in the **Layers** tab, or choose **Download for This Device** from the layer's :ui[Layer options]{icon=ellipsis} menu or its right-click menu on Mac. Built basemaps have their own behaviour for [other projects and other devices](/manual/basemaps/#other-projects-and-other-devices).

### Removing downloaded tiles

The system never purges downloaded tiles, and all downloads for a layer use the same store. When downloads overlap, only one copy of each shared tile is stored, and you can view the total in **Settings → Storage & iCloud → Downloaded Map Tiles**.

| Action | What it removes | What stays |
|---|---|---|
| **Remove Offline Tiles** in the source layer's :ui[Layer options]{icon=ellipsis} menu, or its right-click menu on Mac | Every downloaded tile of that layer, after **Remove Offline Tiles?** | The layer, which keeps streaming from the server |
| **Clear Downloaded Map Tiles** in [Storage & iCloud](/manual/settings/#storage--icloud) | Every downloaded tile on this device | Every layer |
| Deleting the layer | The layer, and any download it is running | Its downloaded tiles, which its **Offline: …** layers keep drawing |

Use **Remove Offline Tiles** to remove all of a layer's downloads at once; to keep a smaller area, remove the downloads and download that area again. The command appears once the layer has a finished download and is never available on an **Offline: …** layer. :mac[On Mac, you can also choose **Layer → Remove Offline Tiles…**.]

## FAQ

**Why did my download stop, or finish with failed tiles?**
Tiles fail beyond the zoom levels the server publishes, and a server that throttles bulk requests refuses some tiles. Try again, or download a smaller area at a time.

**Why does my WMS layer connect but draw nothing?**
TopoKit requests every WMS layer in Web Mercator (EPSG:3857), so a layer remains blank if the server cannot draw it in that projection. No error appears when a server returns something other than an image for a tile. In the list shown by **Connect**, an orange triangle marks a layer that does not advertise Web Mercator.

**Why does Download Map Tiles… say "Add a tile layer first."?**
You can download map tiles only for XYZ and WMS layers added to the project. Apple Maps cannot be downloaded, and a built basemap is made on the device rather than downloaded.
