/* eslint-disable react/prop-types */

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType,username,userId}) => {
	const isLoading = false;
	
	const reqApi = ()=>{
		if(feedType==="forYou"){
            return "/api/post/all"
		}
		else if(feedType==="following") return "/api/post/following"

		else if(feedType==="posts")  return `/api/post/user/${username}`
		else if(feedType==="likes")  return `/api/post/user/${userId}`

		else return "/api/post/following"
	}


	const dataApi= reqApi(feedType)
	const {data:postData,isPending,refetch,isRefetching}= useQuery({
		queryKey:["postsData"],
		queryFn: async ()=>{
                 const res= await fetch(dataApi)

				 const data= await res.json();
				 if(!res.ok) throw new Error(data.error)

					return data;
		}
		,
		
	})


	
		useEffect(()=>{
			refetch()
		},[feedType,refetch])

	if(isPending){
		return <>  Loading...</>
	}
	

	return (
		<>
			{isLoading &&isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && POSTS && (
				<div>
					{postData?.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;