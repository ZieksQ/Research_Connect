import React from 'react'
import InfoCard from '../../components/profile/InfoCard.jsx'
import { MdOutlineEmail, MdFingerprint } from "react-icons/md";
import { IoSchoolOutline } from "react-icons/io5";
import { GoBook } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";

// About Section in Profile Page
// Change Color to 300 later if you want a lighter shade
const ProfileAboutPage = () => {
  return (
    <main className='flex flex-col gap-2 px-4'>
      <InfoCard Icon={<CiUser className='icon-md'/>} Title="Username" Value={"Andy Gabriel"} Color="bg-blue-500" />
      <InfoCard Icon={<MdOutlineEmail className='icon-md'/>} Title="Email" Value={"AndyGabriel@sample.ph"} Color="bg-violet-500" />
      <InfoCard Icon={<LuPhone className='icon-md'/>} Title="Phone Number" Value={"+63 xxxx904"} Color="bg-green-500" />
      <InfoCard Icon={<MdFingerprint className='icon-md'/>} Title="School ID" Value={"0124-0000"} Color="bg-orange-500" />
      <InfoCard Icon={<IoSchoolOutline className='icon-md'/>} Title="School" Value={"Laguna State Polytechnic University"} Color="bg-red-500" />
      <InfoCard Icon={<GoBook className='icon-md'/>} Title="Course" Value={"BS Information Technology"} Color="bg-cyan-500" />
    </main>
  )
}

export default ProfileAboutPage
