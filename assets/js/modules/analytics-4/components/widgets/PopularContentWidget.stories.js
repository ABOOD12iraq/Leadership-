/**
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

/**
 * Internal dependencies
 */
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { MODULES_ANALYTICS_4 } from '../../datastore/constants';
import {
	provideKeyMetrics,
	provideModules,
} from '../../../../../../tests/js/utils';
import { withWidgetComponentProps } from '../../../../googlesitekit/widgets/util';
import {
	STRATEGY_ZIP,
	getAnalytics4MockResponse,
	provideAnalytics4MockReport,
} from '../../utils/data-mock';
import { replaceValuesInAnalytics4ReportWithZeroData } from '../../../../../../.storybook/utils/zeroReports';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';
import PopularContentWidget from './PopularContentWidget';

const reportOptions = {
	startDate: '2020-08-11',
	endDate: '2020-09-07',
	dimensions: [ 'pagePath' ],
	metrics: [ { name: 'screenPageViews' } ],
	orderby: [
		{
			metric: { metricName: 'screenPageViews' },
			desc: true,
		},
	],
	limit: 3,
};

const pageTitlesReportOptions = {
	startDate: '2020-08-11',
	endDate: '2020-09-07',
	dimensionFilters: {
		pagePath: new Array( 3 )
			.fill( '' )
			.map( ( _, i ) => `/test-post-${ i + 1 }/` )
			.sort(),
	},
	dimensions: [ 'pagePath', 'pageTitle' ],
	metrics: [ { name: 'screenPageViews' } ],
	orderby: [ { metric: { metricName: 'screenPageViews' }, desc: true } ],
	limit: 15,
};

const WidgetWithComponentProps =
	withWidgetComponentProps( 'test' )( PopularContentWidget );

const Template = ( { setupRegistry, ...args } ) => (
	<WithRegistrySetup func={ setupRegistry }>
		<WidgetWithComponentProps { ...args } />
	</WithRegistrySetup>
);

export const Ready = Template.bind( {} );
Ready.storyName = 'Ready';
Ready.args = {
	setupRegistry: ( registry ) => {
		const pageTitlesReport = getAnalytics4MockResponse(
			pageTitlesReportOptions,
			// Use the zip combination strategy to ensure a one-to-one mapping of page paths to page titles.
			// Otherwise, by using the default cartesian product of dimension values, the resulting output will have non-matching
			// page paths to page titles.
			{ dimensionCombinationStrategy: STRATEGY_ZIP }
		);

		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetReport( pageTitlesReport, {
				options: pageTitlesReportOptions,
			} );

		provideAnalytics4MockReport( registry, reportOptions );
	},
};
Ready.scenario = {
	label: 'KeyMetrics/PopularContentWidget/Ready',
	delay: 250,
};

export const Loading = Template.bind( {} );
Loading.storyName = 'Loading';
Loading.args = {
	setupRegistry: ( { dispatch } ) => {
		dispatch( MODULES_ANALYTICS_4 ).startResolution( 'getReport', [
			reportOptions,
		] );
	},
};

export const ZeroData = Template.bind( {} );
ZeroData.storyName = 'Zero Data';
ZeroData.args = {
	setupRegistry: ( { dispatch } ) => {
		const report = getAnalytics4MockResponse( reportOptions );
		const zeroReport =
			replaceValuesInAnalytics4ReportWithZeroData( report );

		dispatch( MODULES_ANALYTICS_4 ).receiveGetReport( zeroReport, {
			options: reportOptions,
		} );
	},
};
ZeroData.scenario = {
	label: 'KeyMetrics/PopularContentWidget/ZeroData',
	delay: 250,
};

export const Error = Template.bind( {} );
Error.storyName = 'Error';
Error.args = {
	setupRegistry: ( { dispatch } ) => {
		const errorObject = {
			code: 400,
			message: 'Test error message. ',
			data: {
				status: 400,
				reason: 'badRequest',
			},
			selectorData: {
				storeName: 'modules/analytics-4',
				name: 'getReport',
				args: [ reportOptions ],
			},
		};

		dispatch( MODULES_ANALYTICS_4 ).receiveError(
			errorObject,
			'getReport',
			[ reportOptions ]
		);

		dispatch( MODULES_ANALYTICS_4 ).finishResolution( 'getReport', [
			reportOptions,
		] );
	},
};
Error.scenario = {
	label: 'KeyMetrics/PopularContent/Error',
	delay: 250,
};

export default {
	title: 'Key Metrics/PopularContentWidget',
	decorators: [
		( Story, { args } ) => {
			const setupRegistry = ( registry ) => {
				provideModules( registry, [
					{
						slug: 'analytics-4',
						active: true,
						connected: true,
					},
				] );

				registry.dispatch( CORE_USER ).setReferenceDate( '2020-09-08' );

				provideKeyMetrics( registry );

				// Call story-specific setup.
				args.setupRegistry( registry );
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
};
