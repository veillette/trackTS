/**
 * jsTrack: web-based Tracker (https://physlets.org/tracker/). Get position data from objects in a video.
 * Copyright (C) 2018 Luca Demian
 */

import { master, canvas, saveProject } from './globals';
import { drawGraphics } from './index';

keyboardJS.pause();
keyboardJS.on(
  'shift',
  function (e: KeyboardJSEvent) {
    e.preventRepeat();
    if (master.track !== null && master.track !== undefined) {
      master.state.mode = 'add';
      for (const uid in master.trackList) {
        master.trackList[uid].state.mode = 'add';
      }
    }
  },
  function () {
    if (master.track !== null && master.track !== undefined) {
      master.state.reset();
      for (const uid in master.trackList) {
        master.trackList[uid].state.resetMode();
      }
    }
  }
);

keyboardJS.on(
  's',
  function (e: KeyboardJSEvent) {
    e.preventRepeat();
    master.state.mode = 'seek';
  },
  function () {
    master.state.reset();
  }
);

keyboardJS.on(['delete', 'backspace'], function () {
  if (master.track !== undefined && master.track !== null) {
    if (master.track.selectedPoint !== null && master.track.selectedPoint !== undefined) {
      master.track.selectedPoint.shape.dispatchEvent(new Event('dblclick'));
    }
  }
});

keyboardJS.on(['up', 'down', 'right', 'left'], function (e: KeyboardJSEvent) {
  const bg = master.background as createjs.Bitmap & { w: number; h: number };
  const newPos = { x: master.positioning.x, y: master.positioning.y };

  switch (e.key) {
    case 'ArrowLeft':
      newPos.x += 20;
      break;
    case 'ArrowRight':
      newPos.x -= 20;
      break;
    case 'ArrowUp':
      newPos.y += 20;
      break;
    case 'ArrowDown':
      newPos.y -= 20;
      break;
  }

  if (newPos.x + bg.w < canvas.width) {
    newPos.x = canvas.width - bg.w;
  }
  if (newPos.x > 0 && bg.w > canvas.width) {
    newPos.x = 0;
  }
  if (newPos.y + bg.h < canvas.height) {
    newPos.y = canvas.height - bg.h;
  }
  if (newPos.y > 0 && bg.h > canvas.height) {
    newPos.y = 0;
  }

  if (bg.w > canvas.width) {
    master.positioning.x = newPos.x;
    master.positioning.stuck = false;
  }
  if (bg.h > canvas.height) {
    master.positioning.y = newPos.y;
    master.positioning.stuck = false;
  }
});

keyboardJS.on(['ctrl + =', 'ctrl + +', 'cmd + =', 'cmd + +'], function (e: KeyboardJSEvent) {
  e.preventDefault();
  master.positioning.zoom += 0.01;
});

keyboardJS.on(['ctrl + -', 'cmd + -'], function (e: KeyboardJSEvent) {
  e.preventDefault();
  if (master.positioning.zoom > 0.02) master.positioning.zoom -= 0.01;
  else master.positioning.zoom = 0.01;
});

keyboardJS.on(['=', '+'], function () {
  master.positioning.zoom += 0.05;
});

keyboardJS.on('-', function () {
  if (master.positioning.zoom > 0.1) master.positioning.zoom -= 0.05;
  else master.positioning.zoom = 0.05;
});

keyboardJS.on(['ctrl + 0', 'cmd + 0'], function (e: KeyboardJSEvent) {
  e.preventDefault();
  master.positioning.zoom = 1;
  master.positioning.autoZoom = true;
  master.positioning.stuck = true;
  drawGraphics();
  const el = document.getElementById('screen-fit-button');
  if (el) el.classList.add('disabled');
});

keyboardJS.on(
  'ctrl',
  function (e: KeyboardJSEvent) {
    e.preventRepeat();
    master.state.mode = 'positioning';
  },
  function () {
    master.state.reset();
  }
);

keyboardJS.on(['ctrl+z', 'cmd+z'], function () {
  master.undo();
});

keyboardJS.on(['ctrl+y', 'cmd+y'], function () {
  master.redo();
});

keyboardJS.on(['ctrl+s', 'cmd+s'], function (e: KeyboardJSEvent) {
  e.preventRepeat();
  e.preventDefault();
  saveProject.show();
});
