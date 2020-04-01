/**
 * Data store utilities tests.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
	addInitializeAction,
	addInitializeReducer,
	collect,
	collectActions,
	collectReducers,
	collectName,
	initializeAction,
} from './utils';

describe( 'data utils', () => {
	describe( 'collect()', () => {
		it( 'should collect multiple objects and combine them into one', () => {
			const objectOne = {
				bar: () => {},
				foo: () => {},
			};
			const objectTwo = {
				cat: () => {},
				dog: () => {},
			};

			expect( collect( objectOne, objectTwo ) ).toEqual( {
				...objectOne,
				...objectTwo,
			} );
		} );

		it( 'should accept as many objects as supplied', () => {
			const objectOne = {
				bar: () => {},
				foo: () => {},
			};
			const objectTwo = {
				cat: () => {},
				dog: () => {},
			};
			const objectThree = {
				feline: () => {},
				wolf: () => {},
			};
			const objectFour = {
				mouse: () => {},
				rat: () => {},
			};
			const objectFive = {
				horse: () => {},
				unicorn: () => {},
			};

			expect( collect(
				objectOne,
				objectTwo,
				objectThree,
				objectFour,
				objectFive
			) ).toEqual( {
				...objectOne,
				...objectTwo,
				...objectThree,
				...objectFour,
				...objectFive,
			} );
		} );

		it( 'should error if objects have the same key', () => {
			// This can lead to subtle/hard-to-detect errors, so we check for it
			// whenever combining store actions, selectors, etc.
			// See: https://github.com/google/site-kit-wp/pull/1162/files#r385912255
			const objectOne = {
				cat: () => {},
				feline: () => {},
				mouse: () => {},
			};
			const objectTwo = {
				cat: () => {},
				feline: () => {},
				dog: () => {},
			};

			expect( () => {
				collect( objectOne, objectTwo );
			} ).toThrow( /Your call to collect\(\) contains the following duplicated functions: cat, feline./ );
		} );
	} );

	describe( 'addInitializeAction()', () => {
		it( 'should include an initialize action that dispatches an INITIALIZE action type', () => {
			const objectOne = {
				bar: () => {},
				foo: () => {},
			};
			const objectTwo = {
				cat: () => {},
				dog: () => {},
			};

			expect(
				addInitializeAction( collectActions( objectOne, objectTwo ) )
			).toMatchObject( {
				initialize: initializeAction,
			} );
		} );
	} );

	describe( 'reducer utility functions', () => {
		const fakeAction = () => {
			return { type: 'ACTION_ONE', payload: {} };
		};
		const anotherFakeAction = () => {
			return { type: 'ACTION_TWO', payload: {} };
		};

		const fakeReducer = ( state, action ) => {
			switch ( action.type ) {
				case 'ACTION_ONE':
					return { ...state, one: true };
				default: {
					return { ...state };
				}
			}
		};
		const fakeReducerTwo = ( state, action ) => {
			switch ( action.type ) {
				case 'ACTION_TWO':
					return { ...state, two: 2 };
				default: {
					return { ...state };
				}
			}
		};

		describe( 'collectReducers()', () => {
			it( 'should return modified state based on the reducers supplied', () => {
				const initialState = { count: 0 };
				const combinedReducer = collectReducers( initialState, fakeReducer, fakeReducerTwo );

				let state = combinedReducer();
				expect( state ).toEqual( { count: 0 } );
				expect( state.one ).toEqual( undefined );

				state = combinedReducer( state, fakeAction() );
				expect( state ).toEqual( { count: 0, one: true } );

				state = combinedReducer( state, anotherFakeAction() );
				expect( state ).toEqual( { count: 0, one: true, two: 2 } );

				// Should not respond to the initializeAction as this reducer is not
				// extended with `addInitializeReducer()`. This will return state as-is.
				const newState = combinedReducer( state, initializeAction() );

				expect( state ).toEqual( newState );
			} );
		} );

		describe( 'addInitializeReducer()', () => {
			it( 'should respond to an INITIALIZE action because it extends the reducers to include one', () => {
				const initialState = { count: 0 };
				const combinedReducer = addInitializeReducer(
					initialState,
					collectReducers( fakeReducer, fakeReducerTwo )
				);

				let state = combinedReducer();
				expect( state ).toEqual( { count: 0 } );

				// It should still respond to the original actions.
				state = combinedReducer( state, fakeAction() );
				expect( state ).toEqual( { count: 0, one: true } );

				state = combinedReducer( state, anotherFakeAction() );
				expect( state ).toEqual( { count: 0, one: true, two: 2 } );

				//
				state = combinedReducer( state, initializeAction() );
				expect( state ).toEqual( initialState );
			} );
		} );

		describe( 'collectName()', () => {
			it( 'should return the single store name', () => {
				const individualStoreName = 'core/site';
				const collectedStoreName = collectName( individualStoreName, individualStoreName, individualStoreName );

				expect( collectedStoreName ).toEqual( individualStoreName );
			} );

			it( 'should error if not all store names match', () => {
				const storeName = 'core/site';
				const wrongStoreName = 'core/user';

				expect( () => {
					collectName( storeName, storeName, wrongStoreName, storeName );
				} ).toThrow( /collectName\(\) must not receive different names./ );
			} );
		} );
	} );
} );
