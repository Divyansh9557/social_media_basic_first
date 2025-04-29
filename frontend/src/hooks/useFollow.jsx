
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const useFollow= ()=>{
    const queryClient= useQueryClient()
    

    const {mutate:follow,error,isPending}= useMutation({
        mutationFn: async(userID)=>{
            try {
                const res= await fetch(`/api/user/follow/${userID}`,{method:"POST"})
                const data= await res.json()

                if(!res.ok) throw new Error(data.error || "some thing went wrong")

                    return data

            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["sugUser"]})
            queryClient.invalidateQueries({queryKey:["getUser"]})
        },
        onError:()=>{
            toast.error(error.message)
        }
    })
    return {follow,isPending}

}
export default useFollow
