---
title: "Routes"
description: "Driving, walking and cycling routes through up to 14 stops, with roads from Apple Maps, drawn on the map and savable as a line."
---
Add Route builds a route through up to 14 stops for driving, walking or cycling. TopoKit asks Apple Maps for the road between each pair of neighbouring stops, draws each leg on the map as Apple answers, and saves the finished route into your project as a line.

## Adding stops

:ui[Add Route] in the tool sidebar starts the tool. :mac[On Mac, **Tools → Add Route** (`Cmd-5`) does the same.] Both are dimmed until a project is open. Routes are part of the full app; see [Your TopoKit](/manual/your-topokit/#what-asks-you-to-unlock).

![The Add Route card: a stop tapped onto the map, a second picked from search, the two reordered by dragging, and the end of the list at 14 stops reading "14 stops is the most"](/media/route-stops.svg)

The tool card opens with one empty field reading **Start**. To fill it:

1. **Tap the map.** Each tap adds a stop at the end of the list.
2. **Use your location.** :ui[My Location]{icon=location} at the right end of the empty field adds where you are as a stop named "My Location". The stop is your position at the moment you add it; it does not follow you. The button shows while the field is empty, [location access](/manual/gps-and-track-recording/#location-permissions) is granted and there is a fix.
3. **Type a coordinate.** Type it into the empty field and pick its row. [Any of the four formats](/manual/search-and-identify/#coordinate-formats) works, whatever the coordinate format is set to.
4. **Search.** Type a name into the empty field. It searches what the [search bar](/manual/search-and-identify/) searches. A point, a basemap name, a place or a coordinate becomes a stop; picking a line, polygon, folder, raster or tile layer adds nothing.

A stop picked from search, a typed coordinate or :ui[My Location]{icon=location} moves the map to frame the stops. A route holds up to 14 stops, start and end included; at 14 the field reads "14 stops is the most" and a map tap adds nothing unless a stop is selected, which it moves.

A stop tapped onto the map is named from Apple's place lookup, for example "St Mary's Ln"; until the lookup answers, or when it finds nothing, the field shows its coordinates.

### Starting from a point or a place

- **A card on the map**: the route button on a point's, a place's or a search result's card makes that spot the last stop. With a location fix, "My Location" becomes the start and TopoKit asks for the route at once. Without one, the spot is the only stop, and your first tap, search pick or :ui[My Location]{icon=location} becomes the start. This works with no project open; saving still needs one.
- **A point or multipoint row in the Layers tab**: :ios[On iPhone, :ui[Layer options]{icon=ellipsis} → **Route to Here**.] :mac[On Mac, right-click the row, or select it and choose **Layer → Route to Here**.] The point becomes the only stop even with a fix, and the next stop you add becomes the start. On a multipoint row the route ends at its first point.
- **A spot with nothing on it**: the **Start here** menu on the card for a [held spot or a typed coordinate](/manual/search-and-identify/#holding-a-spot-and-the-place-card) starts a route from that spot. :mac[On Mac, the map's [right-click menu](/manual/search-and-identify/#right-clicking-the-map) also offers **Add Route From Here** and **Route to Here**.] Starting from a held spot or a bare spot on the map needs a project open.

## The tool card

From two stops, the totals line under the fields holds the travel-mode menu, the distance and travel time, a count of straight legs when there are any, :ui[Undo], :ui[Redo] once something has been undone, and :ui[Reverse].

The distance is measured along the line drawn on the map, so it matches the elevation profile; the travel time is Apple's. [Measuring](/manual/measurement/#units) covers the units, and :ui[Elevation profile] opens the [elevation profile](/manual/elevation/#a-profile-while-you-draw) of the route being drawn.

## Travel modes

The mode menu is on the card before the first stop. TopoKit starts in **Drive** and remembers the last mode chosen across launches. Every leg is asked for in the chosen mode. There is no transit and no off-trail routing.

## Changing a route

- **Move a stop.** Drag its dot; only the legs that meet it are asked for again. Or tap its field or its dot to select it: the next map tap or search pick moves that stop instead of adding one. Tap the field or the dot again, or the empty field, to let it go. :ui[My Location]{icon=location} always adds a new last stop, even while a stop is selected.
- **Remove a stop.** Tap the x at the end of its field; one leg then joins the stops either side. A stop cannot be removed from the map.
- **Reorder stops.** Drag a field up or down the list. To put a stop between two others, add it and drag its field into place; a route has no dots between stops to pull one from.
- **Reverse the route.** Tap :ui[Reverse]; every leg is asked for again in the new direction.
- **Change the mode.** Choose another mode from the menu. Answers already received are kept, so switching back restores them without asking Apple again.
- **Undo a change.** Tap :ui[Undo] on the totals line to take back any change in this list. See [While a tool is open](/manual/interface/#while-a-tool-is-open).
- **Start over.** Tap :ui[Cancel]: the tool closes and discards the stops without asking. :mac[On Mac, `Esc` asks "Discard the stops you've placed?" first.]

## The routing engine

Directions come from Apple Maps, so every request goes to [Apple's servers](/manual/#what-topokit-sends-and-where) and a route cannot be computed offline. A saved route works offline like any other line; see [Before a trip](/manual/offline/#before-a-trip).

Each leg is a separate request: a route through five stops makes four.

A leg is drawn as a dashed straight line while it is being asked for, while it waits for a retry, and when Apple has no road for it. A waiting leg is asked again only when you tap :ui[Retry]: TopoKit does not retry on its own when the connection returns. A leg with no road counts as answered: it adds its length to the distance and nothing to the travel time. A leg still being asked for or waiting keeps :ui[Elevation profile], :ui[Share] and :ui[Save] dimmed.

## How the route is drawn

Stops draw in **Vertex Style** and legs in **Default Style** under **Routes**, both in [Settings → Features](/manual/settings/#features). With a dashed or dotted style the road legs look like the straight ones, and the count on the totals line is what tells them apart. The route draws above the map labels and above your saved lines and polygons, and saved points draw on top of it.

## Saving a route

:ui[Save] on the tool card opens the route editor. It stays dimmed until a project is open. The route stays on the map while the editor is open, so cancelling the editor keeps it, and the tool closes once the route is saved.

The name is pre-filled as "Start → End" from the names of the first and last stops, or from the travel mode and the distance when either end has no name. A blank description is saved as "Route via Apple Maps Directions".

The saved line keeps every point Apple returned, which for a detailed city route can be many hundreds, and runs straight across any straight leg. The stops are not saved as separate points. Its properties are `routeStart`, `routeEnd`, `routeDistance`, `routeTravelTime`, `routeTransportType`, `routeSource` ("Apple Maps Directions"), `routeViaCount` (the stops between the ends, on a route of more than two), `routeStraightLegs` and the description. `routeDistance` is text, in the units set when you saved. The line's card shows them under **Attributes**, all but the two end names.

## Sharing a route

:ui[Share] on the tool card shares the route without saving it, and works with no project open.

Open the route in Apple Maps or another maps app. **Open in Apple Maps** passes the start, the end and the travel mode, and Apple Maps plans its own route between them, so any stops between are left out. The row under it opens the route in another maps app with the start, the end and the first nine stops between them; on a longer route its caption counts what it carries, for example "11 of 13 stops". :ios[On iPhone that row appears only when the other app is installed.] :mac[On Mac that row opens the route in the browser.] TopoKit keeps the route's shape and figures, not Apple's turn list, so for turn-by-turn directions open the route in one of these.

**GPX**, **KML**, **GeoJSON** and **GeoPackage** share the route as a file, named as the save editor would name it, with the route's properties. A GPX file holds the route as a track, not as a GPX route. See [Exporting and sharing](/manual/import-and-export/#exporting-and-sharing).

## FAQ

**Why is part of my route a dashed straight line?**
Apple has not answered with a road for that leg, or has none. When there is no road the card reads, for example, "No driving route from 2 to 3", naming the mode and the first such leg. Drag the stop onto a mapped road or path, switch the mode, or keep the leg, which saves as a straight line. When a request gets no answer instead, the card names the cause, such as "Apple is limiting requests" or "Server error", and :ui[Retry] on that line asks again.

**Why does my route take an unusual path?**
TopoKit sets only the travel mode and asks for no alternatives, so the route through a middle stop is Apple's route to it joined to Apple's route onward. To steer it, add a stop on the road you want, or drag one there.
