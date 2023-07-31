/**
 * ConnectGA4CTATileWidget component tests.
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
 * Internal dependencies
 */
import {
	provideModules,
	provideUserCapabilities,
	render,
} from '../../../../../../tests/js/test-utils';
import ConnectGA4CTATileWidget from './ConnectGA4CTATileWidget';

describe( 'ConnectGA4CTATileWidget', () => {
	it( 'should render the Connect GA4 CTA tile', () => {
		const { container, getByText } = render(
			<ConnectGA4CTATileWidget widgetSlug="some-widget" />,
			{
				setupRegistry: ( registry ) => {
					provideUserCapabilities( registry );
					provideModules( registry );
				},
			}
		);

		expect( container ).toMatchSnapshot();

		expect( getByText( 'Connect Analytics' ) ).toBeInTheDocument();
	} );
} );
