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
import { render } from '@testing-library/react';
import NotFoundView from './NotFoundView';
import { MemoryRouter } from 'react-router-dom';

describe('NotFoundView', () => {
  it('should add noindex meta', () => {
    render(<NotFoundView />, { wrapper: MemoryRouter });

    expect(document.head.innerHTML).toContain(`<meta name="robots" content="noindex">`);
  });

  it('should remove noindex meta', () => {
    const { unmount } = render(<NotFoundView />, { wrapper: MemoryRouter });
    unmount();

    expect(document.head.innerHTML).not.toContain(`<meta name="robots" content="noindex">`);
  });
});
