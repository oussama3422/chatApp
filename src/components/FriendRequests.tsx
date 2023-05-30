"use client"

import { Check, UserPlus } from 'lucide-react'
import { FC, useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequest:IncomingFriendRequest[]
    sessionId:string
}

const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequest,sessionId}) => {
  const [firendRequests,setfirendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequest
  )
    return (
        <>
         {
            FriendRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here ...</p>
            ):(
                firendRequests.map((request)=>(
                    <div key={request.senderId} className='flex gap-4 items-center'>
                        <UserPlus className='text-black'/>
                        <p className='font-medium text-lg'>{request.senderEmail}</p>
                        <button aria-label='accept friend' className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <Check  className='font-semibold text-white w-3/4 h-3/4'/>
                        </button>
                        <button >
                            
                        </button>
                    </div>
                ))
            )
         }
        </>
    )
}

export default FriendRequests