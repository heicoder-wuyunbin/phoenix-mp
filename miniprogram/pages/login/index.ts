import { api } from '../../utils/api';

Page({
  data: {
    loginInfo: '',
    password: '',
    loading: false,
  },

  onLoginInfoInput(e: any) {
    this.setData({ loginInfo: e.detail });
  },

  onPasswordInput(e: any) {
    this.setData({ password: e.detail });
  },

  async onLogin() {
    const { loginInfo, password } = this.data;
    if (!loginInfo.trim()) {
      wx.showToast({ title: '请输入账号', icon: 'none' });
      return;
    }
    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    try {
      const result = await api.login({ loginInfo, password });
      wx.setStorageSync('token', result.data.token);
      wx.setStorageSync('userInfo', result.data);
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      console.error('登录失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  goToRegister() {
    wx.navigateTo({ url: '/pages/register/index' });
  },

  goToForgot() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onWechatLogin() {
    wx.showToast({ title: '微信登录开发中', icon: 'none' });
  },

  onQQLogin() {
    wx.showToast({ title: 'QQ登录开发中', icon: 'none' });
  },
});
