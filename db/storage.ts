import {env} from 'cloudflare:workers';
export function storage(){if(!env.DB)throw Error('Report storage is unavailable');return env.DB;}
