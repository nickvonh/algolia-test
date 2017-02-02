<template>
    <div class="reviews">
        <span class="rating">{{review}}</span>
        <div class="emptyStars">
            <img src="./graphics/stars-plain.png" v-for="each in stars"/>
        </div>
        <span class="count">({{count}} reviews)</span>

    </div>
</template>

<script>
export default {
    name: 'reviews',
    props: ['review', 'count'],
    data(){
        return {
        }
    },
    computed: {
        stars(){
            return parseInt(this.review)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import './stylus/resources.styl'
.reviews
    height 20px
    font-size 14px
    font-weight 200
    flexbox()
    flex-wrap(nowrap)
    align-items(center)
    .rating
        color #FFAB66
    .emptyStars
        height 15px
        width 80px
        margin 10px
        background-image url('./graphics/stars-icons.png')
        background-size 100%
        cursor pointer
        img
            width 15px
            margin 0 .5px
</style>
