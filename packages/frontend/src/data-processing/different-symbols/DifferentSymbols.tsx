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

import { ReactNode } from 'react';
import { Module } from '../Module';
import DifferentSymbolsUi from './ui/DifferentSymbolsUi';
import { ModuleId } from '../ModuleId';

export class DifferentSymbols extends Module {
  public getId(): ModuleId {
    return ModuleId.DifferentSymbols;
  }

  public getI18nName(): string {
    return 'Different_symbols';
  }

  public getUserInterface(): ReactNode {
    return <DifferentSymbolsUi />;
  }
}
