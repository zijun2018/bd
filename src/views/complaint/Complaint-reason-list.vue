<template>
    <div class="reason-page">
        <div class="reason-list">
            <p class="reason-select-tip">请选择投诉原因</p>
            <div class="cell-wrap">              
                <div class="cell-list" v-for="item in reasonList" :key="item.name" @click="showMore(item.type,item.isMore)">
                    <span>{{item.name}}</span>
                    <i class="arrow-icon" v-if="item.isMore"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            reasonList: [
                {name: '欺诈', isMore: true, type: 1},
                {name: '色情', isMore: false, type: 5},
                {name: '诱导行为', isMore: true, type: 2},
                {name: '不实信息', isMore: true, type: 3},
                {name: '违法犯罪', isMore: false, type: 6},
                {name: '骚扰', isMore: false, type: 7},
                {name: '内容未经授权/滥用原创', isMore: true, type: 4},
                {name: '其他', isMore: false, type: 8}
            ]
        }
    },
    methods: {
        showMore(index, isMore) {
            let query = this.$route.query;
            if (isMore) {
                this.$router.push(`/moreDetailList?listType=${index - 1}`);
            } else {
                this.$router.push(`/complaint?type=${index}`);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .reason-page{
        min-height: 100vh;
        background-color: #eee;
        .reason-list{
            background-color: #fff;
            .reason-select-tip{
                text-indent: .4rem;
                line-height: 1.04rem;
                font-size: .373333rem;
                border-bottom: 1px solid #e2e2e2;
            }
            .cell-wrap{
                padding: 0 .4rem;
                .cell-list{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 1.226667rem;
                    border-bottom: 1px solid #e2e2e2;
                    &:last-child{
                        border-bottom: none;
                    }
                    span{
                        font-size: .4rem;
                        color: #444;
                    }
                    .arrow-icon{
                        display: block;
                        width: .213333rem;
                        height: .36rem;
                        background: url(../../assets/images/arrow_right.png) no-repeat;
                        background-size: 100% auto;
                    }
                }
            }
        }
    }
</style>
