import { combineReducers } from 'redux';
import { organization } from '../../containers/Application';
import redHatRepositories from './RedHatRepositories';
import { subscriptions } from '../../scenes/Subscriptions';
import { upstreamSubscriptions } from '../../scenes/Subscriptions/UpstreamSubscriptions';
import { manifestHistory } from '../../scenes/Subscriptions/Manifest';
import settings from '../../scenes/Settings';
import { subscriptionDetails } from '../../scenes/Subscriptions/Details';
import { setOrganization } from '../../components/SelectOrg/SetOrganization';
import { moduleStreams } from '../../scenes/ModuleStreams';
import { reducers as organizationProductsReducers } from '../OrganizationProducts';
import { moduleStreamDetails } from '../../scenes/ModuleStreams/Details';

export default combineReducers({
  organization,
  redHatRepositories,
  subscriptions,
  upstreamSubscriptions,
  manifestHistory,
  settings,
  subscriptionDetails,
  setOrganization,
  moduleStreams,
  moduleStreamDetails,
  ...organizationProductsReducers,
});
