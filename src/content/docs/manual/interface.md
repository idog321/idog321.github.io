---
title: "The interface"
description: "What is on the TopoKit screen on iPhone and Mac, where each control is, how undo works, and what VoiceOver reads."
---
TopoKit is a full-screen map with the tool sidebar at one edge. :ios[On iPhone, a sheet with four tabs holds your projects, layers, GPS and settings.] :mac[On Mac, one floating panel with three tabs holds your projects, layers and settings, and the menu bar carries the main commands.]

## The map

Everything you add draws over Apple Maps, which the **Apple Maps** button at the foot of the tool sidebar switches between :ui[Standard]{icon=map-standard}, :ui[Hybrid]{icon=map-hybrid}, :ui[Satellite]{icon=map-satellite} and :ui[Off] ([The Apple Maps switch](/manual/basemaps/#the-apple-maps-switch)). Over the map:

- **Compass**: appears when the map is rotated, and a tap or click turns the map back to north, keeping any tilt. **Settings → Map** can keep it on screen or lock north up ([Map](/manual/settings/#map)).
- **Zoom**: :ios[On iPhone, there is no zoom button.] :mac[On Mac, a + and − pair is at the top right, with **Zoom to Project Extent** below it, which frames every visible feature and raster in the project; tile layers and basemaps are not counted.]
- **Location button**: :ios[On iPhone, the first tap follows you, the second also turns the map to your heading, and the third stops following.] :mac[On Mac, each click centres the map on you once; the Mac map never follows you.]
- **Scale bar**: under the location button, in the units set in **Settings → Units & Coordinates → Units**.
- **Search bar**: finds your layers, basemap names, places and typed coordinates. :ios[On iPhone, it is at the top of the **Layers** tab.] :mac[On Mac, it is in the bar above the map, and `Cmd-F` puts the cursor in it.] See [Search](/manual/search-and-identify/#search).
- **Tool card**: appears at the bottom while a tool runs and holds its live figures, a ✕ at the left that cancels, and **Save** at the right, with **Undo** between them on the line, polygon and circle cards and **Redo** beside it once a step has been undone. The Add Point card has only the ✕ and, once location access is granted, the use-my-location button, because a placed point opens its editor at once. Tapping a figure copies it, and tapping a unit opens a menu of units ([Units](/manual/measurement/#units)).
- **Map credits**: Apple's logo and **Legal** are at the bottom left, and while a basemap you built with map features is on screen, a credit line under them opens the map data's copyright page ([Credit and licences](/manual/basemaps/#credit-and-licences)).

Opening a project frames its visible features and rasters, and so does **Reload** on **Updated on another device** ([iCloud sync](/manual/projects-and-files/#icloud-sync)), so the view you had is lost; with nothing to frame, the map centres once per launch on your first location fix.

Each tile download, elevation download and basemap build shows a progress row at the bottom of the map, whichever tab is open, with a ✕; for tile and elevation downloads it asks before stopping.

## The tool sidebar

The sidebar holds the same eight buttons on iPhone and Mac.

1. :ui[Add Point]{icon=add-point} marks one location where you tap or click, or where you stand, and opens its editor ([Adding a point](/manual/points-lines-polygons/#adding-a-point)).
2. :ui[Add Line]{icon=add-line} draws a line with its live length and bearing ([Adding lines, polygons and circles](/manual/points-lines-polygons/#adding-lines-polygons-and-circles)).
3. :ui[Add Polygon]{icon=add-polygon} draws an area with its live area and perimeter ([Polygons](/manual/points-lines-polygons/#polygons)).
4. :ui[Add Circle]{icon=add-circle} draws a circle from a centre and an edge point, with a lock that holds the radius ([Circles](/manual/points-lines-polygons/#circles)).
5. :ui[Add Route] draws a driving, walking or cycling route through the stops you place, following the roads from Apple Maps, and saves it as a line ([Routes](/manual/routes/)).
6. :ui[Add Data]{icon=plus} opens a menu: **Add Vector Layer…** ([Importing a file](/manual/import-and-export/#importing-a-file)), **Add Raster Layer…** ([Importing a raster](/manual/raster-overlays/#importing-a-raster)), **Add Tile Layer…** ([Tile layers](/manual/tile-layers/)), **Download Map Tiles…** ([Offline downloads](/manual/tile-layers/#offline-downloads)) and **Download Elevation…** ([Downloading tiles](/manual/elevation/#downloading-tiles)). :ios[On iPhone, a pick from this menu opens the Layers tab and finishes there, except **Download Elevation…**, which opens its grid on the map.]
7. :ui[Basemaps] builds an offline map with contours for an area you pick and adds it to the project ([Building a basemap](/manual/basemaps/#building-a-basemap)).
8. **Apple Maps** moves Apple Maps to the next state with each tap or click, and its label names the current one, such as **Apple Maps (Hybrid)**.

:ios[On iPhone, touch and hold a button to see its name.]

:::ios
## iPhone layout

TopoKit on iPhone runs in portrait only. The map fills the screen, and the sheet stays at one of three heights: a strip showing only the tab bar, half the screen, or nearly full. Tapping another tab raises the strip to half height, and tapping the selected tab raises the sheet to nearly full, and again lowers it to half. Choosing a search result, or **Zoom to** on a row, lowers the sheet to the strip so the place is in view. Pulling the sheet down to the strip keeps what is open in it, so an editor in the Layers tab keeps its unsaved changes. Near full height the location button, scale bar, compass and credit line fade out.

While a tool runs or a card is open, the sheet and the tool sidebar leave the screen. The area pickers of Download Map Tiles…, Download Elevation… and Basemaps, Edit Vertices on Map and an open elevation profile count as tools. When you finish or close it, the sheet returns as the strip whatever its height before, unless the tool carries on in a page of the Layers tab.

The sheet's four tabs are :ui[Projects]{icon=folder} for your projects and their sync state ([Projects and files](/manual/projects-and-files/)), :ui[Layers]{icon=layers} for the open project's layers, the search bar and the Undo pill ([The layer tree](/manual/layer-tree/)), :ui[GPS] for position, accuracy, the compass, readouts and track recording, red while a track is recording or paused ([The GPS tab](/manual/gps-and-track-recording/#the-gps-tab)), and :ui[Settings]{icon=settings} for all ten Settings pages ([Settings](/manual/settings/)).

The tool sidebar is on the right edge by default. **Settings → Toolbar & Haptics → Position** moves it to the left ([Toolbar & Haptics](/manual/settings/#toolbar--haptics)).

### Gestures

Beyond pan, pinch, two-finger twist and a two-finger drag up or down, which tilts the map:

- **Tap a feature** to open its card ([What a tap finds](/manual/search-and-identify/#what-a-tap-finds)).
- **Touch and hold a spot** for half a second to open a card for the ground there; it does nothing while a tool is running ([Holding a spot and the place card](/manual/search-and-identify/#holding-a-spot-and-the-place-card)).
- **Swipe toward the screen edge, starting on the map just beside the sidebar,** to hide the sidebar. The chevron tab left at the edge brings it back ([Toolbar & Haptics](/manual/settings/#toolbar--haptics)).
- **Slide a finger up or down the sidebar** to see each button's name as the finger passes it. Lifting the finger presses the button under it.
:::

:::mac
## Mac layout

The window holds the map, the tool sidebar and one floating panel with three tabs: :ui[Projects]{icon=folder} for your projects ([Projects and files](/manual/projects-and-files/)), :ui[Layers]{icon=layers} for the open project's layers ([The layer tree](/manual/layer-tree/)), and :ui[Settings]{icon=settings} for the Settings pages as a list ([Settings](/manual/settings/)).

TopoKit opens the panel unfolded on the Projects tab at its narrowest width, and dragging its edge widens it; the width, the fold and the tab are not kept between launches. While the pointer is over the tab bar, a chevron appears on the panel's outer edge; clicking it, or `Cmd-Ctrl-S`, folds the panel to a pull tab. The pull tab or the same key brings it back. **Settings → Appearance → Panel Position** puts the panel on the left, the default, or on the right ([Appearance](/manual/settings/#appearance)).

The tool sidebar is always on the left of the map and moves up above the elevation profile while one is open. The bar above the map holds the search bar and, when the map is rotated, the compass.

### Mouse and keyboard

- **Click a feature** to open its card in a popover ([What a tap finds](/manual/search-and-identify/#what-a-tap-finds)).
- **Right-click the map**, or Control-click it, for a menu of actions at that spot ([Right-clicking the map](/manual/search-and-identify/#right-clicking-the-map)).
- **Right-click a row** in the Layers tab for its menu ([The Layer menu](/manual/layer-tree/#the-layer-menu)).
- **Press `Esc`** to cancel the running tool, including Edit Vertices on Map and the area pickers of Download Map Tiles…, Download Elevation… and Basemaps. With points already placed or moved, it first asks in an **Unsaved Work** alert, where `Return` keeps the work and **Discard** takes a click. **Tools → Cancel Tool** and the card's ✕ discard without asking, and starting another tool with points placed asks the same question as `Esc`.

### The menu bar

Most commands grey out while the Settings window is in front, or while a dialog, the introduction or the basemap setup panel is open over the map. **Reset to North** also greys while you type in a field, where `Cmd-Shift-Up` selects text instead.

| Menu | Commands and keys |
|---|---|
| **TopoKit** | **Settings…** `Cmd-,`, in a window of its own ([The Mac Settings window](/manual/settings/#the-mac-settings-window)); **Unlock TopoKit…** and **Restore Purchases** ([Your TopoKit](/manual/your-topokit/)); **Quit** `Cmd-Q`. |
| **File** | **New Project…** `Cmd-N`, **Open Project…** `Cmd-O`, **Open Recent**, **Close Project** `Cmd-W`, **Save** `Cmd-S`, and the open project's commands ([Projects and files](/manual/projects-and-files/)). |
| **Edit** | **Undo** `Cmd-Z` and **Redo** `Cmd-Shift-Z`, named for the step; **Copy**, **Paste** and **Duplicate** `Cmd-D` act on layers while the Layers list has the keyboard; **Search** `Cmd-F`. |
| **View** | **Hide Panel** or **Show Panel** `Cmd-Ctrl-S`, **Show Projects**, **Show Layers**, **Apple Maps**, **Zoom In** `Cmd-+`, **Zoom Out** `Cmd-−`, **Zoom to Project** `Cmd-0`, **Show My Location** `Cmd-L`, **Reset to North** `Cmd-Shift-Up`. |
| **Layer** | The **Add Data** rows and **Build Basemap…**, **New Folder** `Cmd-Shift-N`, **New Folder with Selection** `Cmd-Ctrl-N`, **Edit Layer…** `Cmd-I`, and a row's right-click commands, acting on the rows selected in the Layers tab. |
| **Tools** | **Add Point** `Cmd-1`, **Add Line** `Cmd-2`, **Add Polygon** `Cmd-3`, **Add Circle** `Cmd-4`, **Add Route** `Cmd-5`, **Cancel Tool**. |
| **Help** | **TopoKit Help** `Cmd-?` opens this manual and **Getting Started** its first chapter, then the feedback, rating and legal items. |

- `Cmd-W` saves the project and closes it, leaving the window open; if the save fails, the project stays open.
- Closing the map window quits TopoKit, as `Cmd-Q` does. Both save the open project first, and TopoKit quits after 10 seconds whether or not the save has finished.
:::

## Undo and redo

TopoKit keeps one undo history for the open project. Each step has a name, which the Undo control and VoiceOver read, such as **Undo Delete Camp** or **Undo Hide 3 Layers**.

On the history: every row you add, including one saved from a basemap's card, and every raster or tile layer you add; deleting, hiding and showing rows, moving them, grouping them into a new folder, renaming a folder, and applying a folder's style to the features in it.

Not on the history: changes made in an editor, such as a feature's name, description, coordinates, style or photos, or a raster's or tile layer's settings and name, apart from moving the layer to another folder. Building a basemap is not a step either, and deleting one deletes its map files, so Undo cannot bring it back ([Deleting](/manual/layer-tree/#deleting)).

The history has no length limit. It starts empty whenever a project is created, opened, closed or reloaded, which happens after another device changes it, after a merge and after **Restore from Backup**. Saving does not clear it.

:::ios
On iPhone, Undo is a pill at the bottom right of the **Layers** list, shown while there is a step to undo or redo, and an editor opened from the list covers it. The pill steps aside while rows are checked in **Select**. It is the only place for the project's Undo on iPhone, so a change made on the map is undone from the Layers tab.
:::

:::mac
On Mac, **Edit → Undo** (`Cmd-Z`) and **Edit → Redo** (`Cmd-Shift-Z`) carry the step's name. While you type in a field they undo the typing, and while a point is held they wait.
:::

### While a tool is open

Every change to the shape you are drawing is a step: a point added by a tap or pulled out of the faint dot in the middle of a segment, a point dragged, which is recorded when you let go, and a point deleted.

The card's **Undo** and **Redo** act only on the drawing's own steps, and wait while a point is held. The ✕ discards the steps with the shape. **Save** replaces them with one step, **Create** and the feature's name, so one Undo afterwards removes the whole feature. :mac[On Mac, `Cmd-Z` takes back the drawing's steps first and then carries on into the project's earlier steps; the card's Undo stops at the drawing's.]

In **Edit Vertices on Map**, each change is its own step on the project's history as you make it, named **Move Point**, **Add Point** or **Delete Point**. While its card is up, Undo and Redo, on the card or in the Edit menu, act only on that editing session's steps. What the card's **Done** and ✕ keep is in [Reshaping a saved line or polygon](/manual/points-lines-polygons/#reshaping-a-saved-line-or-polygon).

## Accessibility

When a card opens, VoiceOver moves to its name, which reads the whole card at once: the name, its kind, its folder for your own feature, then its facts, with units spoken as words ("1,819 metres"). Activating the name copies it. The coordinate, address and description copy the same way, and each copy is announced "Copied."

When several things lie under one tap, the card opens as a list headed "3 points here", or "3 things here" when anything other than your own points is among them.

A cluster of pins reads "5 grouped points", and activating it zooms in on them, or lists them when they share one spot. When a tap lands on a basemap tile that is still loading, VoiceOver says "Map still loading here." and answers again when the tile arrives, with the card or "Nothing here."

:ios[On iPhone, a greyed sidebar button adds "Not available without a project", and while a tool or card is open the sheet is out of VoiceOver's reach as well as out of sight.]

VoiceOver announces each tool as it starts and each point added or deleted with the running count, such as "Point added. 4 points." While you draw or reshape a line or area, activating a faint dot adds its point, and a point that can be removed offers the **Delete Point** action. Basemap builds, elevation downloads and track recording announce their milestones, such as "Offline basemap ready" with the basemap's name, and the number of points a stopped track holds. An elevation profile announces its gain and loss as it loads, and how much of the line has no terrain data.

TopoKit follows the system **Reduce Motion** setting: sheets, panels, cards and folds change in one step instead of sliding or fading.

## FAQ

**My tool sidebar disappeared. Where did it go?**
:ios[On iPhone, a tool or card is open ([iPhone layout](#iphone-layout)); the sheet is above about a fifth of the screen, where the sidebar fades out until it is gone at 40%; or it was swiped off: tap the chevron tab at the edge, or check **Settings → Toolbar & Haptics → Show Toolbar**.] :mac[On Mac, nothing hides the sidebar.]

**Why are the tool buttons greyed out?**
No project is open. Everything the buttons make is saved into a project, so every button except **Apple Maps** waits until you open or create one. :ios[On iPhone, a tap on a greyed button says so.]

**Why can I see the map through the panel?**
**Settings → Appearance → Panel Style** decides it: **Solid** is opaque, while **Blur** and **Glass** let the map show through unless **Solid Panel Background** is on ([Appearance](/manual/settings/#appearance)).
