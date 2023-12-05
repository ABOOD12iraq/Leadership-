/**
 * Select when in-view hook.
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
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useCallback, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useInView } from './useInView';

/**
 * Returns whether the nearest parent component tracking viewport detection is in-view.
 *
 * @since 1.49.0
 * @private
 *
 * @param {Function} mapSelect Selector to call when this selector's component is considered in-view.
 * @param {Array}    deps      Deps passed to `useInViewSelect`'s `deps` argument.
 * @param {any}      message   Foo.
 * @return {*} The result of the selector if in-view; `undefined` if not in-view.
 */
export const useInViewSelect = ( mapSelect, deps = [], message ) => {
	const isInView = useInView( { sticky: true }, message );
	const latestSelectorResult = useRef();

	const log = message
		? ( ...args ) => global.console.log( message, ...args )
		: () => {};

	const mapSelectCallback = useCallback(
		( select ) => {
			log( '>>>> CALLING mapSelect' );
			return mapSelect( select );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ ...deps, mapSelect ]
	);

	log( {
		isInView,
	} );

	const selectorResult = useSelect(
		isInView
			? mapSelectCallback
			: () => {
					// log( 'not in view' );
					return undefined;
			  }
	);

	log( {
		latestSelectorResult: latestSelectorResult.current,
		selectorResult,
	} );

	if ( isInView ) {
		latestSelectorResult.current = selectorResult;
	}

	return latestSelectorResult.current;
};
