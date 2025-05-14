import apicache from 'apicache'

let cache = apicache.middleware

export const cacheFor = (duration = "5 minutos") =>(cache(duration))

