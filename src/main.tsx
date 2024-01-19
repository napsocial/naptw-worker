/**
 * 
 * ############################################
 * ##                                        ##
 * ##            The NAP Platform            ##
 * ##         NAP Shortener Projecet         ##
 * ##                                        ##
 * ##    Copyright (c) 2024 SanZi Network    ##
 * ##       Copyright (c) 2024 Muisnow       ##
 * ##                                        ##
 * ############################################
 * 
 * @copyright Copyright (c) 2024 SanZi Network
 * @copyright Copyright (c) 2024 The NAP Platform Project
 *
 * Contact Information:
 *     NAP Shortener Project is a private project made by Muisnow. For the source code
 *     issue, please contact Muisnow or SanZi Network's maintainer using following
 *     methods.
 *
 *     Contact with Muisnow:
 *         Mail     - muisnow@sanzi.io
 *         Mastodon - @muisnow@nap.social
 *         Twitter  - @Hen000000hen
 *
 *     Contact with Maintainer:
 *         Mail     - service@sanzi.io
 *         Mastodon - @sanzi@nap.social
 * 
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import App from './App.tsx';

import "./index.css";

const ga = !location.pathname.match("encryption") && "G-MSENQ0VVLY";
if (ga) ReactGA.initialize(ga);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
