<?php
/**
 * Class Google\Site_Kit\Core\User_Input\User_Input
 *
 * @package   Google\Site_Kit\Core\User_Input
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\User_Input;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Authentication\Authentication;
use Google\Site_Kit\Core\Authentication\User_Input_State;
use Google\Site_Kit\Core\Permissions\Permissions;
use Google\Site_Kit\Core\REST_API\REST_Route;
use Google\Site_Kit\Core\Storage\Options;
use Google\Site_Kit\Core\Storage\User_Options;
use Google\Site_Kit\Core\User_Input\User_Input_Site_Settings;
use Google\Site_Kit\Core\User_Input\User_Input_User_Settings;
use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class managing requests to user input settings endpoint.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class User_Input {

	/**
	 * Authentication instance.
	 *
	 * @since n.e.x.t
	 * @var Authentication
	 */
	private $authentication;

	/**
	 * User_Input_Site_Settings instance.
	 *
	 * @since n.e.x.t
	 * @var User_Input_Site_Settings
	 */
	protected $user_input_site_settings;

	/**
	 * User_Input_User_Settings instance.
	 *
	 * @since n.e.x.t
	 * @var User_Input_User_Settings
	 */
	protected $user_input_user_settings;

	/**
	 * User Input properties.
	 *
	 * @since n.e.x.t
	 * @var array|ArrayAccess
	 */
	private static $properties = array(
		'purpose'       => array(
			'scope' => 'site',
		),
		'postFrequency' => array(
			'scope' => 'user',
		),
		'goals'         => array(
			'scope' => 'user',
		),
	);

	/**
	 * Constructor.
	 *
	 * @since n.e.x.t
	 *
	 * @param Context        $context         Plugin context.
	 * @param Authentication $authentication  Optional. Authentication instance. Default a new instance.
	 */
	public function __construct( Context $context, Authentication $authentication = null ) {
		$options      = new Options( $context );
		$user_options = new User_Options( $context );

		$this->authentication           = $authentication ?: new Authentication( $context );
		$this->user_input_site_settings = new User_Input_Site_Settings( $options );
		$this->user_input_user_settings = new User_Input_User_Settings( $user_options );
	}

	/**
	 * Registers functionality.
	 *
	 * @since n.e.x.t
	 */
	public function register() {
		$this->user_input_site_settings->register();
		$this->user_input_user_settings->register();

		add_filter(
			'googlesitekit_rest_routes',
			function( $routes ) {
				return array_merge( $routes, $this->get_rest_routes() );
			}
		);
	}

	/**
	 * Gets related REST routes.
	 *
	 * @since n.e.x.t
	 *
	 * @return array List of REST_Route objects.
	 */
	private function get_rest_routes() {
		$can_authenticate = function() {
			return current_user_can( Permissions::AUTHENTICATE );
		};

		return array(
			new REST_Route(
				'core/user/data/user-input-settings',
				array(
					array(
						'methods'             => WP_REST_Server::READABLE,
						'callback'            => function() {
							return rest_ensure_response( $this->get_settings() );
						},
						'permission_callback' => $can_authenticate,
					),
					array(
						'methods'             => WP_REST_Server::CREATABLE,
						'callback'            => function( WP_REST_Request $request ) {
							$data = $request->get_param( 'data' );

							if ( ! isset( $data['settings'] ) || ! is_array( $data['settings'] ) ) {
								return new WP_Error(
									'rest_missing_callback_param',
									__( 'Missing settings data.', 'google-site-kit' ),
									array( 'status' => 400 )
								);
							}

							return rest_ensure_response(
								$this->set_settings(
									$data['settings']
								)
							);
						},
						'permission_callback' => $can_authenticate,
						'args'                => array(
							'data' => array(
								'type'       => 'object',
								'required'   => true,
								'properties' => array(
									'settings' => array(
										'type'       => 'object',
										'required'   => true,
										'properties' => array_fill_keys(
											array_keys( static::$properties ),
											array(
												'type'  => 'array',
												'items' => array( 'type' => 'string' ),
											)
										),
									),
								),
							),
						),
					),
				)
			),
		);
	}

	/**
	 * Gets the set of user input properties.
	 *
	 * @since n.e.x.t
	 *
	 * @return array The user input properties.
	 */
	public static function get_properties() {
		return static::$properties;
	}

	/**
	 * Gets user input settings.
	 *
	 * @since n.e.x.t
	 *
	 * @return array|WP_Error User input settings.
	 */
	public function get_settings() {
		$data = array(
			'site' => $this->user_input_site_settings->get(),
			'user' => $this->user_input_user_settings->get(),
		);

		$properties = static::$properties;
		$settings   = array_merge( $data['site'], $data['user'] );

		// If there are no settings, return default empty values.
		if ( empty( $settings ) ) {
			array_walk(
				$properties,
				function ( &$property ) {
					$property['values'] = array();
				}
			);

			return $properties;
		}

		$user_id = get_current_user_id();

		foreach ( $settings as &$setting ) {
			if ( ! isset( $setting['answeredBy'] ) ) {
				continue;
			}

			$answered_by = intval( $setting['answeredBy'] );
			unset( $setting['answeredBy'] );

			if ( ! $answered_by || $answered_by === $user_id ) {
				continue;
			}

			$setting['author'] = array(
				'photo' => get_avatar_url( $answered_by ),
				'name'  => get_the_author_meta( 'user_email', $answered_by ),
			);
		}

		// If there are un-answered questions, return default empty values for them.
		foreach ( $properties as $property_key => $property_value ) {
			if ( ! isset( $settings[ $property_key ] ) ) {
				$settings[ $property_key ]           = $property_value;
				$settings[ $property_key ]['values'] = array();
			}
		}

		return $settings;
	}

	/**
	 * Determines whether the current user input settings have empty values or not.
	 *
	 * @since n.e.x.t
	 *
	 * @param array $settings The settings to check.
	 * @return boolean|null TRUE if at least one of the settings has empty values, otherwise FALSE.
	 */
	public function are_settings_empty( $settings = array() ) {
		if ( empty( $settings ) ) {
			$settings = $this->get_settings();

			if ( is_wp_error( $settings ) ) {
				return null;
			}
		}

		$empty_settings = array_filter(
			$settings,
			function( $setting ) {
				return empty( $setting['values'] );
			}
		);

		return 0 < count( $empty_settings );
	}

	/**
	 * Sets user input settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param array $settings User settings.
	 * @return array|WP_Error User input settings.
	 */
	public function set_settings( $settings ) {
		$properties    = static::$properties;
		$site_settings = array();
		$user_settings = array();

		foreach ( $settings as $setting_key => $answers ) {
			$setting_data           = array();
			$setting_data['values'] = $answers;
			$setting_data['scope']  = $properties[ $setting_key ]['scope'];

			if ( 'site' === $setting_data['scope'] ) {
				$setting_data['answeredBy']    = get_current_user_id();
				$site_settings[ $setting_key ] = $setting_data;
			} elseif ( 'user' === $setting_data['scope'] ) {
				$user_settings[ $setting_key ] = $setting_data;
			}
		}

		$this->user_input_site_settings->set( $site_settings );
		$this->user_input_user_settings->set( $user_settings );

		$updated_settings = $this->get_settings();
		$is_empty         = $this->are_settings_empty( $updated_settings );

		if ( ! is_null( $is_empty ) ) {
			$this->authentication->get_user_input_state()->set( $is_empty ? User_Input_State::VALUE_MISSING : User_Input_State::VALUE_COMPLETED );
		}

		return $updated_settings;
	}

	/**
	 * Method re-usable by scoped classes to sanitize settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param User_Input_Site_Settings|User_Input_User_Settings $setting Instance of either setting class.
	 * @param array                                             $settings Settings to sanitize.
	 * @param string                                            $scope Scope of the settings, either 'site' or 'user'.
	 * @return array Sanitized settings.
	 */
	public static function sanitize_settings( $setting, $settings, $scope ) {
		$valid_scopes = array( 'site', 'user' );

		if (
			! isset( $setting ) ||
			! isset( $settings ) ||
			! isset( $scope ) ||
			! is_array( $settings ) ||
			! in_array( $scope, $valid_scopes, true )
		) {
			return $setting->get();
		}

		$properties = array_filter(
			static::get_properties(),
			function ( $property ) use ( $scope ) {
				return $scope === $property['scope'];
			}
		);

		$results = array();

		foreach ( $settings as $setting_key => $setting_values ) {
			// Ensure all the data is valid.
			if (
				! in_array( $setting_key, array_keys( $properties ), true ) ||
				! is_array( $setting_values ) ||
				! isset( $setting_values['scope'] ) ||
				! isset( $setting_values['values'] ) ||
				$scope !== $setting_values['scope'] ||
				! is_array( $setting_values['values'] )
			) {
				continue;
			}

			if (
				'site' === $scope && (
					! isset( $setting_values['answeredBy'] ) ||
					! is_int( $setting_values['answeredBy'] )
				)
			) {
				continue;
			}

			$valid_values          = array();
			$valid_values['scope'] = $setting_values['scope'];

			if ( 'site' === $scope ) {
				$valid_values['answeredBy'] = $setting_values['answeredBy'];
			}

			$valid_answers = array();

			foreach ( $setting_values['values'] as $answer ) {
				if ( is_string( $answer ) ) {
					$valid_answers[] = $answer;
				}
			}

			$valid_values['values'] = $valid_answers;

			if ( ! empty( $valid_values ) ) {
				$results[ $setting_key ] = $valid_values;
			}
		}

		return $results;
	}
}
