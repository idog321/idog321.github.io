---
title: "Directions & Routing"
description: "Driving and walking directions via Apple Maps, drawn on the map and savable as a line."
---
TopoKit computes driving and walking directions between two points, draws the route on the map, and saves it as a line in your project.

## Setting start and end

<video src="/media/directions-setting-start-and-end.mp4" autoplay loop muted playsinline aria-label="Setting up a route: placing the start and destination on the map, the tool card naming each reverse-geocoded endpoint, and the route drawing between them"></video>

Activate :ui[Create Route]{icon=create-route} from the tool sidebar. The [tool card](/manual/interface/#the-map) appears at the bottom of the screen and asks for a start point. Four ways to set each point:

1. **Tap the map.** The first tap places the start (green A pin), the second places the end (red B pin), and the route computes automatically.
2. **My Location.** The pill appears when [location access](/manual/gps-and-track-recording/#location-permissions) is granted and a fix is available, and fills in whichever point the card is asking for. As a start it is labelled "My Location" rather than reverse-geocoded; as a destination it gets a real place name like any other endpoint.
3. **Coords.** Type a position in the [coordinate format](/manual/ui-settings-styling/#units-and-coordinates) the app is set to. The sheet has no format picker of its own, so switch the app's format first if you need to enter UTM.
4. **Search.** Type a name to search two sources at once: **My Features**, up to ten named Point or MultiPoint features from your open project, each tagged with a **Project** chip; and **Places**, Apple Maps' addresses and points of interest.

The three pills are on screen only while the card is asking for a point. They disappear once a route is drawn.

As soon as you drop a point, TopoKit reverse-geocodes it into a place name and shows it on the card, for example "St Mary's Ln → Riverside Park". Raw coordinates appear instead when the lookup finds no match, and a match carrying no name or address of its own reads "Unknown".

Shortcuts open Directions with the destination already filled in:

- **A feature's info card on the map.** Choose :ui[Directions] to set that spot as the destination. With a position fix available it fills in the start and computes the route on the spot.
- **A Point or MultiPoint row in the [layer tree](/manual/layer-tree/).** :mac[On Mac, right-click the row.] :ios[On iPhone, tap :ui[More]{icon=ellipsis} on the row.] This fills the destination only, so you set the start yourself.
- :mac[**The Mac map's right-click menu.** Choosing **Directions** on any spot, feature or bare ground, behaves like the info-card shortcut.]

### Transport modes

Directions offers two modes, chosen on the tool card:

- **Drive**: the default. Follows the road network, including one-ways and turn restrictions.
- **Walk**: follows the pedestrian network, including footpaths that driving would skip. There is no off-trail routing, so a walking route stays on mapped paths.

Cycling and transit are not available.

### Changing a route once it is drawn

- **Change the mode.** Switching between Drive and Walk recomputes the route.
- **Swap the endpoints.** The swap button exchanges start and end and recomputes. The reverse route can differ from the forward one because of one-ways.
- **Move the destination.** Tap the map again: the existing start is kept and the tap becomes the new end. This is also how you retry after a failure, where the card prompts "Tap a new destination to retry".
- **Start over.** The start cannot be edited once a route exists — swap it into the end slot, or use :ui[Cancel]{icon=x} to close the tool and re-open :ui[Create Route].

Every recompute re-centres the map to fit the whole route, and there is no way to hold your current view.

## The routing engine

Directions come from Apple Maps, so every request goes to Apple's servers. That has three consequences:

- The device needs a connection: routes cannot be computed offline.
- Route quality, road coverage, and geocoding match the Apple Maps app on the same device.
- Coverage is thinner in remote areas than in North America, Europe, or Japan.

The tool card reads "Routes provided by Apple Maps" while a route is on screen, and saving the route writes that attribution into the line's properties.

## Map overlays

Directions draws a green **A** pin at the start, a red **B** pin at the destination, and a line along every vertex Apple returns. The line is always the system blue — no setting changes it — and it draws above the map labels and above your saved lines and polygons, though saved pins still sit on top of it. The line style you pick in the save editor applies to the saved feature only, never to this overlay.

## Saving a route

The save button on the tool card — the download arrow, dimmed until a route is on screen — closes Directions and opens the route editor. :mac[On Mac the editor is titled **Save Route**.] :ios[On iPhone it is titled **Route Editor**.]

The editor pre-fills the name as "Start → End" from the reverse-geocoded endpoints, falling back to "Automobile — 12.3 km" when a name did not resolve, and takes a description and a destination [folder](/manual/layer-tree/#folders). Its line style starts from **Default Route Style**, so a saved route is orange by default rather than the blue of the overlay. Distance, travel time and transport type are shown and cannot be edited. Left blank, the description is saved as "Route via Apple Maps Directions".

The saved line keeps every vertex Apple returns, which for a detailed city route can be many hundreds of points, along with the start and end names, distance, travel time and transport type as properties. From then on it is an ordinary line: [measure](/manual/measurement/) it, restyle it, [export](/manual/vector-import-export/#supported-export-formats) it.

## FAQ

**Why was no route found?**

One of four things has usually happened:

- One endpoint is outside Apple's road coverage. See [The routing engine](#the-routing-engine).
- The start and end are on disconnected networks, such as two sides of a river with no bridge for miles.
- The mode is Walk and there is no pedestrian path between the points.
- The route is long enough to exceed Apple's internal limits, and the card reads "No route found between these points".

Try switching mode, moving an endpoint onto an actual road rather than open ground, or breaking the trip into shorter segments.

**Why is the route taking an unusual path?**

You are seeing Apple Maps' routing decisions. For driving, the router minimizes travel time, which can mean a detour to a highway even where a direct road exists, and it factors in tolls, one-ways and closures. For walking, it may follow major roads where footpaths are missing from Apple's data. TopoKit passes your request straight through and cannot adjust these preferences.

**Can I get step-by-step directions inside TopoKit?**

No. TopoKit keeps the route's shape — every vertex, the distance and the travel time — and discards the turn list, so a saved route holds nothing to replay as navigation. There is no hand-off to Apple Maps either; you enter the destination there yourself. Tapping the coordinate line on a feature's info card copies it, though Apple Maps will not accept the UTM form.

**Can I use the directions tool offline?**

Not to compute one: a request without a connection fails on the tool card. If you know where you are going, compute the route while online and save it as a line — once it is in your project it works offline like any other vector feature. See [The routing engine](#the-routing-engine).
