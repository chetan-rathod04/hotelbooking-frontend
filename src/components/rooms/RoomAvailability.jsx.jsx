// import React, { useEffect, useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import api from "../../api/axios";
// import { format } from "date-fns";

// export default function RoomAvailability({ roomId }) {
//   const [bookedDates, setBookedDates] = useState([]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await api.get(`/bookings/room/${roomId}`);
//         const dates = res.data
//           .map((b) => {
//             let from = new Date(b.fromDate);
//             let to = new Date(b.toDate);
//             let arr = [];
//             while (from <= to) {
//               arr.push(new Date(from));
//               from.setDate(from.getDate() + 1);
//             }
//             return arr;
//           })
//           .flat();
//         setBookedDates(dates);
//       } catch (err) {
//         console.error("Error fetching room availability", err);
//       }
//     };
//     fetchBookings();
//   }, [roomId]);

//   const tileClassName = ({ date }) => {
//     if (
//       bookedDates.find(
//         (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
//       )
//     ) {
//       return "bg-red-400 text-white rounded"; // booked
//     }
//     return "bg-green-200"; // available
//   };

//   return (
//     <div>
//       <h2 className="font-semibold text-lg mb-2">Room Availability</h2>
//       <Calendar tileClassName={tileClassName} />
//     </div>
//   );
// }
