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

import Cls from './MapView.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import MainMap from './main-map/MainMap';
import LayerControls from './layer-controls/LayerControls';
import FeatureControls from './feature-controls/FeatureControls';
import ProjectStatus from './project-status/ProjectStatus';
import { Logger } from '@abc-map/shared';
import ProjectControls from './project-controls/ProjectControls';
import ToolSelector from './tool-selector/ToolSelector';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import { LayerWrapper } from '../../core/geo/layers/LayerWrapper';
import Search from './search/Search';
import ImportData from './import-data/ImportData';
import CursorPosition from './cursor-position/CursorPosition';
import { MainMapKeyboardListener } from './MainMapKeyboardListener';
import { pageSetup } from '../../core/utils/page-setup';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../i18n/i18n';
import { IconDefs } from '../../components/icon/IconDefs';
import SideMenu from '../../components/side-menu/SideMenu';
import { useServices } from '../../core/useServices';
import { FullscreenButton } from './fullscreen-button/FullscreenButton';
import { isDesktopDevice } from '../../core/ui/isDesktopDevice';
import { Scale } from '../../components/scale/Scale';
import { Attributions } from './main-map/attributions/Attributions';
import { Zoom } from './main-map/zoom/Zoom';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';

const logger = Logger.get('MapView.tsx');

const t = prefixedTranslation('MapView:');

function MapView() {
  const { geo } = useServices();
  const [layers, setLayers] = useState<LayerWrapper[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerWrapper | undefined>();
  const [features, setFeatures] = useState<FeatureWrapper[]>([]);

  const mainMap = geo.getMainMap();

  // Page title
  useEffect(() => pageSetup(t('The_map'), t('Visualize_and_create_in_your_browser')), []);

  // When layer list change we update layer list state
  const handleLayerChange = useCallback(() => {
    logger.debug('Layers changed');
    setLayers(mainMap.getLayers());
    setActiveLayer(mainMap.getActiveLayer());
    setFeatures(mainMap.getActiveFeatures());
  }, [mainMap]);

  useEffect(() => {
    mainMap.addLayerChangeListener(handleLayerChange);
    handleLayerChange(); // We manually trigger the first setup

    return () => mainMap.removeLayerChangeListener(handleLayerChange);
  }, [handleLayerChange, mainMap]);

  // Keyboard shortcuts
  useEffect(() => {
    const listener = MainMapKeyboardListener.create();
    listener.initialize();

    return () => listener.destroy();
  }, []);

  return (
    <div className={Cls.mapView}>
      {/*Map Viewp*/}
      <MainMap />

      {/*Map Overlays:*/}
      {/* Toggle fullscreen button*/}
      <FullscreenButton style={{ top: '6vh', left: '50vw' }} />

      {/* Search menu  TODO Replace with search bar*/}
      <SideMenu
        title={t('Search_menu')}
        buttonIcon={IconDefs.faSearch}
        buttonStyle={{ top: '6vh', left: '30vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-search'}
        data-cy={'search-menu'}
      >
        <div className={Cls.spacer} />
        <Search />
        <div className={'flex-grow-1'} />
        <CursorPosition />
        <div className={Cls.spacer} />
      </SideMenu>

      {/* Project menu TODO replace with Dropdown similar to UserMenu and change to gear icon aka ProjectSettings*/}
      <SideMenu
        title={t('Project_menu')}
        buttonIcon={IconDefs.faFileAlt}
        buttonStyle={{ top: '6vh', left: '54vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-project'}
        data-cy={'project-menu'}
      >
        <div className={Cls.spacer} />
        <ProjectStatus />
        <ProjectControls />
        <ImportData />
        <div className={'flex-grow-1'} />
        <div className={Cls.spacer} />
      </SideMenu>

      {/* Draw Tool menu */}
      <SideMenu
        title={t('Tools_menu')}
        buttonIcon={IconDefs.faScrewdriverWrench}
        buttonStyle={{ top: '50vh', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-tools'}
        initiallyOpened={isDesktopDevice()}
        data-cy={'tools-menu'}
      >
        <HistoryControls historyKey={HistoryKey.Map} />
        <ToolSelector activeLayer={activeLayer} />
      </SideMenu>

      {/* Draw Layer and feature menu */}
      <SideMenu
        title={t('Layers_menu')}
        buttonIcon={IconDefs.faDraftingCompass}
        buttonStyle={{ top: '50vh', right: '2vw' }}
        menuPlacement={'right'}
        menuId={'views/MapView-layers'}
        initiallyOpened={isDesktopDevice()}
        data-cy={'layers-menu'}
      >
        <LayerControls layers={layers} />
        <FeatureControls features={features} />
      </SideMenu>

      {/*Main map Bottom Bar*/}
      <div className={Cls.bottomBar}>
        {/* TODO Center Scale */}
        <Scale map={mainMap} className={Cls.scale} />

        <div className={Cls.controls}>
          <Attributions map={mainMap} />
          <Zoom map={mainMap} />
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(MapView);
