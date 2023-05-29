const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL

const authToken = process.env.UPSTASH_REDIS_REST_TOKEN


type Command= 'zrange' | 'sismember' | 'get' | 'smembers'



export async function fetchRedis(command:Command,...args:(string | number)[]){
    const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`
    const response=await fetch(commandUrl,{
            headers:{
                    Authorization:`Bearer ${authToken}`
            },
            cache:'no-store'
        },
    )
    console.log("response ::>",response)
    if(!response.ok){
        throw new Error(`Error Executing Redis command : ${response.statusText}`)
    }
}