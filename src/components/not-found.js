import { Link } from "react-router-dom";

const NotFound = () => (
  <>
    <main className="box is-flex flex-column ai-c jc-c h-100 fg-4">
      <header>404 Page not found</header>
      <Link to="/" className="button w-200">
        Go to Home page.
      </Link>
    </main>
  </>
);

export default NotFound;
