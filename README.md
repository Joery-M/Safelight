# Safelight

This is my attempt at a video editor using Vue.

### Goal

My main goal is for a user to be able to load up the website, make a project, insert video clips, maybe trim it a bit, add some text, whatever floats their boat.
And then be able to export the video in usable formats like H264, HEVC, AV1 or VP9 (Depending on the browser of course)

My second goal is to allow the user to make plugins that add functionality to the editor (like VSCode extensions).

This would allow users to create extensions for:

-   Adding graphs with [chart.js](https://www.chartjs.org/) or [D3.js](https://d3js.org/)
-   Motion tracking with [tracking.js](https://trackingjs.com/)
-   3D rendering with [threejs](https://threejs.org/)
-   Speech recognition using the [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)

And for my last goal, I wan't this project to be able to run in different environments.
Like, it should be possible to turn this into an [Electron](https://www.electronjs.org/) app and use full [FFmpeg](https://ffmpeg.org/) to be able to export in special formats like [DCP](https://en.wikipedia.org/wiki/Digital_Cinema_Package).

Or maybe use a server and have multiple people work on the same projects and store media in centralized storage.

But I'm getting ahead of myself.
