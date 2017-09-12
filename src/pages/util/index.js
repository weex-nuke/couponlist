import fetch from './request/fetch';

export default {
    Http: {
        fetch: fetch
    },
    NameSpace:(name)=>{
        return function(v) {
            return name + '-' + v;
        }
    }
}