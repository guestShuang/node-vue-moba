<template>
  <div>
    <swiper :options="swiperOption" v-if="showSwiper">
      <swiper-slide v-for="item in ads" :key="item.id">
				<a :href="item.url">
					<img class="w-100" :src="item.image" alt />
				</a> 
      </swiper-slide>
      <div class="swiper-pagination pagination-home text-right px-3 pb-1" slot="pagination"></div>
    </swiper>
    <!-- end of swiper -->
		<div class="nav-icons bg-white mt-3 text-center pt-3 text-dark-1" :class="{'open': eflag}">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3">
          <i class="sprite sprite-news"></i>
          <div class="py-2">爆料站</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-story"></i>
          <div class="py-2">故事站</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-shop"></i>
          <div class="py-2">周边商城</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-tyf"></i>
          <div class="py-2">体验服</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-xrzq"></i>
          <div class="py-2">新人专区</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-rycc"></i>
          <div class="py-2">荣耀·传承</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-wzyd"></i>
          <div class="py-1">王者营地</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-gzh"></i>
          <div class="py-2">公众号</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-bbjs"></i>
          <div class="mt-1">版本介绍</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-djhj"></i>
          <div class="mt-2">对局环境</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-wxwzt mt-1"></i>
          <div class="mt-3">无限王者团</div>
        </div>
				<div class="nav-item mb-3">
          <i class="sprite sprite-cyhdy"></i>
          <div class="">创意互动营</div>
        </div>
      </div>     
    </div>
		<div class="bg-light py-2 fs-sm text-center" @click="handleExpand">
			<i class="sprite sprite-arrow mr-1"></i>
			<span>{{ eflag ? '展开': '收起'}}</span>
    </div>
    <!-- end of nav icons -->
		<m-list-card icon="menu1" title="新闻资讯" :categories="newsCats">
			<template #items="{category}">
				<router-link 
        tag="div"
        :to="`/articles/${news._id}`"
        class="py-2 fs-lg d-flex" 
        v-for="(news, i) in category.newsList" :key="i">
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-2">|</span>
          <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{news.title}}</span>
          <span class="text-grey-1 fs-sm">{{news.createdAt | date}}</span>
        </router-link>
			</template>
		</m-list-card>

		<m-list-card icon="card-hero" title="英雄列表" :categories="heroCats">
      <template #items="{category}">
        <div class="d-flex flex-wrap" style="margin: 0 -0.5rem;">
          <router-link
          tag="div"
          :to="`/heroes/${hero._id}`"
          class="p-2 text-center"
          style="width: 20%;" 
          v-for="(hero, i) in category.heroList" :key="i">
            <img :src="hero.avatar" class="w-100">
            <div>{{hero.name}}</div>
          </router-link>
        </div>
      </template>
    </m-list-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
	filters: {
		date(val) {
			return dayjs(val).format('MM/DD')
		}
	},
	data() {
		return {
			eflag: true,
			swiperOption: {
        pagination: {
          el: ".pagination-home"
				},
				loop: true,
				autoplay: {
          delay: 2500,
          disableOnInteraction: false
        }
			},
			newsCats: [],
			heroCats: [],
			ads:[]
		}
	},
	computed:{
    showSwiper () {
      return this.ads.length
    }
  },
	methods: {
		handleExpand() {
			this.eflag = !this.eflag;
		},
		async fetchAds(){
			const res = await this.$http.get('ad/list');
			this.ads = res.data.items;
		},
		async fetchNewsCats(){
			const res = await this.$http.get('news/list');
			this.newsCats = res.data;
		},
    async fetchHeroCats() {
      const res = await this.$http.get("heroes/list");
      this.heroCats = res.data;
    }
	},
	created() {
		this.fetchNewsCats()
		this.fetchHeroCats()
		this.fetchAds()
	}
};
</script>

<style lang="scss">
@import "../assets/scss/variables";

.pagination-home {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.1538rem;
    background: map-get($colors, "white");
    &.swiper-pagination-bullet-active {
      background: map-get($colors, "info");
    }
  }
}
.nav-icons {
	&.open {
		height: 5.3846rem;
		overflow: hidden;
	}
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}
</style>