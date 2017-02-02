let client = algoliasearch('NOGZ8XVS9S', '058277a81bd179be0aece61810f1cfcc');
let helper = algoliasearchHelper(client, 'restaurants', {
    facets: ['food_type', 'stars_count', 'payment_options']
});

export default {
    client : client,
    helper : helper
}
