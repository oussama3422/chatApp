'use client'
import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps{}

type FormData = z.infer<typeof addFriendValidator>


const AddFriendButton:FC<AddFriendButtonProps> = ({})=>{
    const [showSucessState,setShowSucessState] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setError,
        formState:{errors}
    } = useForm<FormData>({
        resolver:zodResolver(addFriendValidator)
    })
    const addFriend = async(email:string) => {
        try{
            const validatedEmail = addFriendValidator.parse({email})
            axios.post('/api/friend/add',{email:validatedEmail})
            setShowSucessState(true);
        }catch(error){
            console.log(error);
            if(error instanceof z.ZodError){
                setError('email',{message:error.message});
                return 
            }
            if(error instanceof AxiosError){
                setError('email',{message:error.response?.data});
                return 
            }
            setError('email',{message:'Somthing went wrong'});
        }
    }

    const Submit = (data:FormData)=>{
        addFriend(data.email);
    }

    return <form onSubmit={handleSubmit(Submit)} className="max-w-sm">
   <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
    Add a friend by E-Mail
   </label>
   <div className="mt-2 flex gap-4">
    <input 
    {...register('email')}
    type="text" className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset-300 ring-gray-300 placeholder:text-gray-400 focus-ring-2 
    focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
    placeholder="you@example.com"
    />
    <Button>Add</Button>
   </div>
   <p className="mt-1 text-red-600">{errors.email?.message}</p>
   {showSucessState ?(
   <p className="mt-1 text-green-600">Friend request send successfullly !</p>
   ):null}
    </form>
}


export default AddFriendButton;