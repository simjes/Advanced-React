import Downshift, { resetIdCounter } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import Router from 'next/router';
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

const routeToItem = item => {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
};

class AutoComplete extends Component {
  state = {
    items: [],
    loading: false,
  };

  onChange = debounce(async (e, client) => {
    this.setState({ loading: true });

    // Manually query apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    });

    this.setState({
      items: res.data.items,
      loading: false,
    });
  }, 350);

  render() {
    const { items, loading } = this.state;

    resetIdCounter();

    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={item => (item === null ? '' : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      id: 'search',
                      type: 'search',
                      placeholder: 'Search for an item',
                      className: loading ? 'loading' : '',
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>

              {isOpen && (
                <DropDown>
                  {items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}

                  {!items.length &&
                    !loading && (
                      <DropDownItem>
                        Nothing found for {inputValue}
                      </DropDownItem>
                    )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
