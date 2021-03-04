/**
 * Widgets layout constants.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { WIDGET_WIDTHS } from '../datastore/constants';

export const WIDTH_GRID_COUNTER_MAP = {
	[ WIDGET_WIDTHS.QUARTER ]: 3,
	[ WIDGET_WIDTHS.HALF ]: 6,
	[ WIDGET_WIDTHS.FULL ]: 12,
};

export const WIDTH_GRID_CLASS_MAP = {
	[ WIDGET_WIDTHS.QUARTER ]: [
		'mdc-layout-grid__cell',
		'mdc-layout-grid__cell--span-2-phone',
		'mdc-layout-grid__cell--span-3-desktop',
		'mdc-layout-grid__cell--span-4-tablet',
	],
	[ WIDGET_WIDTHS.HALF ]: [
		'mdc-layout-grid__cell',
		'mdc-layout-grid__cell--span-6-desktop',
		'mdc-layout-grid__cell--span-8-tablet',
	],
	[ WIDGET_WIDTHS.FULL ]: [
		'mdc-layout-grid__cell',
		'mdc-layout-grid__cell--span-12',
	],
};

export const HIDDEN_CLASS = 'googlesitekit-hidden';
