import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/owner");
      if (data.success) setBookings(data.bookings);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });

      if (data.success) {
        toast.success("Status Updated");
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="px-6 md:px-10 mt-10 w-full">

      <h1 className="text-2xl font-semibold">Manage Bookings</h1>
      <p className="text-gray-500 mb-6">
        Track bookings, approve or cancel requests
      </p>

      <div className="w-full border border-gray-200 rounded-md overflow-hidden">

        <table className="w-full text-sm text-left text-gray-600">

          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Car</th>
              <th className="p-3 max-md:hidden">Date Range</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
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

                {/* Date */}
                <td className="p-3 max-md:hidden">
                  {booking.pickupDate.split("T")[0]} →{" "}
                  {booking.returnDate.split("T")[0]}
                </td>

                {/* Price */}
                <td className="p-3 font-medium">
                  {currency}
                  {booking.price}
                </td>

                {/* Status Badge */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : booking.status === "payment_pending"
                        ? "bg-orange-100 text-orange-600"
                        : booking.status === "pending"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                {/* Action */}
                <td className="p-3">
                  {booking.status === "pending" ? (
                    <select
                      onChange={(e) =>
                        changeBookingStatus(booking._id, e.target.value)
                      }
                      className="text-xs border px-2 py-1 rounded outline-none"
                      defaultValue="pending"
                    >
                      <option value="pending">Pending</option>
                      <option value="payment_pending">Approve</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
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

export default ManageBookings;