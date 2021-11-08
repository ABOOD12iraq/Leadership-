/**
 * In viewport hook.
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
import { useUpdateEffect } from 'react-use';

/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InViewContext from '../components/InViewProvider/InViewContext';
import Data from 'googlesitekit-data';
import { CORE_UI } from '../googlesitekit/datastore/ui/constants';
const { useSelect } = Data;

/**
 * Returns whether the nearest parent component tracking viewport detection is in-view.
 *
 * @since n.e.x.t
 *
 * @param {Object}  options        Optional. Options to pass to the request.
 * @param {boolean} options.sticky Set to `true` to always return `true` after the nearest viewport-detecting component has been in-view once. Defaults to `false`.
 * @return {boolean} `true` if the nearest parent component is in-view (or if `sticky` is `true`, if the component has ever been in-view); `false` if not..
 */
export const useInView = ( { sticky = false } = {} ) => {
	const [ hasBeenInViewOnce, setHasBeenInViewOnce ] = useState( false );
	const inView = useContext( InViewContext );

	const resetCount = useSelect( ( select ) =>
		select( CORE_UI ).getUseInViewResetCount()
	);

	useEffect( () => {
		if ( inView && ! hasBeenInViewOnce ) {
			setHasBeenInViewOnce( true );
		}
	}, [ hasBeenInViewOnce, inView ] );

	useUpdateEffect( () => {
		setHasBeenInViewOnce( false );
	}, [ resetCount ] );

	if ( sticky && hasBeenInViewOnce ) {
		return true;
	}

	return !! inView;
};
