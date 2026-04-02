import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const { axios, currency } = useAppContext()

  const [image, setImage] = useState(null)

  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return

    // ✅ VALIDATION (MAIN FIX)
    if (!image) return toast.error("Upload image")
    if (!car.category) return toast.error("Select category")
    if (!car.transmission) return toast.error("Select transmission")
    if (!car.fuel_type) return toast.error("Select fuel type")

    setIsLoading(true)

    try {
      const formData = new FormData()

      formData.append('brand', car.brand)
      formData.append('model', car.model)
      formData.append('year', car.year)
      formData.append('pricePerDay', car.pricePerDay)
      formData.append('category', car.category)
      formData.append('transmission', car.transmission)
      formData.append('fuel_type', car.fuel_type)
      formData.append('seating_capacity', car.seating_capacity)
      formData.append('location', car.location)
      formData.append('description', car.description)
      formData.append('image', image)

      const { data } = await axios.post('/api/owner/add-car', formData)

      if (data.success) {
        toast.success(data.message)

        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: '',
          pricePerDay: '',
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: '',
          description: '',
        })

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title 
        title="Add New Car" 
        subTitle="Fill details to list a car" 
      />

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 mt-6 max-w-xl'>

        {/* Image */}
        <div className='flex items-center gap-2'>
          <label htmlFor="car-image">
            <img 
              src={image ? URL.createObjectURL(image) : assets.upload_icon} 
              className='h-14 cursor-pointer'
            />
            <input 
              type="file" 
              hidden 
              id="car-image"
              onChange={e => setImage(e.target.files[0])}
            />
          </label>
          <p>Upload image</p>
        </div>

        {/* Brand + Model */}
        <div className='grid md:grid-cols-2 gap-4'>
          <input required placeholder="Brand"
            value={car.brand}
            onChange={e => setCar({...car, brand: e.target.value})} />

          <input required placeholder="Model"
            value={car.model}
            onChange={e => setCar({...car, model: e.target.value})} />
        </div>

        {/* Year + Price */}
        <div className='grid md:grid-cols-2 gap-4'>
          <input required type="number" placeholder="Year"
            value={car.year}
            onChange={e => setCar({...car, year: e.target.value})} />

          <input required type="number" placeholder={`Price (${currency})`}
            value={car.pricePerDay}
            onChange={e => setCar({...car, pricePerDay: e.target.value})} />
        </div>

        {/* Category */}
        <select required value={car.category}
          onChange={e => setCar({...car, category: e.target.value})}>
          <option value="">Select Category</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Van">Van</option>
        </select>

        {/* Transmission */}
        <select required value={car.transmission}
          onChange={e => setCar({...car, transmission: e.target.value})}>
          <option value="">Select Transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        {/* Fuel */}
        <select required value={car.fuel_type}
          onChange={e => setCar({...car, fuel_type: e.target.value})}>
          <option value="">Select Fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>

        {/* Seats */}
        <input required type="number" placeholder="Seats"
          value={car.seating_capacity}
          onChange={e => setCar({...car, seating_capacity: e.target.value})} />

        {/* Location */}
        <input required placeholder="Location"
          value={car.location}
          onChange={e => setCar({...car, location: e.target.value})} />

        {/* Description */}
        <textarea required placeholder="Description"
          value={car.description}
          onChange={e => setCar({...car, description: e.target.value})} />

        <button className='bg-primary text-white py-2 rounded'>
          {isLoading ? "Adding..." : "Add Car"}
        </button>

      </form>
    </div>
  )
}

export default AddCar