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

import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
import { EventsKey } from 'ol/events';
import { Select } from 'ol/interaction';
import { withGeometryOfType } from '../helpers/common-conditions';
import { LayerWrapper } from '../../../geo/layers/LayerWrapper';
import { DefaultTolerancePx } from '../constants';
import { SelectEvent } from 'ol/interaction/Select';
import { SupportedGeometry } from './SupportedGeometry';
import { FeatureStyle } from '@abc-map/shared';
import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';

export declare type StyleSelectionHandler = (style: FeatureStyle, feat: FeatureWrapper) => void;

export interface Options {
  condition: (ev: MapBrowserEvent<UIEvent>) => boolean;
}

/**
 * This object bundles selection interactions.
 *
 * It also listen vector source for removed or added features, then update selection.
 * - If features added, per example with "duplicate" button, and selected, they are added to selection.
 * - If features removed, per example with "delete" button, they are removed from selection.
 */
export class SelectionInteractionsBundle {
  public onStyleSelected?: StyleSelectionHandler;

  private features = new Collection<Feature<Geometry>>();

  private map?: Map;
  private source?: VectorSource<Geometry>;
  private select?: Select;
  private sourceListeners: EventsKey[] = [];

  constructor(private options: Options) {}

  public setup(map: Map, source: VectorSource<Geometry>, geometryTypes: SupportedGeometry[]) {
    this.map = map;
    this.source = source;

    this.select = new Select({
      condition: this.options.condition,
      toggleCondition: this.options.condition,
      layers: (lay) => LayerWrapper.from(lay).isActive(),
      filter: (feat) => withGeometryOfType(feat, geometryTypes),
      // Warning: here we must use null to not manage styles with Select interaction
      // Otherwise modification of style can be 'restored' from a bad state
      style: null,
      hitTolerance: DefaultTolerancePx,
      features: this.features,
    });

    this.select.on('select', (ev: SelectEvent) => {
      // We dispatch style of last selected feature
      if (ev.selected.length) {
        const last = FeatureWrapper.from(ev.selected[ev.selected.length - 1]);
        this.onStyleSelected && this.onStyleSelected(last.getStyleProperties(), last);
      }

      // We update selection properties of features
      ev.selected.forEach((f) => FeatureWrapper.from(f).setSelected(true));
      ev.deselected.forEach((f) => FeatureWrapper.from(f).setSelected(false));
    });

    // When vector source change we update selection
    this.sourceListeners.push(source.on('addfeature', this.handleFeatureAdded));
    this.sourceListeners.push(source.on('removefeature', this.handleFeatureRemoved));
    this.sourceListeners.push(source.on('clear', this.handleClear));

    map.addInteraction(this.select);
  }

  private handleFeatureAdded = (evt: VectorSourceEvent<Geometry>) => {
    if (evt.feature && FeatureWrapper.from(evt.feature)?.isSelected()) {
      this.features.push(evt.feature);
    }

    this.removeUnselected();
  };

  private handleFeatureRemoved = (evt: VectorSourceEvent<Geometry>) => {
    if (evt.feature) {
      FeatureWrapper.from(evt.feature).setSelected(false);
      this.features.remove(evt.feature);
    }

    this.removeUnselected();
  };

  private handleClear = () => {
    this.clear();
  };

  // When source change, some features may be unselected (eg, after a "duplicate")
  private removeUnselected = () => {
    this.features
      .getArray()
      .slice()
      .forEach((feat) => {
        if (!FeatureWrapper.from(feat).isSelected()) {
          this.features.remove(feat);
        }
      });
  };

  public clear(): void {
    this.features.forEach((f) => FeatureWrapper.from(f).setSelected(false));
    this.features.clear();
  }

  public getFeatures(): Collection<Feature<Geometry>> {
    return this.features;
  }

  public dispose() {
    if (this.select) {
      this.clear();
      this.select.dispose();
      this.map?.removeInteraction(this.select);
    }

    // FIXME: event types typings are wrong
    this.sourceListeners.forEach((listener) => this.source?.un(listener.type as any, listener.listener));
  }
}
