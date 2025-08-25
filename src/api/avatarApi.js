// import axios from "../api/axios";

// export const uploadAvatar = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   return await axios.post("/users/avatar", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//     withCredentials: true,
//   });
// };

// export const getAvatar = async () => {
//   return await axios.get("/users/avatar", { withCredentials: true });
// };
// export const downloadInvoice = async (bookingId) => {
//   const response = await axios.get(
//     `http://localhost:8080/api/bookings/invoice/${bookingId}`,
//     { responseType: "blob" } // Important for binary files
//   );

//   const url = window.URL.createObjectURL(new Blob([response.data]));
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", "invoice.pdf");
//   document.body.appendChild(link);
//   link.click();
// };
