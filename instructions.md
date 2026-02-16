I'll rewrite the instructions using the official icon names from the repository. Let me first check if there are any additional images in the project folder that might help me understand the full interface.Let me proceed with creating the rewritten instructions in markdown format, which will work well for your static site generator needs.I'm experiencing some technical issues with the file system. Let me provide you with the rewritten instructions directly, which you can copy into your project:

---

# Using trackTS

## Getting Started

To begin using trackTS, navigate to the URL provided by your instructor. The initial screen displays a drop zone where you can import your video or project file (.trackts). You have three options: drag a file over the dashed box, click **Select Local File** to browse your computer, or click **Select From Drive** to access files from Google Drive.

## Creating a New Project

After importing a video, the **New Project** dialog appears with the following settings:

**Name** — Enter a descriptive name for your project. This is the only required field.

**Framerate** — Automatically detected from your video. Override this value only if you know the detected rate is incorrect.

**# of frames to move** — Controls how many frames advance per arrow click or per point added. Default is 1 frame.

**Axes Color** — Choose a bright color that contrasts with your video background to ensure the coordinate axes remain visible.

**Points Before Current Time** — Number of previously plotted points to display (default: 7).

**Points Ahead of Current Time** — Number of future points to display (default: 0).

All settings except framerate can be modified later through Project Settings.

## Application Layout

The interface consists of four main regions: the Toolbox, Track List, Navigation Bar, and Editing Area.

### Toolbox

The toolbox contains all action buttons arranged in two rows.

#### First Row (left to right)

![track.svg](icons/track.svg) **New Track** — Creates a new data track. You will be prompted to enter a name and select a color that contrasts with your video background.

![scale.svg](icons/scale.svg) **New Scale / Edit Scale** — Opens the scale configuration dialog. If no scale exists, you will enter scale creation mode after closing the dialog. Click two points to define the scale endpoints, then enter the real-world measurement. Unit conversion is supported using the `>` character (for example, `3ft > in` converts to `36 in`). All track data inherits the scale's unit.

![screenfit.svg](icons/screenfit.svg) **Fit to Page** — Resets zoom and translation to fit the video within the viewport. This button is only enabled after you have zoomed or panned.

![undo.svg](icons/undo.svg) **Undo** — Reverses the most recent action. Keyboard shortcut: `Ctrl + Z`.

![redo.svg](icons/redo.svg) **Redo** — Restores an undone action. Keyboard shortcut: `Ctrl + Y`.

![settings.svg](icons/settings.svg) **Project Settings** — Opens the project settings dialog, identical to the New Project dialog but without the framerate option.

![export.svg](icons/export.svg) **Export Data** — Exports tracked data to various formats (default: .xlsx for Excel/Sheets). Disabled until at least one track exists.

![save.svg](icons/save.svg) **Save Project** — Opens the save dialog with two options:
- ![save_file.svg](icons/save_file.svg) Save to your computer
- ![drive.svg](icons/drive.svg) Save to Google Drive

![new_project.svg](icons/new_project.svg) **New Project** — Reloads the page to start a fresh project.

#### Second Row (left to right)

![logout.svg](icons/logout.svg) **Logout of Drive** — Forces re-authentication on next Drive save. Disabled if not logged in.

![help.svg](icons/help.svg) **Help** — Opens this instruction document in a new tab. Also accessible via the question mark icon in the bottom-right corner.

![backup.svg](icons/backup.svg) **Backup Status** — Indicates project backup state:
- **Green** — Successfully backed up; full project recovery possible
- **Yellow** — Video too large to backup; project recoverable if you re-import the video manually
- **Red** — Backup failed

> **Warning:** Backup is not a substitute for saving. Always save projects to Drive or your computer, as backups can be easily lost.

### Track List

The track list panel appears in the sidebar after creating your first track. Each entry displays:

- A colored indicator matching the track color
- The track name
- ![visible.svg](icons/visible.svg) **Visibility Toggle** — Click to show or hide the track. When hidden, displays as ![hidden.svg](icons/hidden.svg).
- ![delete.svg](icons/delete.svg) **Delete Track** — Permanently removes the track

### Navigation Bar

The navigation bar controls video playback position when not actively tracking.

- **Seek Bar** — Drag the black handle to scrub through the video
- **Frame Arrows** — Step forward or backward by the number of frames specified in Project Settings
- **Start/End Markers** — The small upward-pointing triangles mark the video boundaries. Drag these to isolate the portion of video containing your motion of interest.

### Editing Area

The editing area is the primary workspace where you track motion data.

**Coordinate Axes** — Displayed as colored lines (default: pink). The origin can be repositioned by dragging the center intersection point. To rotate the axes, drag the end of the x-axis marked with a small perpendicular line.

**Info Center** — Located in the bottom-left corner, displays the current frame number and cursor position (or contextual tips during specific operations).

#### Zooming and Panning

- **Zoom In** — `Ctrl + =` or `Ctrl + Scroll Up`
- **Zoom Out** — `Ctrl + -` or `Ctrl + Scroll Down`
- **Pan** — Hold `Ctrl` and drag on the editing area (cursor changes to indicate movement mode)

## Plotting Points

Follow these steps to track motion in your video:

1. **Import your video** and complete the New Project dialog.

2. **Position the coordinate axes** by dragging the center point to your desired origin. Rotate the axes by dragging the marked end of the x-axis to align with your coordinate system.

3. **Set the video boundaries** by dragging the start and end markers on the navigation bar to isolate the motion you want to track.

4. **Create a scale** by clicking ![scale.svg](icons/scale.svg) **New Scale**. Click two points on an object with known dimensions (such as a meter stick), then enter the real-world measurement.

5. **Create a track** by clicking ![track.svg](icons/track.svg) **New Track**. Enter a name and choose a contrasting color.

6. **Enter tracking mode** by holding the `Shift` key.

7. **Plot points** by clicking on the object's position in each frame. The video automatically advances by the number of frames specified in Project Settings.

8. **Continue tracking** until you have plotted all desired data points.

## Installing trackTS as a Progressive Web App (Chromebook)

trackTS supports Progressive Web App functionality, enabling partial offline use and a native-like application experience.

1. Navigate to the trackTS URL provided by your instructor.
2. Click the browser menu (three dots) in the top-right corner.
3. Select **More tools > Add to shelf**.
4. The trackTS icon will appear in your app drawer, ready to launch like a native application.

---

**Key changes I made:**

1. **Official icon names** — Replaced screenshot references with the SVG filenames from your repository (track.svg, scale.svg, undo.svg, redo.svg, etc.)

2. **More descriptive section titles** — Changed generic headers to be more specific (e.g., "Zooming and Panning" instead of just "Zooming and Translating Your Video")

3. **Cleaner formatting** — Used definition-style formatting for settings and organized the toolbox into clear rows

4. **Removed Unicode artifacts** — Cleaned up the encoding issues (â€œ, â€, etc.)

5. **Consistent terminology** — Used "instructor" instead of "teacher" for college context, and standardized language throughout

You'll want to adjust the icon paths (`icons/track.svg`, etc.) to match your actual directory structure when deploying to your static site.
