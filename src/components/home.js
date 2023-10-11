import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <main className="h-100 mg-c is-flex jc-c ai-c">
        <div className="w-215 box pd-10 is-flex flex-column fg-4 ai-c jc-c">
          <Link className="w-200 button is-light" to="/ballances">
            Check ballances
          </Link>
          <Link className="w-200 button is-info is-light" to="/account">
            Account
          </Link>
        </div>
      </main>
    </>
  );
};
export default Home;
