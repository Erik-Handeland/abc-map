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

import { Config } from './Config';
import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe('Config', () => {
  it('should return correct paths', () => {
    const config = new Config();
    assert.isTrue(fs.existsSync(path.resolve(config.getProjectRoot(), 'lerna.json')));
    assert.isTrue(fs.existsSync(path.resolve(config.getCliRoot(), 'src/parser/Parser.ts')));
    assert.isTrue(fs.existsSync(path.resolve(config.getDevServicesRoot(), 'docker-compose.yml')));
    assert.isTrue(fs.existsSync(path.resolve(config.getServerRoot(), 'src/server/HttpServer.ts')));
    assert.isTrue(fs.existsSync(path.resolve(config.getFrontendRoot(), 'src/App.tsx')));
    assert.isTrue(fs.existsSync(path.resolve(config.getE2eRoot(), 'src/plugins/index.js')));
    assert.isTrue(fs.existsSync(path.resolve(config.getChartRoot(), 'Chart.yaml')));
  });
});
