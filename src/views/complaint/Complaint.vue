<template>
    <div class="complaint-page">
        <div class="area-complaint">
            <p class="tip-wrap">投诉内容</p>
            <div class="article-content" @click="goArticlePage">
                <p>{{relatedInfo.articleTitle}}</p>
                <img :src="relatedInfo.articleUrl" alt="">
            </div>
        </div>
        <div class="area-complaint mt-18">
            <p class="tip-wrap">投诉描述</p>
            <div class="complaint-content">
                <div class="complaint-input-wrap">
                    <textarea name="complaint_content" class="complaint-input" placeholder="请输入投诉内容" v-model="content" maxlength="200"></textarea>
                </div>
                <span class="limit-tip">{{content.length}}/200</span>
            </div>
        </div>
        <div class="area-complaint mt-18">
            <p class="tip-wrap">证据截图<span>(点击上方投诉内容进去截图）</span><span class="fr">{{imgFileList.length}}/4</span></p>
            <div class="complaint-prove">
                <div class="upload-image-container" v-for="(item,index) in imgFileList" :key="index">
                    <img :src="item" alt="">
                </div>
                <div class="upload-image-container" v-if="imgFileList.length < 4">
                    <ImgInputer
                        :max-size="10240"
                        :on-change="imageChange"
                        @onExceed="imageExceed"
                        accept="image/*"
                        v-if="!colding"
                        v-model="imgFile">
                    </ImgInputer>
                    <div class="upload-icon"></div>
                </div>
            </div>
        </div>
        <div class="sub-btn mg-42" @click="subData"><span>提交</span></div>
    </div>
</template>

<script>
import ImgInputer from '../../assets/js/index'
import Compressor from 'compressorjs';
import { postComplaintImg, postComplaintAdd } from '../../api/agent'
import { getNews } from '../../api/news'
import { mapMutations } from 'vuex'
import { Toast } from 'mint-ui';

export default {
    data() {
        return {
            relatedInfo: JSON.parse(sessionStorage.getItem('articleInfo')),
            colding: false,
            content: '',
            imgFile: '',
            imgFileList: []
        }
    },
    components: {
        ImgInputer
    },
    computed: {
        articleUrl() {
            let _url = decodeURIComponent(this.relatedInfo.jumpLink);
            return _url;
        }
    },
    methods: {
        ...mapMutations([
            'SET_LOADING'
        ]),

        /**
         * 跳转资讯页
         * /article?key=13054695994f4b54d50ba447d3c9161f&agentId=43&from_type=0&from_id=43
         */
        goArticlePage () {
            location.href = this.articleUrl;
        },

        /**
         * 图片超出限制
         */
        imageExceed () {
            Toast('图片大小不能超过10M');
            this.colding = true;
            setTimeout(() => {
                this.colding = false;
            }, 200);
        },

        /**
         * 监听到图片改变，自动上传
         */
        async imageChange () {
            this['SET_LOADING']('open');
            // 假如图片超过2M，则需要先进行压缩
            let compressImg;
            if (this.imgFile.size > 2056000) {
                compressImg = await this.compressImage(this.imgFile);
            } else {
                compressImg = this.imgFile;
            }

            let imgData = new FormData();
            imgData.append('fname', compressImg);

            postComplaintImg(imgData).then(res => {
                this.imgFileList.push(res.url);
                let imgnode = document.getElementsByClassName('img-inputer__preview-img')[0];
                if(imgnode) {
                    imgnode.style.opacity = 0;
                }
                this['SET_LOADING']('close');
            }).catch(() => {
                let imgnode = document.getElementsByClassName('img-inputer__preview-img')[0];
                if(imgnode) {
                    imgnode.style.opacity = 0;
                }
                this['SET_LOADING']('close');
            });
        },

        /**
         * 压缩图片操作
         * @param file {String} 图片文件
         * @param rate {Number} 压缩比例
         * @returns {Promise<any>}
        */
        compressImage (file, rate) {
            return new Promise(resolve => {
                new Compressor(file, {
                    quality: 0.3,
                    convertSize: 500000,
                    success (result) {
                        resolve(result);
                    },
                    error (err) {
                        console.log(err.message);
                    }
                });
            })
        },

        /**
         * 提交投诉
         */
        subData () {
            if(this.content == '') {
                Toast('请输入投诉内容');
                return;
            }
            if(!this.imgFileList.length) {
                Toast('请上传证据截图');
                return;
            }
            
            let picStr = this.imgFileList.join(',');
            let param = {
                user_id: this.relatedInfo.userId,
                agent_id: this.relatedInfo.agentId,
                key: this.relatedInfo.articleKey,
                type: this.$route.query.type,
                content: this.content,
                pic: picStr
            }
            this['SET_LOADING']('open');
            postComplaintAdd(param).then(res => {
                Toast('提交成功');
                this['SET_LOADING']('close');
                setTimeout(() => {
                    location.replace(this.articleUrl);
                }, 200);
            }).catch(() => {
                this['SET_LOADING']('close');
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .complaint-page{
        min-height: calc(100vh - .56rem);
        padding-bottom: .56rem;
        background-color: #eee;
        .area-complaint{
            background-color: #fff;
            &.mt-18{
                margin-top: .24rem;
            }
            .tip-wrap{
                padding: 0 .373333rem;
                line-height: 1.04rem;
                font-size: .373333rem;
                border-bottom: 1px solid #e2e2e2;
                span{
                    margin-left: .266667rem;
                    font-size: .32rem;
                    color: #999;
                    &.fr{
                        float: right;
                    }
                }
            }
            .article-content{
                display: flex;
                justify-content: space-between;
                padding: .466667rem .88rem .466667rem .386667rem;
                p{
                    width: 5.6rem;
                    line-height: .586667rem;
                    font-size: .426667rem;
                    color: #282828;
                }
                img{
                    width: 2.533333rem;
                    height: 1.813333rem;
                    border-radius: 4px;
                }
            }
            .complaint-content{
                position: relative;
                padding: .2rem .4rem;
                .complaint-input-wrap{
                    width: 9.2rem;
                    height: 3.226667rem;
                    padding: .32rem .28rem .42rem;
                    border: 1px solid #e2e2e2;
                    border-radius: 8px;
                    box-sizing: border-box;
                    .complaint-input{          
                        width: 100%;
                        height: 100%;
                        font-size: .373333rem;
                        -webkit-appearance: none;
                        border: none;
                        &::placeholder{
                            font-size: .373333rem;
                            color: #999;     
                        }
                    }
                }
                .limit-tip{
                    position: absolute;
                    bottom: .333333rem;
                    right: .653333rem;
                    font-size: .32rem;
                    color: #999;
                }
            }
            .complaint-prove{
                padding: .4rem;
                display: flex;
                .upload-image-container{
                    position: relative;
                    margin-right: .4rem;
                    width: 2rem;
                    height: 2rem;
                    &:last-child{
                        margin: 0;
                    }
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    .upload-icon{
                        width: 100%;
                        height: 100%;
                        border: 1px solid #E2E2E2;
                        &:before{
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            margin-top: -.04rem;
                            margin-left: -.44rem;
                            content: '';
                            width: .893333rem;
                            height: .08rem;
                            background-color: #CFCFCF;
                        }
                        &:after{
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            margin-top: -.44rem;
                            margin-left: -.04rem;
                            content: '';
                            width: .08rem;
                            height: .893333rem;
                            background-color: #CFCFCF;
                        }
                    }
                }
            }
        }
        .sub-btn{
            margin: .56rem auto 0;
        }
    }
</style>


