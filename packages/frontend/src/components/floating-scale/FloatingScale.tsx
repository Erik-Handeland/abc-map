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

import Cls from './FloatingScale.module.scss';
import { Rnd, RndDragCallback } from 'react-rnd';
import { Scale } from '../scale/Scale';
import React, { useCallback } from 'react';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { AbcScale } from '@abc-map/shared';
import clsx from 'clsx';

interface Props {
  map: MapWrapper;
  scale: AbcScale;
  readOnly?: boolean;
  minWidth?: number;
  // Modify font sizes and dimensions based on this ratio. Useful for static exports.
  ratio?: number;
  baseFontSizeEm?: number;
  onChange?: (before: AbcScale) => void;
}

export function FloatingScale(props: Props) {
  const { map, scale, readOnly, minWidth, ratio, baseFontSizeEm, onChange } = props;

  const handleDragStop: RndDragCallback = useCallback(
    (ev, data) => {
      onChange && onChange({ ...scale, x: data.x, y: data.y });
    },
    [onChange, scale]
  );

  return (
    <Rnd position={{ x: scale.x, y: scale.y }} disableDragging={readOnly} onDragStop={handleDragStop} enableResizing={false} bounds={'parent'}>
      <Scale
        map={map}
        minWidth={minWidth}
        ratio={ratio}
        baseFontSizeEm={baseFontSizeEm}
        tooltip={false}
        className={clsx(Cls.scale, readOnly && Cls.readOnly)}
      />
    </Rnd>
  );
}
