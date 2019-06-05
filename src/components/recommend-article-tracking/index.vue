<template>
    <div class="artice-tracking">
        <div class="list-head" @click="getIntentList">
            <span class="cor-333">{{className}}文章</span>
            <p class="cor-666"><span class="vm">喜好客户&nbsp;&nbsp;{{total}}人</span><i :class="[isShow ? 'top-arrow' : 'bottom-arrow']"></i></p>
        </div>
        <div class="list-container" v-if="isShow">
            <div class="list-content" v-for="(item,index) in intentList" :key="index">
                <div class="user-info">
                    <img :src="item.user_info.avatar_url" alt=""><span class="vm fb nick-name">{{item.user_info.nick_name}}</span>
                </div>
                <div class="statistics-info">
                    <span class="cor-666 mr-32">喜好程度</span><span class="fb" :class="colorObj[item.prefered_level]">{{level[item.prefered_level - 1]}}</span>
                </div>
            </div>
        </div>
        <p class="more-data" v-if="total > 3 && intentList.length < total && isShow" @click="getMore">查看更多</p>
        <p class="more-data" v-if="total > 3 && intentList.length == total && isShow">没有更多了</p>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    data() {
        return {
            colorObj: {
                '1': 'cor-low',
                '2': 'cor-middle',
                '3': 'cor-high'       
            },
            level: ['偏低', '中等', '偏高']
        }
    },
    props: ['intentList', 'className', 'total', 'isShow', 'page'],
    computed: {
        classification() {
            let classList = ['技术派', '价投派', '热点派', '综合派'];
            return classList.indexOf(this.className) + 1 || 1;
        }
    },
    methods: {
        ...mapMutations([
            'homeMenu/SET_CLASSIFICATION',
            'homeMenu/SET_STATUS_LIST',
            'homeMenu/SET_PAGE',
            'homeMenu/SET_BEHAVOR_STATUS'
        ]),

        getIntentList() {
            this['homeMenu/SET_BEHAVOR_STATUS']('switch');
            if(this.isShow) {
                this['homeMenu/SET_STATUS_LIST']({index: this.classification - 1,status: false});
            } else {
                this['homeMenu/SET_STATUS_LIST']({index: this.classification - 1,status: true});
                this['homeMenu/SET_CLASSIFICATION'](this.classification);
                this['homeMenu/SET_PAGE'](1);
            }     
        },
        getMore() {
            this['homeMenu/SET_BEHAVOR_STATUS']('loadMore');
            this['homeMenu/SET_PAGE'](this.page + 1);
        }
    }
}
</script>

<style lang="scss" scoped>
    .artice-tracking{
        // .list-container{
        //     max-height: 9.333333rem;
        //     overflow: auto;
        // }
        .list-head,.list-content{
            .cor-333{
                color: #333;
            }
            .cor-666{
                color: #666;
            }
        }
        .list-head{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 .4rem;
            height: 1.466667rem;
            font-size: .426667rem;
            border-bottom: 1px solid #eee;
            .top-arrow,.bottom-arrow{
                display: inline-block;
                margin-left: .186667rem;
                vertical-align: middle;
                width: .213333rem;
                height: .346667rem;
            }
            .top-arrow{
                background: url('../../assets/images/arrow_right.png') no-repeat;
                background-size: 100% auto;
                transform: rotate(90deg);
            }
            .bottom-arrow{
                background: url('../../assets/images/arrow_right.png') no-repeat;
                background-size: 100% auto;
                transform: rotate(-90deg);
            }
        }
        .list-content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 .4rem;
            height: 1.573333rem;
            border-bottom: 1px solid #eee;
            font-size: .426667rem;
            .user-info{
                font-weight: 500;
                color: #333;
                img{
                    margin-right: .413333rem;
                    width: 1.066667rem;
                    height: 1.066667rem;
                    vertical-align: middle;
                    border-radius: 50%;
                }
                .nick-name{
                    display: inline-block;
                    width: 3.6rem;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
            .statistics-info{
                .mr-32{
                    margin-right: .426667rem;
                }
                .cor-high{
                    color: #DA3237;
                }
                .cor-middle{
                    color: #F5871B;
                }
                .cor-low{
                    color: #2DCBB3;
                }
            }
            .fb{
                font-weight: bold;
            }
        }
        .more-data{
            line-height: 1.226667rem;
            text-align: center;
            font-size: .32rem;
            color: #666;
            border-bottom: 1px solid #eee;
        }
    }
</style>
