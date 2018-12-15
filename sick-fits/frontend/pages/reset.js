import ResetPassword from '../components/ResetPassword';

const Reset = props => (
  <div>
    <p>Reset your password</p>
    <ResetPassword resetToken={props.query.resetToken} />
  </div>
);

export default Reset;
