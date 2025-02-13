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
import { generateSitemap } from './sitemap';
import { Language } from '@abc-map/shared';
import { assert } from 'chai';

describe('sitemap', () => {
  it('should return correct sitemap', () => {
    const actual = generateSitemap('http://domain.fr', [Language.English, Language.French]);

    const expected = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">

        <url>
          <loc>http://domain.fr/en</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en"/>
          <lastmod>2021-11-15</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1.0</priority>
        </url>

        <url>
          <loc>http://domain.fr/en/documentation</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en/documentation"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr/documentation"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en/documentation"/>
          <lastmod>2021-11-15</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.9</priority>
        </url>

        <url>
          <loc>http://domain.fr/en/funding</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en/funding"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr/funding"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en/funding"/>
          <lastmod>2021-11-15</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>

        <url>
          <loc>http://domain.fr/en/map</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en/map"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr/map"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en/map"/>
          <lastmod>2021-11-15</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>

        <url>
          <loc>http://domain.fr/en/legal-mentions</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en/legal-mentions"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr/legal-mentions"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en/legal-mentions"/>
          <lastmod>2021-11-15</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>

        <url>
          <loc>http://domain.fr/en/datastore</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en/datastore"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr/datastore"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en/datastore"/>
          <lastmod>2021-11-15</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>

        <url>
          <loc>http://domain.fr/en/share/settings</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en/share/settings"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr/share/settings"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en/share/settings"/>
          <lastmod>2022-01-04</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>

        <url>
          <loc>http://domain.fr/en/export</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/en/export"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/fr/export"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/en/export"/>
          <lastmod>2021-11-15</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>

      </urlset>
    `;

    // Uncomment this to fix test
    // require('fs').writeFileSync("actual.xml", actual)
    // require('fs').writeFileSync("expected.xml", expected)

    assert.equal(removeBlanks(removeDates(actual)), removeBlanks(removeDates(expected)));
  });
});

function removeBlanks(s: string): string {
  return s.replace(/\s/gi, '');
}

function removeDates(s: string): string {
  return s.replace(/<lastmod>[0-9]{4}-[0-9]{2}-[0-9]{2}<\/lastmod>/gi, '<lastmod>0000-00-00</lastmod>');
}
