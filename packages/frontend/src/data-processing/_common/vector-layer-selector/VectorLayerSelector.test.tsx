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

import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import { abcRender } from '../../../core/utils/test/abcRender';
import { screen } from '@testing-library/react';
import VectorLayerSelector from './VectorLayerSelector';
import sinon, { SinonStub } from 'sinon';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { PredefinedLayerModel } from '@abc-map/shared';
import userEvent from '@testing-library/user-event';

describe('VectorLayerSelector', () => {
  let map: MapWrapper;
  let services: TestServices;
  let handleSelected: SinonStub;
  beforeEach(() => {
    map = MapFactory.createNaked();
    services = newTestServices();
    handleSelected = sinon.stub();

    services.geo.getMainMap.returns(map);
  });

  it('should render without layers', () => {
    // Act
    abcRender(<VectorLayerSelector value={undefined} label={'Couche vecteur:'} onSelected={handleSelected} data-cy={'test-data-cy'} />, { services });

    // Assert
    expect(screen.getByText('Couche vecteur:')).toBeDefined();

    const select = screen.getByTestId('vector-layer-selector');
    expect(select).toBeDefined();
    expect(select.dataset['cy']).toEqual('test-data-cy');
  });

  it('should render with layers', () => {
    map.addLayer(LayerFactory.newVectorLayer().setName('Layer 1'));
    map.addLayer(LayerFactory.newVectorLayer().setName('Layer 2'));
    map.addLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenToner));

    // Act
    abcRender(<VectorLayerSelector value={undefined} onSelected={handleSelected} />, { services });

    // Assert
    expect(screen.getByText('Layer 1')).toBeDefined();
    expect(screen.getByText('Layer 2')).toBeDefined();
  });

  it('should watch layers', () => {
    map.addLayer(LayerFactory.newVectorLayer().setName('Layer 1'));
    map.addLayer(LayerFactory.newVectorLayer().setName('Layer 2'));
    map.addLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenToner));

    abcRender(<VectorLayerSelector value={undefined} onSelected={handleSelected} />, { services });

    // Act
    map.addLayer(LayerFactory.newVectorLayer().setName('Layer 3'));

    // Assert
    expect(screen.getByText('Layer 1')).toBeDefined();
    expect(screen.getByText('Layer 2')).toBeDefined();
    expect(screen.getByText('Layer 3')).toBeDefined();
  });

  it('should notify on layer selected', () => {
    const layer1 = LayerFactory.newVectorLayer().setName('Layer 1');
    map.addLayer(layer1);
    map.addLayer(LayerFactory.newVectorLayer().setName('Layer 2'));
    map.addLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenToner));

    abcRender(<VectorLayerSelector value={undefined} onSelected={handleSelected} />, { services });

    // Act
    userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), ['Layer 1']);

    // Assert
    expect(handleSelected.callCount).toEqual(1);
    expect(handleSelected.args[0]).toEqual([layer1]);
  });

  it('should notify if layer unselected', () => {
    const layer1 = LayerFactory.newVectorLayer().setName('Layer 1');
    map.addLayer(layer1);

    abcRender(<VectorLayerSelector value={undefined} onSelected={handleSelected} />, { services });

    userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), ['Layer 1']);
    handleSelected.reset();

    // Act
    userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), ['Select a layer']);

    // Assert
    expect(handleSelected.callCount).toEqual(1);
    expect(handleSelected.args[0]).toEqual([undefined]);
  });
});
