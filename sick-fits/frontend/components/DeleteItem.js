import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.string,
  };

  deleteItem = async deleteItemMutation => {
    const { id } = this.props;

    await deleteItemMutation({
      variables: {
        id,
      },
    });
  };

  update = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id,
    );

    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    const { children, id } = this.props;

    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem();
              }
            }}
          >
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
