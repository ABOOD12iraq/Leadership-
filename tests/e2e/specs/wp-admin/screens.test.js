/**
 * Screens test.
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

/**
 * WordPress dependencies
 */
import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { enableFeature, setupSiteKit } from '../../utils';

describe( 'screen tests', () => {
	describe( 'page title test for googlesitekit-user-input screen', () => {
		it( 'ensures that the page title element for the googlesitekit-user-input screen starts with the expected value, indicating that non-null but non-existent parent_slug screen properties are not breaking the page title text', async () => {
			await enableFeature( 'userInput' );

			await setupSiteKit();

			await visitAdminPage(
				'admin.php',
				'page=googlesitekit-user-input'
			);

			await page.waitForSelector( 'title' );

			await expect( page ).toMatchElement( 'title', {
				text: /Site Kit by Google User Input\b/i,
			} );
		} );
	} );

	describe( 'page title test for googlesitekit-ad-blocking-recovery screen', () => {
		it( 'ensures that the page title element for the googlesitekit-ad-blocking-recovery screen starts with the expected value, indicating that non-null but non-existent parent_slug screen properties are not breaking the page title text', async () => {
			await enableFeature( 'adBlockerDetection' );

			await setupSiteKit();

			await visitAdminPage(
				'admin.php',
				'page=googlesitekit-ad-blocking-recovery'
			);

			await page.waitForSelector( 'title' );

			await expect( page ).toMatchElement( 'title', {
				text: /Site Kit by Google Ad Blocking Recovery\b/i,
			} );
		} );
	} );
} );
