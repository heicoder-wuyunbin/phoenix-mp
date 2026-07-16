import { api } from '../../utils/api';

Page({
  data: {
    cartItems: [] as {
      skuId: number;
      name: string;
      image: string;
      specText: string;
      price: number;
      quantity: number;
      stock: number;
      selected: boolean;
    }[],
    selectedSkuIds: [] as number[],
    totalPrice: 0,
    totalCount: 0,
    allSelected: false,
    loading: false,
    isEmpty: true,
  },

  onShow() {
    this.loadCartList();
  },

  loadCartList() {
    this.setData({ loading: true });
    api.getCartList().then((res) => {
      const items = (res.data || []).map((item) => ({
        ...item,
        selected: false,
      }));
      this.setData({
        cartItems: items,
        isEmpty: items.length === 0,
        selectedSkuIds: [],
        allSelected: false,
        totalPrice: 0,
        totalCount: 0,
        loading: false,
      });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  toggleSelect(e: any) {
    const skuId = e.currentTarget.dataset.skuId;
    let selectedSkuIds = [...this.data.selectedSkuIds];
    const index = selectedSkuIds.indexOf(skuId);
    if (index !== -1) {
      selectedSkuIds.splice(index, 1);
    } else {
      selectedSkuIds.push(skuId);
    }
    const allSelected = selectedSkuIds.length === this.data.cartItems.length;
    this.setData({ selectedSkuIds, allSelected });
    this.calculateTotal();
  },

  toggleSelectAll() {
    if (this.data.allSelected) {
      this.setData({
        selectedSkuIds: [],
        allSelected: false,
        totalPrice: 0,
        totalCount: 0,
      });
    } else {
      const selectedSkuIds = this.data.cartItems.map((item) => item.skuId);
      this.setData({ selectedSkuIds, allSelected: true });
      this.calculateTotal();
    }
  },

  increaseQty(e: any) {
    const skuId = e.currentTarget.dataset.skuId;
    const item = this.data.cartItems.find((i) => i.skuId === skuId);
    if (!item) return;
    if (item.quantity >= item.stock) {
      wx.showToast({ title: '已达库存上限', icon: 'none' });
      return;
    }
    const newQty = item.quantity + 1;
    api.updateCart(skuId, newQty).then(() => {
      const items = this.data.cartItems.map((i) => {
        if (i.skuId === skuId) {
          return { ...i, quantity: newQty };
        }
        return i;
      });
      this.setData({ cartItems: items });
      this.calculateTotal();
    }).catch(() => {});
  },

  decreaseQty(e: any) {
    const skuId = e.currentTarget.dataset.skuId;
    const item = this.data.cartItems.find((i) => i.skuId === skuId);
    if (!item) return;
    if (item.quantity <= 1) {
      this.removeItem(skuId);
      return;
    }
    const newQty = item.quantity - 1;
    api.updateCart(skuId, newQty).then(() => {
      const items = this.data.cartItems.map((i) => {
        if (i.skuId === skuId) {
          return { ...i, quantity: newQty };
        }
        return i;
      });
      this.setData({ cartItems: items });
      this.calculateTotal();
    }).catch(() => {});
  },

  removeItem(skuId: number) {
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          api.removeFromCart(skuId).then(() => {
            this.loadCartList();
          }).catch(() => {});
        }
      },
    });
  },

  onRemoveItem(e: any) {
    const skuId = e.currentTarget.dataset.skuId;
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          api.removeFromCart(skuId).then(() => {
            this.loadCartList();
          }).catch(() => {});
        }
      },
    });
  },

  clearCart() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          api.clearCart().then(() => {
            this.loadCartList();
          }).catch(() => {});
        }
      },
    });
  },

  calculateTotal() {
    const { cartItems, selectedSkuIds } = this.data;
    let totalPrice = 0;
    let totalCount = 0;
    cartItems.forEach((item) => {
      if (selectedSkuIds.indexOf(item.skuId) !== -1) {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;
      }
    });
    this.setData({
      totalPrice: Math.round(totalPrice * 100) / 100,
      totalCount,
    });
  },

  checkout() {
    if (this.data.selectedSkuIds.length === 0) {
      wx.showToast({ title: '请选择要结算的商品', icon: 'none' });
      return;
    }
    // TODO: 跳转到订单确认页面
    wx.showToast({ title: '结算功能开发中', icon: 'none' });
  },

  goShopping() {
    wx.reLaunch({
      url: '/pages/index/index',
    });
  },
});