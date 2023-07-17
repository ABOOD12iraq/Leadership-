/**
 * MetricTileError component.
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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import CTA from '../notifications/CTA';
import ReportErrorActions from '../ReportErrorActions';
import { __ } from '@wordpress/i18n';

export default function MetricTileError( props ) {
	const { error, headerText } = props;

	return (
		<CTA
			title={ __( 'Data Loading Failed', 'google-site-kit' ) }
			headerText={ headerText }
			description=""
			error={ error }
		>
			<ReportErrorActions moduleSlug="analytics-4" error={ error } />
		</CTA>
	);
}

MetricTileError.propTypes = {
	error: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.object ),
		PropTypes.object,
	] ).isRequired,
	headerText: PropTypes.string,
};
