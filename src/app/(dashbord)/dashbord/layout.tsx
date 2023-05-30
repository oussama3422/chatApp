import FriendRequestsSidebarOption from '@/components/FriendRequestsSidebarOption'
import { Icon, Icons } from '@/components/Icons'
import SingOutButton from '@/components/SingOutButton'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
// import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'


interface layoutProps {
  children:ReactNode
}
interface SidebarOption{
    id:number
    name:string
    href:string
    Icon:Icon
}

const sidebarOption: SidebarOption[] = [
  {
    id:1,
    name:'Add friend',
    href:'/dashbord/add',
    Icon:'UserPlus',
  }
]

const Layout= async ({children}:layoutProps) => {

  const session = await getServerSession(authOptions)
  if(!session){
    notFound()
  }
  const incomingFriendRequests = await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  ) as unknown as User[];
  
  const unseenRequestCount = incomingFriendRequests ? incomingFriendRequests.length : 0;

  return <div className='w-full flex h-screen'>
    <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-auto border-r border-gray-200 bg-white px-6'>
     <Link href='/dashbord' className='flex h-16 shrink-0 items-center'>
        <Icons.Logo className='h-8 w-auto text-indigo-600' />
     </Link>
    <div className='text-xs font-semibold leading-5 text-gray-500'>
      Your chats
    </div>
    <nav className='flex flex-1 flex-col'>
      <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <li>
              //chats that user has 
            </li>
            <li>
              <div className='text-xs font-semibold leading-6 text-gray-400 '>
                  Overview
              </div>
              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {sidebarOption.map((option)=>{
                  const Icon=Icons[option.Icon]
                  return (
                    <li key={option.id}>
                       <Link href={option.href}
                         className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold '
                       >
                           <span className='text-gray-400 border-gray-500 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                              <Icon className='h-6 w-6'/>
                           </span>
                           <span className='truncate'>{option.name}</span>
                       </Link>
                    </li>
                  )
                })
              }
              </ul>
            </li>
            <li>
            <FriendRequestsSidebarOption sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount}/>
            </li>

            <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                 <div className='relative h-8 w-8 bg-gray-50'>
                    <Image
                      fill
                      referrerPolicy='no-referrer'
                      className='rounded-full'
                      src={session.user.image || ''}
                      alt='Your profile picture'
                    />
                 </div>
                 <span className='sr-only'>Your profile</span>
                 <div className='flex flex-col'>
                    <span aria-hidden='true'>{session.user.name}</span>
                    <span className='text-sm text-zinc-400' aria-hidden="true">
                      {session.user.email}
                    </span>
                 </div>
              </div>
              <SingOutButton className='h-full aspect-square '/>
            </li>
      </ul>
    </nav>
    </div>
    {children}
    </div>
}

export default Layout