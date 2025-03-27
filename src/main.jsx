// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import SearchWidget from './SearchWidget.jsx'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <SearchWidget />
//   </React.StrictMode>,
// )
import React from 'react';
import { renderSearchWidget } from './SearchWidget';

// Ensure DOM is fully loaded before attempting to render
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, attempting to render');
  renderSearchWidget('search-widget');
});