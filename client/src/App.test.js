import { render, screen } from '@testing-library/react';
import { Provider } from "react-redux";
import App from './App';
import appStore from "./store/appStore";

test('renders the sign-in page', () => {
  render(
    <Provider store={appStore}>
      <App />
    </Provider>
  );
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
});
