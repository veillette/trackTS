/**
 * jsTrack: web-based Tracker (https://physlets.org/tracker/). Get position data from objects in a video.
 * Copyright (C) 2018 Luca Demian
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 */

import type { Timeline } from './timeline';
import type { Point } from './point';

export class Frame {
  time: number;
  number: number;
  timeline: Timeline;
  uid: string;
  points: Point[];

  constructor(timeline: Timeline, time: number, number: number) {
    this.time = time;
    this.number = number;
    this.timeline = timeline;
    this.uid = (Math.round(Math.random() * 100000) + 1).toString();
    this.points = [];
  }
}
