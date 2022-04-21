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
import { HistoryKey } from '../../../core/history/HistoryKey';
import GeometryListItem from './list-item/GeometryListItem';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { ServiceProps, withServices } from '../../../core/withServices';
import Cls from './GeometryControls.module.scss';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { SetActiveLayerChangeset } from '../../../core/history/changesets/layers/SetActiveLayerChangeset';
import CommonActions from '../tool-selector/_common/common-actions/CommonActions';

const logger = Logger.get('GeometryControls.tsx');

interface LocalProps {
  layers: LayerWrapper[];
}

interface State {
  editLayer?: LayerWrapper;
  addModalVisible: boolean;
}

declare type Props = LocalProps & ServiceProps;

const t = prefixedTranslation('MapView:');

class GeometryControls extends Component<Props, State> {
  private listRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { addModalVisible: false };
  }

  public render(): ReactNode {
    const layers = this.props.layers;

    return (
      <div className={`control-block ${Cls.geometryControls}`}>
        <div className={Cls.titleRow}>{t('Geometry')}</div>

        {/* List of layers */}
        <div className={`control-item ${Cls.geometryList}`} data-cy="layers-list" ref={this.listRef}>
          {!layers.length && <div className={Cls.noGeometry}>{t('No_layer')}</div>}
          {layers
            .map((layer) => {
              const metadata = layer.getMetadata();
              if (!metadata) {
                logger.error('Unsupported layer: ', layer);
                return undefined;
              }
              return (
                <GeometryListItem key={metadata.id} metadata={metadata} onSelect={this.handleSelection} onToggleVisibility={this.handleToggleVisibility} />
              );
            })
            .filter((elem) => !!elem)}
        </div>

        {/* Controls */}
        <CommonActions />
      </div>
    );
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const previousIds = prevProps.layers.map((lay) => lay.getId());
    const layerIds = this.props.layers.map((lay) => lay.getId());
    if (!isEqual(previousIds, layerIds)) {
      // We scroll to bottom of list if layer list change
      const div = this.listRef.current;
      if (div) {
        div.scrollTop = div.scrollHeight;
      }
    }
  }

  private handleSelection = (layerId: string) => {
    const { geo, toasts, history } = this.props.services;

    const map = geo.getMainMap();

    if (map.getActiveLayer()?.getId() === layerId) {
      return;
    }

    const layer = map.getLayers().find((lay) => lay.getId() === layerId);

    if (!layer) {
      logger.error('Layer not found: ' + layerId);
      toasts.genericError();
      return;
    }

    // We set it active
    const setActiveLayer = SetActiveLayerChangeset.create(layer);
    setActiveLayer
      .apply()
      // We register action in history
      .then(() => history.register(HistoryKey.Map, setActiveLayer))
      .catch((err) => logger.error('Cannot set layer active', err));
  };

  //TODO Allow hiding geometry
  private handleToggleVisibility = (layerId: string) => {
    // const { geo, history } = this.props.services;
    // const map = geo.getMainMap();
    // const layer = map.getLayers().find((lay) => lay.getId() === layerId);
    // if (!layer) {
    //   logger.error('Layer not found: ', layerId);
    //   return;
    // }
    // const toggle = async () => {
    //   const cs = new ToggleLayerVisibilityChangeset(map, layer, !layer.isVisible());
    //   await cs.apply();
    //   history.register(HistoryKey.Map, cs);
    // };
    // toggle().catch((err) => logger.error('Cannot toggle visibility of layer', err));
    return layerId;
  };
}

export default withTranslation()(withServices(GeometryControls));
