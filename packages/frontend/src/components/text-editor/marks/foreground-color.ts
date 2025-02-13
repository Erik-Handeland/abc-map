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

import { Editor, Text, Transforms } from 'slate';

export const foregroundColor = {
  unset(editor: Editor) {
    Transforms.setNodes(editor, { foregroundColor: undefined }, { match: (n) => Text.isText(n), split: true });
  },

  set(editor: Editor, color: string) {
    Transforms.setNodes(editor, { foregroundColor: color }, { match: (n) => Text.isText(n), split: true });
  },
};
