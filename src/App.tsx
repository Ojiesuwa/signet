import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Scanning from "./pages/Scanning/Scanning";
import Setup from "./pages/Setup/Setup";

function App() {
  const routes = [
    {
      path: "/",
      component: <Scanning />,
    },
    {
      path: "/setup",
      component: <Setup />,
    },
  ];

  return (
    <div className={"App"}>
      <BrowserRouter>
        <img src="/device-frame.png" alt="" className="device__frame" />
        <Routes>
          {routes.map((data) => (
            <Route path={data.path} element={data.component} />
          ))}
        </Routes>
        <ToastContainer
          position={"top-center"}
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
          closeButton={false}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
