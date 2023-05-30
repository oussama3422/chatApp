import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'


const page = async ()   => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()

    //ids of peaople who sent current logged in user a friend requests

   // Fetch incoming sender IDs
      const response =  await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/user:${session.user.id}:incoming_friend_requests`,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
          cache: 'no-store',
        }
       );
      
      if (!response.ok) {
        console.log("Error occured");
      }
      const data = await response.json();
      const icomingSenderIds =  data.result;
      console.log("icomingSenrerId "+icomingSenderIds)
      const icomingfriendrequest = await Promise.all(
        (icomingSenderIds ?? []).map(async (senderId: any) => {
          const res =( await fetch(
            `${process.env.UPSTASH_REDIS_REST_URL}/user:${senderId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
              },
              cache: 'no-store',
            }
         )) as unknown as User;
        console.log("sender ::>"+res)
          return {
            senderId,
            senderEmail: res.email,
          };
        }
        )
      )

  return (
  <main className='pt-8'>
    <h1 className='font-bold text-5xl mb-8'>
    Add a friend
    </h1>
    <div className='flex flex-col gap-4'>
     <FriendRequests incomingFriendRequest={icomingfriendrequest} sessionId={session.user.id}/>
    </div>
  </main>
  )
}

export default page