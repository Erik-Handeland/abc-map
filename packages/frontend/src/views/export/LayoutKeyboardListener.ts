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

import { getServices, Services } from '../../core/Services';
import { HistoryKey } from '../../core/history/HistoryKey';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import Mousetrap from 'mousetrap';
import { RemoveLayoutsChangeset } from '../../core/history/changesets/layouts/RemoveLayoutsChangeset';
import { HistoryKeyboardListener } from '../../core/ui/HistoryKeyboardListener';

const logger = Logger.get('LayoutKeyboardListener.ts');

const t = prefixedTranslation('core:LayoutKeyboardListener.');

export class LayoutKeyboardListener {
  public static create() {
    return new LayoutKeyboardListener(getServices());
  }

  private historyListeners?: HistoryKeyboardListener;

  constructor(private services: Services) {}

  public initialize(): void {
    this.historyListeners = HistoryKeyboardListener.create(HistoryKey.Export);
    this.historyListeners.initialize();

    Mousetrap.bind('del', this.deleteActiveLayout);
  }

  public destroy(): void {
    this.historyListeners?.destroy();

    Mousetrap.unbind('del');
  }

  private deleteActiveLayout = () => {
    const { history, toasts, project } = this.services;

    const layout = project.getActiveLayout();
    if (!layout) {
      toasts.info(t('Nothing_to_delete'));
      return;
    }

    const apply = async () => {
      const cs = RemoveLayoutsChangeset.create([layout]);
      await cs.apply();
      history.register(HistoryKey.Export, cs);
    };

    apply().catch((err) => logger.error('Cannot delete layout: ', err));
  };
}
