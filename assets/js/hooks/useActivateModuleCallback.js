import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_SITE } from '../googlesitekit/datastore/site/constants';
import {
	CORE_USER,
	PERMISSION_MANAGE_OPTIONS,
} from '../googlesitekit/datastore/user/constants';
import { CORE_MODULES } from '../googlesitekit/modules/datastore/constants';
import { CORE_LOCATION } from '../googlesitekit/datastore/location/constants';
import { VIEW_CONTEXT_DASHBOARD } from '../googlesitekit/constants';
import { trackEvent } from '../util';
const { useSelect, useDispatch } = Data;

export default function useActivateModuleCallback( moduleSlug ) {
	const module = useSelect( ( select ) =>
		select( CORE_MODULES ).getModule( moduleSlug )
	);
	const canManageOptions = useSelect( ( select ) =>
		select( CORE_USER ).hasCapability( PERMISSION_MANAGE_OPTIONS )
	);

	const { activateModule } = useDispatch( CORE_MODULES );
	const { navigateTo } = useDispatch( CORE_LOCATION );
	const { setInternalServerError } = useDispatch( CORE_SITE );

	const activateModuleCallback = useCallback( async () => {
		const { error, response } = await activateModule( moduleSlug );

		if ( ! error ) {
			await trackEvent(
				`${ VIEW_CONTEXT_DASHBOARD }_widget-activation-cta`,
				'activate_module',
				moduleSlug
			);

			navigateTo( response.moduleReauthURL );
		} else {
			setInternalServerError( {
				id: `${ moduleSlug }-setup-error`,
				description: error.message,
			} );
		}
	}, [ activateModule, moduleSlug, navigateTo, setInternalServerError ] );

	if ( ! module?.name || ! canManageOptions ) {
		return null;
	}

	return activateModuleCallback;
}
