<?php
/**
 * Class Google\Site_Kit\Core\Util\Uninstallation
 *
 * @package   Google\Site_Kit\Core\Util
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Util;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Storage\Options;
use Google\Site_Kit\Core\Storage\Encrypted_Options;
use Google\Site_Kit\Core\Authentication\Credentials;
use Google\Site_Kit\Core\Authentication\Google_Proxy;

/**
 * Utility class for handling uninstallation of the plugin.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Uninstallation {

	/**
	 * Plugin context.
	 *
	 * @since n.e.x.t
	 * @var Context
	 */
	private $context;

	/**
	 * Options object.
	 *
	 * @since n.e.x.t
	 * @var Options
	 */
	private $options = null;

	/**
	 * Constructor.
	 *
	 * This class and its logic must be instantiated early in the WordPress
	 * bootstrap lifecycle because an uninstallation hook runs decoupled from
	 * regular action hooks like 'init'.
	 *
	 * @since n.e.x.t
	 *
	 * @param Context $context Plugin context.
	 * @param Options $options Optional. Option API instance. Default is a new instance.
	 */
	public function __construct(
		Context $context,
		Options $options = null
	) {
		$this->context = $context;
		$this->options = $options ?: new Options( $this->context );
	}

	/**
	 * Registers functionality through WordPress hooks.
	 *
	 * @since n.e.x.t
	 */
	public function register() {
		add_action(
			'googlesitekit_uninstallation',
			function() {
				$this->uninstall();
			}
		);
	}

	/**
	 * Runs necessary logic for uninstallation of the plugin.
	 *
	 * If connected to the proxy, it will issue a request to unregister the site.
	 *
	 * @since n.e.x.t
	 */
	private function uninstall() {
		$credentials = new Credentials( new Encrypted_Options( $this->options ) );

		if ( ! $credentials->has() || ! $credentials->using_proxy() ) {
			return;
		}

		$google_proxy = new Google_Proxy( $this->context );
		try {
			$google_proxy->unregister_site( $credentials );
		} catch ( Exception $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// Just avoid this from being thrown.
		}
	}
}
