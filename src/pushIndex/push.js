//loaded "https://cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js"

import list from './restaurants_list.json';
import info from './restaurants_info.csv';

let client = algoliasearch('NOGZ8XVS9S', 'c849f645ef0df0f7a7c335551cfcc008');
let index = client.initIndex('restaurants');

console.log(index)


for(let each of info){
    let match = list.find((r) => { return r.objectID == each.objectID})
    Object.assign(match, each)
    match.stars_count = parseFloat(match.stars_count)
}

index.addObjects(list, function(err, content) {
  console.log(content);
});

index.setSettings({attributesForFaceting: ['food_type', 'stars_count', 'payment_options']})
