import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const MyBookings = () => {
  const { user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) setBookings(data.bookings);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    user && fetchMyBookings();
  }, [user]);

  // 💳 Razorpay
  const handlePayment = async (booking) => {
    try {
      const { data } = await axios.post("/api/payment/create-order", {
        bookingId: booking._id,
      });

      const options = {
        key: "rzp_test_YOURKEY",
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        handler: async function (response) {
          await axios.post("/api/payment/verify", {
            ...response,
            bookingId: booking._id,
          });
          toast.success("Payment Successful");
          fetchMyBookings();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment Failed");
    }
  };

  return (
    <div className="px-6 md:px-16 mt-10">

      <h1 className="text-2xl font-semibold">My Bookings</h1>
      <p className="text-gray-500 mb-6">
        Track your bookings and complete payment
      </p>

      <div className="w-full border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">

          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Car</th>
              <th className="p-3 max-md:hidden">Date Range</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t">

                {/* Car */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={booking.car.image}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <p className="font-medium">
                    {booking.car.brand} {booking.car.model}
                  </p>
                </td>

                {/* Dates */}
                <td className="p-3 max-md:hidden">
                  {booking.pickupDate.split("T")[0]} →{" "}
                  {booking.returnDate.split("T")[0]}
                </td>

                {/* Price */}
                <td className="p-3 font-medium">
                  {currency}
                  {booking.price}
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : booking.status === "payment_pending"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                {/* Payment */}
                <td className="p-3">
                  {booking.status === "payment_pending" ? (
                    <button
                      onClick={() => handlePayment(booking)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {booking.status === "confirmed"
                        ? "Paid"
                        : "—"}
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default MyBookings;