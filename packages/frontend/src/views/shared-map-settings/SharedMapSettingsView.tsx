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

import Cls from './SharedMapSettingsView.module.scss';
import React, { useEffect, useRef } from 'react';
import { pageSetup } from '../../core/utils/page-setup';
import { Logger, UserStatus } from '@abc-map/shared';
import { useAppSelector } from '../../core/store/hooks';
import { EnableSharePanel } from './enable-share-panel/EnableSharePanel';
import SharedMapLayout from './shared-map-layout/SharedMapLayout';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { HistoryKeyboardListener } from '../../core/ui/HistoryKeyboardListener';
import { HistoryKey } from '../../core/history/HistoryKey';

const logger = Logger.get('SharedMapSettingsView.tsx');

const t = prefixedTranslation('SharedMapSettingsView:');

function SharedMapSettingsView() {
  // User status, project status
  // We must ensure that user is connected as we can share projects
  const publicMap = useAppSelector((st) => st.project.metadata.public);
  const userConnected = useAppSelector((st) => st.authentication.userStatus) === UserStatus.Authenticated;
  const showLayout = publicMap && userConnected;

  // Page setup on mount
  useEffect(() => pageSetup(t('Share'), t('Share_your_maps_online')), []);

  // Keyboard setup
  const keyboardListener = useRef<HistoryKeyboardListener>();
  useEffect(() => {
    keyboardListener.current = HistoryKeyboardListener.create(HistoryKey.SharedViews);
    keyboardListener.current?.initialize();

    return () => keyboardListener.current?.destroy();
  }, []);

  return (
    <div className={Cls.sharedMapSettings}>
      {/* User is not authenticated or map is not shared, we ask him to connect or share map */}
      {!showLayout && <EnableSharePanel />}
      {showLayout && <SharedMapLayout />}
    </div>
  );
}

export default withTranslation()(SharedMapSettingsView);
