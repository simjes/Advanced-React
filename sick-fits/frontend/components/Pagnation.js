import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';
import { perPage } from '../config';
import DisplayError from './ErrorMessage';
import PagnationStyles from './styles/PaginationStyles';

const PAGNATION_QUERY = gql`
  query PAGNATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagnation = props => (
  <Query query={PAGNATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;

      if (error) return <DisplayError error={error} />;

      const { count } = data.itemsConnection.aggregate;
      const pages = Math.ceil(count / perPage);
      const { page } = props;

      return (
        <PagnationStyles>
          <Head>
            <title>
              Sick Fits | Page {page} of {pages}
            </title>
          </Head>

          <Link
            prefetch
            href={{ pathname: 'items', query: { page: page - 1 } }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ⬅ Prev
            </a>
          </Link>

          <p>
            Page {page} of {pages}
          </p>

          <p>Page {count} Items Total</p>

          <Link
            prefetch
            href={{ pathname: 'items', query: { page: page + 1 } }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next ➡
            </a>
          </Link>
        </PagnationStyles>
      );
    }}
  </Query>
);

export default Pagnation;
