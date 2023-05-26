import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { headers } from "next/dist/client/components/headers";
import {z} from 'zod'

export async function POST(req:Request){
    try{
      const body=await req.json() 
      const {email:emailToAdd} = addFriendValidator.parse(body.email);
      const RESTResponse =await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,{
         headers:{
            Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
         },
         cache:'no-store',
        }
        )
      const data = await RESTResponse.json() as {result:string};
      const idToAdd =  data.result;
      if(!idToAdd){
        return new Response('This person does not exist',{status:400})
      }
      const session =  await getServerSession(authOptions);
      if(!session){
        return new Response('Unauthorized',{status:401})
      }
      if(idToAdd === session.user.id){
        return new Response('You can not add yourself as a friend',{status:400})
      }

      // check if the user us already added
      const isAlredayAdded = (await fetchRedis(
          'sismember',
          `user:${idToAdd}:incoming_friend_requests`,
          session.user.id
      )) as unknown as 0 | 1

      if(isAlredayAdded){
        return new Response('Alreday added this user',{status:400})
      }
      // check if the user us already friends
      const isAlredayFriends = (
        await fetchRedis(
          'sismember',
          `user:${session.user.id}:friends`,
          idToAdd
       )
       ) as unknown as 0 | 1

      if(isAlredayFriends){
        return new Response('Alreday friends with this user',{status:400})
      }
      // valid request m send friend request

      db.sadd(`user:${idToAdd}:incoming_friend+requests`,session.user.id)

      return new Response('Ok')
    }catch(error){
     if(error instanceof z.ZodError){
        return new Response("Invalid request payload",{status:422})
     }
     return new Response("Invalid request",{status:400})

    }
}