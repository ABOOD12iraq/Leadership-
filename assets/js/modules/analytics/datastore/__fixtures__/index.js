/**
 * Analytics Datastore Fixtures.
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

export { default as accountsPropertiesProfiles } from './accounts-properties-profiles';
export { default as adminBarAnalyticsTotalUsersMockData } from './admin-bar-analytics-total-users-mock-data';
export { default as adminBarAnalyticsTotalUsersOptions } from './admin-bar-analytics-total-users-options';
export { default as adminBarAnalyticsSessionsMockData } from './admin-bar-analytics-session-mock-data';
export { default as adminBarAnalyticsSessionsOptions } from './admin-bar-analytics-session-options';
export { default as createProfile } from './create-profile';
export { default as createProperty } from './create-property';
export { default as goals } from './goals';
export { default as profiles } from './profiles';
export { default as propertiesProfiles } from './properties-profiles';
export { default as getTagPermissionsAccess } from './tag-permissions-access';
export { default as getTagPermissionsNoAccess } from './tag-permissions-no-access';
export { default as createAccount } from './create-account';
export { default as report } from './report';
export { default as dashboardAllTrafficArgs } from './dashboard-all-traffic-widget-args.json';
export { default as dashboardAllTrafficData } from './dashboard-all-traffic-widget-data.json';
export { default as pageDashboardAllTrafficArgs } from './page-dashboard-all-traffic-widget-args.json';
export { default as pageDashboardAllTrafficData } from './page-dashboard-all-traffic-widget-data.json';
export { default as dashboardPopularPagesArgs } from './dashboard-popular-pages-widget-args.json';
export { default as dashboardPopularPagesData } from './dashboard-popular-pages-widget-data.json';
export { default as pageDashboardBounceRateWidgetArgs } from './page-dashboard-bounce-rate-widget-args.json';
export { default as pageDashboardBounceRateWidgetData } from './page-dashboard-bounce-rate-widget-data.json';
export { default as dashboardBounceRateWidgetData } from './dashboard-bounce-rate-widget-data.json';
export { default as dashboardBounceRateWidgetArgs } from './dashboard-bounce-rate-widget-args.json';
export { default as dashboardGoalsWidgetData } from './dashboard-goals-widget-data.json';
export { default as dashboardGoalsWidgetArgs } from './dashboard-goals-widget-args.json';
export { default as dashboardUserDimensionsData } from './dashboard-user-dimensions-data.json';
export { default as dashboardUserDimensionsArgs } from './dashboard-user-dimensions-args.json';
export { default as dashboardUserTotalsData } from './dashboard-user-totals-data.json';
export { default as dashboardUserTotalsArgs } from './dashboard-user-totals-args.json';
export { default as dashboardUserGraphData } from './dashboard-user-graph-data.json';
export { default as dashboardUserGraphArgs } from './dashboard-user-graph-args.json';
export { default as wpDashboardPopularPagesArgs } from './wp-dashboard-popular-pages-args.json';
export { default as wpDashboardPopularPagesData } from './wp-dashboard-popular-pages-data.json';
export { default as wpDashboardUniqueVisitorsArgs } from './wp-dashboard-unique-visitors-args.json';
export { default as wpDashboardUniqueVisitorsData } from './wp-dashboard-unique-visitors-data.json';
export { default as wpDashboardSessionDurationArgs } from './wp-dashboard-session-duration-args.json';
export { default as wpDashboardSessionDurationData } from './wp-dashboard-session-duration-data.json';
export * from './dashboard-unique-visitors-data';
export * from './dashboard-unique-visitors-args';
export { pageDashboardUniqueVisitorsSparkData, pageDashboardUniqueVisitorsVisitorData } from './page-dashboard-unique-visitors-data';
export { pageDashboardUniqueVisitorsSparkArgs, pageDashboardUniqueVisitorsVisitorArgs } from './page-dashboard-unique-visitors-args';
import defaultSettings from './settings--default.json';

export const settings = {
	default: defaultSettings,
};
