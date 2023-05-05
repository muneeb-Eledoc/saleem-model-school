import React, { useEffect, useState } from 'react'
import { AreaChart } from '../charts/AreaChart'
import axios from 'axios'

const FeeByAmount = () => {
  const [filterType, setFilterType] = useState('day')
  const [stats, setStats] = useState({})
  const [feeFilters, setFeeFilters] = useState({
    startDate: '',
    endDate: '',
  })

  async function fetchFeeStats(type) {
    try {

      let res = [];
      if (feeFilters.startDate && feeFilters.endDate) {
        res = await axios.get(`/api/studentfee/stats?type=${type}&startDate=${feeFilters.startDate}&endDate=${feeFilters.endDate}&campus=${localStorage.getItem('campus')}`)
      } else {
        res = await axios.get(`/api/studentfee/stats?type=${type}&campus=${localStorage.getItem('campus')}`)
      }

      let newData = {};

      if (res.data[0]._id.split('-')[2]) {
        newData = {
          labels: res.data?.map((s) => s._id.split('-')[0].slice(2) + '-' + s._id.split('-')[1] + '-' + s._id.split('-')[2]),
          counts: res.data?.map((s) => s.count),
          totalamount: res.data?.map((s) => s.totalamount),
        }
      } else if (res.data[0]._id.split('-')[2]) {
        newData = {
          labels: res.data?.map((s) => s._id.split('-')[0].slice(2) + '-' + s._id.split('-')[1]),
          counts: res.data?.map((s) => s.count),
          totalamount: res.data?.map((s) => s.totalamount),
        }
      } else {
        newData = {
          labels: res.data?.map((s) => s._id),
          counts: res.data?.map((s) => s.count),
          totalamount: res.data?.map((s) => s.totalamount),
        }
      }

      setStats(newData)
    } catch (error) {
    }
  }

  useEffect(() => {
    fetchFeeStats(filterType)
  }, [])

  const handleChange = async (event) => {
    const { name, value } = event.target
    setFeeFilters({ ...feeFilters, [name]: value })
  }

  const handeTypeChange = (e) => {
    setFilterType(e.target.value)
    fetchFeeStats(e.target.value)
  }

  const handleClear = () => {
    setFeeFilters({
      startDate: '',
      endDate: '',
    })
  }

  return (
    <div className='col-span-2 p-3 rounded-lg border border-gray-200 flex flex-col gap-3'>
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex gap-3 items-center flex-wrap">
          <select onChange={handeTypeChange} name="type" className='base__select bg-white px-1 text-sm'>
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <input onChange={handleChange} value={feeFilters.startDate} name='startDate' type="date" className='base__input py-[5px] px-1 mt-0 border-gray-100 bg-white text-sm' />
          <input onChange={handleChange} value={feeFilters.endDate} name='endDate' type="date" className='base__input py-[5px] px-1 mt-0 border-gray-100 bg-white text-sm' />
          <button onClick={() => fetchFeeStats(filterType)} className="base__button px-3 text-sm">Apply</button>
          {feeFilters.startDate !== '' && feeFilters.endDate !== '' && <div onClick={handleClear} className='flex p-1 bg-gray-100 rounded-full shadow cursor-pointer hover:scale-125 transition-all duration-300'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>}
        </div>
        <div onClick={() => fetchFeeStats(filterType)} className='w-8 h-8 font-bold rounded-full flex justify-center items-center bg-gray-50 hover:scale-125 active:rotate-180 transition-all duration-300 ease-in-out cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
      </div>
      <div>
        <AreaChart title='Fee Amounts' xData={stats.labels} yData={stats.totalamount} borderColor='rgba(255, 119, 8)' backgroundColor='rgba(255, 119, 8, 0.5)' />
      </div>
      <div>
        <AreaChart title='Fee Count' xData={stats.labels} yData={stats.counts} borderColor='rgba(252, 3, 157)' backgroundColor='rgba(252, 3, 157, 0.3)' />
      </div>
    </div>
  )
}

export default FeeByAmount