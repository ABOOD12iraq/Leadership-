/**
 * Report utilities.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
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

// TODO: Add tests.
/**
 * Checks whether the report data is empty or not.
 *
 * @since n.e.x.t
 *
 * @param {Object} report Report data object.
 * @return {(boolean|undefined)} Returns undefined if in the loading state, true if the report has no data or missing data, otherwise false.
 */
export function isZeroReport( report ) {
	if ( report === undefined ) {
		return undefined;
	}

	if (
		! report?.rows?.length ||
		! report?.totals?.[ 0 ]?.metricValues?.length
	) {
		return true;
	}

	// false means there _is_ value report data
	return ! report.totals.some( ( totals ) =>
		totals.metricValues.some( ( { value } ) => value > 0 )
	);
}
