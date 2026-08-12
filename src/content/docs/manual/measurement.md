---
title: "Measuring"
description: "Measure distance, area, bearings, and circles with the shape tools, and know how far to trust the numbers."
---
Every shape tool (:ui[Add Line]{icon=add-line}, :ui[Add Polygon]{icon=add-polygon}, and :ui[Add Circle]{icon=add-circle}) shows live measurements as you draw: length and bearing for lines, area and perimeter for polygons, and radius, area, and circumference for circles. Tapping a value copies it. Saving the shape adds it to your project, cancelling discards it, and neither keeps the numbers: the measurements are display-only.

For placing and editing vertices and the [tool card](/manual/interface/#the-map)'s other controls, see [Map tools](/manual/map-tools/) and [Points, lines, polygons and circles](/manual/points-lines-polygons/).

<video src="/media/measurement-live-measurements.mp4" autoplay loop muted playsinline aria-label="Drawing a shape while the tool card updates its live measurements, then tapping a value to copy it"></video>

## Circles and the radius lock

Creating a circle takes two taps: the **centre**, then a **point on the edge**. Tapping again replaces the edge point, so the circle resizes live instead of starting over. The **lock** button, which appears only while drawing a circle, freezes the current radius. With the radius locked, tapping elsewhere or dragging the **centre** moves the whole circle at that fixed radius. Dragging the **edge** handle only slides the handle along the rim: the centre stays put and the radius cannot change. Undoing the edge vertex clears the lock.

## Units

All measurements are dictated from the defaults set in Settings → Units & Coordinates. Switching the **Units** picker between metric and imperial resets these defaults to km / mi and km² / mi². The defaults set the units a new measurement opens in; while measuring, tap the unit abbreviation beside a value on the tool card to change units on the spot. That menu offers metric and imperial units alike, whatever the **Units** picker is set to. Choosing one converts every value of that quantity on the card, and lasts only until you finish the measurement — the next one opens in your defaults again.

## Bearing

While drawing a line, the tool card shows the bearing of the **last segment**, computed as the forward azimuth and normalized to 0–360° clockwise from north. The last segment is the final pair of vertices in the sequence, which is not the pair you placed most recently if you have tapped back and inserted mid-line. Three display modes are available from the picker next to the bearing line:

- **True North (TN)**: the geodetic bearing from the true pole.
- **Magnetic North (MN)**: the true bearing minus the current **magnetic declination**, read from the iPhone's magnetometer.
- **Back Bearing (BB)**: true bearing plus 180°, the direction to walk to return the way you came.

Declination changes across the Earth's surface and drifts with time, so the magnetic bearing for the same segment changes as you move. It is recomputed on every compass sample rather than fixed when you start the line. Magnetic North needs a magnetometer, so the menu shows it as **Magnetic North (iOS only)** and disables it on Mac; if declination is ever unavailable the card falls back to the true bearing.

## Calculation methods

This section explains how every number TopoKit reports is calculated, for anyone reconciling them against survey notes, reports, or another instrument.

### Distance

Every distance TopoKit reports — line length, polygon perimeter, circle radius, track distance, elevation-profile distance — follows the **curvature of the Earth**, not a flat straight line. For a line with N vertices, the reported distance is the sum of the N − 1 segment distances: a chain distance, not a straight line from first to last. That figure comes from Apple's Core Location rather than TopoKit's own code: every segment is measured with the system's distance function, `CLLocation.distance(from:)`. [Apple documents it](https://developer.apple.com/documentation/corelocation/cllocation/distance%28from:%29) as following the Earth's curvature, but publishes neither the algorithm nor an error bound. Its figures match an ellipsoidal geodesic and agree with handheld survey receivers to within a fraction of a percent over everyday distances. If a figure has to stand up in a legal or official context, measure it again in dedicated survey software. TopoKit's numbers are field estimates.

### Area and perimeter

Area is an **approximation**: TopoKit projects the polygon onto a local flat plane centred on its centroid (a local equirectangular projection) and applies the planar [Shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula), the standard surveyor's formula for the area of a polygon from its corner coordinates. This is accurate for small-to-medium polygons up to tens of kilometres across. For very large polygons (regional or continental scale) the approximation degrades, but the error depends on shape and latitude more than on size alone: compact, roughly symmetric polygons stay within about 0.1% even at 1,000 km across, while elongated or lopsided polygons at higher latitudes can be off by a few percent at a few hundred kilometres and by much more at continental scale. The area calculation also treats the Earth as a perfect sphere of radius 6,371 km, which adds a small bias no matter how big the polygon is: roughly 0.45% too large at the equator, about 0.23% too small at 45°, and about 0.89% too small at the poles.

**Area and perimeter on the same card come from different earth models.** Perimeter is measured exactly like line distance: the closed ring is a chain of segments, each measured with the same curvature-following distance function as lines, and summed. Area, as described above, comes from a perfect sphere.

### Circles

The radius is measured from centre to edge point with the same distance function as lines; area and circumference are the analytic πr² and 2πr from it. When rendered or saved, the circle becomes a 64-point ring whose vertices are spaced at equal bearings around the centre, so it is a true circle on the ground rather than a screen-space one. Near the poles or at very large radii it looks elongated on a Mercator map; that is correct behaviour.

The ring is placed with a spherical formula while the radius comes from that distance function, so the drawn ring and the reported radius disagree by up to about 0.7%. The drawn ring does not pass exactly through the edge point you set, and its true ground radius differs slightly from the figure on the card. For a circle you intend to report on, trust the readout rather than measuring the exported ring.

## FAQ

**Why doesn't my distance match my handheld GPS?**
The most common cause is that the handheld reports a spherical great-circle distance while TopoKit uses a geodesic distance; the difference is typically under 0.5% for short routes but adds up over long ones. A second cause is that the handheld may show distance along a recorded **track**, where GPS noise adds path length, while TopoKit shows the straight-segment sum between the vertices you placed.

**Why does my area seem off for a very large polygon?**
The local-projection approximation distorts at large extents, more so for elongated or high-latitude shapes (see [Area and perimeter](#area-and-perimeter)). Split large areas, or measure them in a desktop GIS.

**Are the measurement numbers saved with the feature?**
For shapes you draw, no: the geometry, name, description, style, folder, and photos are stored, but the live distance, area, and perimeter figures are display-only. You do not have to retrace the feature to see them again, though: open :ui[Edit Vertices on Map]{icon=add-line} on a saved line or polygon and the tool card shows the vertex count alongside its current length or area, and a line's [elevation profile](/manual/elevation/) shows its length in the **Distance** stat.

**Is a recorded track's distance saved?**
Yes. A track saves its own statistics as feature properties, including `track_distance`. That figure is the distance accumulated fix by fix while recording, not a re-measurement of the saved line, so it includes the wander of the GPS path and will read higher than retracing the same route with the line tool.
