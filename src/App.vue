<template>
    <div id="app">
        <div id="container">
            <div id="searchBar">
                <input v-model="query" type="text" placeholder="Search for Restaurant by Name, Cuisine, Location"/>
            </div>

            <div id="content">
                <div class="filters" v-if="filters">

                    <!--CUISINE FILTER SECTION-->
                    <div class="filter-group ">
                        <div>
                            <h4>Cuisine/Food Type</h4>
                            <ul class="filter-choices cuisine-filter-choices" :ref="'expandCuisine'">
                                <li v-for="(option, key) in filters.food_type" :ref="['food_type', key]" class="choice" :class="{active: activeFilters.food_type == key}" @click="refineFacet('food_type', key)">
                                    <span class="cuisine">{{key}}</span>
                                    <span class="cuisine-count">{{option}}</span>
                                </li>
                            </ul>
                            <div class="expand" @click="expandSelection('expandCuisine')">{{expandText}}</div>
                        </div>
                    </div>

                    <!--REVIEWS FILTER SECTION-->
                    <div class="filter-group">
                        <starfilter :refineFacet="refineFacet" :activeFilters="activeFilters"></starfilter>
                    </div>

                    <!--PAYMENT FILTER SECTION-->
                    <div class="filter-group">
                        <div>
                            <h4>Payment Options</h4>
                            <ul class="filter-choices">
                                <li v-for="(option, key) in filters.payment_options" :ref="['payment_options', key]" class="choice" :class="{active: activeFilters.payment_options == key}" @click="refineFacet('payment_options', key)">
                                    <span class="filterKey">
                                        {{key}}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="results" v-if="results">
                    <p class="results-info">
                        {{results.nbHits}} results <span class="time">in {{results.processingTimeMS / 1000}} seconds</span>
                    </p>
                    <ul>
                        <li v-for="hit in hits" class="result">
                            <div  class="thumbnail">
                                <img :src="hit.image_url"/>
                            </div>
                            <div class="info">
                                <h3>{{hit.name}}</h3>
                                <reviews :review="hit.stars_count" :count="hit.reviews_count"></reviews>
                                <!--div>
                                    {{hit.stars_count}} ({{hit.reviews_count}} reviews)
                                </div-->
                                <div>
                                    {{hit.food_type}} | {{hit.neighborhood}} | {{hit.price_range}}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import algolia from './functions/algoliaInit.js'
import Reviews from './Reviews.vue'
import Starfilter from './Starfilter.vue'

export default {
    name: 'app',
    components: {Reviews, Starfilter},
    created(){
        let that = this

        algolia.helper.on('result', (content) => {
            that.results = content
            if(!!that.firstLoad){
                console.log('first load')
                that.facets = content.facets
                getFacets(that.facets, that)
                that.firstLoad = false
            }

        });

        //request geo - to prefer location for results
        if(!!navigator.geolocation){
            navigator.geolocation.getCurrentPosition((data)=>{
                console.log(data.coords)
                let latLng = data.coords.latitude + ',' + data.coords.longitude
                {
                    algolia.helper.setQueryParameter('aroundLatLng', latLng).search()
                }
            })
        }
        else{
            algolia.helper.setQueryParameter('aroundLatLngViaIP', true).search()
        }


        function getFacets(facets, context){
            for(let each of facets){
                let name = each.name
                context.filters[name] = each.data
            }
        }


    },
    data() {
        return {
            firstLoad: true,
            query: null,
            facets: null,
            filters: {
                food_type: null,
                stars_count: null,
                payment_options: null
            },
            activeFilters: {
                food_type: null,
                stars_count: null,
                payment_options: null
            },
            filterExpanded: false,
            geo: null,
            results: null
        }
    },
    computed : {
        hits(){
            return !!this.results ? this.results.hits : null
        },
        expandText(){
            return !!this.filterExpanded ? 'show less -' : 'show more +'
        }
    },
    watch : {
        query: (updatedQuery) => {
            algolia.helper.setQuery(updatedQuery).search()
        }
    },
    methods : {
        refineFacet(facet, value){

            if(this.activeFilters[facet] === value){
                this.activeFilters[facet] = null
                algolia.helper.clearRefinements(facet).search()
            }
            else{
                this.activeFilters[facet] = value
                algolia.helper.clearRefinements(facet)

                if(facet !== 'stars_count'){
                    console.log(facet, value)
                    algolia.helper.toggleRefinement(facet, value).search()
                }
                else{
                    console.log('stars', parseFloat(value))
                    algolia.helper.addNumericRefinement('stars_count', '>=', parseFloat(value)).search()
                }
            }


        },
        expandSelection(ref, event){
            $(this.$refs[ref]).toggleClass('expanded')
            this.filterExpanded = !this.filterExpanded
        }
    }
}

</script>

<style lang="stylus">
@import './stylus/resources.styl'
#app
    width 100%
    height 100vh
    background url('./graphics/background.png')
    center()
    #container
        width 100%
        max-width 820px
        min-height 517px
        background white
        flexbox()
        flex-direction(column)
        +below(700px)
            height 100%
        #searchBar
            background #1C688E
            width 100%
            height 83px
            center()
            input
                background #FFFFFF
                border 1px solid #D7D7D7
                border-radius 3px
                font-size 15px
                font-weight 100
                color #B3B3B3
                width 95%
                padding 2%
                height 40px
                margin 0 auto
        #content
            height 600px
            grid('row','','')
            +below(700px)
                height 100%
                grid('column','','start')
            .filters
                cell(1,3)
                margin 0
                padding 20px
                height 100%
                border-right 1px solid #E6E6E6
                flexbox()
                flex-direction(column)
                overflow-y auto
                +below(700px)
                    flex-direction(row)
                    flex-wrap(nowrap)
                    padding 10px 0
                .filter-group
                    margin-bottom 25px
                    +below(700px)
                        margin 0 25px
                        flexbox()
                        justify-content(center)
                        flex(none)
                        width 50%
                    h4
                        font-size 14px
                        font-weight normal
                        margin-bottom 10px
                    .filter-choices
                        list-style none
                        font-size 13px
                        font-weight 200
                        +above(700px)
                            &.cuisine-filter-choices
                                height 160px
                                overflow-y hidden
                                &.expanded
                                    height 400px !important
                                    overflow-y scroll
                        +below(700px)
                            &.cuisine-filter-choices
                                height 160px
                                overflow-y scroll
                                &.expanded
                                    overflow-y scroll
                        .choice
                            width 90%
                            margin 5px 0
                            padding 2.5px 10px
                            border-radius 4px
                            flexbox()
                            justify-content(space-between)
                            align-items(center)
                            cursor pointer
                            &.active
                                background #2897C5
                                color white !important
                                span.cuisine-count
                                    color inherit
                            span.cuisine-count
                                width 50%
                                overflow hidden
                                white-space nowrap
                                text-overflow ellipsis
                                text-align right
                                color rgba(112,112,112,.6)
                    .expand
                        font-size 10px
                        text-align center
                        color rgba(112,112,112,0.6)
                        margin-top 10px
                        cursor pointer
                        +below(700px)
                            display none
            .results
                cell(2,3)
                height calc(100% - 25px)
                padding 25px
                overflow-y auto
                .results-info
                    font-size 14px
                    .time
                        font-size 12px
                .result
                    grid('row','center','start')
                    color rgba(112,112,112,.6)
                    font-size 14px
                    font-weight normal
                    cursor pointer
                    .thumbnail
                        cell(1,6)
                        margin-left 0
                        img
                            width 100%
                            height 100%
                            border-radius 4px
                    .info
                        cell(5,6)
                        height 84px
                        grid('column','','start')
                        h3
                            font-weight 500
                            color black



</style>
