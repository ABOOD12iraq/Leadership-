/**
 * Checkbox component.
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
 * External dependencies
 */
import '@material/web/checkbox/checkbox';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

// Avoid console.log in tests.
const log = process?.stdout
	? ( ...args ) =>
			process.stdout.write(
				args.map( JSON.stringify ).join( ' ' ) + '\n'
			)
	: global.console.log;

export default function Checkbox( {
	checked,
	disabled,
	name,
	value,
	onChange,
	onKeyDown,
} ) {
	log( 'Checkbox render. checked:', checked );
	const ref = useRef( null );

	useEffect( () => {
		const { current } = ref;

		const click = ( event ) => {
			log( 'click', event );

			// Prevent default and manually dispatch a change event, in order to retain checkbox state and use as a controlled input.
			event.preventDefault();

			if ( disabled ) {
				return;
			}

			current.checked = current.checked ? undefined : true;
			// current.checked = ! current.checked;

			current.dispatchEvent(
				new Event( 'change', {
					bubbles: true,
					composed: true,
				} )
			);
		};

		const change = ( event ) => {
			log( 'change', event );

			onChange?.( event );
		};

		// Keydown events work fine without any special logic.
		const keydown = ( event ) => {
			log( 'keydown', event );

			onKeyDown?.( event );
		};

		// The click event is triggered by both mouse and keyboard entry (space key) on Chrome, need to confirm other browsers.
		current?.addEventListener( 'click', click );
		current?.addEventListener( 'change', change );
		current?.addEventListener( 'keydown', keydown );

		// The 'action' event is dispatched by the ActionElement base class of the Material checkbox. See ActionElement source for details.
		// current?.addEventListener( 'action', cancelEvent );

		return () => {
			current?.removeEventListener( 'click', click );
			current?.removeEventListener( 'change', change );
			current?.removeEventListener( 'keydown', keydown );
		};
	}, [ checked, disabled, onChange, onKeyDown ] );

	return (
		<md-checkbox
			// Use the `checked` value in the key on the web component to force a rerender.
			// This is a workaround for the fact the web component doesn't update visually when the checked property is changed programmatically. Seemingly this glitch only occurs once the rendered md-checkbox has been clicked.
			// This workaround has a side effect of unfocusing the checkbox when changed via keyboard input which needs to be addressed.
			key={ `checkbox-${ name }-${ checked }` }
			ref={ ref }
			role="checkbox"
			// Lit boolean attributes treat anything non-null|undefined as true. Coerce to undefined if false. TODO: Use null instead of undefined?
			// See https://lit.dev/docs/v1/components/properties/#attributes
			checked={ checked || undefined }
			disabled={ disabled || undefined }
			name={ name }
			value={ value }
		></md-checkbox>
	);
}

/**
 * Props determined by examining the Material 3 web component's source code.
 *
 * See @property definitions and event handlers in the source to identify which props are needed.
 */

Checkbox.propTypes = {
	// Fundamental checkbox attributes.
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	name: PropTypes.string,
	value: PropTypes.string,

	// Event handlers.
	onChange: PropTypes.func,
	onKeyDown: PropTypes.func,

	// Accessibility attributes.
	// ariaLabel: PropTypes.string,
	// ariaLabelledBy: PropTypes.string,
	// ariaDescribedBy: PropTypes.string,
	// reducedTouchTarget: PropTypes.bool,
};
