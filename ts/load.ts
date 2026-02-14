/**
 * jsTrack: web-based Tracker (https://physlets.org/tracker/). Get position data from objects in a video.
 * Copyright (C) 2018 Luca Demian
 */

import { master } from './globals';
import { hideLoader } from './functions';

export function loadVideo(file: File | Blob, callback: (() => void) | null = null): void {
  master.videoFile = file;
  master.timeline.video.src = URL.createObjectURL(file);
  if (callback !== null) {
    master.timeline.video.addEventListener('playing', callback);
  }
}

export function loadProject(file: File, callback: (() => void) | null = null): void {
  const fileUrl = URL.createObjectURL(file);
  JSZipUtils.getBinaryContent(fileUrl, function (err: Error | null, data: ArrayBuffer) {
    if (err) {
      throw err;
    }

    JSZip.loadAsync(data).then(function (zipData: JSZip) {
      if (zipData.files['video.mp4'] !== undefined) {
        zipData
          .file('video.mp4')
          .async('blob')
          .then(function (videoBlob: Blob) {
            loadVideo(videoBlob, function () {
              if (zipData.files['meta.json'] !== undefined) {
                zipData
                  .file('meta.json')
                  .async('text')
                  .then(function (projectJson: string) {
                    master.load(JSON.parse(projectJson));
                    hideLoader();
                    master.saved = true;
                    master.trigger('created');
                    if (callback !== null) callback();
                  });
              }
            });
          });
      }
    });
  });
}

export function hideLaunchModal(): void {
  const container = document.getElementById('modal-container');
  if (container) {
    container.classList.remove('active');
    container.classList.remove('launch');
  }
  const launch = document.getElementById('launch');
  if (launch) launch.classList.remove('active');

  const helpFab = document.getElementById('help-fab');
  if (helpFab) helpFab.remove();
  const githubFab = document.getElementById('github-fab');
  if (githubFab) githubFab.remove();
  const paypalFab = document.getElementById('paypal-fab');
  if (paypalFab) paypalFab.remove();

  keyboardJS.resume();
}

export interface BackupData {
  name: string;
  data: Record<string, unknown>;
}

export let dataLoaded: BackupData | false = false;

export function setDataLoaded(value: BackupData | false): void {
  dataLoaded = value;
}
