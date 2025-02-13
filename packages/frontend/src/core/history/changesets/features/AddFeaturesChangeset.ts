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

import { Changeset } from '../../Changeset';
import VectorSource from 'ol/source/Vector';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import Geometry from 'ol/geom/Geometry';

export class AddFeaturesChangeset extends Changeset {
  constructor(public readonly source: VectorSource<Geometry>, public readonly features: FeatureWrapper[]) {
    super();
  }

  public async apply(): Promise<void> {
    this.source.addFeatures(this.features.map((f) => f.unwrap()));
  }

  public async undo(): Promise<void> {
    this.features.forEach((feat) => this.source.removeFeature(feat.unwrap()));
  }
}
