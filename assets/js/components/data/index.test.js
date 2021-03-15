/**
 * Legacy dataAPI tests.
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
import dataAPI from './index';
import { DATA_LAYER } from '../../util/tracking/constants';
import { getCacheKey } from './cache';
import { enableTracking } from '../../util/tracking';

describe( 'dataAPI', () => {
	let dataLayerPushSpy;
	const backupDatalayer = global[ DATA_LAYER ];
	const restoreDatalayer = () => global[ DATA_LAYER ] = backupDatalayer;

	beforeEach( () => {
		enableTracking();
		global[ DATA_LAYER ] = [];
		dataLayerPushSpy = jest.spyOn( global[ DATA_LAYER ], 'push' );
	} );

	// The global dataLayer shouldn't be significant between tests,
	// and ideally wouldn't even be necessary to touch,
	// but this makes sure this test leaves no trace.
	afterAll( restoreDatalayer );

	const errorResponse = {
		code: 'internal_server_error',
		message: 'Internal server error',
		data: { status: 500 },
	};

	describe( 'get', () => {
		const get = dataAPI.get.bind( dataAPI );

		it( 'should call trackEvent when an error is returned on get', async () => {
			fetchMock.getOnce(
				/^\/google-site-kit\/v1\/test-type\/test-identifier\/data\/test-datapoint/,
				{ body: errorResponse, status: 500 }
			);

			try {
				await get( 'test-type', 'test-identifier', 'test-datapoint' );
			} catch ( err ) {
				expect( console ).toHaveWarnedWith( 'WP Error in data response', 'method:GET', 'type:test-type', 'identifier:test-identifier', 'datapoint:test-datapoint', `error:"${ err.message }"` );
				expect( dataLayerPushSpy ).toHaveBeenCalledTimes( 1 );
				const [ event, eventName, eventData ] = dataLayerPushSpy.mock.calls[ 0 ][ 0 ];
				expect( event ).toEqual( 'event' );
				expect( eventName ).toEqual( 'GET:test-type/test-identifier/data/test-datapoint' );
				expect( eventData.event_category ).toEqual( 'api_error' );
				expect( eventData.event_label ).toEqual( 'Internal server error (code: internal_server_error)' );
				expect( eventData.value ).toEqual( 500 );
			}
		} );
	} );

	describe( 'set', () => {
		const set = dataAPI.set.bind( dataAPI );

		it( 'should call trackEvent when an error is returned on set', async () => {
			fetchMock.postOnce(
				/^\/google-site-kit\/v1\/test-type\/test-identifier\/data\/test-datapoint/,
				{ body: errorResponse, status: 500 }
			);

			try {
				await set( 'test-type', 'test-identifier', 'test-datapoint', {} );
			} catch ( err ) {
				expect( console ).toHaveWarnedWith( 'WP Error in data response', 'method:POST', 'type:test-type', 'identifier:test-identifier', 'datapoint:test-datapoint', `error:"${ err.message }"` );
				expect( dataLayerPushSpy ).toHaveBeenCalledTimes( 1 );
				const [ event, eventName, eventData ] = dataLayerPushSpy.mock.calls[ 0 ][ 0 ];
				expect( event ).toEqual( 'event' );
				expect( eventName ).toEqual( 'POST:test-type/test-identifier/data/test-datapoint' );
				expect( eventData.event_category ).toEqual( 'api_error' );
				expect( eventData.event_label ).toEqual( 'Internal server error (code: internal_server_error)' );
				expect( eventData.value ).toEqual( 500 );
			}
		} );
	} );

	describe( 'combinedGet', () => {
		const combinedGet = dataAPI.combinedGet.bind( dataAPI );
		const combinedRequest = [
			{
				type: 'test-type',
				identifier: 'test-identifier',
				datapoint: 'test-datapoint',
				data: { dateRange: 'last-99-days' },
			},
			{
				type: 'test-type',
				identifier: 'test-identifier',
				datapoint: 'test-datapoint-2',
				data: { dateRange: 'last-99-days' },
			},
			{
				type: 'test-type',
				identifier: 'analytics',
				datapoint: 'test-datapoint-3',
				data: { dateRange: 'last-99-days' },
			},

		];

		it( 'should not call trackEvent for no errors in combinedGet', async () => {
			fetchMock.postOnce(
				/^\/google-site-kit\/v1\/data/,
				{ body: {}, status: 200 }
			);

			await combinedGet( combinedRequest );

			expect( dataLayerPushSpy ).not.toHaveBeenCalled();
		} );

		it( 'should call trackEvent for error in combinedGet with one error', async () => {
			const cacheKey = getCacheKey( 'test-type', 'test-identifier', 'test-datapoint', { dateRange: 'last-99-days' } );
			const response = {
				body:
					{
						[ cacheKey ]: {
							code: 'internal_server_error',
							message: 'Internal server error',
							data: {
								reason: 'internal_server_error',
								status: 500,
							},
						},

					},
				status: 200,
			};

			fetchMock.post(
				/^\/google-site-kit\/v1\/data/,
				response
			);

			await combinedGet( combinedRequest );

			expect( console ).toHaveWarned();
			expect( dataLayerPushSpy ).toHaveBeenCalledTimes( 1 );
			const [ event, eventName, eventData ] = dataLayerPushSpy.mock.calls[ 0 ][ 0 ];
			expect( event ).toEqual( 'event' );
			expect( eventName ).toEqual( 'GET:test-type/test-identifier/data/test-datapoint' );
			expect( eventData.event_category ).toEqual( 'api_error' );
			expect( eventData.event_label ).toEqual( 'Internal server error (code: internal_server_error, reason: internal_server_error)' );
			expect( eventData.value ).toEqual( 500 );
		} );

		it( 'should call trackEvent for each error in combinedGet with multiple errors', async () => {
			const cacheKey = getCacheKey( 'test-type', 'test-identifier', 'test-datapoint', { dateRange: 'last-99-days' } );
			const cacheKey2 = getCacheKey( 'test-type', 'analytics', 'test-datapoint-3', { dateRange: 'last-99-days' } );
			const response = {
				body:
					{
						[ cacheKey ]: {
							code: 'internal_server_error',
							message: 'Internal server error',
							data: {
								reason: 'internal_server_error',
								status: 500,
							},
						},
						[ cacheKey2 ]: {
							code: 'unknown_error',
							message: 'Unknown error',
							data: {
								reason: 'unknown_error',
								status: 503,
							},
						},
					},
				status: 200,
			};

			fetchMock.post(
				/^\/google-site-kit\/v1\/data/,
				response
			);
			await combinedGet( combinedRequest );
			expect( console ).toHaveWarned();
			expect( dataLayerPushSpy ).toHaveBeenCalledTimes( 2 );
			let [ event, eventName, eventData ] = dataLayerPushSpy.mock.calls[ 0 ][ 0 ];
			expect( event ).toEqual( 'event' );
			expect( eventName ).toEqual( 'GET:test-type/test-identifier/data/test-datapoint' );
			expect( eventData.event_category ).toEqual( 'api_error' );
			expect( eventData.event_label ).toEqual( 'Internal server error (code: internal_server_error, reason: internal_server_error)' );
			expect( eventData.value ).toEqual( 500 );
			[ event, eventName, eventData ] = dataLayerPushSpy.mock.calls[ 1 ][ 0 ];
			expect( event ).toEqual( 'event' );
			expect( eventName ).toEqual( 'GET:test-type/analytics/data/test-datapoint-3' );
			expect( eventData.event_category ).toEqual( 'api_error' );
			expect( eventData.event_label ).toEqual( 'Unknown error (code: unknown_error, reason: unknown_error)' );
			expect( eventData.value ).toEqual( 503 );
		} );
	} );
} );
