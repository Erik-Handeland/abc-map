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

import { AbstractDataReader } from './AbstractDataReader';
import { FileFormat, FileFormats } from '../FileFormats';
import { AbcFile, LayerType, WmsDefinitionManifest, WmsMetadata } from '@abc-map/shared';
import * as yaml from 'js-yaml';
import { BlobIO } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import uuid from 'uuid-random';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import { ModalService } from '../../ui/ModalService';
import { variableExpansion, VariableMap } from '../../utils/variableExpansion';
import { ModalStatus } from '../../ui/typings';
import { prefixedTranslation } from '../../../i18n/i18n';
import { ReadResult, ReadStatus } from '../ReadResult';
import { GeoService } from '../../geo/GeoService';

const logger = Logger.get('WmsDefinitionReader.ts');

const t = prefixedTranslation('core:DataReader.');

export class WmsDefinitionReader extends AbstractDataReader {
  constructor(private geo: GeoService, private modals: ModalService) {
    super();
  }

  public async isSupported(files: AbcFile<Blob>[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION).length > 0;
  }

  public async read(files: AbcFile<Blob>[]): Promise<ReadResult> {
    const definitions = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMS_DEFINITION);
    const layers: LayerWrapper[] = [];
    for (const file of definitions) {
      // We read definition
      const fileContent = await BlobIO.asString(file.content);
      const definition = yaml.load(fileContent) as WmsDefinitionManifest | undefined;
      if (!definition || !definition.wms.urls?.length || !definition.wms.urls) {
        return Promise.reject(new Error(`Invalid WMS definition: ${JSON.stringify(definition)}`));
      }

      // We load projection if any
      if (definition.wms.projection?.name) {
        await this.geo.loadProjection(definition.wms.projection?.name);
      }

      // We prompt variables if needed
      let variables: VariableMap = {};
      if (definition.wms.prompt) {
        const result = await this.modals.promptVariables(t('Further_information'), t('You_must_full_in_this_form'), definition.wms.prompt);
        if (result.status === ModalStatus.Canceled) {
          return { status: ReadStatus.Canceled };
        }
        variables = result.variables;
      }

      // We create layer
      const authentication = definition.wms.auth
        ? {
            username: variableExpansion(definition.wms.auth.username, variables),
            password: variableExpansion(definition.wms.auth.password, variables),
          }
        : undefined;

      const settings = {
        remoteUrls: definition.wms.urls.map((url) => variableExpansion(url, variables)),
        remoteLayerName: definition.wms.remoteLayerName,
        projection: definition.wms.projection,
        extent: definition.wms.extent,
        auth: authentication,
      };

      const layer = LayerFactory.newWmsLayer(settings);

      // We update metadata
      const metadata: WmsMetadata = {
        id: uuid(),
        name: definition.wms.remoteLayerName,
        type: LayerType.Wms,
        active: false,
        opacity: 1,
        visible: true,
        remoteUrls: definition.wms.urls,
        remoteLayerName: definition.wms.remoteLayerName,
        projection: definition.wms.projection,
        extent: definition.wms.extent,
        auth: definition.wms.auth,
      };
      layer.setMetadata(metadata);

      layers.push(layer);
    }

    return { status: ReadStatus.Succeed, layers };
  }
}
