/**
 * ActivateModule component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';

import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useActivateModuleCallback from '../../../../../hooks/useActivateModuleCallback';
import CTA from '../../../../../components/notifications/CTA';
import { Cell, Grid, Row } from '../../../../../material-components';

export default function ActivateAnalyticsCTA( props ) {
	const { title, description } = props;

	const activateModuleCallback = useActivateModuleCallback( 'analytics' );

	if ( ! activateModuleCallback ) return null;

	let moduleTitle = title;
	let moduleDescription = description;

	// Special-cases for default title and description.
	// TODO: Solve these in a more appropriate way, e.g. by updating module registration data.
	switch ( moduleSlug ) {
		case 'analytics':
			if ( ! title ) {
				moduleTitle = __(
					'Learn more about what visitors do on your site',
					'google-site-kit'
				);
			}
			if ( ! description ) {
				moduleDescription = __(
					'Connect with Google Analytics to see unique visitors, goal completions, top pages and more',
					'google-site-kit'
				);
			}
			break;
		case 'pagespeed-insights':
			if ( ! description ) {
				moduleDescription = __(
					'Google PageSpeed Insights gives you metrics about performance, accessibility, SEO and PWA',
					'google-site-kit'
				);
			}
			break;
	}

	return (
		<Grid>
			<Row>
				<Cell>
					See how many people visit your site from Search and track
					how you’re achieving your goals: install Google Analytics.
					<CTA
						title={
							moduleTitle ||
							sprintf(
								/* translators: %s: Module name */
								__( 'Activate %s', 'google-site-kit' ),
								module.name
							)
						}
						description={
							moduleDescription ||
							sprintf(
								/* translators: %s: Module name */
								__(
									'%s module needs to be configured',
									'google-site-kit'
								),
								module.name
							)
						}
						ctaLabel={ __(
							'Set up Google Analytics',
							'google-site-kit'
						) }
						onClick={ activateModuleCallback }
					/>
				</Cell>
			</Row>
		</Grid>
	);
}

ActivateAnalyticsCTA.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
};
