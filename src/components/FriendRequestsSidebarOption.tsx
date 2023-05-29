'use client'
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useState } from 'react'

interface FriendRequestsSidebarOptionProps {
    initialUnseenRequestCount:number
    sessionId:string
  
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({initialUnseenRequestCount,sessionId}) => {
    const [unseenRequestCount,setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)
  return <Link 
       href='/dashbord/requests' 
       className='-ml-2 text-gray-700 hover:text-indigo-600
        hover:bg-gray-50 group flex items-center 
         gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
      >
    <div 
    className='text-gray-400 border-gray-200 group-hover:border-indigo-600 
    group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center
     justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
    >
     <User className='h-5 w-5'/>
    </div>
    <p className='truncate'>Friend requests</p>
    {
        unseenRequestCount>0 ? (
            <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600 '>
            
            </div>
        ):null
    }
  </Link>
}

export default FriendRequestsSidebarOption