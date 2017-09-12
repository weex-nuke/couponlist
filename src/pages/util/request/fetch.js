import APIMAP from '../apimap';
import G from '../global.js';
import qs from 'qs';

module.exports = function (param) {
    if (G.env && G.env == 'local') {
        try {
            let url = APIMAP.local[param.name].value;
            return QN.fetch(url).then(response => {
                return response.json();
            }).catch(err => {
                console.log(err);
            });
        } catch (error) {
            throw new Error(error, 'local url is undefined in apimap.js')
        }
    } else {
        let st = new Date();
        try {
            let url = APIMAP.product[param.name].value;
            param.data.timestamp = Date.now();
            let queryString = qs.stringify(param.data);
            param.url = url + '?' + queryString;

            return fetch(param.url,param).then(response => {
                let ed = Date.now() - st;
                return response.json();
            }).catch(err => {
                let ed = Date.now() - st;
                console.log('fetch error >>>>>', err);
            });;
        } catch (error) {
            throw new Error(error, 'product url is undefined in apimap.js')
        }
    }
}