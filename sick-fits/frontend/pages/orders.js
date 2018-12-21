import Orders from '../components/Orders';
import PleaseSignIn from '../components/PleaseSignin';

const OrdersPage = props => (
  <div>
    <PleaseSignIn>
      <Orders />
    </PleaseSignIn>
  </div>
);

export default OrdersPage;
