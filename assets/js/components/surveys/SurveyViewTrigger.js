/**
 * SurveyViewTrigger component.
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

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
const { useSelect, useDispatch } = Data;

export default function SurveyViewTrigger( { triggerID, ttl = 0 } ) {
	const usingProxy = useSelect( ( select ) =>
		select( CORE_SITE ).isUsingProxy()
	);

	const isTimedOut = useSelect( ( select ) =>
		select( CORE_USER ).isSurveyTimedOut( triggerID )
	);
	const isTimingOut = useSelect( ( select ) =>
		select( CORE_USER ).isTimingOutSurvey( triggerID )
	);

	const { triggerSurvey } = useDispatch( CORE_USER );

	const shouldTriggerSurvey = isTimedOut === false && isTimingOut === false;

	useEffect( () => {
		if ( shouldTriggerSurvey && usingProxy ) {
			triggerSurvey( triggerID, { ttl } );
		}
	}, [ shouldTriggerSurvey, usingProxy, triggerSurvey, triggerID, ttl ] );

	return null;
}

SurveyViewTrigger.propTypes = {
	triggerID: PropTypes.string.isRequired,
	ttl: PropTypes.number,
};
