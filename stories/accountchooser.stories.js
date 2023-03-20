/**
 * AccountChooser stories.
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
 * External dependencies
 */
import TextField, { Input } from '@material/react-text-field';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { Button } from 'googlesitekit-components';
import { useState } from 'react';
import { CORE_USER } from '../assets/js/googlesitekit/datastore/user/constants';
import { useRegistry } from '@wordpress/data';
import { provideUserInfo } from '../tests/js/utils';
const { useSelect } = Data;

export const AccountChooser = () => {
	const [ destURL, setDestURL ] = useState(
		'https://accounts.google.com/ManageAccount'
	);
	const registry = useRegistry();
	const email = useSelect( ( select ) => select( CORE_USER ).getEmail() );
	const onEmailChange = ( { target } ) => {
		provideUserInfo( registry, { email: target.value } );
	};

	const accountChooserURL = useSelect( ( select ) =>
		select( CORE_USER ).getAccountChooserURL( destURL )
	);

	return (
		<div>
			<h1>Account Chooser</h1>
			<p>
				This is a utility component for using the account chooser
				service.
			</p>
			<TextField
				label="Google Account Email"
				onChange={ onEmailChange }
				outlined
			>
				<Input value={ email } />
			</TextField>

			<TextField
				label="Destination URL"
				onChange={ ( { target } ) => setDestURL( target.value ) }
				outlined
			>
				<Input value={ destURL } />
			</TextField>

			<pre>{ accountChooserURL }</pre>
			<Button href={ accountChooserURL } target="_blank">
				Open URL in a new tab
			</Button>
		</div>
	);
};

export default {
	title: 'AccountChooser',
	component: AccountChooser,
};
