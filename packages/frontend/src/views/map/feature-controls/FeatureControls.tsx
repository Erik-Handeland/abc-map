/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import FeatureListItem from './list-item/FeatureListItem';
import { ServiceProps, withServices } from '../../../core/withServices';
import Cls from './FeatureControls.module.scss';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import CommonActions from '../tool-selector/_common/common-actions/CommonActions';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';

const logger = Logger.get('FeatureControls.tsx');

interface LocalProps {
  features: FeatureWrapper[];
}

interface State {
  editLayer?: FeatureWrapper;
  addModalVisible: boolean;
}

declare type Props = LocalProps & ServiceProps;

const t = prefixedTranslation('MapView:');

class FeatureControls extends Component<Props, State> {
  private listRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { addModalVisible: false };
  }

  public render(): ReactNode {
    const features = this.props.features;

    return (
      <div className={`control-block ${Cls.featureControls}`}>
        <div className={Cls.titleRow}>{t('Features')}</div>

        {/* List of features */}
        <div className={`control-item ${Cls.featureList}`} data-cy="features-list" ref={this.listRef}>
          {!features.length && <div className={Cls.noFeature}>{t('No_Features')}</div>}
          {features
            .map((feature) => {
              const metadata = feature.getAllProperties();
              if (!metadata) {
                logger.error('Unsupported feature: ', feature);
                return undefined;
              }
              return <FeatureListItem key={metadata.id} metadata={metadata} onSelect={this.handleSelection} onToggleVisibility={this.handleToggleVisibility} />;
            })
            .filter((elem) => !!elem)}
        </div>

        {/* Controls */}
        <CommonActions />
      </div>
    );
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const previousIds = prevProps.features.map((lay) => lay.getId());
    const layerIds = this.props.features.map((lay) => lay.getId());
    if (!isEqual(previousIds, layerIds)) {
      // We scroll to bottom of list if feature list change
      const div = this.listRef.current;
      if (div) {
        div.scrollTop = div.scrollHeight;
      }
    }
  }

  private handleSelection = (featureId: string) => {
    const { geo, toasts } = this.props.services;

    const map = geo.getMainMap();
    const feature = map.getFeaturesByID(featureId);

    if (!feature) {
      logger.error('Feature not found: ' + featureId);
      toasts.error('Feature not found: ' + featureId);
      return;
    }

    // Feature found, select or deselect it
    feature.isSelected() ? feature.setSelected(false) : feature.setSelected(true);
    map.triggerLayerChange();
  };

  //TODO Allow hiding feature
  private handleToggleVisibility = (layerId: string) => {
    // const { geo, history } = this.props.services;
    // const map = geo.getMainMap();
    // const feature = map.getLayers().find((lay) => lay.getId() === layerId);
    // if (!feature) {
    //   logger.error('feature not found: ', layerId);
    //   return;
    // }
    // const toggle = async () => {
    //   const cs = new ToggleLayerVisibilityChangeset(map, feature, !feature.isVisible());
    //   await cs.apply();
    //   history.register(HistoryKey.Map, cs);
    // };
    // toggle().catch((err) => logger.error('Cannot toggle visibility of feature', err));
    return layerId;
  };
}

export default withTranslation()(withServices(FeatureControls));
