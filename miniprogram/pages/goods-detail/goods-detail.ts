Page({
  data: {
    goodsId: 0,
    goodsInfo: null as any,
    loading: true
  },

  onLoad(options: any) {
    const goodsId = parseInt(options.id);
    if (goodsId) {
      this.setData({ goodsId });
      this.loadGoodsDetail(goodsId);
    }
  },

  loadGoodsDetail(goodsId: number) {
    // TODO: 调用后端接口获取商品详情
    console.log('Load goods detail:', goodsId);
    this.setData({ loading: false });
  }
})
