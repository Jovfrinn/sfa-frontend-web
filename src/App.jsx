import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import { restoreSession } from "./store/authSlice";

function AppWrapper() {
  const api = import.meta.env.VITE_API_URI;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(restoreSession({}));
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URI}/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data.user;

        if (user) {
          dispatch(restoreSession({ token, user }));
        } else {
          dispatch(restoreSession({}));
        }
      } catch (error) {
        console.error("Session restore failed:", error);
        dispatch(restoreSession({}));
      }
    };

    fetchUser();
  }, [dispatch]);

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
