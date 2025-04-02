import "@babel/polyfill";
import './index.css'
import "./App.css";
import { Fragment, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';

import {
  MapPinIcon,
  CalendarIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import FillButton from "./components/fill-button";
import {
  Combobox,
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
  Popover,
  PopoverButton,
  PopoverPanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  DialogBackdrop,
} from "@headlessui/react";
import configuration from "./config";
import { toast } from "react-toastify";
import Label from "./components/label";
import {
  DateRangePicker,
  Button,
} from "@nextui-org/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import LineButton from "./components/line-button";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

const child_age = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
  { id: 8, name: "8" },
  { id: 9, name: "9" },
  { id: 10, name: "10" },
  { id: 11, name: "11" },
  { id: 12, name: "12" },
  { id: 13, name: "13" },
  { id: 14, name: "14" },
  { id: 15, name: "15" },
  { id: 16, name: "16" },
  { id: 17, name: "17" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SearchWidget = ({ initialValue }) => {
  const [searchFields, setSearchFields] = useState({
    rooms: 1,
    children: 0,
    adults: 1
  });
  const [searchDate, setSearchDate] = useState({});
  const [searchPage, setSearchPage] = useState({});

  const [query, setQuery] = useState("");
  const [openHotel, setOpenHotel] = useState(false);
  const [errors, setErrors] = useState();
  const [openguest, setOpenguest] = useState(false);
  const [openguest1, setOpenguest1] = useState(false);
  const [projects, setProjects] = useState([]);
  const [popularHotel, setPopularHotel] = useState([]);

  const [open_mobi, setOpen_mobi] = useState(false);
  const [tempCode, setTempCode] = useState("");
  const numberOfRooms = 3;
  const filteredProjects =
    query === ""
      ? []
      : projects.filter((project) => {
        const searchQuery = query.toLowerCase();
        const name = project.name.toLowerCase();
        const state = project?.state?.toLowerCase() || "";

        if (
          searchQuery.includes("bang") ||
          searchQuery.includes("beng") ||
          searchQuery.includes("bangalore") ||
          searchQuery.includes("bengaluru")
        ) {
          return (
            name.includes("bangalore") ||
            name.includes("bengaluru") ||
            state.includes("bangalore") ||
            state.includes("bengaluru")
          );
        }

        return name.includes(searchQuery) || state.includes(searchQuery);
      });
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    configuration
      .getAPI({ url: "api/common/hotel-list", params: {} })
      .then((data) => {
        if (data?.payload) {
          setProjects(data?.payload);
          const popular = data?.payload?.filter((single) => single?.isPopular);
          setPopularHotel(popular);
          const selectedHotel = data?.payload?.find((single) => single?.propertyId == initialValue)
          if (selectedHotel) {
            const today = new Date();
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + 1);
            const checkIn = formatDate(today);
            const checkOut = formatDate(futureDate);
            setSearchFields({
              ...searchFields,
              hotel: selectedHotel?.name,
              hotelID: selectedHotel?._id,
              searchType: "hotel",
              corporateCode: "",
              checkIn, checkOut
            });
            setSearchDate({
              start: parseDate(checkIn),
              end: parseDate(checkOut)
            })
          }

        } else if (data?.error) {
          return toast.error(data?.error?.message);
        } else {
          return toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        return toast.error(error?.message);
      });
  }, []);
  useEffect(() => {
    // getCities();
    window.addEventListener("scroll", () => {
      if (window.scrollY < 15) {
        setscrolltopdata("");
      } else {
        setscrolltopdata("scrolled_form");
      }
    });
  }, []);

  const getHotels = () => {
    configuration
      .getAPI({ url: "api/common/hotel-list", params: {} })
      .then((data) => {
        if (data?.payload) {
          setProjects(data?.payload);
          const popular = data?.payload?.filter((single) => single?.isPopular);
          setPopularHotel(popular);
          const selectedHotel = data?.payload?.find((single) => single?.propertyId == initialValue)
          if (selectedHotel) {
            setSearchFields({
              ...searchFields,
              hotel: selectedHotel?.name,
              hotelID: selectedHotel?._id,
              searchType: "hotel",
              corporateCode: "",
            });
          }

        } else if (data?.error) {
          return toast.error(data?.error?.message);
        } else {
          return toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        return toast.error(error?.message);
      });
  };
  const [rooms, setRooms] = useState([
    {
      id: 1,
      adults: 1,
      children: 0,
      childrenAges: [],
    },
  ]);

  const handleMinus = (type, roomId) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        if (type === "children" && room[type] > 0) {
          return {
            ...room,
            [type]: room[type] - 1,
            childrenAges: room.childrenAges.slice(0, -1),
          };
        }
        return {
          ...room,
          [type]:
            room[type] > (type === "children" ? 0 : 1)
              ? room[type] - 1
              : room[type],
        };
      }
      return room;
    });
    setRooms(updatedRooms);
    updateTotalCounts(updatedRooms);
  };

  const handlePlus = (type, roomId) => {
    const limits = {
      adults: 4,
      children: 2,
    };

    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        if (type === "children" && room[type] < limits[type]) {
          return {
            ...room,
            [type]: room[type] + 1,
            childrenAges: [...room.childrenAges, 1],
          };
        }
        return {
          ...room,
          [type]: room[type] < limits[type] ? room[type] + 1 : room[type],
        };
      }
      return room;
    });
    setRooms(updatedRooms);
    updateTotalCounts(updatedRooms);
  };

  const handleChildAgeChange = (roomId, childIndex, age) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        const newChildrenAges = [...room.childrenAges];
        newChildrenAges[childIndex] = age;
        return {
          ...room,
          childrenAges: newChildrenAges,
        };
      }
      return room;
    });
    setRooms(updatedRooms);
    updateTotalCounts(updatedRooms);
  };

  function validation() {
    let flag = true;
    let error = {};
    if (searchFields?.searchType === "city") {
      if (!searchFields?.cityID || searchFields?.cityID === "") {
        error["cityID"] = "Please select location";
        flag = false;
      }
    } else {
      if (!searchFields?.hotelID || searchFields?.hotelID === "") {
        error["hotelID"] = "Please select location";
        flag = false;
      }
    }
    if (new Date(searchFields?.checkIn) > new Date(searchFields?.checkOut)) {
      error["checkOut"] = "Please select checkOut greater then checkIn date";
      flag = false;
    }
    setErrors({ ...error });
    return flag;
  }
  const handleSearch = () => {
    if (validation()) {
      const URL = `https://regentarewards.com/select-room?hotelID=${searchFields?.hotelID}&checkIn=${searchFields?.checkIn}&checkOut=${searchFields?.checkOut}`;
      window.open(URL, "_blank", "noopener,noreferrer");
    }
  };

  const [scrolltopdata, setscrolltopdata] = useState("");
  const formatDatePicker = (date) => {
    return `${date.year.toString().padStart(4, "0")}-${date.month
      .toString()
      .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;
  };

  const handleAddRoom = () => {
    if (rooms.length < numberOfRooms) {
      const newRooms = [
        ...rooms,
        {
          id: rooms.length + 1,
          adults: 1,
          children: 0,
          childrenAges: [],
        },
      ];
      setRooms(newRooms);
      updateTotalCounts(newRooms);
    }
  };

  const handleRemoveRoom = (roomId) => {
    const updatedRooms = rooms
      .filter((room) => room.id !== roomId)
      .map((room, index) => ({
        ...room,
        id: index + 1,
      }));
    setRooms(updatedRooms);
    updateTotalCounts(updatedRooms);
  };

  const updateTotalCounts = (updatedRooms) => {
    const totalAdults = updatedRooms.reduce(
      (sum, room) => sum + room.adults,
      0
    );
    const totalChildren = updatedRooms.reduce(
      (sum, room) => sum + room.children,
      0
    );

    const roomData = updatedRooms.map((room) => ({
      adults: room.adults,
      children: room.children,
      childrenAges: room.childrenAges,
    }));

    setSearchFields({
      ...searchFields,
      adults: totalAdults,
      children: totalChildren,
      rooms: roomData,
    });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const d = new Date(dateString);
    const dayName = days[d.getDay()];
    const day = d.getDate().toString().padStart(2, "0");
    const month = months[d.getMonth()];

    return `${dayName} ${day} ${month}`;
  };

  const checkCorporateCode = () => {
    let error = {};
    let flag = true;
    if (!searchFields?.hotelID) {
      error["hotelID"] = "Please select location";
      flag = false;
    }
    setErrors({ ...error });
    if (flag) {
      configuration
        .getAPI({
          url: "hotelogix/hotel-get-corporates",
          params: { tempCode, hotelID: searchFields?.hotelID },
        })
        .then((data) => {
          if (data?.payload?.isValid) {
            setSearchFields({
              ...searchFields,
              corporateCode: tempCode,
              organization: data?.payload?.organization,
              taxCode: data?.payload?.taxCode,
              corporateID: data?.payload?.id,
            });
          } else if (data?.error) {
            return toast.error(data?.error?.message);
          } else {
            return toast.error("The corporate code does not exist");
          }
        })
        .catch((error) => {
          return toast.error(error?.message);
        });
    }
  };

  const [isListening, setIsListening] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      console.log("Speech to text (real-time):", transcript);
    }
  }, [transcript]);

  useEffect(() => {
    // Check microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setMicrophoneAccess(true))
      .catch(() => setMicrophoneAccess(false));
  }, []);

  const handleVoiceSearch = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser does not support speech recognition.");
      return;
    }

    if (microphoneAccess === false) {
      toast.info("Please allow microphone access to use voice search.", {
        onClick: () => {
          // Prompt for microphone access again
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
              setMicrophoneAccess(true);
              startListening();
            })
            .catch(() => {
              toast.error(
                "Microphone access denied. Please enable it in your browser settings."
              );
            });
        },
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    console.log("start listening");
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
    resetTranscript();
  };

  const stopListening = () => {
    console.log("stop listening");
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  useEffect(() => {
    console.log("SearchWidget");
  }, [])
  return (
    <>
      <main>
        <section className="w-full relative">
          <div className="seatchbar_sticky">
            <div
              className={`w-full mobi_bookingwrap xl:px-0 px-2 sm:px-5 bookingbox_form ${scrolltopdata}`}
            >
              <div className="mx-auto max-w-screen-xl">
                <div className="rounded-full shadow-md bg-white">
                  <div className="grid grid-cols-2 xl:grid-cols-12 gap-x-3 xl:gap-x-4 gap-y-6 home-search-wrap">
                    <Transition.Root
                      show={openHotel}
                      as={Fragment}
                      afterLeave={() => setQuery("")}
                      appear
                    >
                      <Dialog
                        className="relative z-50"
                        onClose={() => {
                          stopListening();
                          setOpenHotel(!openHotel);
                        }}
                      >
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-300 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                              <Combobox
                                onChange={(item) => {
                                  // corporateCode
                                  if (item?.title && item?.title !== "") {
                                    setSearchFields({
                                      ...searchFields,
                                      city: item?.title,
                                      cityID: item?._id,
                                      searchType: "city",
                                      corporateCode: "",
                                    });
                                    stopListening();
                                    setOpenHotel(false);
                                    setOpen_mobi(true);
                                  } else if (item?.name && item?.name !== "") {
                                    setSearchFields({
                                      ...searchFields,
                                      hotel: item?.name,
                                      hotelID: item?._id,
                                      searchType: "hotel",
                                      corporateCode: "",
                                    });
                                    stopListening();
                                    setOpenHotel(false);
                                    setOpen_mobi(true);
                                  }
                                }}
                              >
                                <div className="relative">
                                  <MagnifyingGlassIcon
                                    className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-gray-400 mobi-searchinc"
                                    aria-hidden="true"
                                  />
                                  <Combobox.Input
                                    className="h-12 w-full border-0 bg-transparent pl-11 pr-12 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm outline-0"
                                    placeholder="Search..."
                                    onChange={(event) => setQuery(event.target.value)}
                                    onBlur={() => setQuery("")}
                                    value={query}
                                  />
                                  <button
                                    onClick={() => handleVoiceSearch()}
                                    className="absolute right-4 top-3 p-1 rounded-full hover:bg-gray-200 flex items-center"
                                  >
                                    <MicrophoneIcon
                                      className={`h-6 w-6 ${isListening
                                        ? "text-red-500"
                                        : microphoneAccess === false
                                          ? "text-gray-300"
                                          : "text-gray-400"
                                        }`}
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                                {(query === "" ||
                                  filteredProjects.length > 0 ||
                                  filteredCities.length > 0) && (
                                    <Combobox.Options
                                      static
                                      as="ul"
                                      className="max-h-80 scroll-py-2 divide-y divide-gray-300 overflow-y-auto"
                                    >
                                      <li className="p-2">
                                        {query === "" ? (
                                          <>
                                            <div className="mb-2 mt-4 px-3 text-sm font-semibold text-gray-500">
                                              Popular Hotels
                                            </div>
                                            <ul
                                              key="hotel-list"
                                              className="text-sm text-gray-700"
                                            >
                                              {popularHotel.map((project) => (
                                                <Combobox.Option
                                                  as="li"
                                                  key={project._id}
                                                  value={project}
                                                  className={({ active }) =>
                                                    classNames(
                                                      "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                                      active &&
                                                      "secondary_bg text-white cursor-pointer"
                                                    )
                                                  }
                                                >
                                                  {({ active }) => (
                                                    <>
                                                      <span className="ml-0 flex-auto truncate">
                                                        {project.name}
                                                      </span>
                                                      {active && (
                                                        <span className="ml-3 flex-none text-indigo-100"></span>
                                                      )}
                                                    </>
                                                  )}
                                                </Combobox.Option>
                                              ))}
                                            </ul>
                                          </>
                                        ) : (
                                          <>
                                            <div className="mb-2 mt-4 px-3 text-sm font-semibold text-gray-500">
                                              Hotels
                                            </div>
                                            <ul
                                              key="hotel-list"
                                              className="text-sm text-gray-700"
                                            >
                                              {filteredProjects.map((project) => (
                                                <Combobox.Option
                                                  as="li"
                                                  key={project._id}
                                                  value={project}
                                                  className={({ active }) =>
                                                    classNames(
                                                      "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                                      active &&
                                                      "secondary_bg text-white"
                                                    )
                                                  }
                                                >
                                                  {({ active }) => (
                                                    <>
                                                      <span className="ml-0 flex-auto truncate">
                                                        {project.name}
                                                      </span>
                                                      {active && (
                                                        <span className="ml-3 flex-none text-indigo-100"></span>
                                                      )}
                                                    </>
                                                  )}
                                                </Combobox.Option>
                                              ))}
                                              <div className="text-center py-4">
                                              </div>
                                            </ul>
                                          </>
                                        )}
                                      </li>
                                    </Combobox.Options>
                                  )}

                                {query !== "" &&
                                  filteredProjects.length === 0 &&
                                  filteredCities?.length === 0 && (
                                    <div className="px-6 py-14 text-center sm:px-14">
                                      <MapPinIcon
                                        className="mx-auto h-6 w-6 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <p className="mt-4 text-sm text-gray-900">
                                        We couldn't find any location with that term.
                                        Please try again.
                                      </p>
                                    </div>
                                  )}
                              </Combobox>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </Dialog>
                    </Transition.Root>
                    <div className="stikeybar-logo pt-2 xl:col-span-2">
                      {/* <Link to="/">
                        <img
                          loading="lazy"
                          className="w-20 xl:w-36"
                          src="/images/logo.svg"
                          alt=""
                        />
                      </Link> */}
                    </div>
                    <div className="xl:col-span-3 cursor-pointer relative pr-4 pl-4 xl:pl-8 mt-2.5 xl:mt-6 xl:mb-1 separator-line search-stikey-hot"
                      onClick={() => setOpenHotel(true)}
                    >
                      <div className="flex items-center pr-2">
                        <span className="search_mappin_inc">
                          <MapPinIcon className="mr-2 sm:mr-4 secondary-color w-6" />
                        </span>
                        <div className="w-full pr-3">
                          <label className="primary-color truncate text-sm lg:text-base">
                            Explore & Save
                          </label>
                          <p className="block w-full black_textcolor outline-0 font-bookingfield truncate">
                            {searchFields?.searchType === "city" &&
                              searchFields?.city &&
                              searchFields?.city !== ""
                              ? searchFields?.city
                              : searchFields?.searchType === "hotel" &&
                                searchFields?.hotel &&
                                searchFields?.hotel !== ""
                                ? searchFields?.hotel
                                : "Find a Hotel or Destination"}
                          </p>
                        </div>
                      </div>
                      {errors?.cityID ? (
                        <Label
                          className={`block absolute text-sm text-red-600 pl-3 ml-6`}
                          text={errors?.cityID}
                        />
                      ) : null}
                      {errors?.hotelID ? (
                        <Label
                          className={`block absolute text-sm text-red-600 pl-3 ml-6`}
                          text={errors?.hotelID}
                        />
                      ) : null}
                    </div>

                    <div className="xl:col-span-3 pr-4 separator-line-date separator-line-none res-datebox">
                      <div className="w-full">
                        <label className="primary-color home_leftspacelab truncate text-sm lg:text-base date-des">
                          Number of Nights
                        </label>
                        <div className="cursor-pointer checkin_date desktop-cal">
                          <div className="relative">
                            <DateRangePicker
                              visibleMonths={2}
                              minValue={today(getLocalTimeZone())}
                              onChange={(value) => {
                                if (
                                  value?.start &&
                                  value?.end &&
                                  value.start.toString() === value.end.toString()
                                ) {
                                  return;
                                }

                                setSearchDate(value);
                                setSearchFields({
                                  ...searchFields,
                                  checkIn: formatDatePicker(value?.start),
                                  checkOut: formatDatePicker(value?.end),
                                });
                              }}
                              value={searchDate}
                              pageBehavior="single"
                              placeholder="Select dates"
                              selectorIcon={<CalendarIcon className="cal_size" />}
                              className="opacity-1"
                            />
                            {searchDate?.start && searchDate?.end && (
                              <div className="black_textcolor font-bookingfield truncate search-datelab">
                                <span className="font-bookingfield truncate date-booking-over">
                                  {formatDisplayDate(
                                    formatDatePicker(searchDate.start)
                                  )}{" "}
                                  -{" "}
                                  {formatDisplayDate(
                                    formatDatePicker(searchDate.end)
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="cursor-pointer checkin_date mobi-cal mobi_date_hide">
                          <div className="relative">
                            <DateRangePicker
                              visibleMonths={1}
                              minValue={today(getLocalTimeZone())}
                              onChange={(value) => {
                                if (
                                  value?.start &&
                                  value?.end &&
                                  value.start.toString() === value.end.toString()
                                ) {
                                  return;
                                }
                                setSearchDate(value);
                                setSearchFields({
                                  ...searchFields,
                                  checkIn: formatDatePicker(value?.start),
                                  checkOut: formatDatePicker(value?.end),
                                });
                                setOpen_mobi(true);
                              }}
                              value={searchDate}
                              pageBehavior="single"
                              placeholder="Select dates"
                              selectorIcon={<CalendarIcon className="cal_size" />}
                              className="opacity-1"
                            />
                            {searchDate?.start && searchDate?.end && (
                              <div className="black_textcolor font-bookingfield truncate search-datelab-mobi">
                                <span className="truncate font-bookingfield">
                                  {formatDisplayDate(
                                    formatDatePicker(searchDate.start)
                                  )}{" "}
                                  -{" "}
                                  {formatDisplayDate(
                                    formatDatePicker(searchDate.end)
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-3 mobi_hide mt-6 mb-1 cursor-pointer search-stikey-roomguest">
                      <div>
                        <Popover className="relative">
                          <PopoverButton className="outline-0">
                            <div className="cursor-pointer flex items-center">
                              <UserPlusIcon className="w-6 secondary-color mr-2" />
                              <div>
                                <label className="primary-color cursor-pointer">
                                  Rooms & Guests
                                </label>
                                <p className="flex addroon-des">
                                  <span className="block w-full black_textcolor whitespace-nowrap font-bookingfield text-left mgt-1">
                                    {searchFields?.adults} Adults
                                  </span>
                                  <span className="block w-full black_textcolor whitespace-nowrap font-bookingfield text-left mgt-1">
                                    {searchFields?.children} Child
                                  </span>
                                </p>
                              </div>
                            </div>
                          </PopoverButton>

                          <PopoverPanel
                            transition
                            className="absolute left-1/2 z-50 mt-5 w-screen max-w-max -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in box-border bg-content1 rounded-large shadow-medium min-w-[200px]"
                          >
                            {rooms.map((room, index) => (
                              <div
                                key={room.id}
                                className="room_loop_wrap border-t mb-2 pt-4"
                              >
                                <h2 className="semi-bold text-base">
                                  Room {room.id}
                                </h2>
                                <div className="flex items-center justify-between py-2">
                                  <label className="text-base font-normal w-44">
                                    Adults
                                  </label>
                                  <div className="flex items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleMinus("adults", room.id)}
                                      className={`rounded-full p-1.5 shadow-sm guest_minus_btn ${room.adults <= 1 ? "disabled-btn" : ""
                                        }`}
                                      disabled={room.adults <= 1}
                                    >
                                      <MinusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <input
                                      type="number"
                                      value={room.adults}
                                      disabled
                                      className="text-center text-lg black_textcolor w-14 outline-0 bg-white pl-3.5"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handlePlus("adults", room.id)}
                                      className={`rounded-full p-1.5 guest_minus_btn shadow-sm ${room.adults >= 4 ? "disabled-btn" : ""
                                        }`}
                                      disabled={room.adults >= 4}
                                    >
                                      <PlusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                  <label className="text-base font-normal w-44">
                                    <span className="w-full block">Children</span>
                                    <span className="w-full block text-xs onestop-title">
                                      Ages 1 to 17
                                    </span>
                                  </label>
                                  <div className="flex items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleMinus("children", room.id)}
                                      className={`rounded-full p-1.5 shadow-sm guest_minus_btn ${room.children <= 0 ? "disabled-btn" : ""
                                        }`}
                                      disabled={room.children <= 0}
                                    >
                                      <MinusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <input
                                      type="number"
                                      value={room.children}
                                      disabled
                                      className="text-center text-lg black_textcolor w-14 outline-0 bg-white pl-3.5"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handlePlus("children", room.id)}
                                      className={`rounded-full p-1.5 guest_minus_btn ${room.children >= 2 ? "disabled-btn" : ""
                                        }`}
                                      disabled={room.children >= 2}
                                    >
                                      <PlusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </div>
                                {[...Array(room.children)].map((_, childIndex) => (
                                  <div
                                    key={childIndex}
                                    className="my-2 flex justify-between items-center age-slideup"
                                  >
                                    <h3 className="onestop-title semi-bold">
                                      Child {childIndex + 1} age
                                    </h3>
                                    <Listbox
                                      value={room.childrenAges[childIndex] || 1}
                                      onChange={(age) =>
                                        handleChildAgeChange(room.id, childIndex, age)
                                      }
                                    >
                                      <div className="relative">
                                        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-6 pr-12 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 sm:text-sm/6">
                                          <span className="block truncate">
                                            {room.childrenAges[childIndex] || 1}
                                          </span>
                                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronDownIcon
                                              aria-hidden="true"
                                              className="h-10 w-10 text-gray-600"
                                            />
                                          </span>
                                        </ListboxButton>

                                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                          {child_age.map((age) => (
                                            <ListboxOption
                                              key={age.id}
                                              value={age.id}
                                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-pink-600 data-[focus]:text-white"
                                            >
                                              <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                                {age.name}
                                              </span>
                                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-pink-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                                <CheckIcon
                                                  aria-hidden="true"
                                                  className="h-5 w-5"
                                                />
                                              </span>
                                            </ListboxOption>
                                          ))}
                                        </ListboxOptions>
                                      </div>
                                    </Listbox>
                                  </div>
                                ))}
                                {rooms.length > 1 && (
                                  <div className="text-right pt-1">
                                    <button
                                      onClick={() => handleRemoveRoom(room.id)}
                                      className="rounded-full px-7 text-base text-white shadow-sm outline-0 guest_addroom_btn semi-bold"
                                    >
                                      Remove room
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}

                            {rooms.length < numberOfRooms && (
                              <div className="text-right">
                                <FillButton
                                  text="Add another room"
                                  className="guest_addroom_btn semi-bold"
                                  onClick={handleAddRoom}
                                />
                              </div>
                            )}

                            <div className="text-right pb-4 border-t pt-3 border-gray-200 mt-3">
                              <PopoverButton className="outline-0">
                                <FillButton text="Apply" className="fill_btn pb-2" />
                              </PopoverButton>
                            </div>
                          </PopoverPanel>
                        </Popover>
                      </div>
                    </div>
                    {/* <div className="xl:col-span-2 mobi_hide mt-6 mb-1 cursor-pointer search-stikey-roomguest">
                      <Popover className="relative">
                        <PopoverButton className="outline-0">
                          <div className="cursor-pointer flex items-center">
                            <CheckBadgeIcon className="w-6 secondary-color mr-2" />
                            <div>
                              <label className="primary-color cursor-pointer">
                                Special Rate
                              </label>
                              <p className="flex addroon-des">
                                <span className="block w-full black_textcolor whitespace-nowrap font-bookingfield text-left mgt-1">
                                  {searchFields?.corporateCode &&
                                    searchFields?.corporateCode !== ""
                                    ? searchFields?.corporateCode
                                    : "None"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </PopoverButton>

                        <PopoverPanel
                          transition
                          className="absolute left-1/2 z-50 mt-5 w-screen max-w-max -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in box-border bg-content1 rounded-large shadow-medium min-w-[200px]"
                        >
                          <div className="room_loop_wrap border-t mb-2 pt-4">
                            <Label text="Enter Corporate Code" />
                            <InputField
                              value={tempCode}
                              onChange={(e) => setTempCode(e?.target?.value)}
                              placeholder="Add Corporate Code"
                              className="inputfield_border rounded-full w-full"
                            />
                          </div>

                          <div className="text-right pb-4 border-t pt-3 border-gray-200 mt-3">
                            <PopoverButton className="outline-0">
                              <FillButton
                                text="Add"
                                onClick={() => checkCorporateCode()}
                                className="fill_btn pb-2"
                              />
                            </PopoverButton>
                          </div>
                        </PopoverPanel>
                      </Popover>
                    </div> */}
                    <div className="xl:col-span-2 mobi_hide">
                      <button
                        type="button"
                        onClick={() => handleSearch()}
                        className="inline-flex items-center gap-x-2 fill_btn w-full home_search_btn secondary_bg text-white justify-center"
                      >
                        <MagnifyingGlassIcon
                          className="-ml-0.5 h-5 w-5"
                          aria-hidden="true"
                        />
                        Let's Go!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Transition show={open_mobi} className="xl:hidden block">
                <Dialog className="relative z-50" onClose={setOpen_mobi}>
                  <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  </TransitionChild>

                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-0 text-center">
                      <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      >
                        <DialogPanel className="relative transform overflow-hidden rounded-t-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg p-6">
                          <div className="absolute right-0 top-0 pr-4 pt-4 block">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                              onClick={() => setOpen_mobi(false)}
                            >
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="sm:flex sm:items-start w-full">
                            <div className="sm:mt-0 text-left w-full">
                              <DialogTitle
                                as="h3"
                                className="text-lg bold_text leading-6 black_textcolor"
                              >
                                Search Hotel
                              </DialogTitle>
                              <div className="mt-2 w-full">
                                <div className="mt-4">
                                  <div
                                    onClick={() => setOpenHotel(true)}
                                    className="cursor-pointer bg-white flex items-center justify-between p-2 rounded-lg mt-2 h-12 ring-1 ring-inset ring-black/[0.10]"
                                  >
                                    <MapPinIcon className="w-6 mr-2 secondary-color" />
                                    <p className="block w-full black_textcolor outline-0 font-bookingfield truncate">
                                      {searchFields?.searchType === "city" &&
                                        searchFields?.city &&
                                        searchFields?.city !== ""
                                        ? searchFields?.city
                                        : searchFields?.searchType === "hotel" &&
                                          searchFields?.hotel &&
                                          searchFields?.hotel !== ""
                                          ? searchFields?.hotel
                                          : "Find a Hotel or Destination"}
                                    </p>
                                  </div>
                                  {errors?.propertyId ? (
                                    <Label
                                      className={`block text-sm text-red-600 pl-1`}
                                      text={errors?.propertyId}
                                    />
                                  ) : null}
                                </div>
                                <div className="mt-4">
                                  <div className="cursor-pointer bg-white flex items-center justify-between p-2 rounded-lg mt-2 h-12 ring-1 ring-inset ring-black/[0.10]">
                                    <div className="flex w-full px-1">
                                      <div className="w-full">
                                        <div className="cursor-pointer checkin_date mobi-cal mobi_checkdate relative">
                                          <DateRangePicker
                                            visibleMonths={1}
                                            minValue={today(getLocalTimeZone())}
                                            onChange={(value) => {
                                              if (
                                                value?.start &&
                                                value?.end &&
                                                value.start.toString() ===
                                                value.end.toString()
                                              ) {
                                                return;
                                              }
                                              setSearchDate(value);
                                              setSearchFields({
                                                ...searchFields,
                                                checkIn: formatDatePicker(
                                                  value?.start
                                                ),
                                                checkOut: formatDatePicker(
                                                  value?.end
                                                ),
                                              });
                                            }}
                                            value={searchDate}
                                            pageBehavior="single"
                                            selectorIcon={
                                              <CalendarIcon className="w-6 secondary-color" />
                                            }
                                            className="opacity-1"
                                          />
                                          {searchDate?.start && searchDate?.end && (
                                            <div className="search-datelab-mobibot">
                                              <span className="truncate font-bookingfield black_textcolor">
                                                {formatDisplayDate(
                                                  formatDatePicker(searchDate.start)
                                                )}{" "}
                                                -{" "}
                                                {formatDisplayDate(
                                                  formatDatePicker(searchDate.end)
                                                )}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <div className="cursor-pointer bg-white flex items-center justify-between p-2 rounded-lg mt-2 h-12 ring-1 ring-inset ring-black/[0.10] w-full">
                                    <div className="flex w-full">
                                      <div className="ml-0 w-full">
                                        <div className="cursor-pointer w-full">
                                          <Button
                                            onClick={() => setOpenguest(true)}
                                            variant="bordered"
                                            className="addguest_btnwrap w-full pt-1.5"
                                          >
                                            <UserPlusIcon className="w-12 secondary-color ml-1" />
                                            <span className="block w-full black_textcolor whitespace-nowrap font-bookingfield text-left mt-1">
                                              {searchFields?.adults} Adults
                                            </span>
                                            <span className="block w-full black_textcolor whitespace-nowrap font-bookingfield text-left mt-1">
                                              {searchFields?.children} Child
                                            </span>
                                          </Button>
                                          <Dialog
                                            open={openguest}
                                            onClose={setOpenguest}
                                            className="relative code-pop51"
                                          >
                                            <DialogBackdrop
                                              transition
                                              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                                            />

                                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                                <DialogPanel
                                                  transition
                                                  className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                                                >
                                                  <div className="text-left">
                                                    {rooms.map((room, index) => (
                                                      <div
                                                        key={room.id}
                                                        className="room_loop_wrap border-t mb-2 pt-4"
                                                      >
                                                        <h2 className="semi-bold text-base">
                                                          Room {room.id}
                                                        </h2>
                                                        <div className="flex items-center justify-between py-2">
                                                          <label className="text-base font-normal w-72">
                                                            Adults
                                                          </label>
                                                          <div className="flex items-center">
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                handleMinus(
                                                                  "adults",
                                                                  room.id
                                                                )
                                                              }
                                                              className={`rounded-full p-1.5 shadow-sm guest_minus_btn ${room.adults <= 1
                                                                ? "disabled-btn"
                                                                : ""
                                                                }`}
                                                              disabled={
                                                                room.adults <= 1
                                                              }
                                                            >
                                                              <MinusIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                              />
                                                            </button>
                                                            <input
                                                              type="number"
                                                              value={room.adults}
                                                              disabled
                                                              className="text-center text-lg black_textcolor w-14 outline-0 bg-white pl-3.5"
                                                            />
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                handlePlus(
                                                                  "adults",
                                                                  room.id
                                                                )
                                                              }
                                                              className={`rounded-full p-1.5 guest_minus_btn shadow-sm ${room.adults >= 4
                                                                ? "disabled-btn"
                                                                : ""
                                                                }`}
                                                              disabled={
                                                                room.adults >= 4
                                                              }
                                                            >
                                                              <PlusIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                              />
                                                            </button>
                                                          </div>
                                                        </div>
                                                        <div className="flex items-center justify-between py-2">
                                                          <label className="text-base font-normal w-72">
                                                            <span className="w-full block">
                                                              Children
                                                            </span>
                                                            <span className="w-full block text-xs onestop-title">
                                                              Ages 1 to 17
                                                            </span>
                                                          </label>
                                                          <div className="flex items-center">
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                handleMinus(
                                                                  "children",
                                                                  room.id
                                                                )
                                                              }
                                                              className={`rounded-full p-1.5 shadow-sm guest_minus_btn ${room.children <= 0
                                                                ? "disabled-btn"
                                                                : ""
                                                                }`}
                                                              disabled={
                                                                room.children <= 0
                                                              }
                                                            >
                                                              <MinusIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                              />
                                                            </button>
                                                            <input
                                                              type="number"
                                                              value={room.children}
                                                              disabled
                                                              className="text-center text-lg black_textcolor w-14 outline-0 bg-white pl-3.5"
                                                            />
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                handlePlus(
                                                                  "children",
                                                                  room.id
                                                                )
                                                              }
                                                              className={`rounded-full p-1.5 guest_minus_btn ${room.children >= 2
                                                                ? "disabled-btn"
                                                                : ""
                                                                }`}
                                                              disabled={
                                                                room.children >= 2
                                                              }
                                                            >
                                                              <PlusIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                              />
                                                            </button>
                                                          </div>
                                                        </div>
                                                        {[
                                                          ...Array(room.children),
                                                        ].map((_, childIndex) => (
                                                          <div
                                                            key={childIndex}
                                                            className="my-2 flex justify-between items-center age-slideup"
                                                          >
                                                            <h3 className="onestop-title semi-bold">
                                                              Child {childIndex + 1}{" "}
                                                              age
                                                            </h3>
                                                            <Listbox
                                                              value={
                                                                room.childrenAges[
                                                                childIndex
                                                                ] || 1
                                                              }
                                                              onChange={(age) =>
                                                                handleChildAgeChange(
                                                                  room.id,
                                                                  childIndex,
                                                                  age
                                                                )
                                                              }
                                                            >
                                                              <div className="relative">
                                                                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-6 pr-12 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 sm:text-sm/6">
                                                                  <span className="block truncate">
                                                                    {room
                                                                      .childrenAges[
                                                                      childIndex
                                                                    ] || 1}
                                                                  </span>
                                                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronDownIcon
                                                                      aria-hidden="true"
                                                                      className="h-10 w-10 text-gray-600"
                                                                    />
                                                                  </span>
                                                                </ListboxButton>

                                                                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                  {child_age.map(
                                                                    (age) => (
                                                                      <ListboxOption
                                                                        key={age.id}
                                                                        value={age.id}
                                                                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-pink-600 data-[focus]:text-white"
                                                                      >
                                                                        <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                                                          {age.name}
                                                                        </span>
                                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-pink-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                                                          <CheckIcon
                                                                            aria-hidden="true"
                                                                            className="h-5 w-5"
                                                                          />
                                                                        </span>
                                                                      </ListboxOption>
                                                                    )
                                                                  )}
                                                                </ListboxOptions>
                                                              </div>
                                                            </Listbox>
                                                          </div>
                                                        ))}
                                                        {rooms.length > 1 && (
                                                          <div className="text-right pt-1">
                                                            <button
                                                              onClick={() =>
                                                                handleRemoveRoom(
                                                                  room.id
                                                                )
                                                              }
                                                              className="rounded-full px-7 text-base text-white shadow-sm outline-0 guest_addroom_btn semi-bold"
                                                            >
                                                              Remove room
                                                            </button>
                                                          </div>
                                                        )}
                                                      </div>
                                                    ))}
                                                    {rooms.length < 3 && (
                                                      <div className="text-right">
                                                        <FillButton
                                                          text="Add another room"
                                                          className="guest_addroom_btn semi-bold"
                                                          onClick={handleAddRoom}
                                                        />
                                                      </div>
                                                    )}

                                                    <div className="text-right pb-4 border-t pt-3 border-gray-200 mt-3">
                                                      <LineButton
                                                        onClick={() =>
                                                          setOpenguest(false)
                                                        }
                                                        text="Cancel"
                                                        className="line_btn mr-3 py-1.5"
                                                      />
                                                      <FillButton
                                                        onClick={() =>
                                                          setOpenguest(false)
                                                        }
                                                        text="Apply"
                                                        className="fill_btn pb-2"
                                                      />
                                                    </div>
                                                  </div>
                                                </DialogPanel>
                                              </div>
                                            </div>
                                          </Dialog>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="mt-4">
                                  <div className="cursor-pointer bg-white flex items-center justify-between p-2 rounded-lg mt-2 h-12 ring-1 ring-inset ring-black/[0.10] w-full">
                                    <div className="flex w-full">
                                      <div className="ml-0 w-full">
                                        <div className="cursor-pointer w-full">
                                          <Button
                                            onClick={() => setOpenguest1(true)}
                                            variant="bordered"
                                            className="addguest_btnwrap w-full pt-1.5"
                                          >
                                            <CheckBadgeIcon className="w-12 secondary-color ml-1 w-6" />
                                            <span className="block w-full black_textcolor whitespace-nowrap font-bookingfield text-left mt-1">
                                              {searchFields?.corporateCode &&
                                                searchFields?.corporateCode !== ""
                                                ? searchFields?.corporateCode
                                                : "None"}
                                            </span>
                                          </Button>
                                          <Dialog
                                            open={openguest1}
                                            onClose={setOpenguest1}
                                            className="relative code-pop51"
                                          >
                                            <DialogBackdrop
                                              transition
                                              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                                            />

                                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                                <DialogPanel
                                                  transition
                                                  className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 pt-4"
                                                >
                                                  <h2 className="Add Corporate Code pb-4">
                                                    Corporate Code
                                                  </h2>
                                                  <div className="room_loop_wrap mb-2 pt-0">
                                                    <Label text="Enter Corporate Code" />
                                                    <InputField
                                                      value={tempCode}
                                                      onChange={(e) =>
                                                        setTempCode(e?.target?.value)
                                                      }
                                                      placeholder="Add Corporate Code"
                                                      className="inputfield_border rounded-full w-full"
                                                    />
                                                  </div>
                                                  <div className="text-right border-t pt-3 border-gray-200 mt-3">
                                                    <div className="text-right pt-3 mt-3">
                                                      <LineButton
                                                        onClick={() =>
                                                          setOpenguest1(false)
                                                        }
                                                        text="Cancel"
                                                        className="line_btn mr-3 mobi_viewbtn_line w-24"
                                                      />
                                                      <FillButton
                                                        onClick={() => {
                                                          checkCorporateCode();
                                                          setOpenguest1(false);
                                                        }}
                                                        text="Add"
                                                        className="fill_btn pb-2 mobi_viewbtn w-24"
                                                      />
                                                    </div>
                                                  </div>
                                                </DialogPanel>
                                              </div>
                                            </div>
                                          </Dialog>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div> */}
                                <div>
                                  <div className="flex items-center justify-between p-2 rounded-lg mt-5">
                                    <FillButton
                                      onClick={() => handleSearch()}
                                      text="Let's Go!"
                                      className="fill_btn w-full"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogPanel>
                      </TransitionChild>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          </div>
        </section>
      </main>

      {/* <div>
        <Router>
          <PopupProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              theme="dark"
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Routes>
              <Route element={<PrivateRouteLayout />}>
                <Route exact path="/" element={<Home />} />
              </Route>
            </Routes>
          </PopupProvider>
        </Router>
      </div> */}
    </>
  );
}

// export default SearchWidget;

// Separate the render function
export function renderSearchWidget(containerId, initialValue = "") {
  console.log('Attempting to render in container:', containerId);

  try {
    const container = document.getElementById(containerId);

    if (container) {
      console.log('Container found, attempting to create root');
      const root = createRoot(container);
      root.render(<SearchWidget initialValue={initialValue} />);
      console.log('✅ Widget mounted successfully');
    } else {
      console.error(`❌ Container with ID '${containerId}' not found`);
    }
  } catch (error) {
    console.error('Error rendering widget:', error);
  }
}

// Global exposure
if (typeof window !== 'undefined') {
  window.SearchWidget = window.SearchWidget || {};
  window.SearchWidget.renderSearchWidget = renderSearchWidget;
}