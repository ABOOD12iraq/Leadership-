/**
 * Dashboard Sharing Feature Tour.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
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
import { __ } from '@wordpress/i18n';

/*
 * Internal dependencies
 */
import { VIEW_CONTEXT_DASHBOARD } from '../googlesitekit/constants';
import { isFeatureEnabled } from '../features';

export const steps = [
	{
		target: '.googlesitekit-dashboard-sharing-settings__column--view',
		title: __( 'Manage view access for other roles', 'google-site-kit' ),
		content: __(
			'Grant access to the view-only dashboard for each service for the specific roles you want. Users will see the Site Kit dashboard with only the services that have been shared with them without needing to sign-in with Google.',
			'google-site-kit'
		),
		placement: 'auto',
	},
];
const dashboardSharingSettings = {
	slug: 'dashboardSharingSettings',
	contexts: [ VIEW_CONTEXT_DASHBOARD ],
	// TODO: This version should be changed when the feature flag is removed
	// to the actual upcoming version.
	version: '1.85.0',
	gaEventCategory: ( viewContext ) => `${ viewContext }_dashboard-sharing`,
	steps,
	autoStart: false,
	checkRequirements: () => isFeatureEnabled( 'dashboardSharing' ),
};

export default dashboardSharingSettings;
