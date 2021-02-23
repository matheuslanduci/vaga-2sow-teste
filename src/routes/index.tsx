import { useAuth } from "../contexts/Auth";

import Public from "./Public";
import Private from "./Private";

export default function Routes() {
  const { signed } = useAuth();

  return signed ? <Private /> : <Public />;
}
