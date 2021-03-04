/**
 * `calculateOverviewData` helper.
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
import { calculateChange } from '../../../util';

/**
 * Calculates the report data.
 *
 * @since 1.8.0
 *
 * @param {Array} reports Report data.
 * @return {Object} Report data.
 */
const calculateOverviewData = ( reports ) => {
	if ( ! reports || ! reports.length ) {
		return false;
	}

	const { totals } = reports[ 0 ].data;
	const lastMonth = totals[ 0 ].values;
	const previousMonth = totals[ 1 ].values;

	const totalSessions = lastMonth[ 1 ];
	const averageBounceRate = lastMonth[ 2 ];
	const averageSessionDuration = lastMonth[ 3 ];
	const goalCompletions = lastMonth[ 4 ];
	const totalPageViews = lastMonth[ 5 ];
	const totalSessionsChange = calculateChange( previousMonth[ 1 ], lastMonth[ 1 ] );
	const averageBounceRateChange = calculateChange( previousMonth[ 2 ], lastMonth[ 2 ] );
	const averageSessionDurationChange = calculateChange( previousMonth[ 3 ], lastMonth[ 3 ] );
	const goalCompletionsChange = calculateChange( previousMonth[ 4 ], lastMonth[ 4 ] );
	const totalPageViewsChange = calculateChange( previousMonth[ 5 ], lastMonth[ 5 ] );
	return {
		totalSessions,
		averageBounceRate,
		averageSessionDuration,
		totalSessionsChange,
		averageBounceRateChange,
		averageSessionDurationChange,
		goalCompletions,
		goalCompletionsChange,
		totalPageViews,
		totalPageViewsChange,
	};
};

export default calculateOverviewData;
