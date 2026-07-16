import { api } from '../../utils/api';

Page({
  data: {
    goodsId: 0,
    goodsInfo: null as any,
    specTree: [] as { name: string; options: string[] }[],
    skuList: [] as { id: number; spec: Record<string, string>; price: number; stock: number; image: string }[],
    selectedSpec: {} as Record<string, string>,
    currentPrice: 0,
    currentStock: 0,
    currentSku: null as number | null,
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
    api.getGoodsDetail(goodsId).then((res) => {
      const data = res.data;
      const specTree = data.specTree || [];
      const skuList = data.skuList || [];

      // 初始化选中规格（全部为空）
      const selectedSpec: Record<string, string> = {};
      specTree.forEach((spec) => {
        selectedSpec[spec.name] = '';
      });

      this.setData({
        goodsInfo: data,
        specTree,
        skuList,
        selectedSpec,
        currentPrice: data.price,
        currentStock: data.stock,
        loading: false
      });
    }).catch((_err) => {
      this.setData({ loading: false });
    });
  },

  onSpecSelect(e: any) {
    const spec = e.currentTarget.dataset.spec;
    const option = e.currentTarget.dataset.option;

    const newSelected: Record<string, string> = { ...this.data.selectedSpec };
    // 点击相同选项取消选中
    if (newSelected[spec] === option) {
      newSelected[spec] = '';
    } else {
      newSelected[spec] = option;
    }

    this.setData({ selectedSpec: newSelected });
    this.findMatchSku(newSelected);
  },

  findMatchSku(selected: Record<string, string>) {
    const skuList = this.data.skuList;

    // 检查是否有任何规格被选中
    const hasAnySelection = Object.values(selected).some((v) => v !== '');

    if (!hasAnySelection) {
      // 没有选中任何规格，恢复默认价格和库存
      this.setData({
        currentPrice: this.data.goodsInfo.price,
        currentStock: this.data.goodsInfo.stock,
        currentSku: null
      });
      return;
    }

    // 遍历 SKU 列表寻找匹配
    for (const sku of skuList) {
      let match = true;
      for (const [key, value] of Object.entries(selected)) {
        if (value && sku.spec[key] !== value) {
          match = false;
          break;
        }
      }

      if (match) {
        this.setData({
          currentPrice: sku.price,
          currentStock: sku.stock,
          currentSku: sku.id
        });
        return;
      }
    }

    // 没有完全匹配的 SKU，保持当前状态
  },

  addToCart() {
    if (!this.data.currentSku) {
      wx.showToast({ title: '请选择完整规格', icon: 'none' });
      return;
    }

    api.addToCart(this.data.currentSku, 1).then(() => {
      wx.showToast({ title: '加入成功', icon: 'success' });
    }).catch((_err) => {
      // 错误已由 api 层处理
    });
  }
})
