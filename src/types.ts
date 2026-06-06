/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ToolMode = 'ruler' | 'protractor' | 'ring-size' | 'grid' | 'unit-converter' | 'printable' | 'guides';

export interface CalibrationData {
  ppi: number; // Pixels per physical inch (default: 96)
  calibrated: boolean;
  method: 'default' | 'card' | 'coin' | 'manual' | 'preset';
  presetName?: string;
}

export interface DragGuide {
  id: string;
  positionPx: number; // relative to container
  orientation: 'horizontal' | 'vertical';
  label?: string;
}

export interface UnitDefinition {
  id: 'cm' | 'mm' | 'inch' | 'px';
  name: string;
  symbol: string;
  ratioToInch: number; // e.g. 1 inch = 2.54 cm, 1 inch = 25.4 mm, 1 inch = 96 px
}

export interface RingSizeData {
  usa: string;
  uk: string;
  europe: string;
  japan: string;
  diameterMm: number;
}

export interface UnitConversionValue {
  cm: string;
  mm: string;
  inch: string;
  px: string;
  yard: string;
  foot: string;
  meter: string;
}

export interface WebPresetScreen {
  name: string;
  ppi: number;
  diagonal: string;
  deviceType: 'laptop' | 'monitor' | 'tablet' | 'phone';
}
