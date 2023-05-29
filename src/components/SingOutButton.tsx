'use client'
import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/Button'
import { toast } from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface SingOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

const SingOutButton: FC<SingOutButtonProps> = ({...props}) => {
  const [isSingOut,setIsSingOut]=useState<boolean>(false)
  return <Button 
    {...props} 
    variant='ghost'
    onClick={async()=>{
    setIsSingOut(true)
    try {
        await signOut()
    } catch (error) {
        toast.error('There was a problem signing out')
    } finally{
        setIsSingOut(false)
    }
    }}
  >
    {isSingOut?(
       <Loader2 className='animate-spin h-4 w-4 '/>

    ):(
      <LogOut className='w-4 h-4 '/>
    )}
    
  </Button>
}

export default SingOutButton