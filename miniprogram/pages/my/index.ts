import { api } from '../../utils/api';

Page({
  data: {
    userInfo: null as any,
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/login/index' });
  },

  onMenuItemTap() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  async onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.logout();
          } catch (err) {
            console.error('退出失败:', err);
          }
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          this.setData({ userInfo: null });
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      },
    });
  },
});