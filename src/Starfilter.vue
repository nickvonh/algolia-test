<template>
    <div class="starfilter">
        <h4>Rating</h4>
        <ul class="filter-choices">
            <div class="emptyStars" v-for="stars in 6" :class="{active: activeFilters.stars_count == stars-1}" @click="refineFacet('stars_count', stars-1)">
                <img src="./graphics/stars-plain.png" v-for="count in stars-1"/>
            </div>
        </ul>

    </div>
</template>

<script>
export default {
    name: 'starfilter',
    props: ['refineFacet', 'activeFilters'],
    data(){
        return {
        }
    }
}
</script>

<style lang="stylus" scoped>
@import './stylus/resources.styl'
.starsfilter
    height 100%
    width 100%
.emptyStars
    height 15px
    width 80px
    margin 10px 0
    background-image url('./graphics/stars-icons.png')
    background-size 100%
    cursor pointer
    margin 7.5px 10px
    border-radius 2px
    img
        width 15px
        margin 0 .5px
    &.active
        box-shadow 0 0 0 1.5px #2897C5
</style>
