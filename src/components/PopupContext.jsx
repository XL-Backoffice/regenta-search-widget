import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseDate } from "@internationalized/date";
import useBodyClass from './useBodyClass';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [openFor, setOpenFor] = useState("normal")
  const [signupOpen, signupSetOpen] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isAllowLocation, setIsAllowLocation] = useState(false);
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [searchFields, setSearchFields] = useState({
    rooms: 1,
    children: 0,
    adults: 1
  });
  const [searchDate, setSearchDate] = useState({});
  const [searchPage, setSearchPage] = useState({});
  const [userInfo, setUserInfo] = useState({})
  const [settingData, setSettingData] = useState({});

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    getLocation();
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 1);
    const checkIn = formatDate(today);
    const checkOut = formatDate(futureDate);
    setSearchFields({ ...searchFields, checkIn, checkOut })
    setSearchDate({
      start: parseDate(checkIn),
      end: parseDate(checkOut)
    })
  }, []);
  const getLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsAllowLocation(true);
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
  useBodyClass();
  return (
    <PopupContext.Provider value={{
      open, setOpen,
      openFor, setOpenFor,
      signupOpen, signupSetOpen,
      isSignup, setIsSignup,
      isLogin, setIsLogin,
      searchFields, setSearchFields,
      searchDate, setSearchDate,
      searchPage, setSearchPage,
      userInfo, setUserInfo,
      settingData, setSettingData,
      location,
      isAllowLocation,
      getLocation,
    }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);