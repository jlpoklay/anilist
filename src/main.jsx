import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Wrapper from './ProviderWrapper.jsx'
import View from './components/View.jsx'
import Home from './components/Home.jsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <Wrapper>
        <Home/>
      </Wrapper>
  },
  {
    path: 'view/:id',
    element:  <Wrapper>
                <View/>
              </Wrapper>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
          <RouterProvider router={router} />,
)
