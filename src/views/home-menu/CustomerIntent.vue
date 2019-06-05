<template>
    <div class="customer-intent">
        <p class="top-desc">
            <span>什么是推荐文章追踪</span>
            <i class="question-icon" @click="showIntroduce"></i>
        </p>

        <article-tracking :intent-list="intentList" :page="page" :is-show="statusList[0]" class-name="技术派" :total="totalList['1']"></article-tracking>
        <article-tracking :intent-list="intentList" :page="page" :is-show="statusList[1]" class-name="价投派" :total="totalList['2']"></article-tracking>
        <article-tracking :intent-list="intentList" :page="page" :is-show="statusList[2]" class-name="热点派" :total="totalList['3']"></article-tracking>
        <article-tracking :intent-list="intentList" :page="page" :is-show="statusList[3]" class-name="综合派" :total="totalList['4']"></article-tracking>

        <p class="bottom-desc">仅显示近三月访客数据</p>

        <div class="toast-wrap" v-show="isShowIntroduce">
            <p>推荐文章追踪是指基于量化云大数据分析，AI智能实时监控客户查看分享产品的时间、时长、深度等反馈，并智能预测客户喜好程度，助力成交转化</p>
        </div>
    </div>
</template>

<script>
import ArticleTracking from '@/components/recommend-article-tracking'
import { getIntentList } from '../../api/agent'
import { mapState, mapMutations } from 'vuex'
import { Toast } from 'mint-ui'
import { setTimeout, clearTimeout } from 'timers';

export default {
    data() {
        return {
            isShowIntroduce: false,
            page_size: 10,
            intentList: [],
            totalList: []
        }
    },
    computed: {
        ...mapState({
            classification: state => state.homeMenu.classification,
            statusList: state => state.homeMenu.statusList,
            page: state => state.homeMenu.page,
            behavorStatus: state => state.homeMenu.behavorStatus
        })
    },
    watch: {
        classification() {
            if(this.behavorStatus == 'switch') {
                this.intentList = [];
                this.getIntentList();
            }  
        },
        page(newVal) {
            if(this.behavorStatus == 'loadMore') {
                this.getIntentList();
            }         
        }
    },
    components: {
        ArticleTracking
    },
    mounted() {
        this.getIntentList();
    },
    methods: {
        ...mapMutations([
            'homeMenu/SET_PAGE'
        ]),

        getIntentList() {
            let param = {
                classification: this.classification,
                page: this.page,
                page_size: this.page_size
            };

            getIntentList(param).then(res => {
                this.intentList = this.intentList.concat(res.list);
                
                this.totalList = res.stats;
            }).catch(() => {
            })
        },
        showIntroduce() {
            clearTimeout(timer);
            this.isShowIntroduce = true;
            let timer = setTimeout(() => {
                this.isShowIntroduce = false;
            }, 3000);
        }
    }
}
</script>

<style lang="scss" scoped>
    .customer-intent{
        .top-desc{
            padding: .266667rem .4rem .226667rem 0;
            text-align: right;
            color: #666;
            font-size: .32rem;
            border-bottom: 1px solid #eee;
            span{
                vertical-align: middle;
            }
            .question-icon{
                display: inline-block;
                vertical-align: middle;
                margin-left: .093333rem;
                width: .426667rem;
                height: .426667rem;
                background: url('../../assets/images/question.png') no-repeat;
                background-size: 100% auto;
            }
        }
        .bottom-desc{
            margin: .466667rem 0;
            line-height: 1;
            text-align: center;
            color: #999;
            font-size: .32rem;
        }
        .toast-wrap{
            position: fixed;
            top: .8rem;
            right: .666667rem;
            width: 5.6rem;
            padding: .346667rem .24rem;
            background:#000;
            opacity: 0.9;
            border-radius: 14px 0px 14px 14px;
            p{
                font-size: .32rem;
                color: #fff;
                line-height: .586667rem;
            }
        }
    }
</style>
