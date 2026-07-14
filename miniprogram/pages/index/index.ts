const app = getApp<IAppOption>()

Component({
  data: {
    searchValue: '',
    bannerList: [
      {
        id: 1,
        image: 'https://img.yzcdn.cn/vant/cat.jpeg'
      },
      {
        id: 2,
        image: 'https://img.yzcdn.cn/vant/cat.jpeg'
      },
      {
        id: 3,
        image: 'https://img.yzcdn.cn/vant/cat.jpeg'
      }
    ],
    menuList: [
      { id: 1, name: '全部分类', icon: 'apps-o', color: '#ee0a24' },
      { id: 2, name: '购物车', icon: 'shopping-cart-o', color: '#ff4d4f' },
      { id: 3, name: '今日团购', icon: 'ticket-o', color: '#ee0a24' },
      { id: 4, name: '我的收藏', icon: 'star-o', color: '#ff4d4f' }
    ],
    topAdImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
    middleAdImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
    productList: [
      {
        id: 1,
        name: '时尚休闲运动鞋 新款潮流',
        price: '¥199.00',
        image: 'https://img.yzcdn.cn/vant/cat.jpeg'
      },
      {
        id: 2,
        name: '纯棉T恤 夏季透气舒适',
        price: '¥69.00',
        image: 'https://img.yzcdn.cn/vant/cat.jpeg'
      },
      {
        id: 3,
        name: '智能蓝牙耳机 降噪无线',
        price: '¥299.00',
        image: 'https://img.yzcdn.cn/vant/cat.jpeg'
      },
      {
        id: 4,
        name: '复古太阳镜 偏光护眼',
        price: '¥128.00',
        image: 'https://img.yzcdn.cn/vant/cat.jpeg'
      }
    ],
    categoryList: [
      { id: 1, name: '服装鞋帽' },
      { id: 2, name: '数码电子' },
      { id: 3, name: '家居用品' },
      { id: 4, name: '美妆护肤' },
      { id: 5, name: '食品生鲜' },
      { id: 6, name: '母婴用品' }
    ]
  },
  methods: {
    onSearch() {
      // TODO: 实现搜索功能
    },
    onMenuClick(e: any) {
      // TODO: 实现菜单点击跳转
      const id = e.currentTarget.dataset.id
      console.log('Menu clicked:', id)
    },
    onProductClick(e: any) {
      // TODO: 实现商品点击跳转
      const id = e.currentTarget.dataset.id
      console.log('Product clicked:', id)
    },
    onCategoryClick(e: any) {
      // TODO: 实现分类点击跳转
      const id = e.currentTarget.dataset.id
      console.log('Category clicked:', id)
    }
  }
})
