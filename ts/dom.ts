/**
 * jsTrack: web-based Tracker (https://physlets.org/tracker/). Get position data from objects in a video.
 * Copyright (C) 2018 Luca Demian
 */

import { sidebar } from './globals';
import { drawGraphics } from './index';
import { handleFiles } from './handlefiles';
import { showLoader } from './functions';

interact('#sidebar')
  .resizable({
    edges: { left: true },
    restrictEdges: {
      outer: 'parent',
      endOnly: true,
    },
    restrictSize: {
      min: { width: 400 },
      max: { width: window.innerWidth - 300 },
    },
    inertia: true,
  })
  .on('resizemove', function (event: InteractEvent) {
    const target = event.target;
    target.style.width = event.rect.width + 'px';
    const vis = document.getElementById('sidebar-visibility');
    if (vis) vis.style.right = event.rect.width + 'px';
  })
  .on('resizeend', function () { drawGraphics(); });

const sidebarEl = document.getElementById('sidebar');
const panelMove = dragula(sidebarEl ? [sidebarEl] : [], {
  direction: 'vertical',
  moves: function (el: HTMLElement, _source: HTMLElement, handle: HTMLElement) {
    if (!handle.classList.contains('handle-bar')) {
      return false;
    } else {
      handle.style.cursor = 'grabbing';
      return true;
    }
  },
});

let scroll = 0;
let scrollInterval: ReturnType<typeof setInterval> | null = null;
panelMove
  .on('drag', function (el: HTMLElement) {
    const handleBar = el.querySelector('.handle-bar') as HTMLElement | null;
    if (handleBar) handleBar.style.cursor = 'grabbing';
    scrollInterval = setInterval(function () {
      const mirror = document.querySelector('.gu-mirror');
      if (!mirror) return;
      const position = mirror.getBoundingClientRect();

      if (panelMove.dragging) {
        if (position.top < 100) {
          scroll = -1;
        } else if (position.top > window.innerHeight - 100) {
          scroll = 1;
        } else {
          scroll = 0;
        }
      } else {
        scroll = 0;
      }
      const sidebarScroll = document.getElementById('sidebar');
      if (sidebarScroll) sidebarScroll.scrollTop += scroll * 20;
    }, 100);
  })
  .on('dragend', function (el: HTMLElement) {
    const handleBar = el.querySelector('.handle-bar') as HTMLElement | null;
    if (handleBar) handleBar.style.cursor = 'grab';
    if (scrollInterval !== null) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  });

let resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawGraphics, 250);
  const vis = document.getElementById('sidebar-visibility');
  if (vis) vis.style.right = sidebar.offsetWidth + 'px';
});

// ─── File drop area ───

const dropArea = document.getElementById('file-drop-area');
if (dropArea) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
    dropArea.addEventListener(
      eventName,
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
    document.body.addEventListener(
      eventName,
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  });

  ['dragenter', 'dragover'].forEach(function (eventName) {
    dropArea.addEventListener(
      eventName,
      function () {
        dropArea.classList.add('highlight');
      },
      false
    );
  });

  ['dragleave', 'drop'].forEach(function (eventName) {
    dropArea.addEventListener(
      eventName,
      function () {
        dropArea.classList.remove('highlight');
      },
      false
    );
  });

  dropArea.addEventListener(
    'drop',
    function (e: DragEvent) {
      showLoader();
      const dt = e.dataTransfer;
      if (dt) {
        const files = dt.files;
        handleFiles(files);
      }
    },
    false
  );
}

const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
if (fileInput) {
  fileInput.addEventListener('change', function (this: HTMLInputElement) {
    if (this.files) {
      handleFiles(this.files);
      showLoader();
    }
  });
}
