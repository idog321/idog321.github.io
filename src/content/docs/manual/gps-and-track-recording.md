---
title: "GPS and recording tracks"
description: "Location permission, the location dot, the GPS tab, recording and saving tracks, recording profiles, and recovering a recording after a crash."
---
:mac[On Mac, TopoKit records no tracks; the map shows your position and the tracks that [sync in](/manual/projects-and-files/#icloud-sync) from iPhone.]

## Location permissions

:::ios
On iPhone, TopoKit asks for access to your location while the app is in use, from the introduction's permissions page ([The first launch](/manual/getting-started/#the-first-launch)) or, if that was skipped, the first time something needs your position.

With iOS's **Precise Location** switch off, iOS gives only approximate positions, and every profile except **Record All Fixes** rejects nearly every fix. A recording in that state shows a **Precise Location Off** banner whose **Settings** button opens TopoKit's page in iOS Settings.

With access denied, the GPS tab shows **Location Access Required** with an **Open Settings** button. Revoked during a recording, the tab shows a **Location Access Revoked** banner whose **Settings** button opens TopoKit's page in iOS Settings; the recording is not ended and can still be paused, stopped and saved, or deleted.
:::

:::mac
On Mac, only the map's location button and **View → Show My Location** (`Cmd-L`) ask for permission. Until you grant it, the map does not centre on you when it opens, and the Add Point card offers no :ui[location]{icon=location} button.
:::

## The location dot

:::ios
On iPhone, the map marks your position with an orange dot. A pointer on the dot shows the direction the phone faces. It is sharp when the compass is accurate to 10° or better and turns rounder and fainter as accuracy drops, reaching its faintest at 45° or worse. With no usable compass reading, or with Precise Location off, the dot has no pointer. A circle around the dot shows the fix's horizontal accuracy when that is worse than 5 m.
:::

:::mac
On Mac, the map marks your position with the system's blue location dot. TopoKit reads no compass on the Mac, so the dot has no pointer and there is no heading.
:::

:::ios
## The GPS tab

The top of the tab holds latitude and longitude, or a single UTM line, in the format set under [Settings → Units & Coordinates](/manual/settings/#units--coordinates). The **H** and **V** pills give horizontal and vertical accuracy, green to 5 m, yellow to 15 m, orange to 50 m and red beyond. A grey dot and `--` mean iOS is not reporting that figure, most often vertical accuracy.

### The compass

The dial reads the iPhone's compass: it shows where the phone points, not your direction of travel, which is the **Course** reading, `--` while iOS reports none, as when you stand still.

**True N** and **Mag N** under the dial are the same setting as **Settings → Units & Coordinates → Bearing**, so tapping **Mag N** here also changes which north the measuring tools start in ([Bearing](/manual/measurement/#bearing)).

### The stat slots

Tap a slot's label to choose its reading from nine.

- **Dist. Traveled**: counts from when you open the tab, recording or not, and starts at zero each time you return to it, so it does not match the Speed card's **Distance**. It ignores fixes of 50 m or worse and any step of 500 m or more.
- **Mag Declination**: the declination **Mag N** subtracts from a true bearing, read from the phone's compass and shown in degrees with **E** or **W**.
- **Sunrise** and **Sunset**: worked out on the phone from your position and the date, shown in the phone's time zone rather than the local one at your position; "N/A" in polar day or night.

Tapping a coordinate, an accuracy pill, the compass or a stat's value copies it: a coordinate in the format shown, a stat with its unit, the compass heading from whichever north is set.

## Recording a track

1. Open the **GPS** tab.
2. Tap **Record Track**.
3. Tap the pause button for a rest break, and again to resume.
4. Tap **Stop Recording** when the track is finished.

A track records into an open project; with none open, **Record Track** asks you to open or create one from the [Projects tab](/manual/projects-and-files/#creating-a-project). Recording tracks is part of the full app ([What asks you to unlock](/manual/your-topokit/#what-asks-you-to-unlock)).

While a recording runs, paused included, the line under the buttons names the profile in use, adding "· Paused" whether you paused or auto-pause did. If 60 seconds pass without a fix being accepted, a **No recent GPS fixes** banner appears; the recording continues. Dismissing this banner or **Precise Location Off** hides it for the rest of that recording only; **Location Access Revoked** cannot be dismissed.

Every resume starts a new segment in the saved track, as does any gap longer than 60 seconds between accepted fixes, so the map draws no line across the part you did not record.

## Saving a track

**Stop Recording** pauses the recording and raises the **Recording Paused** alert, where **Cancel** resumes. **Delete Recording**, like the trash button beside the pause button, asks for confirmation, and a deleted recording cannot be recovered.

**Save Recording** opens the **Save Track** prompt, whose **Cancel** also resumes. Left blank, **Track name** names the track after the moment you tapped **Record Track**, such as "Track 2026-10-08 14:30". A recording in which no fix was accepted saves no track. The track goes into whichever project is open when you save, not the one open when you tapped **Record Track**; if the project was closed during the recording, saving creates a project named "Recorded Track" and the start date, such as "Recorded Track 2026-10-08".

The track goes to the top of the [Layers tab](/manual/layer-tree/) as a line feature, drawn in **Settings → Features → Tracks → Default Style** ([Features](/manual/settings/#features)). The style is copied onto the track when it is saved, so changing it later does not restyle saved tracks.

## Background recording and recovery

A recording keeps running with the phone locked or another app in front, with the system's location indicator lit.

To keep the screen on from **Record Track** until the track is saved or deleted, paused included, set **Settings → Map → Keep Screen On** ([Map](/manual/settings/#map)) to **While Recording**.

TopoKit saves a snapshot of the track every 30 seconds or 100 metres, whichever comes first, and whenever you pause or leave the app. If iOS ends TopoKit, you force-quit it, it crashes or the battery dies, the next launch raises a **Recover Track?** alert once your last project has opened.

**Recover** adds the track to the open project, or to a new project named like "Recovered Track 2026-10-08". **Discard** deletes it. **Not Now** leaves it for the next launch. One recording is offered per launch, newest first. No alert appears for a track already saved into the open project before TopoKit ended, for a recording whose last point is more than 30 days old, or for a recovery file TopoKit cannot read.

A recovered track is named like "Track 2026-10-08 14:30 (Recovered)" and carries `track_recovered` set to `true`. TopoKit works its statistics out again from the points, so its speeds and moving time can differ slightly from what the cards showed.

## Recording profiles

The profile set at **Settings → GPS & Recording → Recording Profile** ([GPS & Recording](/manual/settings/#gps--recording)) is read when you tap **Record Track**, so a change takes effect on the next recording.

| Profile | Distance filter | Accuracy threshold | Jump threshold | Max velocity | Desired accuracy |
| --- | --- | --- | --- | --- | --- |
| Strict filter | 3 m | ≤15 m | 200 m | 15 m/s | Best available |
| Balanced (default) | 8 m | ≤50 m | 500 m | 40 m/s | Best available |
| Permissive | 20 m | ≤150 m | 1000 m | 150 m/s | Nearest 10 m |
| Record All Fixes | 0 m | none | none | none | Best available |

**Nearest 10 m** lets iOS use lower-power positioning, so Permissive draws less power.

## Auto-pause

With **Settings → GPS & Recording → Auto-Pause When Stationary** on, a recording pauses itself once the reported speed stays below 0.5 m/s for 30 seconds, and resumes when you move at 1.0 m/s or more.

Auto-pause reads the speed each fix reports, not the change in position, and is judged before the distance filter, so standing still is noticed even though those fixes are not recorded.

## How fixes are filtered

Every fix passes four checks:

1. **Accuracy**: horizontal accuracy must be 0 or more and no worse than the profile's threshold. Record All Fixes skips the threshold but still rejects fixes iOS marks invalid.
2. **Age**: fixes older than 10 seconds are rejected on every profile, so a recording is never back-filled with cached positions after a signal gap.
3. **Distance**: a fix closer to the last point than half the profile's distance filter is dropped without counting as a rejection.
4. **Impossible jumps**: a fix is rejected only when its distance from the last point exceeds the jump threshold and its implied speed exceeds max velocity.

Rejections by checks 1, 2 and 4 are counted in the Time card's **Rejected** row, which appears once anything has been rejected.

## Trip statistics

Three cards and a chart appear when a recording starts and stay through pauses; once the track is saved or deleted they go, and the figures remain only in the saved track's card.

- **Speed**: the average is distance over moving time, so a rest does not drag it down.
- **Time**: moving time counts above 0.3 m/s, a lower bar than auto-pause's 0.5 m/s, and the total leaves out every second spent paused.
- **Elevation**: every figure comes from the GPS altitude, and gain and loss count a change only once it reaches 2 m, so receiver jitter does not add climb to a flat walk.
:::

## What a saved track carries

A saved track's properties hold the trip statistics, on iPhone and on any Mac it syncs to, in SI units, so a desktop GIS reads them without converting:

- `track_distance`, `track_duration`, `track_moving_time`, `track_stopped_time`: metres and seconds. `track_duration` leaves out paused time.
- `track_elevation_gain`, `track_elevation_loss`, `track_min_altitude`, `track_max_altitude`: metres.
- `track_max_speed`, `track_avg_speed`: metres per second; the average is over moving time.
- `track_point_count`, `track_segment_count`, `track_avg_accuracy` (metres).
- `track_recorded` and `track_end_time`: when **Record Track** was tapped and the time of the last fix, in ISO 8601.
- `track_profile`: the profile's internal identifier, `highPrecision` (Strict filter), `standard` (Balanced), `batterySaver` (Permissive) or `recordAll`.

Each point of the track also keeps its own altitude, time and horizontal accuracy ([Format by format](/manual/import-and-export/#format-by-format)). A track with one segment is saved as a LineString, and one with several as a MultiLineString.

On a saved track's [card](/manual/search-and-identify/#the-card), **Elevation profile** charts the terrain under the track rather than the recorded altitudes, so the profile's gain and loss can differ from the card's ([The elevation profile](/manual/elevation/#the-elevation-profile)).

## FAQ

:::ios
**Why did my recording pause while I was still moving?**
iOS can report a speed of zero at a slow start or while you shuffle a few centimetres. Turning auto-pause off takes effect on the next recording, not the one in progress.
:::

**Why does my track zigzag on a straight road?**
Every fix within the profile's accuracy threshold is kept, so on Balanced a fix reporting 40 m accuracy still joins the track. Strict filter keeps only fixes of 15 m or better.

**Why is a track's saved distance longer than a line drawn along it?**
`track_distance` is added up fix by fix while recording, so it includes the wander of the GPS path. Retracing the same route with Add Line follows the route itself and reads shorter.
