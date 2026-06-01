import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./app/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />

    <Toaster position="top-right" reverseOrder={false} />
  </Provider>,
);
