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

import React, { useCallback } from 'react';
import Cls from './FeatureListItem.module.scss';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { PropertiesMap } from '../../../../core/geo/features/FeatureWrapper';
import { FeatureProperties } from '@abc-map/shared/build/project/feature/FeatureProperties';

interface Props {
  metadata: PropertiesMap;
  onSelect: (id: string) => void;
  onToggleVisibility: (lay: string) => void;
}

function FeatureListItem(props: Props) {
  const meta = props.metadata;
  const id = meta.id; // meta.geometry.ol_uid
  const itemClasses = meta[FeatureProperties.Selected] ? `${Cls.listItem} ${Cls.active}` : `${Cls.listItem}`;
  //const icon = meta.visible ? IconDefs.faEye : IconDefs.faEyeSlash;

  const handleSelect = useCallback(() => {
    props.onSelect(id);
  }, [props, id]);

  return (
    <div className={itemClasses} data-cy={'list-item'}>
      {/* Eye icon, visible only if Feature is visible */}
      {/* <FaIcon icon={icon} size={'1.2rem'} /> */}
      <div className={'flex-grow-1'} onClick={handleSelect}>
        {id + ' ' + meta[FeatureProperties.Name]}
        {/* {'Data:' + JSON.stringify(meta)} */}
      </div>
    </div>
  );
}

export default FeatureListItem;
