/**
 * WidgetAreaRenderer component.
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
import classnames from 'classnames';
import { useIntersection } from 'react-use';

/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { HIDDEN_CLASS } from '../util/constants';
import { CORE_WIDGETS, WIDGET_AREA_STYLES } from '../datastore/constants';
import {
	CORE_UI,
	UI_IS_SCROLLING,
	UI_CONTEXT_HASH,
} from '../../datastore/ui/constants';
import WidgetRenderer from './WidgetRenderer';
import { getWidgetLayout, combineWidgets } from '../util';
import { Cell, Grid, Row } from '../../../material-components';
import WidgetCellWrapper from './WidgetCellWrapper';
import InViewProvider from '../../../components/InViewProvider';
import { useFeature } from '../../../hooks/useFeature';
import { getHeaderHeight } from '../../../util/header';

const { useSelect } = Data;

export default function WidgetAreaRenderer( { slug, totalAreas } ) {
	const unifiedDashboardEnabled = useFeature( 'unifiedDashboard' );

	const widgetAreaRef = useRef();
	const intersectionEntry = useIntersection( widgetAreaRef, {
		rootMargin: '0px',
		threshold: 0, // Trigger "in-view" as soon as one pixel is visible.
	} );

	const widgetArea = useSelect( ( select ) =>
		select( CORE_WIDGETS ).getWidgetArea( slug )
	);
	const widgets = useSelect( ( select ) =>
		select( CORE_WIDGETS ).getWidgets( slug )
	);
	const widgetStates = useSelect( ( select ) =>
		select( CORE_WIDGETS ).getWidgetStates()
	);
	const isActive = useSelect( ( select ) =>
		select( CORE_WIDGETS ).isWidgetAreaActive( slug )
	);

	const [ inViewState, setInViewState ] = useState( {
		key: `WidgetAreaRenderer-${ slug }`,
		value: !! intersectionEntry?.intersectionRatio,
	} );

	const isScrolling = useSelect( ( select ) =>
		select( CORE_UI ).getValue( UI_IS_SCROLLING )
	);

	const contextHash = useSelect( ( select ) =>
		select( CORE_UI ).getValue( UI_CONTEXT_HASH )
	);

	useEffect( () => {
		setInViewState( {
			key: `WidgetAreaRenderer-${ slug }`,
			value:
				! isScrolling &&
				!! intersectionEntry?.intersectionRatio &&
				widgetAreaRef.current?.getBoundingClientRect().bottom >
					getHeaderHeight(),
		} );
	}, [ isScrolling, intersectionEntry, slug, contextHash ] );

	// Compute the layout.
	const { columnWidths, rowIndexes } = getWidgetLayout(
		widgets,
		widgetStates
	);

	// Combine widgets with similar CTAs and prepare final props to pass to
	// `WidgetRenderer` below. Only one consecutive instance of a similar CTA
	// will be maintained (via an "override component"), and all other similar
	// ones will receive a CSS class to hide them.
	// A combined CTA will span the combined width of all widgets that it was
	// combined from.
	const { gridColumnWidths, overrideComponents } = combineWidgets(
		widgets,
		widgetStates,
		{
			columnWidths,
			rowIndexes,
		}
	);

	// Render all widgets.
	const widgetsOutput = widgets.map( ( widget, i ) => (
		<WidgetCellWrapper
			key={ `${ widget.slug }-wrapper` }
			gridColumnWidth={ gridColumnWidths[ i ] }
		>
			<WidgetRenderer
				OverrideComponent={
					overrideComponents[ i ]
						? () => {
								const {
									Component,
									metadata,
								} = overrideComponents[ i ];
								return <Component { ...metadata } />;
						  }
						: undefined
				}
				slug={ widget.slug }
			/>
		</WidgetCellWrapper>
	) );

	const { Icon, title, style, subtitle } = widgetArea;

	// Here we render the bare output as it is guaranteed to render empty.
	// This is important compared to returning `null` so that the area
	// can maybe render later if conditions change for widgets to become active.
	// Returning `null` here however would have the side-effect of making
	// all widgets active again, which is why we must return the "null" output.
	if ( ! isActive ) {
		return (
			<Grid
				className={ classnames(
					HIDDEN_CLASS,
					'googlesitekit-widget-area',
					{
						[ `googlesitekit-widget-area--${ slug }` ]: !! slug,
						[ `googlesitekit-widget-area--${ style }` ]: !! style,
					}
				) }
				ref={ widgetAreaRef }
			>
				{ widgetsOutput }
			</Grid>
		);
	}

	return (
		<InViewProvider value={ inViewState }>
			<Grid
				className={ classnames(
					'googlesitekit-widget-area',
					`googlesitekit-widget-area--${ slug }`,
					`googlesitekit-widget-area--${ style }`
				) }
				ref={ widgetAreaRef }
			>
				{ ( unifiedDashboardEnabled || totalAreas > 1 ) && (
					<Row>
						<Cell
							className="googlesitekit-widget-area-header"
							size={ 12 }
						>
							{ Icon && <Icon width={ 33 } height={ 33 } /> }

							{ title && (
								<h3 className="googlesitekit-widget-area-header__title googlesitekit-heading-3">
									{ title }
								</h3>
							) }

							{ subtitle && (
								<h4 className="googlesitekit-widget-area-header__subtitle">
									{ subtitle }
								</h4>
							) }
						</Cell>
					</Row>
				) }

				<div className="googlesitekit-widget-area-widgets">
					<Row>
						{ style === WIDGET_AREA_STYLES.BOXES && widgetsOutput }
						{ style === WIDGET_AREA_STYLES.COMPOSITE && (
							<Cell size={ 12 }>
								<Grid>
									<Row>{ widgetsOutput }</Row>
								</Grid>
							</Cell>
						) }
					</Row>
				</div>
			</Grid>
		</InViewProvider>
	);
}

WidgetAreaRenderer.propTypes = {
	slug: PropTypes.string.isRequired,
};
