---
title: "Points, lines, polygons and circles"
description: "Adding, reshaping and editing points, lines, polygons and circles, with their photos, elevation, style and folders."
---
Points, lines and polygons are the three geometry types a TopoKit project stores.

## Adding a point

Set the point's location in one of these ways; the editor then opens on that spot.

- Tap :ui[Add Point]{icon=add-point}, then tap the map where the point goes.
- Tap the :ui[location]{icon=location} button on the Add Point tool card to place the point on your GPS fix. It appears once TopoKit has location access, and only on that card.
- Choose **Add Point** on the card of a search result, a typed coordinate, a [held spot](/manual/search-and-identify/#holding-a-spot-and-the-place-card), or a peak, hut or other mark on a basemap you built.
- :mac[On Mac, right-click the map and choose **Add Point Here** on an empty spot, or **Add Point** on a basemap mark.]

The tool closes once the point is placed; the coordinate stays editable in the editor, and nothing is saved until **Create**, which waits for a name.

:ios[On iPhone, a point placed from your location also stores the GPS reading in its **Attributes**: its accuracy, timestamp and original lat/lon, plus altitude, speed and course when the fix includes them. A saved point you move keeps the original lat/lon and gains **Gps Location Edited** in its Attributes; moving it back onto the reading removes it.]

## Adding lines, polygons and circles

Choose :ui[Add Line]{icon=add-line}, :ui[Add Polygon]{icon=add-polygon} or :ui[Add Circle]{icon=add-circle} in the tool sidebar; they are greyed out until a project is open. :mac[On Mac, the **Tools** menu starts each one from the keyboard ([The menu bar](/manual/interface/#the-menu-bar)).] The [tool card](/manual/interface/#the-map) shows the shape's [live figures](/manual/measurement/).

Each map tap adds a vertex, drawn as a dot styled by **Settings → Features → [Vertex Style](/manual/settings/#features)**. The vertex you touched last is the **active** one, marked by a ring, and new vertices insert after it, so you can tap back to an earlier vertex and add mid-line without starting over.

Every change to the shape is a [step](/manual/interface/#while-a-tool-is-open), and **Undo** on the card takes back the newest. The line card's **Elevation profile** button charts the line ([A profile while you draw](/manual/elevation/#a-profile-while-you-draw)).

The ✕ on the card discards the shape and its steps without asking. Starting another tool does the same, and also puts a line or polygon open in [Edit Vertices on Map](#reshaping-a-saved-line-or-polygon) back as it was. :ios[On iPhone, nothing asks first.] :mac[On Mac, an **Unsaved Work** alert asks first when vertices are placed or moved.]

### Polygons

A polygon needs **3** vertices, and below that it draws as an open outline. Its card shows [area and perimeter](/manual/measurement/#area-and-perimeter) instead of length.

TopoKit closes the ring, so there is no need to tap the first corner again.

### Circles

The first tap places the centre and the second sets the edge; each tap after that resizes the circle. The lock button on the card keeps the radius ([Circles and the radius lock](/manual/measurement/#circles-and-the-radius-lock)). A circle has no faint dots, no **Delete Point** and no segment lengths.

On save, the circle is stored as a polygon feature: a 64-vertex ring, placed on the WGS84 ellipsoid at the radius the card shows. **Save** opens the polygon editor, and from then on the feature is a polygon in every respect, export included.

## Moving, adding and deleting vertices

These work while drawing a line or polygon and in [Edit Vertices on Map](#reshaping-a-saved-line-or-polygon).

- **Move.** Drag a vertex. Letting go records the drag as one step.
- **Add.** A faint dot halfway along a segment becomes a new vertex when you drag it; a tap on it adds nothing. A segment shows its faint dot only when it is long enough on screen to grab without touching its ends, and no more than 100 show at once, so a long line seen from far out has none until you zoom in. :mac[On Mac, a segment's faint dot shows only while the pointer is near it.]
- **Delete.** :ios[On iPhone, tap a vertex to ring it, tap the ringed vertex again, and choose **Delete Point**. The vertex you placed or touched last is already ringed, so one tap on it is enough.] :mac[On Mac, right-click or Control-click a vertex to delete it; no menu opens.] **Undo** brings it back.

In Edit Vertices on Map a line keeps at least two vertices and a polygon three; **Delete Point** is not offered below that. While drawing there is no floor, and **Save** waits until the shape has enough vertices again.

## Finishing a shape

**Save** on the card turns on at two vertices for a line or circle and three for a polygon, and opens the editor, where **Create** waits for a name.

Its **Vertices** section has one row per vertex, collapsed when the shape has 20 or more and shown 20 at a time under **Show more** once expanded. Each coordinate is editable in place. :ios[On iPhone, **Edit** in the list's header reorders and deletes rows, down to 2 vertices for a line and 3 for a polygon.]

Cancelling the editor returns you to the drawing with every vertex in place. The Vertices list is in the creation editor only; a saved shape is reshaped on the map.

## Reshaping a saved line or polygon

Tap **Edit Vertices on Map** in a line's or polygon's editor. :mac[On Mac, **Layer → Edit Vertices on Map** does the same for the line or polygon selected in the Layers tab.] The editor closes, saving what it held, and the vertices come up as dots to [move, add and delete](#moving-adding-and-deleting-vertices).

![Edit Vertices on Map: a point dragged, then deleted with Delete Point, and Undo bringing it back one step at a time](/media/edit-vertices.svg)

Each change is written into the saved feature as you make it, as its own undo step. **Done** keeps them all, so Undo afterward takes the changes back one at a time. ✕ puts the line or polygon back as it was when you opened Edit Vertices on Map and removes those steps. Every vertex you leave in place keeps its height, time and accuracy, so a recorded track keeps its timings; a vertex you move or add has none. While the card is up, its **Undo** :mac[and **Edit → Undo**] take back only this editing's changes ([While a tool is open](/manual/interface/#while-a-tool-is-open)).

## Editing a feature

Open a saved feature from its Layers tab row, or with **Edit** on its card on the map.

:::mac
On Mac, a saved feature's editor is a popover with no Cancel: clicking outside it saves. A new feature's editor is a sheet.
:::

:::ios
On iPhone, the editor saves whenever you leave it: tap **Done**, swipe the sheet down, or go back to the Layers tab.
:::

A style is saved when you tap **Done** in its sheet, a photo when you add or delete it, and a height when **Get Elevation** returns, without waiting for the editor to close. A point's **Elevation** section fills in on its own when the spot's elevation tile is on the device, and otherwise offers **Get Elevation**, which downloads that one tile, 25–40 MB ([Elevation at a point](/manual/elevation/#elevation-at-a-point)). Changes made in an editor are not [undo steps](/manual/interface/#undo-and-redo); moving the feature to another folder is, and so is deleting it.

### Coordinate entry formats

Coordinate fields follow **Settings → Units & Coordinates → [Coordinate Format](/manual/settings/#units--coordinates)**; TopoKit stores decimal degrees underneath whichever format you pick.

Decimal degrees has no hemisphere menu, so south and west are entered as negative numbers.

An entry that does not parse or is out of range shows the reason in red, and the coordinate keeps its last valid value. A comma works as the decimal mark in decimal degrees, DMS seconds and DDM minutes, so `49,5` is read as 49.5. The UTM easting and northing refuse a comma, since it may be a thousands separator.

### Attributes are read-only

TopoKit has no attribute editor: a feature you draw carries a name and a description, and no custom fields.

The **Attributes** list shows the values TopoKit wrote, such as a recorded track's statistics, and every attribute that came with an imported feature. Names show in title case with their words split, so `track_distance` reads **Track Distance**, and sorted alphabetically rather than in the file's order; empty values are left out, and a list of more than five opens collapsed. Imported values are written back out on [export](/manual/import-and-export/#what-an-export-contains), and [search](/manual/search-and-identify/#search) matches them.

For structured attribute capture, collect the geometry in TopoKit, export to GeoPackage, and attribute it in your desktop GIS.

## Photos

Tap **Add Photo**, or the **+** tile after the last thumbnail, in an editor's Details section. :ios[On iPhone, **Take Photo** adds one photo per use and stores it in the project only, not in your Photos library.] :mac[On Mac, **Import from Files** takes any number of images at once.] The photo library takes at most 10 images per pass; a feature can hold more.

Each image is capped on its longest edge by **Settings → Storage & iCloud → [Photo Size](/manual/settings/#storage--icloud)**, saved upright as JPEG, and stored with a thumbnail in a `Photos/` folder [beside the project file](/manual/projects-and-files/#file-locations). On a feature you are creating, photos are attached when you tap **Create**.

Tapping a thumbnail, in the editor or on the feature's card, opens a viewer that pages through every photo on the feature. :mac[On Mac, the Left and Right arrow keys page through them.] **Delete** in the viewer's :ui[More]{icon=ellipsis} menu asks first; **Delete** in a thumbnail's own menu in the editor does not. A deleted photo's file is removed from the project, and Undo does not bring it back.

A photo shows an exclamation mark in place of its thumbnail, and **Photo unavailable** in the viewer, when its file is missing, as after a project is moved by hand without its `Photos/` folder. Put the folder back beside the project file and open the feature again. Over iCloud Drive, a feature opened before its photos arrive shows them unavailable until you reopen it. A [pasted or duplicated](/manual/layer-tree/#copying-pasting-and-duplicating) feature has no photos.

## Styling a feature

**Edit** in the editor's **Style** row opens **Customize Pin**, **Customize Line** or **Customize Polygon**. A feature you draw starts with the **Default Style** for its kind in **Settings → Features**, copied when the feature is made, so changing a default later leaves existing features as they are.

- **Pins**: the small dot first in the **General** symbol category is the no-symbol choice, and a pin with no symbol shows a disc in a shade of its own colour. **Custom icon colour** appears only once a symbol is set. The symbol picker opens on **Recently Used**, your last eight symbols, and on **General** until you have used one.
- **Polygons**: the first stroke swatch, marked with a link, copies the current fill colour to the stroke once, so a fill changed afterwards leaves the stroke as it was. Stroke and fill opacities both run from 0.0, so a polygon can be outline only or fill only; a line's opacity stops at 0.1. Fill opacity starts at 0.15 for polygons you draw and 0.25 for imported ones.
- **My Presets**: empty until you save a style with **Save Current**. Tapping a preset loads it into the sheet, and **Done** applies it; its context menu holds **Delete**. A preset cannot be renamed. Presets are kept on this device and do not sync, but a project opened elsewhere looks the same, because each feature's style is saved in the project.

To restyle every feature of a kind in a folder at once, [style the folder](/manual/layer-tree/#styling-a-folder).

## Points on the map

Each point's name prints under its pin, as **Settings → Features → [Pin Names](/manual/settings/#features)** sets. **Always**, the default, leaves out any name that would overlap another pin, a cluster bubble or another name, so zooming in prints more of them. No more than 150 names print at once, and with more than 600 single pins on screen, pins inside bubbles not counted, only the picked pin's name prints.

A name prints on at most two lines, cut at an ellipsis; a point with no name, or named Untitled Point, prints none. A picked pin draws at one and a half times its size, and its name prints in bold whatever it overlaps. :ios[On iPhone, names follow the system text size, up to 22 pt.]

With **Point Clustering** on, the default, pins that overlap merge into one round bubble showing how many points it holds. Tapping a bubble zooms in to spread its points; when they share one spot, or the map is as close as it goes, the card lists them.

## Moving features between folders

A feature's **Create New Folder** button creates the new folder at the top level of the tree at once, so cancelling the editor afterwards leaves it there empty, and makes it the feature's folder: a feature you are creating saves into it, and a feature you are editing moves into it when the editor closes. The folder picker lists only folders that directly hold a feature of the same type, so a new or empty folder, or one holding only subfolders, is not in its list. The Layers tab has its own ways of [moving rows](/manual/layer-tree/#moving-rows).

## FAQ

**Why does the Unlock TopoKit sheet open when I draw or edit?**
Drawing, measuring and editing are part of the full app; see [What asks you to unlock](/manual/your-topokit/#what-asks-you-to-unlock).

**Why can I reshape only part of a multi-part line or polygon?**
Edit Vertices on Map edits a line's first part, or the outer ring of a polygon's first part; the other parts and any holes are kept as they are. An imported multi-point opens in the point editor on its first point, and a new coordinate moves that point only. To change the rest, [export](/manual/import-and-export/#exporting-and-sharing) the feature, edit it in your desktop GIS, and import it again.

**How precise are the stored coordinates?**
They are stored at full double precision. The fields show decimal degrees to 6 decimal places (about 11 cm), DMS seconds 2 decimals (about 31 cm), DDM minutes 3 decimals (about 1.85 m) and UTM whole metres. Changing any field stores both latitude and longitude as the fields show them, so an edit in DDM can move a point by up to about 1 m.

**Can I make a feature use the default style again?**
Not with one tap: the style sheets have no reset. Open the **Default Style** you want in **Settings → Features**, save it with **Save Current** under **My Presets**, then apply that preset in the feature's own sheet.
