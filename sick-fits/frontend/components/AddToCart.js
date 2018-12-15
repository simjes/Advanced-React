import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    const { id } = this.props;

    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{ id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(addToCart, { loading }) => (
          <button type="button" onClick={addToCart} disabled={loading}>
            Add
            {loading ? 'ing' : ''} to Cart
          </button>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;
