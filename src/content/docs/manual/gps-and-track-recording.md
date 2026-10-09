---
title: "GPS and recording tracks"
description: "Location permission, the location dot, the GPS tab, recording and saving tracks, recording profiles, and recovering a recording after a crash."
---
The GPS tab shows your position, a compass and five readings you choose, and records where you go as a track saved into the project.

:mac[On Mac, TopoKit records no tracks; the map shows your position and the tracks that sync in.]

## Location permissions

:::ios
On iPhone, TopoKit asks for access to your location while the app is in use, from the **Location** row of the introduction's permissions page ([The first launch](/manual/getting-started/#the-first-launch)), or, if that was skipped, the first time something needs your position, such as the GPS tab or the map's location button ([The map](/manual/interface/#the-map)).

With iOS's **Precise Location** switch off, iOS gives only approximate positions, and every profile except **Record All Fixes** rejects nearly every fix. A recording in that state shows a **Precise Location Off** banner whose **Settings** button opens TopoKit's page in iOS Settings.

With access denied, the GPS tab shows **Location Access Required** with an **Open Settings** button. Revoked during a recording, the tab shows a **Location Access Revoked** banner whose **Settings** button opens TopoKit's page in iOS Settings; the recording is not ended, and the pause button, **Stop Recording** and the trash button keep working, so the track can still be saved.
:::

:::mac
On Mac, only the map's location button and **View → Show My Location** (`Cmd-L`) ask for permission. Until you grant it, the map does not centre on you when it opens, and the Add Point card offers no current-location button. TopoKit reads no compass on the Mac, so there is no heading. Tracks recorded on iPhone reach the Mac through [iCloud sync](/manual/projects-and-files/#icloud-sync).
:::

## The location dot

:::ios
On iPhone, the map marks your position with an orange dot. A pointer on the dot shows the direction the phone faces. It is sharp when the compass is accurate to 10° or better and turns rounder and fainter as accuracy drops, reaching its faintest at 45° or worse. With no usable compass reading, or with Precise Location off, the dot has no pointer. A circle around the dot shows the fix's horizontal accuracy when that is worse than 5 m; at 5 m or better no circle is drawn.
:::

:::mac
On Mac, the map marks your position with the system's blue location dot, with no pointer.
:::

:::ios
## The GPS tab

The top of the tab holds latitude and longitude in the format set under [Settings → Units & Coordinates](/manual/settings/#units--coordinates); with UTM chosen, a single UTM line replaces them. The **H** and **V** pills give horizontal and vertical accuracy, green to 5 m, yellow to 15 m, orange to 50 m and red beyond. A grey dot and `--` mean iOS is not reporting that figure, most often vertical accuracy.

### The compass

The dial reads the iPhone's compass: it shows where the phone points, not your direction of travel, which is the **Course** reading, `--` while iOS reports none, as when you stand still.

**True N** and **Mag N** under the dial set the app-wide bearing, the same setting as **Settings → Units & Coordinates → Bearing**, so tapping **Mag N** here also changes which north the measuring tools start in ([Bearing](/manual/measurement/#bearing)).

### The stat slots

Tap one of the five slots' labels to choose its reading from nine. The defaults, top to bottom, are **Speed**, **Altitude**, **Course**, **Sunrise** and **Sunset**. **Speed**, **Altitude** and **Dist. Traveled** follow **Settings → Units & Coordinates → Units**, in km/h and metres or mph and feet.

- **Mag Declination**: the difference between true and magnetic north at your position, as a magnitude with **E** or **W**.
- **Last Fix**: the time of the newest fix, so a frozen readout can be told from a live one.
- **Heading Accuracy**: how far the compass could be off, in degrees; the same figure that softens the location dot's pointer.
- **Dist. Traveled**: an odometer for the tab, counting from when you open it whether or not you are recording, so it does not match the Speed card's **Distance**. It ignores fixes of 50 m or worse and any step of 500 m or more, and starts at zero each time you return to the tab.
- **Sunrise** and **Sunset**: worked out on the phone from your position and the date, shown in the phone's time zone rather than the local one at your position; "N/A" in polar day or night.

Tapping a coordinate, an accuracy pill, the compass or a stat's value copies it: a coordinate in the format shown, a stat with its unit, the compass heading from whichever north is set.

## Recording a track

1. Open the **GPS** tab.
2. Tap **Record Track**.
3. Tap the pause button for a rest break, and again to resume.
4. Tap **Stop Recording** when the track is finished.

A track records into an open project; with none open, **Record Track** asks you to open or create one from the [Projects tab](/manual/projects-and-files/). Recording tracks is part of the full app, checked only when a recording starts, so a recording under way always finishes and saves ([What asks you to unlock](/manual/your-topokit/#what-asks-you-to-unlock)).

The GPS tab stays red for as long as a recording runs, paused included, and the line under the buttons names the profile in use, adding "· Paused" whether you paused or auto-pause did. If 60 seconds pass without a fix being accepted, a **No recent GPS fixes** banner appears; the recording continues and points are added once the signal returns. Dismissing this banner or **Precise Location Off** hides it for the rest of that recording only, so the next recording shows it again; **Location Access Revoked** cannot be dismissed.

Every resume starts a new segment in the saved track, as does any gap longer than 60 seconds between accepted fixes, so the map draws no line across the part you did not record. The live red line on the map breaks at the same places while you record.

## Saving a track

**Stop Recording** pauses the recording and raises the **Recording Paused** alert, where **Cancel** resumes. **Delete Recording**, like the trash button, asks for confirmation first; deleted points cannot be recovered.

**Save Recording** opens the **Save Track** prompt, whose **Cancel** also resumes. Left blank, **Track name** names the track after the moment you tapped **Record Track**, such as "Track 2026-10-08 14:30". A recording in which no fix was accepted saves no track. The track goes into whichever project is open when you save, not the one open when you tapped **Record Track**; if the project was closed during the recording, saving creates a project named "Recorded Track" and the start date, such as "Recorded Track 2026-10-08".

The track goes to the top of the [Layers tab](/manual/layer-tree/) as a line feature, drawn in **Settings → Features → Tracks → Default Style** ([Features](/manual/settings/#features)); with **Randomize Colour** on, each track gets a random colour in place of the style's. The style is copied onto the track when it is saved, so changing it later does not restyle saved tracks.

## Background recording and recovery

A recording keeps running with the phone locked or another app in front, with the system's location indicator lit.

**Settings → Map → Keep Screen On** ([Map](/manual/settings/#map)) is off by default. **While Recording** keeps the screen on from **Record Track** until the track is saved or deleted, paused included; **Always** keeps it on whenever TopoKit is open, at a cost in battery.

TopoKit saves a snapshot of the track every 30 seconds or 100 metres, whichever comes first, and whenever you pause or leave the app. If iOS ends TopoKit, you force-quit it, or it crashes, the next launch raises a **Recover Track?** alert once your last project has opened, saying whether the track will go into the open project or a new one.

**Recover** adds the track to the open project, or to a new project named like "Recovered Track 2026-10-08". **Discard** deletes it. **Not Now** leaves it for the next launch. One recording is offered per launch, newest first. No alert appears for a track already saved into the open project before TopoKit ended, for a recording whose last point is more than 30 days old, or for a recovery file TopoKit cannot read.

A recovered track is named like "Track 2026-10-08 14:30 (Recovered)" and carries `track_recovered` set to `true`. TopoKit works its statistics out again from the points; its speeds and moving time come from the distance and time between points rather than the speed each fix reported, so they can differ slightly from what the cards showed.

## Recording profiles

The profile set at **Settings → GPS & Recording → Recording Profile** ([GPS & Recording](/manual/settings/#gps--recording)) is read when you tap **Record Track**, so a change takes effect on the next recording.

| Profile | Distance filter | Accuracy threshold | Jump threshold | Max velocity | Desired accuracy |
| --- | --- | --- | --- | --- | --- |
| Strict filter | 3 m | ≤15 m | 200 m | 15 m/s | Best available |
| Balanced (default) | 8 m | ≤50 m | 500 m | 40 m/s | Best available |
| Permissive | 20 m | ≤150 m | 1000 m | 150 m/s | Nearest 10 m |
| Record All Fixes | 0 m | none | none | none | Best available |

**Nearest 10 m** lets iOS use lower-power positioning, so Permissive draws less power; Strict filter and Balanced ask iOS for the same accuracy.

## Auto-pause

With **Settings → GPS & Recording → Auto-Pause When Stationary** on, a recording pauses itself once the reported speed stays below 0.5 m/s for 30 seconds, and resumes when you move at 1.0 m/s or more. The gap between the two thresholds keeps a slow stretch from pausing and resuming repeatedly. It is off by default.

Auto-pause reads the speed each fix reports, not the change in position, and is judged before the distance filter, so standing still is noticed even though those fixes are not recorded. Without it, receiver drift larger than the distance filter still gets through, and a water break adds a cluster of points at one spot.

## How fixes are filtered

Every fix passes four checks:

1. **Accuracy**: horizontal accuracy must be 0 or more and no worse than the profile's threshold. Record All Fixes skips the threshold but still rejects fixes iOS marks invalid.
2. **Age**: fixes older than 10 seconds are rejected on every profile, so a recording is never back-filled with cached positions after a signal gap.
3. **Distance**: a fix closer to the last point than half the profile's distance filter is dropped without counting as a rejection.
4. **Impossible jumps**: a fix is rejected only when its distance from the last point exceeds the jump threshold and its implied speed exceeds max velocity. A car at 80 mph is kept; a large shift while you stand still is not.

Rejections by checks 1, 2 and 4 are counted in the Time card's **Rejected** row, which appears once anything has been rejected.

## Trip statistics

Three cards and a chart appear when a recording starts and stay through pauses; once the track is saved or deleted they go, and the figures remain only in the saved track's card. They follow **Settings → Units & Coordinates → Units**, as the stat slots do.

- **Speed**: current, max, average and distance. The average is distance over moving time, so a rest does not drag it down.
- **Time**: total, moving, stopped and points. Moving time counts above 0.3 m/s, a lower bar than auto-pause's 0.5 m/s, and the total leaves out every second spent paused.
- **Elevation**: gain, loss, current, min and max, from the GPS altitude. Gain and loss count a change only once it reaches 2 m, so receiver jitter does not add climb to a flat walk.

Below the cards, a chart plots **Elevation** or **Speed** over distance. These are the altitudes the GPS reported; a saved track's elevation profile charts the terrain model instead ([The elevation profile](/manual/elevation/#the-elevation-profile)).
:::

## What a saved track carries

A saved track's properties hold the trip statistics, on iPhone and on any Mac it syncs to, in SI units, so a desktop GIS reads them without converting:

- `track_distance`, `track_duration`, `track_moving_time`, `track_stopped_time`: metres and seconds. `track_duration` leaves out paused time.
- `track_elevation_gain`, `track_elevation_loss`, `track_min_altitude`, `track_max_altitude`: metres.
- `track_max_speed`, `track_avg_speed`: metres per second; the average is over moving time.
- `track_point_count`, `track_segment_count`, `track_avg_accuracy` (metres).
- `track_recorded` and `track_end_time`: when **Record Track** was tapped and the time of the last fix, in ISO 8601.
- `track_profile`: the profile's internal identifier, `highPrecision` (Strict filter), `standard` (Balanced), `batterySaver` (Permissive) or `recordAll`.

Each point of the track also keeps its own altitude, time and horizontal accuracy, which GPX, KML, GeoJSON and GeoPackage exports can write per point ([Format by format](/manual/import-and-export/#format-by-format)). A track with one segment is saved as a LineString, and one with several as a MultiLineString.

Tapping a saved track opens [its card](/manual/search-and-identify/#the-card), which reads its figures from these properties and its points. The card's **Elevation profile** charts the terrain under the track rather than the recorded altitudes, so the profile's gain and loss can differ from the card's ([The elevation profile](/manual/elevation/#the-elevation-profile)).

## FAQ

:::ios
**Why does my track zigzag on a straight road?**
Every fix carries some position error, larger near buildings, under trees and in narrow valleys, and the filter keeps any fix within the profile's accuracy threshold.

**Why did my recording pause while I was still moving?**
It reads the speed iOS reports, which can be zero at a slow start or while you shuffle a few centimetres. Turning it off takes effect on the next recording, not the one in progress.

**What happens if my battery dies mid-recording?**
TopoKit treats it like a crash, and the next launch offers the track back ([Background recording and recovery](#background-recording-and-recovery)). The recovered track ends at the last snapshot, so up to 30 seconds or 100 metres before the phone died can be missing.
:::

**Why is a track's saved distance longer than a line drawn along it?**
`track_distance` is added up fix by fix while recording, so it includes the wander of the GPS path. Retracing the same route with Add Line follows the route itself and reads shorter.
