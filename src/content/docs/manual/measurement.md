---
title: "Measuring"
description: "What the figures on the tool card are, which units they use, and how TopoKit calculates each one."
---
Drawing and measuring are one tool. :ui[Add Line]{icon=add-line}, :ui[Add Polygon]{icon=add-polygon}, :ui[Add Circle]{icon=add-circle} and :ui[Add Route] show their figures on the tool card while you draw, and saving is optional: cancelling closes the tool without adding anything to the project. Placing and moving vertices is in [Moving, adding and deleting vertices](/manual/points-lines-polygons/#moving-adding-and-deleting-vertices).

The line, polygon and circle tools need an open project even when you only measure; a [route](/manual/routes/) started from a card does not. Drawing and measuring are part of the [full app](/manual/your-topokit/#what-asks-you-to-unlock).

## Live measurements

Figures appear once the shape has enough points: two for a line or a route, three for a polygon, a centre and an edge point for a circle.

Tapping a figure copies the number as the card shows it, rounded, with the device's thousands separator and decimal mark (`1,234.5`) and without its unit; a bearing copies with its degree sign, as three digits (`045°`). A route's figures have no unit menu and do not copy.

A saved line, polygon or circle keeps none of the card's figures: tapping it opens its [card](/manual/search-and-identify/#the-card), which measures it again, and a copy from that card carries the unit. A saved circle is a polygon, so that card shows **Area** and **Perimeter** and no **Radius**. A [saved route](/manual/routes/#saving-a-route) keeps its distance and travel time as properties.

## Circles and the radius lock

Until the circle is locked, dragging its centre moves the centre alone and changes the radius, and a tap or a drag of the edge point resizes it ([Circles](/manual/points-lines-polygons/#circles)).

![The circle tool card: unlocked, dragging the edge point resizes the circle; with the lock on, dragging the centre moves the whole circle and Radius stays at 180 m.](/media/circle-radius-lock.svg)

The lock button becomes active once the circle has a radius, and locking freezes that radius. With the lock on, a tap elsewhere or a drag of the centre moves the whole circle at the fixed radius, the edge point keeping its bearing from the centre; dragging the edge point slides it round the rim. The readout and the ring both come from the radius captured at locking, so the figure does not change however far the circle moves, and unlocking leaves it as it was.

Locking and unlocking are [undo steps](/manual/interface/#while-a-tool-is-open) of their own, **Lock Size** and **Unlock Size**, so Undo straight after locking unlocks the circle at the same size. A move made while locked undoes with the lock still on.

## Units

**Settings → Units & Coordinates → Measuring Tools Start With** holds the **Distance** and **Area** pickers, which set the units a line, polygon or circle card opens in. **Distance** also covers perimeter, radius and circumference. The two pickers offer only the units of the system the **Units** picker names, and switching **Units** between **Metric** and **Imperial** resets them to km and km², or mi and mi². The rows are listed in [Settings](/manual/settings/#units--coordinates).

While measuring, the unit after a figure is a menu offering metric and imperial units alike, whatever **Units** says. Choosing one converts every figure of that kind on the card and does not change the defaults. Feet, miles, square feet and acres are built on the international foot of exactly 0.3048 m.

Every other distance and area TopoKit shows follows the **Units** picker alone and picks its scale by size: m below 1,000 m, then km; ft below 1,000 ft, then mi; m², ha and km², or ft², acres and mi². That covers a route's distance, the **Edit Vertices on Map** card, the elevation profile, a saved feature's card and the segment lengths on the map.

## Bearing

A line's card shows the bearing of its last segment, 0–360° clockwise from north, to the whole degree. The last segment is the final pair of points in the line's order, which is not the pair you placed most recently if you added points after an earlier one. The mode tag after the figure (**TN**, **MN** or **BB**) opens the menu:

- **True North**: the initial great-circle bearing from true north, calculated on a sphere rather than the ellipsoid.
- **Magnetic North**: the true bearing minus the magnetic declination at your position, taken from the difference between the true and magnetic headings the compass reports. Declination is read where you stand, so a line drawn far away still uses your local declination, and it is recomputed on every compass reading.
- **Back Bearing**: the true bearing plus 180°, the direction back the way you came.

A line opens in True North unless **Settings → Units & Coordinates → Bearing** names another mode; switching **Units** leaves it as it is. :ios[On iPhone, the **True N** / **Mag N** switch under the [GPS tab's compass](/manual/gps-and-track-recording/#the-compass) sets the same default.]

:ios[On iPhone, Magnetic North needs location access: until the first compass reading after a location fix, the menu shows **Magnetic North (needs your location)** and greys it.] :mac[On Mac, which has no compass, the menu shows **Magnetic North (iOS only)** and greys it, and Settings does not offer it.] If Magnetic North is the default and no declination has arrived, the card shows the true bearing under the **MN** tag.

## Segment lengths

While you draw a line or polygon, and while you edit a saved one with **Edit Vertices on Map**, each segment shows its length on the map, a polygon's closing side included. A label appears only where its text fits inside the segment on screen, so zooming in shows more of them; where two would overlap, the longer segment keeps its label. Circles and routes have none: a route's would measure the straight line between two stops, not the road.

**Settings → Units & Coordinates → Show Segment Lengths** turns them off; the faint dots between points stay.

## Calculation methods

Each figure on the card has its own earth model: lengths, perimeters and radii are Apple's ellipsoidal distance summed segment by segment; area is measured on the WGS84 ellipsoid through an equal-area projection; a circle's area and circumference are the flat-plane πr² and 2πr of its radius, while its ring is placed on the ellipsoid by Vincenty's direct formula, so the vertices sit at the radius the card shows.

### Distance

Every distance TopoKit reports, a track's and an elevation profile's included, follows the curvature of the Earth, and a line's length is the chain of its segment distances summed point to point. Altitude never enters a distance, so a line up a steep slope reads its map distance, shorter than the distance walked.

The distance function is Apple's Core Location ([`CLLocation.distance(from:)`](https://developer.apple.com/documentation/corelocation/cllocation/distance%28from:%29)); Apple publishes neither its algorithm nor an error bound.

A route's distance is the same chain, measured along the road line Apple Maps returns rather than taken from Apple's own figure, so it matches the distance on the route's profile. A leg Apple finds no road for counts as the straight distance between its two stops. The travel time is Apple's estimate for the road legs only, so a straight leg adds distance but no time.

### Area and perimeter

TopoKit measures area on the WGS84 ellipsoid: it projects the polygon onto a plane with a Lambert azimuthal equal-area projection centred on the polygon, then applies the [Shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula). Because the projection is equal-area, it adds no error that grows with the polygon's size or latitude. A 1° by 1° cell between 45° and 46° N, its sides densified to follow the parallels and meridians, measures within two parts in 100,000 of its exact ellipsoidal area.

The one approximation is the sides. Each side is a straight line between its two vertices on that plane rather than a geodesic, and the difference grows with the side's length. To make a long side follow a particular line, such as a parallel, add points along it.

Perimeter is summed segment by segment with the same distance function as a line, so it follows the Earth's curve along each side, while area takes each side as a straight line on the equal-area plane.

### Circles

The radius is measured from centre to edge point with the same distance function as lines; area and circumference are the flat-plane πr² and 2πr from it. On the curved Earth a circle of that radius is slightly smaller than those formulas give, so both figures read a little high, more so as the radius grows.

When drawn or saved, the circle becomes a ring of 64 vertices at equal bearings round the centre, the first due north, each placed on the WGS84 ellipsoid at the card's radius by Vincenty's direct formula. It is a true circle on the ground rather than one drawn on the screen, so near the poles or at very large radii it looks stretched on the map.

The ring's sides are straight between vertices, so between two vertices it lies just inside the true circle, and it passes through your edge point only when that point lies on one of the 64 bearings.

## FAQ

**Why doesn't my distance match my handheld GPS?**
If the handheld's figure is a recorded track's distance, it includes the wander of every fix ([GPS FAQ](/manual/gps-and-track-recording/#faq)). Where both measure the same points, the remaining difference is the earth model and altitude: TopoKit's distances follow the [ellipsoid](#distance) and leave altitude out.
