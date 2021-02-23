import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";

import Header from ".";

import routes from "../../constants/routes";

test("navigates to add form when click on menu item", () => {
  let testHistory, testLocation: any;

  render(
    <MemoryRouter>
      <Header />
      <Route
        path="*"
        render={({ history, location }) => {
          testHistory = history;
          testLocation = location;
          return null;
        }}
      />
    </MemoryRouter>
  );

  const menuItem = screen.getByText("Adicionar usuário");

  fireEvent.click(menuItem);

  expect(testLocation?.pathname).toBe(routes.ADD_USER);
});
