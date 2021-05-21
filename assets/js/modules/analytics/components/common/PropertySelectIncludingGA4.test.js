/**
 * GA4 Property Select component tests.
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
 * Internal dependencies
 */
import PropertySelect from './PropertySelectIncludingGA4';
import { MODULES_ANALYTICS, ACCOUNT_CREATE } from '../../datastore/constants';
import { MODULES_ANALYTICS_4 } from '../../../analytics-4/datastore/constants';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import * as fixtures from '../../datastore/__fixtures__';
import * as analytics4Fixtures from '../../../analytics-4/datastore/__fixtures__';

import { fireEvent, act, render } from '../../../../../../tests/js/test-utils';

const {
	createProperty,
	createWebDataStream,
	properties: propertiesGA4,
	webDataStreams,
} = analytics4Fixtures;
const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
// is this ok for UA?
const accountID = createProperty._accountID;
const propertyIDga4 = createWebDataStream._propertyID;

const setupRegistry = ( { dispatch } ) => {
	dispatch( CORE_SITE ).receiveSiteInfo( { referenceSiteURL: 'http://example.com' } );
	dispatch( MODULES_ANALYTICS ).receiveGetSettings( {} );
	dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {} );
	dispatch( MODULES_ANALYTICS ).setAccountID( accountID );
	// Not sure what does but copied from elsewhere
	dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( null );

	dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getAccounts', [] );

	dispatch( MODULES_ANALYTICS ).receiveGetProperties( properties, { accountID } );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ accountID ] );

	dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties( propertiesGA4, { accountID } );
	dispatch( MODULES_ANALYTICS_4 ).finishResolution( 'getProperties', [ accountID ] );

	const propertyID = properties[ 0 ].id;
	dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, { accountID, propertyID } );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getProfiles', [ accountID, propertyID ] );

	dispatch( MODULES_ANALYTICS_4 ).receiveGetWebDataStreams( webDataStreams, { propertyID: propertyIDga4 } );
	dispatch( MODULES_ANALYTICS_4 ).finishResolution( 'receiveGetWebDataStreams', { propertyID: propertyIDga4 } );
};

const setupEmptyRegistry = ( { dispatch } ) => {
	dispatch( MODULES_ANALYTICS ).receiveGetSettings( {} );
	dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {} );
	dispatch( MODULES_ANALYTICS ).setAccountID( accountID );

	dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getAccounts', [] );

	dispatch( MODULES_ANALYTICS ).receiveGetProperties( [], { accountID } );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ accountID ] );

	dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties( [], { accountID } );
	dispatch( MODULES_ANALYTICS_4 ).finishResolution( 'getProperties', [ accountID ] );
};

describe( 'PropertySelectIncludingGA4', () => {
	it( 'should render an option for each analytics property of the currently selected account.', async () => {
		const { getAllByRole } = render( <PropertySelect />, { setupRegistry } );

		const listItems = getAllByRole( 'menuitem', { hidden: true } );
		// Note: we do length + 1 here because there should also be an item for
		// "Set up a new property".
		expect( listItems ).toHaveLength( properties.length + propertiesGA4.length + 1 );
	} );

	// TODO - should actually be empty! Copy test from other task when merged
	it( 'should be disabled when in the absence of an valid account ID.', async () => {
		const { container, registry } = render( <PropertySelect />, {
			setupRegistry,
		} );

		// A valid accountID is provided, so ensure it is not currently disabled.
		const selectWrapper = container.querySelector( '.googlesitekit-analytics__select-property' );
		const selectedText = container.querySelector( '.mdc-select__selected-text' );
		expect( selectWrapper ).not.toHaveClass( 'mdc-select--disabled' );
		expect( selectedText ).not.toHaveAttribute( 'aria-disabled', 'true' );

		act( () => {
			registry.dispatch( MODULES_ANALYTICS ).setAccountID( ACCOUNT_CREATE );
			registry.dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ ACCOUNT_CREATE ] );
			registry.dispatch( MODULES_ANALYTICS_4 ).finishResolution( 'getProperties', [ ACCOUNT_CREATE ] );
		} );
		// ACCOUNT_CREATE is an invalid accountID (but valid selection), so ensure the select IS currently disabled.
		expect( selectWrapper ).toHaveClass( 'mdc-select--disabled' );
		expect( selectedText ).toHaveAttribute( 'aria-disabled', 'true' );
	} );

	// TO TEST?
	// * If properties are still loading, the component should return a loading bar.
	// * Every property should show up as its name with its ID in parentheses.

	it( 'should render a select box with only an option to create a new property if no properties are available.', async () => {
		const { getAllByRole } = render( <PropertySelect />, { setupRegistry: setupEmptyRegistry } );

		const listItems = getAllByRole( 'menuitem', { hidden: true } );
		expect( listItems ).toHaveLength( 1 );
		expect( listItems[ 0 ].textContent ).toMatch( /set up a new property/i );
	} );

	// TODO
	// * display UA

	// currently selected property
	it.todo( 'If the getPrimaryPropertyType selector returns "ga4", the selected property has to come from the modules/analytics-4 store\'s getPropertyID selector.' );
	it.todo( 'Otherwise or if the getPrimaryPropertyType selector returns "ua", the selected property has to come from the modules/analytics store\'s getPropertyID selector.' );

	// make this a toggle between both
	it( 'should update propertyID in the GA4 store when a new GA4 item is selected', async () => {
		const { getAllByRole, container, registry } = render( <PropertySelect />, { setupRegistry } );
		const ga4Properties = registry.select( MODULES_ANALYTICS_4 ).getProperties( accountID );
		// NOTE -> due to the selector getPropertiesIncludingGA4 sorting this is rendered second in the select
		const targetProperty = ga4Properties[ 0 ];

		expect( container.querySelector( '.mdc-select__selected-text' ) ).toHaveTextContent( '' );

		fireEvent.click( container.querySelector( '.mdc-floating-label' ) );
		fireEvent.click( getAllByRole( 'menuitem', { hidden: true } )[ 1 ] );

		// If the selected property is a GA4 property, the setPrimaryPropertyType action should be called to indicate "ga4".
		expect( registry.select( MODULES_ANALYTICS ).getPrimaryPropertyType() ).toBe( 'ga4' );

		// Then, the modules/analytics-4 store's selectProperty action should be used to set the GA4 property
		const newPropertyID = registry.select( MODULES_ANALYTICS_4 ).getPropertyID();
		expect( targetProperty._id ).toEqual( newPropertyID );

		expect( container.querySelector( '.mdc-select__selected-text' ) )
			.toHaveTextContent( `${ targetProperty.displayName } (${ targetProperty._id })` );
		expect( container.querySelector( '.mdc-select__selected-text' ) )
			.toHaveTextContent( 'Test GA4 Property (1000)' );

		// while the modules/analytics store's selectProperty action should be used to empty/reset the UA property (since that then needs to later be chosen in another dropdown based on the GA4 property).
		expect( registry.select( MODULES_ANALYTICS ).getPropertyID() ).toBe( '' );

		// TODO -> change between two and then assert that changes correctly
	} );

	it( 'should update propertyID in the UA store when a new UA item is selected', async () => {
		const { getAllByRole, container, registry } = render( <PropertySelect />, { setupRegistry } );
		const uaProperties = registry.select( MODULES_ANALYTICS ).getProperties( accountID );

		const targetProperty = uaProperties[ 0 ];

		expect( container.querySelector( '.mdc-select__selected-text' ) ).toHaveTextContent( '' );

		fireEvent.click( container.querySelector( '.mdc-floating-label' ) );
		fireEvent.click( getAllByRole( 'menuitem', { hidden: true } )[ 7 ] );

		expect( registry.select( MODULES_ANALYTICS ).getPrimaryPropertyType() ).toBe( 'ua' );

		const newPropertyID = registry.select( MODULES_ANALYTICS ).getPropertyID();

		expect( targetProperty.id ).toEqual( newPropertyID );

		expect( container.querySelector( '.mdc-select__selected-text' ) )
			.toHaveTextContent( `${ targetProperty.name } (${ targetProperty.id })` );
		expect( container.querySelector( '.mdc-select__selected-text' ) ).toHaveTextContent( 'wegweg (UA-152925174-1)' );

		//  while the modules/analytics-4 store's selectProperty action should be used to empty/reset the GA4 property (since that then needs to later be chosen in another dropdown based on the GA4 property).
		expect( registry.select( MODULES_ANALYTICS_4 ).getPropertyID() ).toBe( '' );

		// COPY ANY MORE TESTS FROM PREVIOUS TEST
	} );
} );

