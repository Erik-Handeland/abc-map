import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '../../../core/utils/Logger';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { services } from '../../../core/Services';
import * as _ from 'lodash';
import { NominatimResult } from '../../../core/geo/NominatimResult';
import SearchResult from './SearchResult';
import Cls from './Search.module.scss';
import { fromLonLat } from 'ol/proj';

const logger = Logger.get('Search.tsx');

export interface State {
  query: string;
  results: NominatimResult[];
  loading: boolean;
}

export interface Props {
  map: MapWrapper;
}

class Search extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      loading: false,
    };
  }

  public render(): ReactNode {
    const results = this.state.results;
    const query = this.state.query;
    const loading = this.state.loading;
    return (
      <div className={'control-block'}>
        <div className={'control-item'}>
          <div className={'my-2'}>Rechercher sur la carte</div>
          <input type={'text'} className={'form-control'} value={this.state.query} onChange={this.handleSearch} data-cy={'search-on-map'} />
        </div>
        {query && (
          <>
            <div className={Cls.dropdown}>
              <div className={'d-flex justify-content-end mb-2'} onClick={this.handleClose}>
                <i className={'fa fa-times cursor-pointer'} />
              </div>
              {loading && <div className={Cls.message}>Chargement ...</div>}
              {!results.length && !loading && <div className={Cls.message}>Aucun résultat</div>}
              {results.map((res) => (
                <SearchResult key={res.osm_id} result={res} onClick={this.handleResultSelected} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  private handleSearch = (ev: ChangeEvent<HTMLInputElement>) => {
    const query = ev.currentTarget.value;
    this.setState({ query });
    this.search(query);
  };

  private search = _.throttle((query) => {
    this.setState({ loading: true });
    this.services.geo
      .geocode(query)
      .then((results) => {
        results.sort((res) => res.importance);
        logger.debug('Results: ', results);
        this.setState({ results });
      })
      .catch((err) => {
        logger.error('Error while geocoding: ', err);
        this.services.ui.toasts.genericError();
      })
      .finally(() => this.setState({ loading: false }));
  }, 500);

  private handleResultSelected = (res: NominatimResult) => {
    this.setState({ query: '' });

    const coords = res.boundingbox.map((n) => parseFloat(n)) as [number, number, number, number];

    const projection = this.services.geo.getMainMap().unwrap().getView().getProjection();
    const min = fromLonLat([coords[2], coords[0]], projection);
    const max = fromLonLat([coords[3], coords[1]], projection);

    const extent = [...min, ...max] as [number, number, number, number];

    this.props.map.moveTo(extent);
  };

  private handleClose = () => {
    this.setState({ query: '' });
  };
}

export default Search;
