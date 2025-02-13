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

import { DatabaseMigrationScript } from '../../DatabaseMigrationScript';
import { MongodbClient } from '../../../MongodbClient';
import { ProjectDao } from '../../../../projects/ProjectDao';

/**
 * This script add public field to project document
 */
export class S2022_01_04_AddPublicField implements DatabaseMigrationScript {
  public static create(client: MongodbClient): S2022_01_04_AddPublicField {
    return new S2022_01_04_AddPublicField(new ProjectDao(client));
  }

  constructor(private dao: ProjectDao) {}

  public getName(): string {
    return 'S2022_01_04_AddPublicField';
  }

  public async migrate(): Promise<void> {
    // FIXME: we should paginate here
    const projects = await this.dao.findAllMetadata(1000);

    const updates = projects.map((pr) => ({ ...pr, public: false }));

    await this.dao.saveAllMetadata(updates);
  }
}
