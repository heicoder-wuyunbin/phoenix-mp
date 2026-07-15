import { api } from '../../utils/api'

Component({
  data: {
    categories: [] as { id: number; name: string }[],
    goodsList: [] as { id: number; name: string; image: string; price: number; sales: number }[],
    currentCategory: 0,
    pageNum: 1,
    pageSize: 10,
    hasMore: true,
    refreshing: false
  },
  lifetimes: {
    attached() {
      this.loadCategories();
      this.loadGoods();
    }
  },
  methods: {
    loadCategories() {
      api.getCategoryList().then((res) => {
        this.setData({
          categories: [{ id: 0, name: '全部' }, ...res.data]
        });
      }).catch(() => {
        this.setData({
          categories: [{ id: 0, name: '全部' }]
        });
      });
    },

    loadGoods() {
      const { currentCategory, pageNum, pageSize } = this.data;
      api.getGoodsList(currentCategory, pageNum, pageSize).then((res) => {
        const data = res.data;
        const newList = pageNum === 1 ? data.records : [...this.data.goodsList, ...data.records];
        this.setData({
          goodsList: newList,
          hasMore: data.hasNextPage,
          refreshing: false
        });
      }).catch(() => {
        this.setData({
          hasMore: false,
          refreshing: false
        });
      });
    },

    onSearch(e: any) {
      // TODO: 实现搜索功能
      console.log('Search:', e.detail.value);
    },

    onCategoryChange(e: any) {
      const categoryId = e.currentTarget.dataset.id;
      this.setData({
        currentCategory: categoryId,
        pageNum: 1,
        goodsList: [],
        hasMore: true
      });
      this.loadGoods();
    },

    loadMore() {
      if (this.data.hasMore) {
        this.setData({ pageNum: this.data.pageNum + 1 });
        this.loadGoods();
      }
    },

    onRefresh() {
      this.setData({
        pageNum: 1,
        goodsList: [],
        hasMore: true,
        refreshing: true
      });
      this.loadGoods();
    },

    goToDetail(e: any) {
      const goodsId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/goods-detail/goods-detail?id=${goodsId}`
      });
    }
  }
})
