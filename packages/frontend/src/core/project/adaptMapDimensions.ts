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

import { DimensionsPx } from '../utils/DimensionsPx';
import { getViewportDimensions } from '../ui/getViewportDimensions';

/**
 * Return shared map dimensions adapted to viewport.
 * @param fullscreen
 * @param mapDimensions
 */
export function adaptMapDimensions(fullscreen: boolean, mapDimensions: DimensionsPx): DimensionsPx {
  const viewport = getViewportDimensions();
  if (!viewport) {
    return mapDimensions;
  }

  // Fullscreen, we return viewport dimensions
  if (fullscreen) {
    return viewport;
  }

  // Map is bigger than viewport, we return viewport dimensions (e.g. in responsive iframes)
  if (mapDimensions.width > viewport.width || mapDimensions.height > viewport.height) {
    return viewport;
  }

  return mapDimensions;
}
