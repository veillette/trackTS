/**
 * jsTrack: web-based Tracker (https://physlets.org/tracker/). Get position data from objects in a video.
 * Copyright (C) 2018 Luca Demian
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 */

import '../functions';
import type { Project } from './project';
import type { Coordinate } from './axes';

interface ScaleProcessedValue {
  textValue: string;
  size: MathJsUnit;
}

export class Scale {
  stage: createjs.Stage;
  project: Project;
  color: string;
  nodeSize: number;
  positions: [Coordinate, Coordinate];
  textValue: string;
  size: MathJsUnit;
  hitArea: createjs.Shape;
  nodes: [createjs.Shape, createjs.Shape];
  length: number;
  line: createjs.Shape;
  lineStart: createjs.GraphicsCommand;
  lineEnd: createjs.GraphicsCommand;
  textSizingElement: HTMLSpanElement;
  letterWidth: number;
  textElement: HTMLInputElement;
  text: createjs.DOMElement;
  textHitShape: createjs.Shape;
  textHit: createjs.GraphicsCommand;
  uid: string;
  styleCommands: { colors: createjs.GraphicsCommand[] };

  constructor(
    stage: createjs.Stage,
    size: string | null,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    project: Project
  ) {
    this.stage = stage;
    this.project = project;
    this.color = color;
    this.nodeSize = 8;
    this.uid = (Math.round(Math.random() * 100000000) + 1).toString();
    this.positions = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ];
    if (size === null || size === undefined) {
      this.textValue = math.unit('1m').toString();
      this.size = math.unit('1m');
    } else {
      const valueProcessed = this.processValue(size);
      if (valueProcessed !== false) {
        this.textValue = valueProcessed.textValue;
        this.size = valueProcessed.size;
      } else {
        this.textValue = math.unit('1m').toString();
        this.size = math.unit('1m');
      }
    }

    this.hitArea = new createjs.Shape();
    this.hitArea.graphics
      .beginFill(this.color)
      .drawRect(-1, -1, this.nodeSize + 2, this.nodeSize + 2);
    this.nodes = [new createjs.Shape(), new createjs.Shape()];
    this.nodes[0].hitArea = this.hitArea;
    this.nodes[1].hitArea = this.hitArea;
    this.nodes[0].regX = this.nodeSize / 2;
    this.nodes[1].regX = this.nodeSize / 2;
    this.nodes[0].regY = this.nodeSize / 2;
    this.nodes[1].regY = this.nodeSize / 2;
    this.styleCommands = { colors: [] };
    this.styleCommands.colors[0] = this.nodes[0].graphics.beginStroke(this.color).command;
    this.styleCommands.colors[1] = this.nodes[1].graphics.beginStroke(this.color).command;
    this.nodes[0].graphics.drawEllipse(0, 0, this.nodeSize, this.nodeSize);
    this.nodes[1].graphics.drawEllipse(0, 0, this.nodeSize, this.nodeSize);
    this.nodes[0].cursor = 'pointer';
    this.nodes[1].cursor = 'pointer';
    const scaled1 = this.project.toUnscaled(x1, y1);
    const scaled2 = this.project.toUnscaled(x2, y2);
    this.nodes[0].x = scaled1.x;
    this.nodes[1].x = scaled2.x;
    this.nodes[0].y = scaled1.y;
    this.nodes[1].y = scaled2.y;

    this.length = Math.sqrt(
      Math.pow(this.positions[0].y - this.positions[1].y, 2) +
        Math.pow(this.positions[0].x - this.positions[1].x, 2)
    );
    this.line = new createjs.Shape();
    this.line.graphics.setStrokeStyle('2');
    this.styleCommands.colors.push(this.line.graphics.beginStroke(this.color).command);
    this.lineStart = this.line.graphics
      .moveTo(this.nodes[0].x, this.nodes[0].y)
      .command;
    this.lineEnd = this.line.graphics.lineTo(this.nodes[1].x, this.nodes[1].y).command;
    this.line.graphics.endStroke();

    this.textSizingElement = document.createElement('span');
    this.textSizingElement.innerText = this.textValue;
    this.textSizingElement.classList.add('scale-text');
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) mainContainer.appendChild(this.textSizingElement);
    this.letterWidth =
      this.textSizingElement.getBoundingClientRect().width / this.textValue.length;
    this.textSizingElement.remove();

    this.textElement = document.createElement('input');
    if (mainContainer) mainContainer.appendChild(this.textElement);
    this.textElement.classList.add('scale-text');
    this.textElement.classList.add('not-editing');
    this.textElement.type = 'text';
    this.textElement.readOnly = true;
    this.textElement.style.border = '2px ' + this.color + ' solid';
    this.textElement.style.color = this.color;
    this.textElement.style.width = this.letterWidth * this.textValue.length + 'px';
    this.textElement.value = this.textValue;
    this.text = new createjs.DOMElement(this.textElement);

    this.textHitShape = new createjs.Shape();
    this.textHit = this.textHitShape.graphics
      .drawRect(
        this.text.x - this.text.regX,
        this.text.y - this.text.regY,
        this.text.offsetWidth,
        this.text.offsetHeight
      )
      .command;

    this.stage.addChild(this.textHitShape);
    this.stage.addChild(this.text);
    this.stage.addChild(this.line);
    this.stage.addChild(this.nodes[0]);
    this.stage.addChild(this.nodes[1]);

    this.update();
    this.stage.update();
    this.project.update();

    const _scale = this;
    this.textElement.addEventListener('focus', function () {
      if (_scale.textElement.readOnly) {
        _scale.textElement.blur();
      }
    });

    ['startEditing', 'dblclick'].forEach(function (value) {
      _scale.textElement.addEventListener(value, function () {
        _scale.textElement.classList.add('editing');
        _scale.textElement.classList.remove('not-editing');
        _scale.textElement.readOnly = false;
        _scale.textElement.value = math.format(_scale.size).toString();
        _scale.update();
      });
    });

    ['change', 'keypress', 'keyup'].forEach(function (value) {
      _scale.textElement.addEventListener(value, function (e) {
        if (
          (value !== 'keypress' && value !== 'keyup') ||
          (e as KeyboardEvent).key === '13'
        ) {
          _scale.update(_scale.textElement.value);
          _scale.textElement.classList.remove('editing');
          _scale.textElement.classList.add('not-editing');
          _scale.textElement.blur();
          _scale.textElement.readOnly = true;
        } else {
          _scale.update();
        }
      });
    });
    _scale.stage.addEventListener('click', function (e: createjs.MouseEvent) {
      const mouseCoords = _scale.textHitShape.globalToLocal(e.stageX, e.stageY);
      if (mouseCoords.x > _scale.textElement.offsetWidth) {
        _scale.update(_scale.textElement.value);
        _scale.textElement.classList.remove('editing');
        _scale.textElement.classList.add('not-editing');
        _scale.textElement.blur();
        _scale.textElement.readOnly = true;
      }
    });

    this.nodes[0].addEventListener('pressmove', function (e: createjs.MouseEvent) {
      const coords = e.target.stage.globalToLocal(e.stageX, e.stageY);
      _scale.nodes[0].x = coords.x;
      _scale.nodes[0].y = coords.y;

      const scaledCoord = _scale.project.toScaled(coords);
      _scale.positions[0] = scaledCoord;

      _scale.update();
      _scale.stage.update();
    });
    this.nodes[1].addEventListener('pressmove', function (e: createjs.MouseEvent) {
      const coords = e.target.stage.globalToLocal(e.stageX, e.stageY);
      _scale.nodes[1].x = coords.x;
      _scale.nodes[1].y = coords.y;

      const scaledCoord = _scale.project.toScaled(coords);
      _scale.positions[1] = scaledCoord;

      _scale.update();
      _scale.stage.update();
    });

    this.nodes[0].addEventListener('pressup', function () {
      _scale.project.update();
      _scale.project.changed();
    });
    this.nodes[1].addEventListener('pressup', function () {
      _scale.project.update();
      _scale.project.changed();
    });
  }

  show(): void {
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) mainContainer.appendChild(this.textElement);
    this.stage.addChild(this.textHitShape);
    this.stage.addChild(this.text);
    this.stage.addChild(this.line);
    this.stage.addChild(this.nodes[0]);
    this.stage.addChild(this.nodes[1]);
    this.update();
  }

  hide(): void {
    this.stage.removeChild(this.textHitShape);
    this.stage.removeChild(this.text);
    this.stage.removeChild(this.line);
    this.stage.removeChild(this.nodes[0]);
    this.stage.removeChild(this.nodes[1]);
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) mainContainer.removeChild(this.textElement);
  }

  updateInfo(data: Record<string, string>): void {
    for (const key in data) {
      switch (key) {
        case 'color':
          this.color = data[key];
          this.textElement.style.color = this.color;
          this.textElement.style.border = '2px ' + this.color + ' solid';
          for (let i = 0; i < this.styleCommands.colors.length; i++) {
            this.styleCommands.colors[i].style = this.color;
          }
          this.project.changed();
          break;
      }
    }
  }

  unit(): string {
    return this.size.units[0].unit.name;
  }

  processValue(value: string): ScaleProcessedValue | false {
    const returnData: Partial<ScaleProcessedValue> = {};
    if (value.length > 0) {
      try {
        if (value.split('>').length > 1) {
          const split = value.split('>');
          math.unit(split[0].trim());
          returnData.size = math.unit(split[0].trim()).to(split[split.length - 1].trim());
          returnData.textValue = math
            .format(returnData.size, { notation: 'auto', precision: 6 })
            .toString();
        } else {
          returnData.size = math.unit(value);
          returnData.textValue = math
            .format(math.unit(value), { notation: 'auto', precision: 6 })
            .toString();
        }
      } catch {
        return false;
      }
    } else {
      return false;
    }
    return returnData as ScaleProcessedValue;
  }

  update(value: string = this.textValue): void {
    const _scale = this;

    if (value !== _scale.textValue) {
      let valueProcessed = this.processValue(value);

      if (!valueProcessed) {
        valueProcessed = this.processValue(value.trim() + ' m');
      }

      if (valueProcessed !== false) {
        if (valueProcessed.size.value !== null) {
          const oldInfo = {
            size: _scale.size,
            textValue: _scale.textValue,
          };

          _scale.size = valueProcessed.size;
          _scale.textValue = valueProcessed.textValue;

          const newInfo = {
            size: _scale.size,
            textValue: _scale.textValue,
          };

          if (oldInfo.size.toString() !== newInfo.size.toString()) {
            _scale.project.change({
              undo: function () {
                _scale.update(oldInfo.size.toString());
              },
              redo: function () {
                _scale.update(newInfo.size.toString());
              },
            });
          }
          _scale.project.update();

          _scale.textElement.value = _scale.textValue;
        } else {
          _scale.textElement.value = _scale.textValue;
        }
      } else {
        _scale.textElement.value = _scale.textValue;
      }
    }

    _scale.lineStart.x = _scale.nodes[1].x;
    _scale.lineStart.y = _scale.nodes[1].y;
    _scale.lineEnd.x = _scale.nodes[0].x;
    _scale.lineEnd.y = _scale.nodes[0].y;
    _scale.length = Math.sqrt(
      Math.pow(_scale.positions[0].y - _scale.positions[1].y, 2) +
        Math.pow(_scale.positions[0].x - _scale.positions[1].x, 2)
    );

    _scale.textElement.style.width =
      _scale.letterWidth * _scale.textElement.value.length + 'px';

    if (
      (_scale.nodes[0].x < _scale.nodes[1].x && _scale.nodes[0].y < _scale.nodes[1].y) ||
      (_scale.nodes[1].x < _scale.nodes[0].x && _scale.nodes[1].y < _scale.nodes[0].y)
    ) {
      _scale.text.regX = 0;
      _scale.text.regY = _scale.textElement.offsetHeight;
      _scale.text.x =
        _scale.nodes[1].x + (_scale.nodes[0].x - _scale.nodes[1].x) / 2;
      _scale.text.y =
        _scale.nodes[1].y + (_scale.nodes[0].y - _scale.nodes[1].y) / 2;
    } else {
      _scale.text.regX = _scale.textElement.offsetWidth;
      _scale.text.regY = _scale.textElement.offsetHeight;
      _scale.text.x =
        _scale.nodes[1].x + (_scale.nodes[0].x - _scale.nodes[1].x) / 2;
      _scale.text.y =
        _scale.nodes[1].y + (_scale.nodes[0].y - _scale.nodes[1].y) / 2;
    }

    if (
      Math.abs(
        (_scale.nodes[1].y - _scale.nodes[0].y) / (_scale.nodes[1].x - _scale.nodes[0].x)
      ) < 0.4
    ) {
      _scale.text.regX = _scale.textElement.offsetWidth * 0.5;
      _scale.text.regY = _scale.textElement.offsetHeight;
      _scale.text.x =
        _scale.nodes[1].x + (_scale.nodes[0].x - _scale.nodes[1].x) / 2;
      _scale.text.y =
        _scale.nodes[1].y + (_scale.nodes[0].y - _scale.nodes[1].y) / 2;
    }

    _scale.textHit.x = _scale.text.x - _scale.text.regX;
    _scale.textHit.y = _scale.text.y - _scale.text.regY;
    _scale.textHit.w = _scale.textElement.offsetWidth;
    _scale.textHit.h = _scale.textElement.offsetHeight;
    _scale.stage.update();
  }

  convert(
    pixels: number,
    unit: MathJsUnit = math.unit(this.unit())
  ): { number: number } {
    const mathUnit = math
      .unit(
        (math.multiply(pixels, math.divide(this.size, this.length) as number) as unknown as string)
      )
      .to(unit.toString());
    return { number: mathUnit.toNumber(unit.toString()) };
  }
}
