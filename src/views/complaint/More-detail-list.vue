<template>
    <div class="reason-page">
        <div class="reason-list">
            <p class="reason-select-tip">请选择投诉原因</p>
            <div class="cell-wrap">              
                 <div class="cell-list" v-for="(item,index) in detailList[listType]" :key="index" @click="nextPage(item.type)">
                    <span>{{item.name}}</span>
                </div>
            </div>
        </div>
        <p class="reason-tip" v-if="listType == 3">未经授权使用你的内容且违规标原创，请选择“抄袭/洗稿”投诉</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            detailList: [
                [
                    {name: '多级分销', type: '1-1'},
                    {name: '网络借贷', type: '1-2'},
                    {name: '兼职赚钱', type: '1-3'},
                    {name: '高额返利', type: '1-4'},
                    {name: '相亲交友', type: '1-5'},
                    {name: '虚假活动', type: '1-6'},
                    {name: '高收益理财', type: '1-7'},
                    {name: '微盘微交易', type: '1-8'},
                    {name: '不在以上类型中', type: '1-9'}
                ],
                [
                    {name: '诱导分享', type: '2-1'},
                    {name: '诱导关注', type: '2-2'}
                ],
                [
                    {name: '政治类不实信息', type: '3-1'},
                    {name: '医疗健康类不实信息', type: '3-2'},
                    {name: '社会事件类不实信息', type: '3-3'}
                ],
                [
                    {name: '抄袭/洗稿', type: '4-1'},
                    {name: '滥用原创', type: '4-2'}
                ]
            ]
        }
    },
    computed: {
        listType() {
            return this.$route.query.listType;
        }
    },
    methods: {
        nextPage(type) {
            let query = this.$route.query;
            this.$router.push(`/complaint?type=${type}`);
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
                }
            }
        }
        .reason-tip{
            margin-top: .44rem;
            padding: 0 .4rem;
            line-height: .506667rem;
            font-size: .346667rem;
            color: #999;
        }
    }
</style>
